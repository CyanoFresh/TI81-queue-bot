module.exports = {
  token: process.env.TOKEN,
  admin_chatids: process.env.ADMIN_CHATIDS.split(','),
  users: require('./users'),
  dbPath: process.env.DB_FILE_PATH || './db.json',
  ignoreChance: 9,
  enableStickers: true,
  doneAppendStr: '  ‍🌈',
  stickersChance: 40,
  buttonsInRow: 3,
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
  mans: [
    'лох дня',
    'админ дня',
    'пососавший дня',
    'антон дня',
    'отчисленный дня',
    'деканатнутый дня',
    'корявикова дня',
    'мішь дня',
    'мышь дня',
    'хуесос дня',
    'πdoor дня',
    'стас дня',
    'a fan dick off дня',
    'гей дня',
    'англосакс дня',
    'бомж дня',
    'алкаш дня',
    'пампушка дня',
    'пузата мамзелька дня',
    'гандон дня',
    'пиздабол дня',
    'торч дня',
    'должен пивас',
    'будет сегодня шныряться',
    'не сдаст сегодня лабу',
    'слетит со стипендии',
    'будет работать в маке',
    'встретит богатого папика',
    'сегодня будет у сигая под столиком',
  ],
};
