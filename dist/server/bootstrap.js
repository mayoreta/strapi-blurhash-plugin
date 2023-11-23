"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = ({ strapi }) => {
    const generateBlurhash = async (event, eventType) => {
        const { data, where } = event.params;
        if (data.mime && data.mime.startsWith('image/')) {
            data.blurhash = await strapi
                .plugin('blurhash')
                .service('blurhash')
                .generateBlurhash(data.url);
        }
        if (eventType === 'beforeUpdate' &&
            strapi.plugin('blurhash').config('regenerateOnUpdate') === true) {
            const fullData = await strapi.db.query('plugin::upload.file').findOne({
                select: ['url', 'blurhash', 'name', 'mime'],
                where,
            });
            if (fullData.mime &&
                fullData.mime.startsWith('image/') &&
                !fullData.blurhash) {
                data.blurhash = await strapi
                    .plugin('blurhash')
                    .service('blurhash')
                    .generateBlurhash(fullData.url);
            }
        }
    };
    strapi.db.lifecycles.subscribe({
        models: ['plugin::upload.file'],
        beforeCreate: (event) => generateBlurhash(event, 'beforeCreate'),
        beforeUpdate: (event) => generateBlurhash(event, 'beforeUpdate'),
    });
};
