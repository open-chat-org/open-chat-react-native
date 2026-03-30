import { Box, Button, HStack, Heading, Text, VStack } from 'native-base';
import { ThemeMode } from '../app/theme/theme';

type HeaderAction = {
  label: string;
  on_press?: () => void;
  tone?: 'primary' | 'secondary';
};

type AppHeaderProps = {
  can_go_back: boolean;
  context_label: string;
  on_go_back: () => void;
  right_actions?: HeaderAction[];
  subtitle: string;
  theme_mode: ThemeMode;
  title: string;
};

export function AppHeader({
  can_go_back,
  context_label,
  on_go_back,
  right_actions = [],
  subtitle,
  theme_mode,
  title,
}: AppHeaderProps) {
  const is_dark = theme_mode === 'dark';
  const secondary_button_bg = is_dark ? 'panel.50' : 'white';
  const secondary_button_border = is_dark ? 'surface.800' : 'surface.200';

  return (
    <HStack alignItems="center" justifyContent="space-between" space={3}>
      <HStack flex={1} alignItems="center" space={3}>
        {can_go_back ? (
          <Button
            bg={secondary_button_bg}
            borderWidth={1}
            borderColor={secondary_button_border}
            _text={{ color: is_dark ? 'surface.50' : 'surface.900', fontSize: 'md' }}
            px={3}
            h="40px"
            minW="40px"
            shadow={is_dark ? 0 : 1}
            onPress={on_go_back}
          >
            {'<'}
          </Button>
        ) : null}

        <VStack flex={1} space={1.5}>
          <HStack alignItems="center" space={2}>
            <HStack
              alignItems="center"
              space={2}
              rounded="full"
              bg={is_dark ? 'brand.900' : 'brand.50'}
              px={3}
              py={1.5}
            >
              <Box h="8px" w="8px" rounded="full" bg="brand.500" />
              <Text color="brand.500" fontSize="2xs" fontWeight="bold" textTransform="uppercase">
                Open Chat
              </Text>
            </HStack>

            <Box
              rounded="full"
              bg={is_dark ? 'panel.50' : 'panel.100'}
              px={3}
              py={1.5}
            >
              <Text
                color={is_dark ? 'surface.100' : 'surface.700'}
                fontSize="2xs"
                fontWeight="medium"
                textTransform="uppercase"
              >
                {context_label}
              </Text>
            </Box>
          </HStack>

          <VStack space={0.5}>
            <Heading color={is_dark ? 'white' : 'surface.900'} size="md">
              {title}
            </Heading>
            <Text color={is_dark ? 'surface.100' : 'surface.700'} fontSize="xs">
              {subtitle}
            </Text>
          </VStack>
        </VStack>
      </HStack>

      {right_actions.length > 0 ? (
        <HStack alignItems="center" space={2}>
          {right_actions.map((action) => {
            const is_primary = action.tone === 'primary';

            return (
              <Button
                key={action.label}
                bg={is_primary ? 'brand.500' : secondary_button_bg}
                borderWidth={is_primary ? 0 : 1}
                borderColor={secondary_button_border}
                _text={{
                  color: is_primary ? 'white' : is_dark ? 'surface.50' : 'surface.900',
                  fontSize: action.label === '...' ? 'md' : 'lg',
                  fontWeight: 'bold',
                }}
                px={3}
                h="40px"
                minW="40px"
                shadow={is_dark ? 0 : 1}
                onPress={action.on_press}
              >
                {action.label}
              </Button>
            );
          })}
        </HStack>
      ) : null}
    </HStack>
  );
}
