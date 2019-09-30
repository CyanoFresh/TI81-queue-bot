module.exports = {
  token: process.env.TOKEN,
  admin_chatids: process.env.ADMIN_CHATIDS.split(','),
  users: require('./users'),
  dbPath: './db.json',
  stickers: {
    'java': [
      'CAADAgADwAADLoK7DcOHxj3oGV3MFgQ',
      'CAADAgADwgADLoK7Dag7x8qa-zPJFgQ',
      'CAADAgADwwADLoK7DZISN4cFbaRHFgQ',
      'CAADAgADxAADLoK7DTw5GKGPxseQFgQ',
      'CAADAgADywADLoK7DSSiSbXzugE7FgQ',
      'CAADAgAD3gADLoK7DaFGePtd02qbFgQ',
    ],
  },
};
