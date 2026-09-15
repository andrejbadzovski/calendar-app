import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react-native';
import { MonthGrid } from '../MonthGrid';
import { toDateKey } from '@/utils/date';

const september2026 = new Date(2026, 8, 15);

type GridProps = React.ComponentProps<typeof MonthGrid>;

function renderGrid(overrides: Partial<GridProps> = {}) {
  const props: GridProps = {
    visibleMonth: september2026,
    selectedDate: september2026,
    onSelectDate: jest.fn(),
    eventCountByDate: {},
    ...overrides,
  };
  render(<MonthGrid {...props} />);
  return props;
}

describe('MonthGrid', () => {
  it('renders a full six week grid of day cells', () => {
    renderGrid();
    expect(screen.getAllByRole('button')).toHaveLength(42);
  });

  it('renders Monday first weekday headings', () => {
    renderGrid();
    expect(screen.getByText('Mon')).toBeOnTheScreen();
    expect(screen.getByText('Sun')).toBeOnTheScreen();
  });

  it('gives every cell a unique accessibility label', () => {
    renderGrid();
    const labels = screen
      .getAllByRole('button')
      .map(cell => cell.props.accessibilityLabel as string);

    expect(new Set(labels).size).toBe(42);
  });

  it('marks the selected day as selected', () => {
    renderGrid();
    expect(screen.getByLabelText('Tue, 15 September, 0 events')).toBeSelected();
  });

  it('does not mark other days as selected', () => {
    renderGrid();
    expect(screen.getByLabelText('Wed, 16 September, 0 events')).not.toBeSelected();
  });

  it('reports the tapped date to the caller', () => {
    const { onSelectDate } = renderGrid();

    fireEvent.press(screen.getByLabelText('Wed, 16 September, 0 events'));

    expect(onSelectDate).toHaveBeenCalledTimes(1);
    const received = (onSelectDate as jest.Mock).mock.calls[0]?.[0] as Date;
    expect(toDateKey(received)).toBe('2026-09-16');
  });

  it('surfaces the event count for a day', () => {
    renderGrid({ eventCountByDate: { '2026-09-16': 3 } });
    expect(screen.getByLabelText('Wed, 16 September, 3 events')).toBeOnTheScreen();
  });

  it('allows selecting a day from an adjacent month', () => {
    const { onSelectDate } = renderGrid();

    fireEvent.press(screen.getByLabelText('Mon, 31 August, 0 events'));

    const received = (onSelectDate as jest.Mock).mock.calls[0]?.[0] as Date;
    expect(toDateKey(received)).toBe('2026-08-31');
  });

  it('distinguishes the first of the visible month from the first of the next', () => {
    renderGrid();
    expect(screen.getByLabelText('Tue, 1 September, 0 events')).toBeOnTheScreen();
    expect(screen.getByLabelText('Thu, 1 October, 0 events')).toBeOnTheScreen();
  });
});
