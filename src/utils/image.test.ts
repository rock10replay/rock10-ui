import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { getImageDimensions, lerDimensoesImagem } from './image';

describe('image utils', () => {
  const originalImage = global.Image;
  const originalCreateObjectURL = URL.createObjectURL;
  const originalRevokeObjectURL = URL.revokeObjectURL;

  beforeEach(() => {
    URL.createObjectURL = vi.fn(() => 'blob:mock-url');
    URL.revokeObjectURL = vi.fn();
  });

  afterEach(() => {
    global.Image = originalImage;
    URL.createObjectURL = originalCreateObjectURL;
    URL.revokeObjectURL = originalRevokeObjectURL;
  });

  it('should resolve image dimensions on success from File', async () => {
    class MockImageSuccess {
      naturalWidth = 800;
      naturalHeight = 600;
      onload: (() => void) | null = null;
      onerror: (() => void) | null = null;
      set src(_val: string) {
        setTimeout(() => {
          if (this.onload) this.onload();
        }, 10);
      }
    }
    // @ts-expect-error mock image
    global.Image = MockImageSuccess;

    const file = new File(['fake-content'], 'test.png', { type: 'image/png' });
    const dims = await getImageDimensions(file);

    expect(dims).toEqual({ width: 800, height: 600 });
    expect(URL.createObjectURL).toHaveBeenCalledWith(file);
    expect(URL.revokeObjectURL).toHaveBeenCalledWith('blob:mock-url');
  });

  it('should resolve image dimensions from URL directly without revokeObjectURL', async () => {
    class MockImageSuccess {
      naturalWidth = 1920;
      naturalHeight = 1080;
      onload: (() => void) | null = null;
      onerror: (() => void) | null = null;
      set src(_val: string) {
        setTimeout(() => {
          if (this.onload) this.onload();
        }, 10);
      }
    }
    // @ts-expect-error mock image
    global.Image = MockImageSuccess;

    const dims = await lerDimensoesImagem('https://example.com/logo.png');

    expect(dims).toEqual({ width: 1920, height: 1080 });
    expect(URL.createObjectURL).not.toHaveBeenCalled();
    expect(URL.revokeObjectURL).not.toHaveBeenCalled();
  });

  it('should reject when image load fails', async () => {
    class MockImageError {
      onload: (() => void) | null = null;
      onerror: (() => void) | null = null;
      set src(_val: string) {
        setTimeout(() => {
          if (this.onerror) this.onerror();
        }, 10);
      }
    }
    // @ts-expect-error mock image
    global.Image = MockImageError;

    const file = new File(['corrupt'], 'broken.png', { type: 'image/png' });
    await expect(getImageDimensions(file)).rejects.toThrow(
      'Não foi possível obter as dimensões da imagem.'
    );
    expect(URL.revokeObjectURL).toHaveBeenCalledWith('blob:mock-url');
  });
});
