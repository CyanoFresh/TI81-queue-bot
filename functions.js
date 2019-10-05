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

module.exports.loadQueues = () => {
  let queues = {};

  try {
    const loadedString = fs.readFileSync(config.dbPath, { encoding: 'utf8', flag: 'r' });

    queues = JSON.parse(loadedString);

    console.log(`Loaded ${Object.keys(queues).length} queues from '${config.dbPath}'`);
  } catch (e) {
    console.log(`Creating new file '${config.dbPath}'...`);

    this.saveQueues(queues);
  }

  return queues;
};

module.exports.saveQueues = queues => new Promise((res, rej) => fs.writeFile(config.dbPath, JSON.stringify(queues), err => {
  if (err) {
    console.error('Queues save error', err);
    return rej();
  }

  console.log(`${Object.keys(queues).length} queues saved to disk`);

  return res();
}));

/**
 * @param {number} percents chance from 0 to 100
 * @returns {boolean}
 */
module.exports.testChance = percents => Math.random() * 100 < percents;
