import Tesseract from 'tesseract.js';

export async function runOcr(
  imageDataUrl: string,
  onProgress?: (p: number) => void
): Promise<string> {
  const result = await Tesseract.recognize(imageDataUrl, 'eng', {
    logger: (m) => {
      if (m.status === 'recognizing text' && typeof m.progress === 'number') {
        onProgress?.(m.progress);
      }
    },
  });
  return result.data.text;
}
