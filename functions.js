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

module.exports.stringifyUserList = (users, center) => {
  return users.reduce((result, user, index) => {
    if (center && (index < center - 2 || index > center + 2)) {
      return result;
    }

    return result + `\n${index + 1}. ${user}`
  }, '')
};

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

/**
 * Mark user as done or undone in queue.
 * @param {Object} queue
 * @param {string} user
 * @param {boolean} isDone
 * @returns {Object} Updated queue
 */
module.exports.markUserInQueue = async (queue, user, isDone = true) => {
  const updatedQueue = [...queue];

  for (let i = 0; i < updatedQueue.length; i++) {
    const currentUser = updatedQueue[i];

    if (currentUser.includes(user)) {
      const isMarked = currentUser[0] === '*';

      if (!isDone && !isMarked) {
        const error = new Error(`*${currentUser}* еще не отмечен`);
        error.code = 400;
        throw error;
      }

      if (isDone && isMarked) {
        const error = new Error(`*${currentUser}* уже был отмечен`);
        error.code = 400;
        throw error;
      }

      if (isDone) {
        updatedQueue[i] = `*${currentUser}${config.doneAppendStr}*`;
      } else {
        updatedQueue[i] = currentUser
          .replace(config.doneAppendStr, '')
          .replace(/\*/g, '');  // remove '*'s
      }

      return updatedQueue;
    }
  }

  const error = new Error('чето хуйня произошла какая то, хз че делать');
  error.code = 404;
  throw error;
};
