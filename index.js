const Telegraf = require('telegraf');
const commandParts = require('telegraf-command-parts');

if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}

const config = require('./config');

const queues = {};

const app = new Telegraf(config.token);

function shuffleArray(sourceArray) {
  const array = [...sourceArray];

  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }

  return array;
}

function printUsers(users) {
  return users.reduce((result, user, index) => result + `\n${index + 1}. ${user}`, '');
}

function auth(ctx) {
  if (ctx.message && ctx.message.from.id) {
    const userChatId = ctx.message.from.id.toString();
    return config.admin_chatids.includes(userChatId);
  }

  return false;
}

app.use(commandParts());

app.catch((err) => {
  console.error('Ooops', err);
});

app.help((ctx) => ctx.reply('/q - Показать все актуальные очереди\n' +
  '/q {name} - Показать всю очередь по имени {name}\n' +
  '/new {name} - Создать новую очередь с именем {name}\n' +
  '/del {name} - Удалить очередь с именем {name}\n' +
  '/users - Показать всех пользователей\n',
));

app.command('q', ctx => {
  let response = 'Очереди:\n';

  Object.keys(queues).forEach(key => {
    response += '\n- ' + key;
  });

  return ctx.reply(response);
});

app.command('new', ctx => {
  if (!auth(ctx)) {
    return;
  }

  let name = ctx.contextState.command.splitArgs[0];

  if (!name) {
    return ctx.reply('Введите название очереди через пробел после команды');
  }

  const users = shuffleArray(config.users);

  queues[name] = users;

  return ctx.reply(`Очередь создана с именем '${name}'\n` + printUsers(users));
});

app.command('del', ctx => {
  if (!auth(ctx)) {
    return;
  }

  let name = ctx.contextState.command.splitArgs[0];

  if (!name) {
    return ctx.reply('Введите название очереди через пробел после команды');
  }

  delete queues[name];

  return ctx.reply(`Очередь с именем '${name}' удалена`);
});

app.command('users', ctx => {
  let response = `Все пользователи:\n`;

  response += printUsers(config.users);

  return ctx.reply(response);
});

app.launch();
