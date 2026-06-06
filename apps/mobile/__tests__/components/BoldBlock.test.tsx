import { render, screen } from '@testing-library/react-native';
import { Text } from 'react-native';
import { BoldBlock } from '../../src/components/BoldBlock';
import { Card } from '../../src/components/Card';
import { colors } from '../../src/theme/colors';

describe('BoldBlock', () => {
  it('renders children', () => {
    render(<BoldBlock testID="bb"><Text>hi</Text></BoldBlock>);
    expect(screen.getByText('hi')).toBeTruthy();
  });

  it('fills the content with the requested tone', () => {
    render(<BoldBlock testID="bb" tone="yellow"><Text>x</Text></BoldBlock>);
    const content = screen.getByTestId('bb-content');
    expect(content.props.style).toEqual(
      expect.arrayContaining([expect.objectContaining({ backgroundColor: colors.yellow })]),
    );
  });
});

describe('Card', () => {
  it('renders children on the calm surface', () => {
    render(<Card testID="c"><Text>read me</Text></Card>);
    expect(screen.getByText('read me')).toBeTruthy();
    const card = screen.getByTestId('c');
    expect(card.props.style).toEqual(
      expect.arrayContaining([expect.objectContaining({ backgroundColor: colors.surfaceCard })]),
    );
  });
});
