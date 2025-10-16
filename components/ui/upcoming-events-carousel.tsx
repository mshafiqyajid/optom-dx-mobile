import { View, StyleSheet, Dimensions, ScrollView } from 'react-native';
import { useCallback, useEffect, useRef, useState } from 'react';
import { EventCard, EventCardProps } from './event-card';
import { Spacing } from '@/constants/design-system';

const SCREEN_WIDTH = Dimensions.get('window').width;
const CAROUSEL_WIDTH = SCREEN_WIDTH - Spacing.lg * 2;

export interface UpcomingEventsCarouselProps {
  events: EventCardProps[];
}

export function UpcomingEventsCarousel({ events }: UpcomingEventsCarouselProps) {
  const scrollViewRef = useRef<ScrollView>(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  const scrollToNext = useCallback(() => {
    if (!scrollViewRef.current || events.length === 0) return;

    const nextIndex = (currentIndex + 1) % events.length;
    scrollViewRef.current.scrollTo({
      x: nextIndex * CAROUSEL_WIDTH,
      animated: true,
    });
    setCurrentIndex(nextIndex);
  }, [currentIndex, events.length]);

  useEffect(() => {
    if (events.length <= 1) return;

    const autoplay = setInterval(() => {
      scrollToNext();
    }, 5000);

    return () => clearInterval(autoplay);
  }, [scrollToNext, events.length]);

  if (events.length === 0) {
    return null;
  }

  return (
    <View style={styles.container}>
      <ScrollView
        ref={scrollViewRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        scrollEnabled={events.length > 1}
        scrollEventThrottle={16}
        onMomentumScrollEnd={(event) => {
          const contentOffsetX = event.nativeEvent.contentOffset.x;
          const index = Math.round(contentOffsetX / CAROUSEL_WIDTH);
          setCurrentIndex(index);
        }}
        style={styles.scrollView}
        contentContainerStyle={styles.scrollViewContent}
      >
        {events.map((event, index) => (
          <View key={index} style={[styles.slide, { width: CAROUSEL_WIDTH }]}>
            <EventCard
              variant="upcoming"
              title={event.title}
              subtitle={event.subtitle}
              date={event.date}
              time={event.time}
              onPress={event.onPress}
            />
          </View>
        ))}
      </ScrollView>

      {events.length > 1 && (
        <View style={styles.pagination}>
          {events.map((_, index) => (
            <View
              key={index}
              style={[
                styles.paginationDot,
                index === currentIndex && styles.paginationDotActive,
              ]}
            />
          ))}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: Spacing.md,
  },
  scrollView: {
    overflow: 'visible',
  },
  scrollViewContent: {
    paddingHorizontal: 0,
  },
  slide: {
    justifyContent: 'center',
    paddingHorizontal: Spacing.sm,
  },
  pagination: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: Spacing.md,
    gap: Spacing.xs,
  },
  paginationDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#D0D5DD',
  },
  paginationDotActive: {
    backgroundColor: '#B8A072',
    width: 24,
  },
});
