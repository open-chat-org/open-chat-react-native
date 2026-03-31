# Open Chat

Open Chat is a decentralized chat application.

## Product Idea

- Any person or community should be able to host their own server.
- A user identity is defined by an `ed25519` public key.
- Messages are encrypted for the recipient by using the recipient's public key.
- Only the holder of the matching private key should be able to decrypt the message locally.
- The backend should know users by public key, but should never own or store the user's private key.

## Core Rules

- Treat the public key as the main user identity.
- Never send the private key to the backend.
- Never log the private key to the console.
- Never store the private key in plain app state if secure storage can be used.
- All decryption must happen on the client side.
- The backend may route, store, and deliver encrypted payloads, but it must not require access to decrypted message content.

## Security Rules

- Generate key pairs on the client.
- Use `ed25519` for identity key generation.
- Save the private key only in local secure storage.
- Public keys may be sent to the backend for registration and discovery.
- Validate public key format before sending it to the backend.
- Do not build features that depend on the server being trusted with secrets.
- Avoid exposing keys, tokens, or raw encrypted payloads in debug logs.

## Project Structure

Use this folder structure as the default baseline:

```text
src/
  app/
    router/          app-level routing or screen switching
    theme/           theme setup
  screens/           top-level pages/screens
  features/          feature-specific UI, hooks, and services
  shared/
    config/          environment and app config
    services/        shared api, crypto, and storage services
    utils/           small reusable helpers
  components/        reusable presentational components
  hooks/             shared custom hooks
  services/          optional non-feature app services
  types/             shared types
```

## Folder Rules

- Put top-level pages in `src/screens`.
- Put feature-specific business logic under `src/features/<feature_name>`.
- Put reusable crypto, api, and storage code under `src/shared/services`.
- Put app-wide setup such as theme and routing under `src/app`.
- Keep screen files thin. Screens should compose components and call hooks, not contain deep business logic.
- Keep crypto logic separate from UI logic.

## Naming Rules

- Use `PascalCase` for screen and component file names, for example `CreateAccount.tsx`.
- Use `camelCase` for variables, functions, and hook return values.
- Use clear feature names instead of vague names like `helper`, `temp`, or `data`.
- Name files by responsibility, not by implementation detail.

## Frontend Rules

- Use NativeBase components first for visible UI.
- Keep screens simple and move reusable UI into components.
- Keep network calls out of screen files when possible.
- Keep storage access out of screen files when possible.
- Put async workflows into hooks or feature services.
- Use system theme by default unless there is a strong reason to override it.

## Backend Integration Rules

- The frontend should send only the public key when creating a user.
- The backend should identify users by public key.
- API contracts must be small and explicit.
- Keep request payloads minimal and validate them before sending.

## Realtime Architecture

The frontend realtime layer is a reusable transport component that sits above screens and below feature logic.

It is responsible for the signed websocket handshake, connection lifecycle, reconnect behavior, ack handling, and event dispatch. Screens and features should consume realtime through hooks and store state, not by opening websocket connections directly.

### Realtime Flow

The frontend realtime flow works like this:

1. Load the local identity from secure storage.
2. Fetch the backend server public key.
3. Request `POST /realtime/challenge` with `x-public-key`.
4. Verify the returned `server_signature` with the known server public key.
5. Sign the canonical challenge message with the local private key.
6. Open the websocket connection to `/realtime`.
7. Send the first frame as `auth.connect`.
8. Store the returned `session_id` locally for reconnect.
9. Auto-send `delivery.ack` for reliable inbound envelopes.
10. Reconnect with a fresh challenge and the previous `last_session_id` when the socket drops.

### Realtime Responsibilities

- Realtime client: own websocket creation, auth, reconnect, and frame parsing.
- Zustand store: hold connection state and event subscription dispatch.
- Provider: start and stop the realtime client for the authenticated app tree.
- Hooks: expose connection status, connect or disconnect actions, and event subscriptions to screens and features.

### Realtime Files

Use this structure for frontend realtime work:

```text
src/
  app/
    context/
      realtime.context.tsx
  hooks/
    useRealtime.ts
    useRealtimeStatus.ts
    useRealtimeEvent.ts
  store/
    realtime.store.ts
  shared/
    services/
      realtime/
        realtime.api.ts
        realtime.client.ts
        realtime.utils.ts
  types/
    realtime.types.ts
```

File responsibilities:

- `realtime.context.tsx`: mounts the app-wide realtime provider and exposes connect, disconnect, send, and subscribe actions.
- `useRealtime.ts`: gives access to realtime actions from the provider.
- `useRealtimeStatus.ts`: reads realtime connection and session state from Zustand.
- `useRealtimeEvent.ts`: subscribes to incoming realtime event types.
- `realtime.store.ts`: keeps connection state and dispatches inbound events to subscribers.
- `realtime.api.ts`: calls the backend challenge endpoint.
- `realtime.client.ts`: performs the signed handshake, websocket lifecycle, reconnect, and ack behavior.
- `realtime.utils.ts`: builds the canonical challenge message and websocket URL and provides small realtime helpers.
- `realtime.types.ts`: contains the shared frame, envelope, and connection status types.

### Realtime Rules

- Do not open websocket connections directly inside screens.
- Do not put signed auth or reconnect logic inside UI components.
- Always verify the backend challenge signature before sending `auth.connect`.
- Always sign the websocket challenge with the local private key only.
- Keep reliable envelope handling centralized in the realtime client.
- Future chat features should subscribe to realtime events through hooks instead of importing websocket internals.

## Message Flow Rules

When the chat flow is implemented, it should follow this shape:

1. A sender fetches or receives the recipient public key.
2. The sender encrypts the message for that recipient on the client.
3. The sender sends only encrypted payload data to a server.
4. The recipient device downloads the encrypted payload.
5. The recipient decrypts the message locally with the private key.

## Do Not

- Do not store private keys on the backend.
- Do not decrypt messages on the backend.
- Do not mix crypto code directly into UI components.
- Do not create giant screen files with api calls, crypto logic, and rendering all together.
- Do not add hidden assumptions that only one central server exists.

## Current Direction

The current frontend starts with account creation:

- generate an `ed25519` key pair on the client
- store the private key locally
- send the public key to the backend
- build the rest of the app on top of public-key identity
