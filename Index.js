const express = require('express');
const bodyParser = require('body-parser');
const TelegramBot = require('node-telegram-bot-api');

const token = process.env.BOT_TOKEN; // Telegram token som miljövariabel
const app = express();
const bot = new TelegramBot(token);

app.use(bodyParser.json());

app.post(`/bot${token}`, (req, res) => {
  bot.processUpdate(req.body);
  res.sendStatus(200);
});

bot.setWebHook(`https://<din-railway-url>/bot${token}`);

bot.on('message', (msg) => {
  const chatId = msg.chat.id;
  if (msg.text.toLowerCase() === 'hej') {
    bot.sendMessage(chatId, 'Hej från Railway webhook!');
  }
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server kör på port ${port}`);
});
