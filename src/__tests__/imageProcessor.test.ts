import { resizeImage } from '../utils/imageProcessor';
import sharp from 'sharp';
import path from 'path';  // Import path module for handling file paths

jest.mock('sharp');

describe('resizeImage', () => {
  const mockInputPath = 'images/image.jpg';
  const mockOutputPath = 'processed/resized_200x300_image.jpg';

  const mockSharpInstance = {
    resize: jest.fn().mockReturnThis(),
    toFile: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (sharp as unknown as jest.Mock).mockReturnValue(mockSharpInstance);
  });

  it('should resize the image and return the output path', async () => {
    mockSharpInstance.toFile.mockResolvedValueOnce(mockOutputPath);

    const result = await resizeImage(mockInputPath, 200, 300);

    expect(sharp).toHaveBeenCalledWith(mockInputPath);
    expect(mockSharpInstance.resize).toHaveBeenCalledWith(200, 300);
    expect(mockSharpInstance.toFile).toHaveBeenCalledWith(expect.stringContaining('resized_200x300_image.jpg'));

    // Compare only the basename of the paths to avoid full path issues
    expect(path.basename(result)).toBe(path.basename(mockOutputPath));
  });
 
    it('should throw an error if resizing fails', async () => {
        const mockError = new Error('Resizing error');
        mockSharpInstance.toFile.mockRejectedValueOnce(mockError);
      
        // Mock console.error to suppress output during the test
        const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
      
        await expect(resizeImage(mockInputPath, 200, 300)).rejects.toThrow('Failed to resize the image');
      
        // Restore the original console.error
        consoleErrorSpy.mockRestore();
      });
});
