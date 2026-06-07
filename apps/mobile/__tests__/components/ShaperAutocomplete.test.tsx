import { render, screen, fireEvent, waitFor } from '@testing-library/react-native';
import { ShaperAutocomplete } from '../../src/components/ShaperAutocomplete';

jest.mock('@glidr/data', () => ({
  getShapers: jest.fn().mockResolvedValue([{ id: 's1', name: 'Christenson' }]),
}));
jest.mock('../../src/lib/supabase', () => ({ supabase: {} }));

describe('ShaperAutocomplete', () => {
  it('resolves a shaper id when a suggestion is tapped', async () => {
    const onResolve = jest.fn();
    const onChangeName = jest.fn();
    render(<ShaperAutocomplete name="Chris" onChangeName={onChangeName} onResolve={onResolve} />);
    fireEvent(screen.getByPlaceholderText('e.g. Christenson'), 'focus');
    const sugg = await waitFor(() => screen.getByText('Christenson'));
    fireEvent.press(sugg);
    expect(onResolve).toHaveBeenCalledWith('s1');
    expect(onChangeName).toHaveBeenCalledWith('Christenson');
  });
});
