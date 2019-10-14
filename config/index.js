module.exports = {
  token: process.env.TOKEN,
  admin_chatids: process.env.ADMIN_CHATIDS.split(','),
  users: require('./users'),
  dbPath: process.env.DB_FILE_PATH || './db.json',
  ignoreChance: 9,
  enableStickers: true,
  doneAppendStr: '  ‍🌈',
  stickersChance: 40,
  buttonsInRow: 4,
  webhook: {
    port: process.env.WEBHOOKS_PORT,
    domain: process.env.WEBHOOKS_DOMAIN,  // leave empty to disable
  },
  stickers: {
    'java': [
      'CAADAgADDwMAAl1_ZhzKP7488INhIxYE',
      'CAADAgADEgMAAl1_ZhyM0SozYxTVlRYE',
      'CAADAgADFQMAAl1_Zhx78brg2d4y0hYE',
      'CAADAgADGgMAAl1_ZhyfBNAwTR76oBYE',
      'CAADAgADGwMAAl1_Zhx09da1JD6NpBYE',
      'CAADAgADHAMAAl1_ZhzVhfvCl_cqyRYE',
      'CAADAgADFwADHQABrRfA9oh9gd1WxRYE',
    ],
    'oop': [
      'CAADAgADBwAD6sQmDiJufGfYNzRnFgQ',
      'CAADAgADCgADwyiDDSWVKnfzX9CJFgQ',
    ],
    ignore: [
      'CAADAgADAgADvCmHBpTyThvOEv6KFgQ',
      'CAADAgADHAADvCmHBsvnSJH49E-IFgQ',
      'CAADAgADBQADvCmHBkJzzN_agFOqFgQ',
      'CAADAgADAwADvCmHBixoDOj9gxBtFgQ',
      'CAADAgADEgADvCmHBuPwsaxvQgVyFgQ',
      'CAADAgADCAADvCmHBocHUMuyzzJ_FgQ',
    ],
  },
};
