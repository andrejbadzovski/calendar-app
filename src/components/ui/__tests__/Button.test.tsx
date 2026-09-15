import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react-native';
import { Button } from '../Button';

describe('Button', () => {
  it('renders its label', () => {
    render(<Button label="Save" onPress={jest.fn()} />);
    expect(screen.getByText('Save')).toBeOnTheScreen();
  });

  it('calls onPress when tapped', () => {
    const onPress = jest.fn();
    render(<Button label="Save" onPress={onPress} />);

    fireEvent.press(screen.getByRole('button'));

    expect(onPress).toHaveBeenCalledTimes(1);
  });

  it('does not call onPress when disabled', () => {
    const onPress = jest.fn();
    render(<Button label="Save" onPress={onPress} disabled />);

    fireEvent.press(screen.getByRole('button'));

    expect(onPress).not.toHaveBeenCalled();
  });

  it('hides the label and blocks presses while loading', () => {
    const onPress = jest.fn();
    render(<Button label="Save" onPress={onPress} loading />);

    expect(screen.queryByText('Save')).not.toBeOnTheScreen();

    fireEvent.press(screen.getByRole('button'));
    expect(onPress).not.toHaveBeenCalled();
  });

  it('exposes its disabled state to assistive technology', () => {
    render(<Button label="Save" onPress={jest.fn()} disabled />);
    expect(screen.getByRole('button')).toBeDisabled();
  });
});