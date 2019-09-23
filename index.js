const Telegraf = require('telegraf');
const commandParts = require('telegraf-command-parts');
const fs = require('fs');

if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}

const config = require('./config');
const queues = require('./db') || {};

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

function saveChanges() {
  return new Promise((res, rej) => fs.writeFile(
    config.dbPath,
    JSON.stringify(queues),
    (err) => {
      if (err) {
        console.error(err);
        rej();
      }

      console.log('Changes saved');

      res();
    },
  ));
}

app.use(commandParts());

app.catch((err) => {
  console.error('Ooops', err);
});

app.help((ctx) => ctx.reply('/q - Показать все актуальные очереди пидоров\n' +
  '/q {name} - Показать всю очередь пидоров по имени {name}\n' +
  '/new {name} - Создать новую очередь пидоров с именем {name}\n' +
  '/del {name} - Удалить очередь пидоров с именем {name}\n' +
  '/users - Показать всех пользователей-пидоров\n',
));

app.start(auth);

app.command('q', ctx => {
  let name = ctx.contextState.command.splitArgs[0];
  let response = '';

  if (name && queues[name]) {
    response += `Очередь '${name}':\n`;
    response += printUsers(queues[name]);
  } else {
    response += 'Очереди:\n';

    Object.keys(queues).forEach(key => {
      response += '\n- ' + key;
    });

    response += '\n\nЧтобы посмотреть определенную очередь используйте команду:\n/q НАЗВАНИЕ';
  }

  return ctx.reply(response);
});

app.command('new', async ctx => {
  if (!auth(ctx)) {
    return;
  }

  let name = ctx.contextState.command.splitArgs[0];

  if (!name) {
    return ctx.reply('Введите название очереди через проебл после команды');
  }

  const users = shuffleArray(config.users);

  queues[name] = users;
  await saveChanges();
  await ctx.reply(`Очередь создана с именем '${name}'\n` + printUsers(users));
});

app.command('del', async ctx => {
  if (!auth(ctx)) {
    return;
  }

  let name = ctx.contextState.command.splitArgs[0];

  if (!name) {
    return ctx.reply('Введите название очереди через проебл после команды');
  }

  delete queues[name];

  await saveChanges();
  await ctx.reply(`Очередь с именем '${name}' удалена`);
});

app.command('users', ctx => {
  let response = `Все пидоры:\n`;

  response += printUsers(config.users);

  return ctx.reply(response);
});

app.launch();
