import React from 'react';
import { render, fireEvent, screen, waitFor } from '@testing-library/react';
import App from './App';

describe('App component', () => {
  it('should render the input field, button, and image container', () => {
    render(<App />);
    expect(screen.getByPlaceholderText('Enter a keyword...')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Send Data' })).toBeInTheDocument();
    expect(screen.getByAltText('')).toBeInTheDocument();
  });

  it('should update the input field value when the user enters text', () => {
    render(<App />);
    const input = screen.getByPlaceholderText('Enter a keyword...');
    fireEvent.change(input, { target: { value: 'dog' } });
    expect(input.value).toBe('dog');
  });

  it('should fetch data and display an image when the user clicks the button', async () => {
    // Mock fetch API
    const mockFetch = jest.fn(() =>
      Promise.resolve({
        json: () =>
          Promise.resolve({
            data: [
              {
                url: 'https://example.com/image.png',
              },
            ],
          }),
      })
    );
    global.fetch = mockFetch;

    render(<App />);
    const input = screen.getByPlaceholderText('Enter a keyword...');
    const button = screen.getByRole('button', { name: 'Send Data' });
    fireEvent.change(input, { target: { value: 'cat' } });
    fireEvent.click(button);

    // Wait for the image to load
    await waitFor(() => {
      expect(screen.getByAltText('')).toHaveAttribute('src', 'https://example.com/image.png');
    });

    expect(mockFetch).toHaveBeenCalledTimes(1);
    expect(mockFetch).toHaveBeenCalledWith('https://api.openai.com/v1/images/generations', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer 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',
      },
      body: JSON.stringify({
        prompt: 'cat Meme',
        n: 1,
        size: '512x512',
      }),
    });
  });

  it('should show a loading message when data is being sent', async () => {
    // Mock fetch API
    const mockFetch = jest.fn(() => Promise.resolve({ json: () => Promise.resolve({ data: [{ url: 'image.png' }] }) }));
    global.fetch = mockFetch;

    render(<App />);
    const button = screen.getByRole('button', { name: 'Send Data' });
    fireEvent.click(button);

    expect(screen.getByText('Sending Data...')).toBeInTheDocument();
  });
});
