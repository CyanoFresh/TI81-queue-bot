const config = require('./config');
const { shuffleArray } = require('./functions');
const { testChance } = require('./functions');

module.exports.nameStickerMiddleware = (ctx, next) => {
  if (!config.enableStickers) return next();

  let name = ctx.contextState.command && ctx.contextState.command.splitArgs[0];

  if (!name) return next();

  name = name.toLowerCase();

  const stickerName = Object.keys(config.stickers).find(triggerWord => name.includes(triggerWord));

  if (!stickerName) return next();

  const stickers = config.stickers[stickerName];
  const sticker = shuffleArray(stickers)[0];

  ctx.replyWithSticker(sticker);

  return next();
};

module.exports.ignoreMiddleware = (ctx, next) => {
  if (testChance(config.ignoreChance)) {
    const sticker = shuffleArray(config.stickers.ignore)[0];

    return ctx.replyWithSticker(sticker);
  }

  return next();
};

module.exports.authMiddleware = (ctx, next) => {
  if (ctx.message && ctx.message.from.id) {
    const userChatId = ctx.message.from.id.toString();

    if (!config.admin_chatids.includes(userChatId)) {
      return;
    }
  }

  return next();
};
