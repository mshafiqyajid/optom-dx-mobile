import { StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { DesignColors, ComponentSizes, Spacing } from '@/constants/design-system';

export interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'danger' | 'outline';
  size?: 'small' | 'medium' | 'large';
  disabled?: boolean;
  loading?: boolean;
  fullWidth?: boolean;
}

export function Button({
  title,
  onPress,
  variant = 'primary',
  size = 'large',
  disabled = false,
  loading = false,
  fullWidth = false,
}: ButtonProps) {
  const getBackgroundColor = () => {
    if (disabled) return '#CCCCCC';
    switch (variant) {
      case 'primary':
        return DesignColors.primary;
      case 'secondary':
        return DesignColors.accent;
      case 'danger':
        return DesignColors.error;
      case 'outline':
        return 'transparent';
      default:
        return DesignColors.primary;
    }
  };

  const getHeight = () => {
    switch (size) {
      case 'small':
        return 40;
      case 'medium':
        return 48;
      case 'large':
        return ComponentSizes.button.height;
      default:
        return ComponentSizes.button.height;
    }
  };

  const getPaddingHorizontal = () => {
    switch (size) {
      case 'small':
        return Spacing.md;
      case 'medium':
        return Spacing.lg;
      case 'large':
        return ComponentSizes.button.paddingHorizontal;
      default:
        return ComponentSizes.button.paddingHorizontal;
    }
  };

  return (
    <TouchableOpacity
      style={[
        styles.button,
        {
          backgroundColor: getBackgroundColor(),
          height: getHeight(),
          paddingHorizontal: getPaddingHorizontal(),
          borderRadius: ComponentSizes.button.borderRadius,
          borderWidth: variant === 'outline' ? 2 : 0,
          borderColor: variant === 'outline' ? DesignColors.primary : 'transparent',
          opacity: disabled ? 0.5 : 1,
          width: fullWidth ? '100%' : 'auto',
        },
      ]}
      onPress={onPress}
      disabled={disabled || loading}>
      {loading ? (
        <ActivityIndicator color="#FFFFFF" />
      ) : (
        <ThemedText
          type="defaultSemiBold"
          style={[
            styles.buttonText,
            {
              color: variant === 'outline' ? DesignColors.primary : '#FFFFFF',
              fontSize: size === 'small' ? 14 : size === 'medium' ? 16 : 18,
            },
          ]}>
          {title}
        </ThemedText>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    fontWeight: '600',
  },
});
