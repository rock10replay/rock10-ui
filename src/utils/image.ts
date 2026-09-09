export interface ImageDimensions {
  width: number;
  height: number;
}

/**
 * Lê as dimensões (largura e altura) de um arquivo de imagem (File/Blob) ou de uma URL.
 */
export function getImageDimensions(fileOrUrl: File | Blob | string): Promise<ImageDimensions> {
  return new Promise((resolve, reject) => {
    let url: string;
    let revoke = false;

    if (typeof fileOrUrl === 'string') {
      url = fileOrUrl;
    } else {
      url = URL.createObjectURL(fileOrUrl);
      revoke = true;
    }

    const img = new Image();
    img.onload = () => {
      if (revoke) {
        URL.revokeObjectURL(url);
      }
      resolve({ width: img.naturalWidth, height: img.naturalHeight });
    };
    img.onerror = () => {
      if (revoke) {
        URL.revokeObjectURL(url);
      }
      reject(new Error('Não foi possível obter as dimensões da imagem.'));
    };
    img.src = url;
  });
}

/**
 * Alias em português para compatibilidade direta com implementações legadas.
 */
export const lerDimensoesImagem = getImageDimensions;
