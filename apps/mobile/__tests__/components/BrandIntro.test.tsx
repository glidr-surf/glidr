import { render, screen } from '@testing-library/react-native';
import { BrandIntro } from '../../src/components/BrandIntro';

describe('BrandIntro', () => {
  it('renders the mark and wordmark', () => {
    render(<BrandIntro onDone={() => {}} />);
    expect(screen.getByText('G')).toBeTruthy();
    expect(screen.getByText('GLIDR')).toBeTruthy();
  });
});
