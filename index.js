const Telegraf = require('telegraf');
const commandParts = require('telegraf-command-parts');

if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}

const config = require('./config');
const { namesReplyMiddleware, authMiddleware, ignoreMiddleware } = require('./middlewares');
const { loadQueues, saveQueues, stringifyUserList, shuffleArray } = require('./functions');

const queues = loadQueues();

const app = new Telegraf(config.token);

app.use(commandParts());
app.use(namesReplyMiddleware);

app.catch(err => console.error('Error caught:', err));

app.help(ignoreMiddleware, ctx => ctx.reply(`/q - Показать все актуальные очереди пидоров
/q {name} - Показать всю очередь пидоров по имени {name}
/new {name} - Создать новую очередь пидоров с именем {name}
/del {name} - Удалить очередь пидоров с именем {name}
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
  let name = ctx.contextState.command.splitArgs[0];

  if (!name) {
    return ctx.reply('Введи название очереди через проебл после команды');
  }

  const shuffledUsers = shuffleArray(config.users);

  queues[name] = shuffledUsers;
  await saveQueues(queues);
  await ctx.reply(`Очередь создана с именем '${name}'\n${stringifyUserList(shuffledUsers)}`);
});

app.command('del', authMiddleware, async ctx => {
  let name = ctx.contextState.command.splitArgs[0];

  if (!name) {
    return ctx.reply('Введи название очереди через проебл после команды');
  }

  delete queues[name];
  await saveQueues(queues);
  await ctx.reply(`Очередь с именем '${name}' удалена`);
});

app.command('users', ignoreMiddleware, ctx => ctx.reply(`Все пидоры:\n${stringifyUserList(config.users)}`));

app.launch();
