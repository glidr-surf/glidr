import React from 'react';
import { render, screen } from '@testing-library/react-native';
import { GText } from '../../src/components/GText';

describe('GText', () => {
  it('renders text content', () => {
    render(<GText>Hello</GText>);
    expect(screen.getByText('Hello')).toBeTruthy();
  });

  it('applies display variant styles', () => {
    const { getByText } = render(<GText variant="displayL">Title</GText>);
    const element = getByText('Title');
    expect(element.props.style).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ fontSize: 32 }),
      ]),
    );
  });

  it('applies custom color', () => {
    const { getByText } = render(<GText color="#E8432A">Red text</GText>);
    const element = getByText('Red text');
    expect(element.props.style).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ color: '#E8432A' }),
      ]),
    );
  });
});
