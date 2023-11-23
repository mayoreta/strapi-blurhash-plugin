import { Strapi } from '@strapi/strapi'
import { encode } from 'blurhash'
import { loadImage, createCanvas } from 'canvas'

export default ({ strapi }: { strapi: Strapi }) => ({
  async generateBlurhash(imageUrl: string) {
    const image = await loadImage(imageUrl)
    const canvas = createCanvas(image.width, image.height)
    const context = canvas.getContext('2d')
    context.drawImage(image, 0, 0)
    const imageData = context.getImageData(0, 0, image.width, image.height)

    return encode(imageData.data, imageData.width, imageData.height, 5, 3)
  },
})
