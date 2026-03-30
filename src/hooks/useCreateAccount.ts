import { useState } from 'react';
import { create_account_registration } from '../services/account-registration.service';
import { CreateAccountResult } from '../types/account.types';

export function useCreateAccount() {
  const [is_creating_account, set_is_creating_account] = useState(false);
  const [created_public_key, set_created_public_key] = useState('');
  const [error_message, set_error_message] = useState('');

  const create_account = async () => {
    try {
      set_is_creating_account(true);
      set_error_message('');

      const result: CreateAccountResult = await create_account_registration();

      set_created_public_key(result.public_key);
      return result;
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : 'Something went wrong while creating the account.';

      set_error_message(message);
      return null;
    } finally {
      set_is_creating_account(false);
    }
  };

  return {
    create_account,
    created_public_key,
    error_message,
    is_creating_account,
  };
}
