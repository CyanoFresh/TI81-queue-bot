const Telegraf = require('telegraf');
const commandParts = require('telegraf-command-parts');

if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}

const config = require('./config');
const { nameStickerMiddleware, authMiddleware, ignoreMiddleware } = require('./middlewares');
const { loadQueues, saveQueues, stringifyUserList, shuffleArray } = require('./functions');

const queues = loadQueues();

const app = new Telegraf(config.token);

app.use(commandParts());
app.use(nameStickerMiddleware);

app.catch(err => console.error('Error caught:', err));

app.help(ignoreMiddleware, ctx => ctx.reply(`/q - Показать все актуальные очереди пидоров
/q {name} - Показать всю очередь пидоров по имени {name}
/new {name} - Создать новую очередь пидоров с именем {name}
/del {name} - Удалить очередь пидоров с именем {name}
/done {name} ФАМИЛИЯ - Отметить место пользователя в очереди {name} как выполненное
/undone {name} ФАМИЛИЯ - Отметить место пользователя в очереди {name} как невыполненное
/users - Показать всех пользователей-пидоров`));

app.command('q', ignoreMiddleware, ctx => {
  const name = ctx.contextState.command.splitArgs[0];

  if (name && queues[name]) {
    return ctx.reply(`Очередь '${name}':\n${stringifyUserList(queues[name])}`);
  }

  const queuesList = Object.keys(queues).reduce((result, queue) => result + `\n- ${queue}`, '');

  return ctx.reply(`Очереди:\n${queuesList}\n\nЧтобы посмотреть определенную очередь:\n/q НАЗВАНИЕ`);
});

app.command('new', authMiddleware, async ctx => {
  const name = ctx.contextState.command.splitArgs[0];

  if (!name) {
    return ctx.reply('Введи название очереди через проебл после команды');
  }

  const shuffledUsers = shuffleArray(config.users);

  queues[name] = shuffledUsers;
  await saveQueues(queues);
  await ctx.reply(`Очередь создана с именем '${name}'\n${stringifyUserList(shuffledUsers)}`);
});

app.command('del', authMiddleware, async ctx => {
  const name = ctx.contextState.command.splitArgs[0];

  if (!name) {
    return ctx.reply('Введи название очереди через проебл после команды');
  }

  delete queues[name];
  await saveQueues(queues);
  await ctx.reply(`Очередь с именем '${name}' удалена`);
});

app.command('done', async ctx => {
  const queueName = ctx.contextState.command.splitArgs[0];
  const userName = ctx.contextState.command.splitArgs[1];

  if (!queueName || !userName) {
    return ctx.reply('Неправильный формат команды. Используйте:\n/done {имя очереди} {фамилия}');
  }

  if (!queues[queueName]) {
    return ctx.reply(`Очередь с именем '${queueName}' не найдена`);
  }

  for (let i = 0; i < queues[queueName].length; i++) {
    const currentUser = queues[queueName][i];

    if (currentUser.toLowerCase().includes(userName.toLowerCase())) {
      queues[queueName][i] = currentUser + '  ‍🌈';

      await saveQueues(queues);

      return ctx.reply(`Отмечен пользователь '${currentUser}' из очереди '${queueName}'`);
    }
  }

  return ctx.reply(`Пользователь '${userName}' не найден`);
});

app.command('undone', async ctx => {
  const queueName = ctx.contextState.command.splitArgs[0];
  const userName = ctx.contextState.command.splitArgs[1];

  if (!queueName || !userName) {
    return ctx.reply('Неправильный формат команды. Используйте:\n/done {имя очереди} {фамилия}');
  }

  if (!queues[queueName]) {
    return ctx.reply(`Очередь с именем '${queueName}' не найдена`);
  }

  for (let i = 0; i < queues[queueName].length; i++) {
    let currentUser = queues[queueName][i];

    if (currentUser.toLowerCase().includes(userName.toLowerCase())) {
      queues[queueName][i] = currentUser.slice(0, currentUser.length - 3);

      await saveQueues(queues);

      return ctx.reply(`Отмечен пользователь '${queues[queueName][i]}' из очереди '${queueName}'`);
    }
  }

  return ctx.reply(`Пользователь '${userName}' не найден`);
});

app.command('users', ignoreMiddleware, ctx => ctx.reply(`Все пидоры:\n${stringifyUserList(config.users)}`));

let params;

if (Boolean(config.webhook.domain)) {
  params = {
    webhook: config.webhook,
  };
}

app.launch(params).then(() => console.log('Server started'));
