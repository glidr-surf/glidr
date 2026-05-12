import Svg, { Path } from 'react-native-svg';

interface SurfboardIconProps {
  size?: number;
  color?: string;
  filled?: boolean;
}

export function SurfboardIcon({ size = 16, color = '#1A1714', filled = false }: SurfboardIconProps) {
  const width = size * 0.375;
  return (
    <Svg width={width} height={size} viewBox="0 0 12 32">
      <Path
        d="M6 0C3.5 0 1.5 4 1 8C0.3 13 0 18 0.5 23C1 27 2.5 30 4 31.5C5 32.3 5.5 32 6 32C6.5 32 7 32.3 8 31.5C9.5 30 11 27 11.5 23C12 18 11.7 13 11 8C10.5 4 8.5 0 6 0Z"
        fill={filled ? color : 'none'}
        stroke={color}
        strokeWidth={1}
      />
    </Svg>
  );
}
