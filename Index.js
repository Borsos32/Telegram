const express = require('express');
const bodyParser = require('body-parser');
const TelegramBot = require('node-telegram-bot-api');

// Hämta token från miljövariabel
const token = process.env.BOT_TOKEN;
if (!token) {
  throw new Error('BOT_TOKEN saknas! Lägg till den som miljövariabel i Render.');
}

const app = express();
app.use(bodyParser.json());

// Skapa bot utan polling (vi använder webhook)
const bot = new TelegramBot(token);

// Endpoint för Telegram att skicka uppdateringar till
app.post(`/bot${token}`, (req, res) => {
  bot.processUpdate(req.body);
  res.sendStatus(200);
});

// Svar på meddelanden
bot.on('message', (msg) => {
  const chatId = msg.chat.id;
  const text = msg.text ? msg.text.toLowerCase() : '';

  if (text === 'hej') {
    bot.sendMessage(chatId, 'Hej! Jag körs på Render med webhook 🚀');
  } else {
    bot.sendMessage(chatId, 'Jag förstod inte, skriv "hej" för att testa.');
  }
});

// Starta servern
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server kör på port ${port}`);

  // Sätt webhook med Render’s externa hostname
  const url = `https://${process.env.RENDER_EXTERNAL_HOSTNAME}/bot${token}`;
  bot.setWebHook(url)
    .then(() => console.log(`Webhook satt till ${url}`))
    .catch(err => console.error('Fel vid sättning av webhook:', err));
});
