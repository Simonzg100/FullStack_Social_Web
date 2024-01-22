import React from 'react';
import {
  render, fireEvent, screen, waitFor,
} from '@testing-library/react';
import '@testing-library/jest-dom';
import UploadMedia from '../component/UploadMedia/UploadMedia';
import { uploadFile } from '../api/postsAPI';
import '@testing-library/jest-dom/extend-expect';
/* eslint-disable */
// Mock the uploadFile function
jest.mock('../api/postsAPI', () => ({
  uploadFile: jest.fn(),
}));

describe('UploadMedia Component', () => {
  // Define mock function for handling URL
  const mockHandleSetUrl = jest.fn();

  beforeEach(() => {
    // Clear mock function calls before each test
    jest.clearAllMocks();
  });

  it('uploads a file and sets the URL', async () => {
    // Mock the response from the uploadFile function
    const mockURL = 'https://example.com/media/file123.jpg';
    uploadFile.mockResolvedValue(mockURL);

    render(<UploadMedia handleSetUrl={mockHandleSetUrl} />);

    // Simulate selecting a file using its label text
    const fileInput = document.querySelector('#upld');


    const testFile = new File(['test content'], 'test.jpg', { type: 'image/jpeg' });
    fireEvent.change(fileInput, { target: { files: [testFile] } });

    // Simulate clicking the upload button
    const uploadButton = screen.getByRole('button', { name: /upload new media/i });
    fireEvent.click(uploadButton);

    // Wait for the uploadFile function to be called and URL to be set
    await screen.findByText(/upload complete/i);

    // Check if uploadFile was called with the FormData containing the file
    expect(uploadFile).toHaveBeenCalledWith(expect.any(FormData));

    // Check if handleSetUrl was called with the mock URL
    expect(mockHandleSetUrl).toHaveBeenCalledWith(mockURL);
  });

  it('displays an error message for unsupported file types', () => {
    render(<UploadMedia handleSetUrl={mockHandleSetUrl} />);

    const fileInput = document.querySelector('#upld');
    const unsupportedFile = new File(['test'], 'test.txt', { type: 'text/plain' });
    fireEvent.change(fileInput, { target: { files: [unsupportedFile] } });

    expect(screen.getByText(/unsupported file type/i)).toBeInTheDocument();
    expect(uploadFile).not.toHaveBeenCalled();
    expect(mockHandleSetUrl).not.toHaveBeenCalled();
  });

  // ... [other modified tests]

  it('handles errors during file upload', async () => {
    // Mock the uploadFile function to simulate an error without throwing
    uploadFile.mockResolvedValue({ error: 'Upload failed' });
  
    render(<UploadMedia handleSetUrl={mockHandleSetUrl} />);
  
    // Simulate selecting a file
    const fileInput = document.querySelector('#upld');
    const testFile = new File(['test'], 'test.jpg', { type: 'image/jpeg' });
    fireEvent.change(fileInput, { target: { files: [testFile] } });
  
    // Simulate clicking the upload button
    const uploadButton = screen.getByText('Upload New Media');
    fireEvent.click(uploadButton);
  
    // Use waitFor to handle asynchronous updates
    await waitFor(() => {
      // Check if handleSetUrl was not called, indicating the upload did not succeed
      expect(mockHandleSetUrl).not.toHaveBeenCalled();
    });
  
    // Optionally, check for other indications of failure as per the component's implementation
  });
  
  it('displays a message if no file is selected', () => {
    render(<UploadMedia handleSetUrl={mockHandleSetUrl} />);

    const uploadButton = screen.getByText('Upload New Media');
    fireEvent.click(uploadButton);

    expect(screen.getByText('Please select a file')).toBeInTheDocument();
    expect(uploadFile).not.toHaveBeenCalled();
    expect(mockHandleSetUrl).not.toHaveBeenCalled();
  });
});