const { Bot, session } = require("grammy");
const { hydrate } = require("@grammyjs/hydrate");
const { Menu } = require("@grammyjs/menu");
const axios = require('axios').default;
const fs = require("fs");
const fsPromises = fs.promises;
const  mongoose  = require("mongoose");
const { MongoDBAdapter, ISession } = require("@grammyjs/storage-mongodb");



require('dotenv').config()

async function main(){
    await mongoose.connect("mongodb://admin:admin@127.0.0.1:27018/admin");
    const collection = mongoose.connection.db.collection(
        "sessions",
    )
    // Create an instance of the `Bot` class and pass your bot token to it.
    const bot = new Bot(process.env.BOT_TOKEN); ; // <-- put your bot token between the ""
    
    bot.use(hydrate());
    bot.use(session({
       
        initial: () => ({trialPeriod:true}),
        storage: new MongoDBAdapter({ collection }),
    }))

    bot.use(async (ctx, next) => {
        ctx.replyWithAutoDelete = async (msg, config = {}, secForDelete = 20) => {
            let statusMessage = await ctx.reply(msg,config);
            setTimeout(()=>{
                statusMessage.delete();
            },secForDelete*1000)
        }
        await next();
      });
    const menu = new Menu("root-menu")

        .text("🔑 Мои ключи", async (ctx) =>{
            ctx.editMessageText(await getMessage('accessKeys-menu'),{ 
                parse_mode: "HTML",
                reply_markup: accessKeys 
            })
        }).row()
        .text("🌐 Получить VPN", async (ctx) =>{
            ctx.editMessageText(await getMessage('price-menu'),{ 
                parse_mode: "HTML",
                reply_markup: priceMenu 
            })
        }).row()
        .text("⚠️ Инструкция", async (ctx) =>{
            ctx.editMessageText(await getMessage('instructions-menu'),{ 
                parse_mode: "HTML",
                reply_markup: instructions 
            })
        }).row()
        

    const priceMenu = new Menu("price-menu")
        .text("🕵🏻 1 месяц - 300р", async (ctx) => {
            ctx.replyWithAutoDelete("Временно недоступно.")

        }).row()
        .text("🧑🏼‍💻 3 месяц - 800р", async (ctx) => {
            ctx.replyWithAutoDelete("Временно недоступно.")

        }).row()
        .text("🤴🏻 6 месяц - 1600р", async (ctx) => {
            ctx.replyWithAutoDelete("Временно недоступно.")
        }).row()
        .text("↩️ В меню", async (ctx) => {
            ctx.editMessageText(await getMessage('root-menu'),{ 
                parse_mode: "HTML",
                reply_markup: menu 
            })
        }).row()

    const accessKeys = new Menu("accessKeys-menu")
        .text("👀 Показать ключи", async (ctx) => {
            let {id} = ctx.from;
            let response = await axios({
                method: 'post',
                url: 'http://127.0.0.1:3000/getAccessKeys',
                data: {
                    uid:`t${id}`
                }
            });

            let keys = response.data;
            let msg = keys.map(item=>{
                return `№ Key: ${item.id * id}\n`+
                `<b>Нажми для копирования</b> 👇\n`
                + `<code>${item.accessUrl}</code>`
            })
            ctx.replyWithAutoDelete(msg.join('\n\n'),{
                parse_mode: "HTML",
            });
        }).row()
        .text("❗️ Инструкция", async (ctx) =>{
            ctx.editMessageText(await getMessage('instructions-menu'),{ 
                parse_mode: "HTML",
                reply_markup: instructions 
            })
        }).row()
        .text("↩️ В меню", async (ctx) => {
            ctx.editMessageText(await getMessage('root-menu'),{ 
                parse_mode: "HTML",
                reply_markup: menu 
            })
        }).row()

    const instructions = new Menu("instructions-menu")
        .text("📞 Android", async (ctx) =>{
            ctx.editMessageText(await getMessage('instructionsAndroid-menu'),{ 
                parse_mode: "HTML",
                reply_markup: instructionsAndroid 
            })
        })
        .text("📱 IOS", async (ctx) =>{
            ctx.editMessageText(await getMessage('instructionsIOS-menu'),{ 
                parse_mode: "HTML",
                reply_markup: instructionsIOS 
            })
        }).row()
        .text("💻 PC", async (ctx) =>{
            ctx.editMessageText(await getMessage('instructionsPC-menu'),{ 
                parse_mode: "HTML",
                reply_markup: instructionsPC 
            })
        }).row()
        .text("↩️ В меню", async (ctx) => {
            ctx.editMessageText(await getMessage('root-menu'),{ 
                parse_mode: "HTML",
                reply_markup: menu 
            })
        }).row()

    const instructionsAndroid = new Menu("instructionsAndroid-menu")
        .text("В меню", async (ctx) => {
            ctx.editMessageText(await getMessage('root-menu'),{ 
                parse_mode: "HTML",
                reply_markup: menu 
            })
        }).row()

    const instructionsIOS = new Menu("instructionsIOS-menu")
        .text("В меню", async (ctx) => {
            ctx.editMessageText(await getMessage('root-menu'),{ 
                parse_mode: "HTML",
                reply_markup: menu 
            })
        }).row()

    const instructionsPC = new Menu("instructionsPC-menu")
        .text("В меню", async (ctx) => {
            ctx.editMessageText(await getMessage('root-menu'),{ 
                parse_mode: "HTML",
                reply_markup: menu 
            })
        }).row()


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
    bot.command("start", async (ctx) => {
        let {id} = ctx.from
        let msg = await getMessage('root-menu');
        
        if(ctx.session.trialPeriod){
            let response = await axios({
                method: 'post',
                url: 'http://127.0.0.1:3000/createAccessKey',
                data: {
                    uid:`t${id}`
                }
            });
            msg+='\n\n <b>Вам выдан пробный ключ на 3 дня</b>'
            ctx.session.trialPeriod=false;
        }

        ctx.reply(msg,{ 
            parse_mode: "HTML",
            reply_markup: menu 
        })
        
        
        
    });
    // Handle other messages.
    bot.on("message", (ctx) => ctx.reply("Got another message!"));

    // Now that you specified how to handle messages, you can start your bot.
    // This will connect to the Telegram servers and wait for messages.

    // Start the bot.
    bot.start();



    async function getMessage(file){
        return `${(await fsPromises.readFile(`./messange/${file}.html`)).toString()}`;
    }
}

console.log('asd')
main();