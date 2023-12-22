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
    let { width, height } = await image.metadata();
    if (width > 250 || height > 250) {
        width = 250;
        height = 250;
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
    return (0, blurhash_1.encode)(buf, info.width, info.height, 4, 3);
};
exports.default = ({ strapi }) => ({
    async generateBlurhash(imageUrl) {
        const image = await loadImage(imageUrl);
        const blurhash = await encodeImage(image);
        return blurhash;
    },
});
