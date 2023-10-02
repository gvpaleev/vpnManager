const { Bot } = require("grammy");
const { Menu } = require("@grammyjs/menu");

require('dotenv').config()



// Create an instance of the `Bot` class and pass your bot token to it.
const bot = new Bot(process.env.BOT_TOKEN); ; // <-- put your bot token between the ""

const menu = new Menu("root-menu")
    .submenu("Мои ключи", "accessKeysaccess-menu").row()
    .submenu("Получить VPN", "price-menu").row()
    .submenu("Инструкция", "instructions-menu").row()

const priceMenu = new Menu("price-menu")
    .text("1 месяц", (ctx) => ctx.reply("1 месяц")).row()
    .text("2 месяц", (ctx) => ctx.reply("2 месяц")).row()
    .submenu("Назад", "root-menu")

const accessKeys = new Menu("accessKeysaccess-menu")
    .text("Показать", (ctx) => ctx.reply("1 месяц")).row()
    .submenu("Назад", "root-menu")

const instructions = new Menu("instructions-menu")
    .submenu("Android", "instructionsAndroid-menu")
    .submenu("IOS", "instructionsIOS-menu").row()
    .submenu("PC", "instructionsPC-menu").row()
    .submenu("Назад", "root-menu")

const instructionsAndroid = new Menu("instructionsAndroid-menu")
    .submenu("Меню", "root-menu")

const instructionsIOS = new Menu("instructionsIOS-menu")
    .submenu("Меню", "root-menu")

const instructionsPC = new Menu("instructionsPC-menu")
    .submenu("Меню", "root-menu")


menu.register(priceMenu);
menu.register(accessKeys);
menu.register(instructions);
instructions.register(instructionsAndroid);
instructions.register(instructionsIOS);
instructions.register(instructionsPC);

bot.use(menu);
// You can now register listeners on your bot object `bot`.
// grammY will call the listeners when users send messages to your bot.

// Handle the /start command.
bot.command("start", async (ctx) => 
    ctx.reply("Welcome! VPN service manager",{ reply_markup: menu })
    );
// Handle other messages.
bot.on("message", (ctx) => ctx.reply("Got another message!"));

// Now that you specified how to handle messages, you can start your bot.
// This will connect to the Telegram servers and wait for messages.

// Start the bot.
bot.start();