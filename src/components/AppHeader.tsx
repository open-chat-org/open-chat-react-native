import { Box, HStack, Heading, Text, VStack } from 'native-base';
import { ThemeMode } from '../app/theme/theme';
import { AppIconName } from '../types/icon.types';
import { MotionIconButton } from './MotionIconButton';

type HeaderAction = {
  icon: AppIconName;
  label?: string;
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
  const action_button_size = 38;
  const action_icon_size = 16;

  return (
    <HStack alignItems="flex-start" space={3}>
      {can_go_back ? (
        <MotionIconButton
          accessibility_label="Go back"
          bg={secondary_button_bg}
          border_color={secondary_button_border}
          border_width={1}
          icon_color={is_dark ? '#d8e3ea' : '#17212b'}
          icon_name="caret-left"
          icon_size={action_icon_size}
          shadow={is_dark ? 0 : 1}
          on_press={on_go_back}
          size={action_button_size}
          style={{ marginTop: 2 }}
        />
      ) : null}

      <VStack flex={1} space={3}>
        <HStack alignItems="flex-start" justifyContent="space-between" space={3}>
          <HStack alignItems="center" flex={1} flexWrap="wrap" space={2}>
            <HStack
              alignItems="center"
              space={2}
              rounded="full"
              bg={is_dark ? 'brand.900' : 'brand.50'}
              px={2.5}
              py={1.5}
            >
              <Box h="7px" w="7px" rounded="full" bg="brand.500" />
              <Text color="brand.500" fontSize="2xs" fontWeight="bold" textTransform="uppercase">
                Open Chat
              </Text>
            </HStack>

            <Box
              rounded="full"
              bg={is_dark ? 'panel.50' : 'panel.100'}
              px={2.5}
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

          {right_actions.length > 0 ? (
            <HStack alignItems="center" space={1.5}>
              {right_actions.map((action) => {
                const is_primary = action.tone === 'primary';

                return (
                  <MotionIconButton
                    key={`${action.icon}-${action.label ?? 'action'}`}
                    accessibility_label={action.label}
                    bg={is_primary ? 'brand.500' : secondary_button_bg}
                    border_color={is_primary ? undefined : secondary_button_border}
                    border_width={is_primary ? 0 : 1}
                    icon_color={is_primary ? '#ffffff' : is_dark ? '#d8e3ea' : '#17212b'}
                    icon_name={action.icon}
                    icon_size={action_icon_size}
                    icon_weight={is_primary ? 'bold' : 'regular'}
                    shadow={is_dark ? 0 : 1}
                    on_press={action.on_press}
                    size={action_button_size}
                  />
                );
              })}
            </HStack>
          ) : null}
        </HStack>

        <VStack flex={1} space={1}>
          <Heading color={is_dark ? 'white' : 'surface.900'} size="md">
            {title}
          </Heading>
          <Text
            color={is_dark ? 'surface.100' : 'surface.700'}
            fontSize="xs"
            lineHeight="18px"
            numberOfLines={2}
          >
            {subtitle}
          </Text>
        </VStack>
      </VStack>
    </HStack>
  );
}
