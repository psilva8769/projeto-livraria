import React from 'react';
import { render } from '@testing-library/react';

const MinimalComponent = () => <div>Hello, World!</div>;

test('renders MinimalComponent', () => {
  const { getByText } = render(<MinimalComponent />);
  expect(getByText('Hello, World!')).toBeInTheDocument();
});
