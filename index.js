const Telegraf = require('telegraf');
const Extra = require('telegraf/extra');
const Markup = require('telegraf/markup');
const commandParts = require('telegraf-command-parts');

if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}

const config = require('./config');
const { nameStickerMiddleware, authMiddleware } = require('./middlewares');
const { loadQueues, saveQueues, stringifyUserList, shuffleArray, markUserInQueue } = require('./functions');

const queues = loadQueues();

const app = new Telegraf(config.token);

app.use(commandParts());
app.use(nameStickerMiddleware);

app.catch(err => console.error('Error caught:', err));

app.help(ctx => ctx.reply(`/q - Показать доступные очереди пидоров
/new {name} - Создать новую очередь пидоров с именем {name}
/del - Удалить очередь
/done - Отметить пользователя в очереди как выполненного
/undone - Отметить пользователя в очереди как невыполненного
/users - Показать всех пользователей-пидоров`));

const renderQueue = (name, center) => queues[name] ? `Очередь *${name}*\n${stringifyUserList(queues[name], center)}` : `Очередь '${name}' не найдена`;

const renderNamesButtons = action => Markup.inlineKeyboard(
  Object.keys(queues).map(queue => Markup.callbackButton(queue, `${action}_${queue}`)),
  { columns: config.buttonsInRow },
).extra();

app.hears(/^\/q\s(\w+)$/, async ctx => ctx.replyWithMarkdown(renderQueue(ctx.match[1])));

app.command('q', ctx => ctx.reply(
  'Выбери очередь из списка:',
  renderNamesButtons('q'),
));

app.action(/^q_(\w+)$/, async ctx => {
  const name = ctx.match[1];
  await ctx.answerCbQuery();
  await ctx.editMessageText(renderQueue(name), Extra.markdown());
});

app.command('new', authMiddleware, async ctx => {
  const name = ctx.contextState.command.splitArgs[0];

  if (!name) {
    return ctx.reply('Введи название очереди через проебл после команды');
  }

  queues[name] = shuffleArray(Object.values(config.users));

  await saveQueues(queues);
  await ctx.replyWithMarkdown(renderQueue(name));
});

app.command('del', authMiddleware, ctx => ctx.replyWithMarkdown(
  `[${ctx.update.message.from.username}](tg://user?id=${ctx.update.message.from.id}) выбери очередь *для удаления* из списка:`,
  renderNamesButtons('del'),
));

app.action(/^del_(\w+)$/, authMiddleware, async ctx => {
  const name = ctx.match[1];

  delete queues[name];
  await saveQueues(queues);

  await ctx.answerCbQuery();
  await ctx.editMessageText(`Очередь *${name}* удалена`, Extra.markdown());
});

app.command('done', ctx => ctx.replyWithMarkdown(
  `[${ctx.update.message.from.username}](tg://user?id=${ctx.update.message.from.id}) выбери очередь в которой отметить:`,
  renderNamesButtons('done'),
));

app.action(/^done_(\w+)$/, async ctx => {
  const name = ctx.match[1];  // queue name
  const chatId = ctx.update.callback_query.from.id;

  // Check if tagged user clicked the button
  if (chatId !== ctx.update.callback_query.message.entities[0].user.id) return;

  try {
    const user = config.users[chatId];

    queues[name] = await markUserInQueue(queues[name], user);

    await saveQueues(queues);

    await ctx.answerCbQuery();
    await ctx.editMessageText(renderQueue(name, queues[name].indexOf(user)), Extra.markdown());
  } catch (e) {
    await ctx.answerCbQuery('Ошибка');
    await ctx.editMessageText(e.message, Extra.markdown());
  }
});

app.command('undone', ctx => ctx.replyWithMarkdown(
  `[${ctx.update.message.from.username}](tg://user?id=${ctx.update.message.from.id}) выбери очередь в которой отменить:`,
  renderNamesButtons('undone'),
));

app.action(/^undone_(\w+)$/, async ctx => {
  const name = ctx.match[1];  // queue name
  const chatId = ctx.update.callback_query.from.id;

  // Check if tagged user clicked the button
  if (chatId !== ctx.update.callback_query.message.entities[0].user.id) return;

  try {
    const user = config.users[chatId];

    queues[name] = await markUserInQueue(queues[name], user, false);

    await saveQueues(queues);

    await ctx.answerCbQuery();
    await ctx.editMessageText(renderQueue(name, queues[name].indexOf(user)), Extra.markdown());
  } catch (e) {
    await ctx.answerCbQuery('Ошибка');
    await ctx.editMessageText(e.message, Extra.markdown());
  }
});

app.command('users', ctx => ctx.reply(`Все пидоры:\n${stringifyUserList(Object.values(config.users))}`));

let params;

if (Boolean(config.webhook.domain)) {
  params = {
    webhook: config.webhook,
  };
}

app.launch(params).then(() => console.log('Telegram Bot started'));
