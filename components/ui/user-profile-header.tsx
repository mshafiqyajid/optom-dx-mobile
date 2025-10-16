import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { StatusBadge } from '@/components/ui/status-badge';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { DesignColors, ComponentSizes, Spacing } from '@/constants/design-system';

export interface UserProfileHeaderProps {
  name: string;
  role: string;
  avatarUrl?: string;
  online?: boolean;
  size?: 'small' | 'medium' | 'large';
  onAvatarPress?: () => void;
}

export function UserProfileHeader({
  name,
  role,
  avatarUrl,
  online = true,
  size = 'medium',
  onAvatarPress,
}: UserProfileHeaderProps) {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  const avatarSize =
    size === 'small'
      ? ComponentSizes.avatar.sm
      : size === 'large'
        ? ComponentSizes.avatar.lg
        : ComponentSizes.avatar.md;

  return (
    <View style={styles.container}>
      <View style={styles.info}>
        <ThemedText type="title" style={styles.name}>
          {name}
        </ThemedText>
        <StatusBadge text={role} online={online} />
      </View>
      <TouchableOpacity style={styles.avatarContainer} onPress={onAvatarPress}>
        <View
          style={[
            styles.avatar,
            {
              width: avatarSize,
              height: avatarSize,
              borderRadius: avatarSize / 2,
              backgroundColor: isDark ? '#444' : DesignColors.light.surface,
            },
          ]}>
          {avatarUrl ? (
            // Add Image component here when implementing
            <IconSymbol
              name="person.fill"
              size={avatarSize / 2}
              color={isDark ? DesignColors.dark.icon : DesignColors.light.icon}
            />
          ) : (
            <IconSymbol
              name="person.fill"
              size={avatarSize / 2}
              color={isDark ? DesignColors.dark.icon : DesignColors.light.icon}
            />
          )}
        </View>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  info: {
    flex: 1,
  },
  name: {
    fontSize: 28,
    marginBottom: 4,
  },
  avatarContainer: {
    borderRadius: 9999,
    overflow: 'hidden',
  },
  avatar: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});
