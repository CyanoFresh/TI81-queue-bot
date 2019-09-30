const config = require('./config');
const fs = require('fs');

/**
 * @see https://stackoverflow.com/a/12646864/4009260
 * @param {Array} sourceArray
 * @returns Array
 */
module.exports.shuffleArray = sourceArray => {
  const array = [...sourceArray];

  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }

  return array;
};

module.exports.stringifyUserList = users => users.reduce((result, user, index) => result + `\n${index + 1}. ${user}`, '');

module.exports.auth = ctx => {
  if (ctx.message && ctx.message.from.id) {
    const userChatId = ctx.message.from.id.toString();
    return config.admin_chatids.includes(userChatId);
  }

  return false;
};

module.exports.saveQueues = data => new Promise((res, rej) => fs.writeFile(config.dbPath, JSON.stringify(data), err => {
  if (err) {
    console.error('Save error:', err);
    return rej();
  }

  console.log('Changes saved to DB');

  return res();
}));

module.exports.stickers = (ctx, next) => {
  let name = ctx.contextState.command && ctx.contextState.command.splitArgs[0];

  if (!name) return next();

  name = name.toLowerCase();

  const stickerName = Object.keys(config.stickers).find(triggerWord => name.includes(triggerWord));

  if (!stickerName) return next();

  const stickers = config.stickers[stickerName];
  const sticker = this.shuffleArray(stickers)[0];

  ctx.replyWithSticker(sticker);

  return next();
};
