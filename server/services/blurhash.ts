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
  const { width, height } = await image.metadata();

  let w, h;
  w = h = 32;
  if (width && height) {
    if (width > height) w = Math.round((w * width) / height);
    else h = Math.round((h * height) / width);
  }

  const { data, info } = await image
    .raw()
    .ensureAlpha()
    .resize(w, h, { fit: "fill" })
    .toBuffer({ resolveWithObject: true });

  let componentX = 3;
  let componentY = Math.round((3 * info.height) / info.width);

  if (info.width > info.height) {
    componentX = Math.round((3 * info.width) / info.height);
    componentY = 3;
  }

  const buf = new Uint8ClampedArray(data);
  return encode(buf, info.width, info.height, componentX, componentY);
};

export default ({ strapi }: { strapi: Strapi }) => ({
  async generateBlurhash(imageUrl: string) {
    const image = await loadImage(imageUrl);
    const blurhash = await encodeImage(image);

    return blurhash;
  },
});
