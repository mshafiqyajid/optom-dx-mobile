import { View, StyleSheet, Dimensions, TextInput } from 'react-native';
import Svg, { G, Path } from 'react-native-svg';
import { ThemedText } from './themed-text';
import { Spacing, Typography } from '@/constants/design-system';

interface SeverityChartProps {
  value: number; // 1-10
  maxValue?: number;
  onValueChange?: (value: number) => void;
}

export function SeverityChart({ value, maxValue = 10, onValueChange }: SeverityChartProps) {
  const width = Dimensions.get('window').width - Spacing.lg * 4;
  const size = Math.min(width, 280);
  const strokeWidth = 32;
  const radius = (size - strokeWidth) / 2;
  const centerX = size / 2;
  const centerY = size / 2;

  const handleValueChange = (text: string) => {
    const numValue = parseInt(text, 10);
    if (!isNaN(numValue) && numValue >= 1 && numValue <= maxValue) {
      onValueChange?.(numValue);
    } else if (text === '') {
      onValueChange?.(0);
    }
  };

  // Calculate percentage
  const percentage = (value / maxValue) * 100;
  const angle = (percentage / 100) * 180; // 0-180 degrees for semi-circle

  // Create path for background (full semi-circle)
  const createArcPath = (startAngle: number, endAngle: number) => {
    const start = polarToCartesian(centerX, centerY, radius, endAngle);
    const end = polarToCartesian(centerX, centerY, radius, startAngle);
    const largeArcFlag = endAngle - startAngle <= 180 ? '0' : '1';
    return `M ${start.x} ${start.y} A ${radius} ${radius} 0 ${largeArcFlag} 0 ${end.x} ${end.y}`;
  };

  const polarToCartesian = (centerX: number, centerY: number, radius: number, angleInDegrees: number) => {
    const angleInRadians = ((angleInDegrees - 180) * Math.PI) / 180.0;
    return {
      x: centerX + radius * Math.cos(angleInRadians),
      y: centerY + radius * Math.sin(angleInRadians),
    };
  };

  const backgroundPath = createArcPath(0, 180);
  const progressPath = createArcPath(0, angle);

  return (
    <View style={styles.container}>
      <Svg width={size} height={size / 2 + 40}>
        <G rotation="0" origin={`${centerX}, ${centerY}`}>
          {/* Background arc */}
          <Path
            d={backgroundPath}
            stroke="#E5E5E5"
            strokeWidth={strokeWidth}
            fill="none"
            strokeLinecap="round"
          />
          {/* Progress arc */}
          <Path
            d={progressPath}
            stroke="#E94E4E"
            strokeWidth={strokeWidth}
            fill="none"
            strokeLinecap="round"
          />
        </G>
      </Svg>

      {/* Value display */}
      <View style={styles.valueContainer}>
        <View style={styles.valueBox}>
          <TextInput
            style={styles.valueInput}
            value={value > 0 ? value.toString() : ''}
            onChangeText={handleValueChange}
            keyboardType="number-pad"
            maxLength={2}
            textAlign="center"
            placeholder="0"
            placeholderTextColor="#CCCCCC"
          />
        </View>
        <ThemedText style={styles.outOf}>OUT OF {maxValue}</ThemedText>
        <ThemedText style={styles.scale}>(1 = MILD, {maxValue} = SEVERE)</ThemedText>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.xl,
    position: 'relative',
  },
  valueContainer: {
    position: 'absolute',
    bottom: 0,
    alignItems: 'center',
  },
  valueBox: {
    width: 68,
    height: 68,
    borderRadius: 16,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.md,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#E5E5E5',
  },
  valueInput: {
    fontSize: 42,
    fontWeight: Typography.fontWeight.bold,
    color: '#000000',
    width: '100%',
    height: '100%',
    textAlign: 'center',
  },
  outOf: {
    fontSize: Typography.fontSize.sm,
    fontWeight: Typography.fontWeight.semibold,
    color: '#666666',
    marginBottom: 4,
  },
  scale: {
    fontSize: Typography.fontSize.xs,
    color: '#999999',
  },
});
