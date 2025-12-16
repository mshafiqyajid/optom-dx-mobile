import { Image } from 'react-native';

interface OptomLogoProps {
  width?: number;
  height?: number;
}

export function OptomLogo({ width = 200, height = 120 }: OptomLogoProps) {
  return (
    <Image
      source={require('@/assets/images/optom-logo.png')}
      style={{ width, height }}
      resizeMode="contain"
    />
  );
}
