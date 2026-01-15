/*
 * ==========================================================
 * PROJETO: Portal AMB Amazonas
 * ARQUIVO: canvasUtils.ts
 * CAMINHO: client/src/lib/canvasUtils.ts
 * DATA: 15 de Janeiro de 2026
 * FUNÇÃO: Utilitário para Recorte de Imagens (Crop)
 * VERSÃO: 1.0 Prime
 * ==========================================================
 */

export const createImage = (url: string): Promise<HTMLImageElement> =>
  new Promise((resolve, reject) => {
    const image = new Image();
    image.addEventListener('load', () => resolve(image));
    image.addEventListener('error', (error) => reject(error));
    image.setAttribute('crossOrigin', 'anonymous'); 
    image.src = url;
  });

export function getRadianAngle(degreeValue: number) {
  return (degreeValue * Math.PI) / 180;
}

/**
 * Retorna o novo bounding box de uma imagem rotacionada
 */
export function rotateSize(width: number, height: number, rotation: number) {
  const rotRad = getRadianAngle(rotation);

  return {
    width:
      Math.abs(Math.cos(rotRad) * width) + Math.abs(Math.sin(rotRad) * height),
    height:
      Math.abs(Math.sin(rotRad) * width) + Math.abs(Math.cos(rotRad) * height),
  };
}

/**
 * Função principal para recortar a imagem
 */
export async function getCroppedImg(
  imageSrc: string,
  pixelCrop: { x: number; y: number; width: number; height: number },
  rotation = 0,
  flip = { horizontal: false, vertical: false }
): Promise<Blob | null> {
  const image = await createImage(imageSrc);
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');

  if (!ctx) {
    return null;
  }

  const rotRad = getRadianAngle(rotation);

  // Calcula bounding box
  const { width: bBoxWidth, height: bBoxHeight } = rotateSize(
    image.width,
    image.height,
    rotation
  );

  // Define tamanho do canvas
  canvas.width = bBoxWidth;
  canvas.height = bBoxHeight;

  // Move o contexto para o centro da imagem
  ctx.translate(bBoxWidth / 2, bBoxHeight / 2);
  ctx.rotate(rotRad);
  ctx.scale(flip.horizontal ? -1 : 1, flip.vertical ? -1 : 1);
  ctx.translate(-image.width / 2, -image.height / 2);

  // Desenha a imagem rotacionada
  ctx.drawImage(image, 0, 0);

  // Extrai a imagem recortada
  const data = ctx.getImageData(
    pixelCrop.x,
    pixelCrop.y,
    pixelCrop.width,
    pixelCrop.height
  );

  // Define o canvas final com o tamanho do recorte
  canvas.width = pixelCrop.width;
  canvas.height = pixelCrop.height;

  // Cola os dados da imagem recortada no canvas final
  ctx.putImageData(data, 0, 0);

  // Retorna como Blob
  return new Promise((resolve) => {
    canvas.toBlob((blob) => {
      resolve(blob);
    }, 'image/jpeg');
  });
}