export interface ImageSize {
  width: number;
  height: number;
}

export interface ImageFormat {
  thumbnail: ImageSize;
  small: ImageSize;
  medium: ImageSize;
  large: ImageSize;
}

export const standardSizes: ImageFormat = {
  thumbnail: { width: 150, height: 150 },
  small: { width: 300, height: 300 },
  medium: { width: 600, height: 600 },
  large: { width: 1200, height: 1200 }
};

export type SizeOption = keyof ImageFormat;
