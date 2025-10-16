import Svg, { Path } from 'react-native-svg';

interface OptomLogoProps {
  width?: number;
  height?: number;
  color?: string;
}

export function OptomLogo({ width = 200, height = 120, color = '#B8A072' }: OptomLogoProps) {
  return (
    <Svg width={width} height={height} viewBox="0 0 200 120" fill="none">
      {/* Eye icon */}
      <Path
        d="M100 45C85 45 72 52 65 62C72 72 85 79 100 79C115 79 128 72 135 62C128 52 115 45 100 45Z"
        stroke={color}
        strokeWidth="4"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
      {/* Eye pupil */}
      <Path
        d="M100 70C105.523 70 110 65.523 110 60C110 54.477 105.523 50 100 50C94.477 50 90 54.477 90 60C90 65.523 94.477 70 100 70Z"
        stroke={color}
        strokeWidth="4"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
      {/* Plus icon */}
      <Path
        d="M130 25H140M135 20V30"
        stroke={color}
        strokeWidth="4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}
