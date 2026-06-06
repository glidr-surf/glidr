import { View, StyleSheet, ViewProps } from 'react-native';
import { colors } from '../theme/colors';
import { spacing } from '../theme/spacing';
import { Children, isValidElement, Fragment } from 'react';

interface CardGroupProps extends ViewProps {
  children: React.ReactNode;
}

export function CardGroup({ children, style, ...props }: CardGroupProps) {
  const items = Children.toArray(children).filter(isValidElement);

  return (
    <View style={[styles.container, style]} {...props}>
      {items.map((child, i) => (
        <Fragment key={i}>
          {i > 0 && <View style={styles.separator} />}
          {child}
        </Fragment>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.surfaceCard,
    borderRadius: 2,
    marginHorizontal: spacing.xl,
    overflow: 'hidden',
  },
  separator: {
    height: 1,
    backgroundColor: colors.borderSoft,
  },
});
