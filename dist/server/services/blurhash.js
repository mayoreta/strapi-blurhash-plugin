"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const axios_1 = __importDefault(require("axios"));
const sharp_1 = __importDefault(require("sharp"));
const blurhash_1 = require("blurhash");
const loadImage = async (url) => {
    const { data } = await axios_1.default.get(url, {
        responseType: "arraybuffer",
    });
    const buffer = Buffer.from(data, "utf-8");
    return buffer;
};
const encodeImage = async (buffer) => {
    const image = (0, sharp_1.default)(buffer);
    const { width, height } = await image.metadata();
    let w, h;
    w = h = 32;
    if (width && height) {
        if (width > height)
            w = Math.round((w * width) / height);
        else
            h = Math.round((h * height) / width);
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
    return (0, blurhash_1.encode)(buf, info.width, info.height, componentX, componentY);
};
exports.default = ({ strapi }) => ({
    async generateBlurhash(imageUrl) {
        const image = await loadImage(imageUrl);
        const blurhash = await encodeImage(image);
        return blurhash;
    },
});
