import { processImage } from "../utils/imageProccessor";

describe('processImage', () => {
  it('should throw an error if the file does not exist', async () => {
    await expectAsync(processImage('nonexistent', { width: 100, height: 100 })).toBeRejectedWithError('File not found');
  });
});
