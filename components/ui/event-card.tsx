import { memo } from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { DesignColors, BorderRadius, Spacing, IconSizes } from '@/constants/design-system';

export interface EventCardProps {
  title: string;
  subtitle?: string;
  date: string;
  time?: string;
  variant?: 'upcoming' | 'list';
  onPress?: () => void;
  onMenuPress?: () => void;
}

export const EventCard = memo(function EventCard({
  title,
  subtitle,
  date,
  time,
  variant = 'list',
  onPress,
  onMenuPress,
}: EventCardProps) {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  if (variant === 'upcoming') {
    return (
      <TouchableOpacity
        style={[
          styles.upcomingCard,
          { backgroundColor: isDark ? DesignColors.eventCard.backgroundDark : DesignColors.eventCard.background },
        ]}
        onPress={onPress}
        accessibilityLabel={`Upcoming event: ${title}${subtitle ? `, ${subtitle}` : ''}, ${date}${time ? ` at ${time}` : ''}`}
        accessibilityRole="button"
        accessibilityHint="Double tap to view event details">
        <View style={styles.eventIconContainer}>
          <View style={[styles.eventIcon, { backgroundColor: DesignColors.accent }]}>
            <IconSymbol name="calendar" size={IconSizes.lg} color="#FFFFFF" />
          </View>
        </View>
        <View style={styles.upcomingEventContent}>
          <ThemedText style={[styles.upcomingEventTitle, { color: '#FFFFFF' }]}>{title}</ThemedText>
          {subtitle && (
            <ThemedText style={[styles.upcomingEventSubtitle, { color: '#FFFFFF' }]}>
              {subtitle}
            </ThemedText>
          )}
          <View style={styles.upcomingEventDetails}>
            <ThemedText style={[styles.upcomingEventDate, { color: '#FFFFFF' }]}>{date}</ThemedText>
            {time && (
              <ThemedText style={[styles.upcomingEventTime, { color: '#FFFFFF', opacity: 0.8 }]}>
                {time}
              </ThemedText>
            )}
          </View>
        </View>
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity
      style={[
        styles.eventItem,
        {
          backgroundColor: isDark ? DesignColors.dark.surface : DesignColors.light.surface,
          borderColor: isDark ? DesignColors.dark.border : DesignColors.light.border,
        },
      ]}
      onPress={onPress}
      accessibilityLabel={`Event: ${title}, ${date}`}
      accessibilityRole="button"
      accessibilityHint="Double tap to view event details">
      <View style={[styles.eventIcon, { backgroundColor: DesignColors.accent }]}>
        <IconSymbol name="calendar" size={IconSizes.md} color="#FFFFFF" />
      </View>
      <View style={styles.eventContent}>
        <ThemedText type="defaultSemiBold" style={styles.eventTitle}>
          {title}
        </ThemedText>
        <ThemedText
          style={[
            styles.eventDate,
            { color: isDark ? DesignColors.dark.textSecondary : DesignColors.light.textSecondary },
          ]}>
          {date}
        </ThemedText>
      </View>
      {onMenuPress && (
        <TouchableOpacity
          style={styles.eventMenu}
          onPress={onMenuPress}
          accessibilityLabel={`More options for ${title}`}
          accessibilityRole="button">
          <IconSymbol
            name="ellipsis"
            size={IconSizes.sm}
            color={isDark ? DesignColors.dark.icon : DesignColors.light.icon}
          />
        </TouchableOpacity>
      )}
    </TouchableOpacity>
  );
});

const styles = StyleSheet.create({
  // Upcoming variant styles
  upcomingCard: {
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    marginTop: Spacing.md,
  },
  eventIconContainer: {
    marginBottom: Spacing.md,
  },
  upcomingEventContent: {
    gap: Spacing.sm,
  },
  upcomingEventTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  upcomingEventSubtitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  upcomingEventDetails: {
    marginTop: Spacing.sm,
  },
  upcomingEventDate: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 4,
  },
  upcomingEventTime: {
    fontSize: 14,
  },

  // List variant styles
  eventItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.md,
    borderRadius: BorderRadius.md,
    marginBottom: Spacing.md,
    borderWidth: 1,
  },
  eventIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  eventContent: {
    flex: 1,
    marginLeft: Spacing.md,
  },
  eventTitle: {
    fontSize: 13,
    marginBottom: 4,
    letterSpacing: 0.5,
  },
  eventDate: {
    fontSize: 12,
  },
  eventMenu: {
    padding: Spacing.sm,
  },
});
