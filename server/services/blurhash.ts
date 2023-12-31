import { Strapi } from "@strapi/strapi";
import axios from "axios";
import sharp from "sharp";
import { encode } from "blurhash";

const loadImage = async (url: string): Promise<Buffer> => {
  const { data } = await axios.get(url, {
    responseType: "arraybuffer",
  });

  const buffer = Buffer.from(data, "utf-8");

  return buffer;
};

const encodeImage = async (buffer: Buffer): Promise<string> => {
  const image = sharp(buffer);
  let { width, height } = await image.metadata();

  if (width! > 250 || height! > 250) {
    width = 250
    height = 250
  }

  const { data, info } = await image
  .raw()
  .ensureAlpha()
  .resize({
    width,
    height,
    fit: 'inside',
  })
  .flatten({ background: '#fff' })
  .toBuffer({ resolveWithObject: true });

  const buf = new Uint8ClampedArray(data);
  return encode(buf, info.width, info.height, 4, 3);
};

export default ({ strapi }: { strapi: Strapi }) => ({
  async generateBlurhash(imageUrl: string) {
    const image = await loadImage(imageUrl);
    const blurhash = await encodeImage(image);

    return blurhash;
  },
});
