import { Text, TextProps, StyleSheet } from 'react-native';
import { typeStyles, TypeVariant } from '../theme/typography';

interface GTextProps extends TextProps {
  variant?: TypeVariant;
  color?: string;
}

export function GText({ variant = 'bodyM', color, style, ...props }: GTextProps) {
  return (
    <Text
      style={[styles[variant], color ? { color } : undefined, style]}
      {...props}
    />
  );
}

const styles = StyleSheet.create(typeStyles);
