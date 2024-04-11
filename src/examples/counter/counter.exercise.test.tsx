import { screen, render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Counter from '.';
import { renderComponent } from './test/utilities';

test('it should render the component', () => {
  renderComponent(<Counter />);
  const currentCount = screen.getByTestId('current-count');
  expect(currentCount).toHaveTextContent('0');
});

test('it should increment when the "Increment" button is pressed', async () => {
  const { user } = renderComponent(<Counter />);

  const currentCount = screen.getByTestId('current-count');
  const incrementButton = screen.getByRole('button', { name: 'Increment' });

  await user.click(incrementButton);

  expect(currentCount).toHaveTextContent('1');
});

test('it should render the component with an initial count', () => {
  renderComponent(<Counter initialCount={5} />);
  const currentCount = screen.getByTestId('current-count');

  expect(currentCount).toHaveTextContent('5');
});

test('it should reset the count when the "Reset" button is pressed', async () => {
  const { user } = renderComponent(<Counter initialCount={4} />);

  const currentCount = screen.getByTestId('current-count');
  const resetButton = screen.getByRole('button', { name: 'Reset' });

  expect(currentCount).toHaveTextContent('4');

  await user.click(resetButton);
  expect(currentCount).toHaveTextContent('0');
});
