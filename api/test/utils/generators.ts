import sharp from "sharp";

const generateImageBuffer = async (): Promise<Buffer> => {
  return await sharp({
    create: {
      width: 10,
      height: 10,
      channels: 3,
      background: { r: 255, g: 0, b: 0 }
    }
  }).png().toBuffer();
};

export default {
  generateImageBuffer
};
