"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const blurhash_1 = require("blurhash");
const canvas_1 = require("canvas");
exports.default = ({ strapi }) => ({
    async generateBlurhash(imageUrl) {
        const image = await (0, canvas_1.loadImage)(imageUrl);
        const canvas = (0, canvas_1.createCanvas)(image.width, image.height);
        const context = canvas.getContext('2d');
        context.drawImage(image, 0, 0);
        const imageData = context.getImageData(0, 0, image.width, image.height);
        return (0, blurhash_1.encode)(imageData.data, imageData.width, imageData.height, 5, 3);
    },
});
