import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react-native';
import { Input } from '../Input';

describe('Input', () => {
  it('renders its label', () => {
    render(<Input label="Email" />);
    expect(screen.getByText('Email')).toBeOnTheScreen();
  });

  it('reports typed text to the caller', () => {
    const onChangeText = jest.fn();
    render(<Input label="Email" onChangeText={onChangeText} />);

    fireEvent.changeText(screen.getByLabelText('Email'), 'user@example.com');

    expect(onChangeText).toHaveBeenCalledWith('user@example.com');
  });

  it('shows an error message when one is provided', () => {
    render(<Input label="Email" error="Email is required" />);
    expect(screen.getByText('Email is required')).toBeOnTheScreen();
  });

  it('shows no error message by default', () => {
    render(<Input label="Email" />);
    expect(screen.queryByText('Email is required')).not.toBeOnTheScreen();
  });

  it('still calls a caller supplied onFocus handler', () => {
    const onFocus = jest.fn();
    render(<Input label="Email" onFocus={onFocus} />);

    fireEvent(screen.getByLabelText('Email'), 'focus');

    expect(onFocus).toHaveBeenCalled();
  });

  it('still calls a caller supplied onBlur handler', () => {
    const onBlur = jest.fn();
    render(<Input label="Email" onBlur={onBlur} />);

    fireEvent(screen.getByLabelText('Email'), 'blur');

    expect(onBlur).toHaveBeenCalled();
  });

  it('renders the provided placeholder', () => {
    render(<Input label="Email" placeholder="you@example.com" />);
    expect(screen.getByPlaceholderText('you@example.com')).toBeOnTheScreen();
  });
});
