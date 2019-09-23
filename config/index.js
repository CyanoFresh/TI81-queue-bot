module.exports = {
  token: process.env.TOKEN,
  admin_chatids: process.env.ADMIN_CHATIDS.split(','),
  users: require('./users'),
  dbPath: './db.json',
};
