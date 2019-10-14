const Telegraf = require('telegraf');
const commandParts = require('telegraf-command-parts');
const Extra = require('telegraf/extra');
const Markup = require('telegraf/markup');

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

app.help(ignoreMiddleware, ctx => ctx.reply(`/q - Показать доступные очереди пидоров
/new {name} - Создать новую очередь пидоров с именем {name}
/del {name} - Удалить очередь пидоров с именем {name}
/done {name} ФАМИЛИЯ - Отметить место пользователя в очереди {name} как выполненное
/undone {name} ФАМИЛИЯ - Отметить место пользователя в очереди {name} как невыполненное
/users - Показать всех пользователей-пидоров`));

const renderQueue = name => queues[name] ? `Очередь *${name}*\n${stringifyUserList(queues[name])}` : `Очередь '${name}' не найдена`;

/**
 * @returns {CallbackButton[]}
 */
const getButtons = () => Object.keys(queues).map(queue => Markup.callbackButton(queue, `q_${queue}`));

app.command('q', ctx => ctx.reply(
  'Выбери очередь из списка:',
  Markup.inlineKeyboard(getButtons(), { columns: config.buttonsInRow }).extra(),
));

app.action(/q_(\w+)/, async ctx => {
  const name = ctx.match[1];
  await ctx.answerCbQuery();
  await ctx.editMessageText(renderQueue(name), Extra.markdown());
});

app.command('new', authMiddleware, async ctx => {
  const name = ctx.contextState.command.splitArgs[0];

  if (!name) {
    return ctx.reply('Введи название очереди через проебл после команды');
  }

  queues[name] = shuffleArray(config.users);

  await saveQueues(queues);
  await ctx.replyWithMarkdown(renderQueue(name));
});

app.command('del', authMiddleware, async ctx => {
  const name = ctx.contextState.command.splitArgs[0];

  if (!name) {
    return ctx.reply('Введи название очереди через проебл после команды');
  }

  delete queues[name];

  await saveQueues(queues);
  await ctx.replyWithMarkdown(`Очередь *${name}* удалена`);
});

app.command('done', async ctx => {
  const queueName = ctx.contextState.command.splitArgs[0];
  const userName = ctx.contextState.command.splitArgs[1];

  if (!queueName || !userName) {
    return ctx.reply('Неправильный формат команды. Используйте:\n/done {очердь} {фамилия}');
  }

  if (!queues[queueName]) {
    return ctx.reply(`Очередь с именем '${queueName}' не найдена`);
  }

  for (let i = 0; i < queues[queueName].length; i++) {
    const currentUser = queues[queueName][i];

    if (currentUser.toLowerCase().includes(userName.toLowerCase())) {
      queues[queueName][i] = currentUser + '  ‍🌈';

      await saveQueues(queues);

      return ctx.replyWithMarkdown(`Отмечен пользователь *${currentUser}* из очереди *${queueName}*`);
    }
  }

  return ctx.reply(`Пользователь '${userName}' не найден`);
});

app.command('undone', async ctx => {
  const queueName = ctx.contextState.command.splitArgs[0];
  const userName = ctx.contextState.command.splitArgs[1];

  if (!queueName || !userName) {
    return ctx.reply('Неправильный формат команды. Используйте:\n/undone {очередь} {фамилия}');
  }

  if (!queues[queueName]) {
    return ctx.reply(`Очередь с именем '${queueName}' не найдена`);
  }

  for (let i = 0; i < queues[queueName].length; i++) {
    let currentUser = queues[queueName][i];

    if (currentUser.toLowerCase().includes(userName.toLowerCase())) {
      queues[queueName][i] = currentUser.slice(0, currentUser.length - 3);

      await saveQueues(queues);

      return ctx.replyWithMarkdown(`Отмечен пользователь *${queues[queueName][i]}* из очереди *${queueName}*`);
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

app.launch(params).then(() => console.log('Telegram Bot started'));
