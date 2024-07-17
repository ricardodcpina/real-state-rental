const mockResolve = jest.fn();
const mockUnlink = jest.fn();

const mockPath = {
  resolve: mockResolve,
};

const mockFs = {
  unlink: mockUnlink,
};

jest.mock('dotenv');
jest.mock('bcrypt', () => ({}));
jest.mock('path', () => mockPath);
jest.mock('fs', () => mockFs);

const { deletePreviousEstateImage } = require('../../src/utils/utils');

describe('deletePreviousEstateImage', () => {
  it('should log mockImageFile deleted with success', () => {
    const mockImageFile = 'mock_house14.png';
    const logSpy = jest.spyOn(console, 'log');

    mockUnlink.mockImplementation((filename, callback) => {
      callback(null);
    });

    mockResolve.mockReturnValue(`../public/image/${mockImageFile}`);

    deletePreviousEstateImage(mockImageFile);

    expect(mockResolve).toHaveBeenCalledWith(
      'C:\\Users\\Avell\\projetos-dev\\projetos-pessoais\\real-estate-rental\\backend\\src\\utils',
      '..',
      '..',
      '..',
      'public',
      'images',
      mockImageFile
    );
    expect(mockUnlink).toHaveBeenCalledWith(
      `../public/image/${mockImageFile}`,
      expect.any(Function)
    );
    expect(logSpy).toHaveBeenCalledWith(`File ${mockImageFile} deleted with success`);
  });

  it('should log mockImageFile not deleted', () => {
    const mockImageFile = 'mock_house14.png';
    const logSpy = jest.spyOn(console, 'log');

    mockUnlink.mockImplementation((filename, callback) => {
      callback(new Error(''));
    });

    mockResolve.mockReturnValue(`../public/image/${mockImageFile}`);

    deletePreviousEstateImage(mockImageFile);

    expect(mockResolve).toHaveBeenCalledWith(
      'C:\\Users\\Avell\\projetos-dev\\projetos-pessoais\\real-estate-rental\\backend\\src\\utils',
      '..',
      '..',
      '..',
      'public',
      'images',
      mockImageFile
    );
    expect(mockUnlink).toHaveBeenCalledWith(
      `../public/image/${mockImageFile}`,
      expect.any(Function)
    );
    expect(logSpy).toHaveBeenCalledWith(`File ${mockImageFile} not deleted`);
  });
});
