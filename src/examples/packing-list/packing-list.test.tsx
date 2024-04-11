import { render as _render, screen, waitFor } from 'test/utilities';
import { PackingList } from '.';
import { createStore } from './store';
import { Provider } from 'react-redux';
import { PropsWithChildren } from 'react';

const render: typeof _render = (Component, options) => {
  const store = createStore();
  const Wrapper = ({ children }: PropsWithChildren) => {
    return <Provider store={store}>{children}</Provider>;
  };

  return _render(Component, { ...options, wrapper: Wrapper });
};

it('renders the Packing List application', () => {
  render(<PackingList />);
});

it('has the correct title', async () => {
  render(<PackingList />);
  screen.getByText('Packing List');
});

it('has an input field for a new item', () => {
  render(<PackingList />);
  screen.getByLabelText('New Item Name');
});

it('has a "Add New Item" button that is disabled when the input is empty', () => {
  render(<PackingList />);
  const newItemInput = screen.getByLabelText('New Item Name');
  const addNewItemBtn = screen.getByRole('button', {
    name: 'Add New Item',
  });

  expect(newItemInput).toHaveValue('');
  expect(addNewItemBtn).toBeDisabled();
});

it('enables the "Add New Item" button when there is text in the input field', async () => {
  const { user } = render(<PackingList />);
  const newItemInput = screen.getByLabelText('New Item Name');
  const addNewItemBtn = screen.getByRole('button', {
    name: 'Add New Item',
  });

  await user.type(newItemInput, 'MacBook Pro');

  expect(addNewItemBtn).toBeEnabled();
});

it('adds a new item to the unpacked item list when the clicking "Add New Item"', async () => {
  const { user } = render(<PackingList />);
  const newItemInput = screen.getByLabelText('New Item Name');
  const addNewItemBtn = screen.getByRole('button', {
    name: 'Add New Item',
  });

  await user.type(newItemInput, 'MacBook Pro');
  await user.click(addNewItemBtn);

  expect(screen.getByLabelText('MacBook Pro')).not.toBeChecked();
});

it('removes an item from the unpacked item list when the clicking "Remove"', async () => {
  const { user } = render(<PackingList />);
  const newItemInput = screen.getByLabelText('New Item Name');
  const addNewItemBtn = screen.getByRole('button', {
    name: 'Add New Item',
  });

  await user.type(newItemInput, 'MacBook Pro');
  await user.click(addNewItemBtn);

  expect(screen.getByLabelText('MacBook Pro')).not.toBeChecked();

  const removeItemBtn = screen.getByLabelText(/Remove MacBook Pro/i);

  await user.click(removeItemBtn);

  await waitFor(() => expect(removeItemBtn).not.toBeInTheDocument());
});
