require('dotenv').config()
const fs = require('fs')
const huggingface_api = require('./helpers/huggingface_api.js')
const utils = require('./helpers/utils.js')
const prefix = "!"

const Discord = require('discord.js')
const client = new Discord.Client()
client.commands = new Discord.Collection()

const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'))
for (const file of commandFiles) {
	const command = require(`./commands/${file}`);
	client.commands.set(command.name, command);
}

client.login(process.env.BOT_TOKEN)

console.log("Bot getting ready... ✨")

client.once('ready', () => {
    console.log("up and running! 🎉")
})

client.on('message', async (msg) => {

    if( !msg.content.startsWith(prefix) || msg.author.bot ) return

    const [commandName, input] = utils.extractInfo(prefix, msg)

    if (!client.commands.has(commandName)) return;

    try {
        client.commands.get(commandName).execute(msg, input);
    } catch (error) {
        console.error(error);
        message.reply('there was an error trying to execute that command!');
    }

    if(msg.content.startsWith("!ai help")){

        msg.reply("Hey!")

        const helpEmbed = new Discord.MessageEmbed()
            .setColor('#d3d3d3')
            .setTitle("I'm an Artificially Intelligent DudeBot")
            .setDescription("I'm a bot powered by the GPT2 and BERT models provided by the folks at HuggingFace (https://huggingface.co/) \n \n \
            **GPT2** can autocomplete your sentences! \n Just use **'!gpt2 {your sentence here}'** or **'!ai complete this: {your sentence here}** \n \n \
            **BERT** can fill in the blanks in your sentences! \n Just use **'!bert {your sentence here and mark the blanks with __-blank-__}'** or **'!ai fill this in: {your sentence here and mark the blanks with __-blank-__}'**")

        msg.channel.send(helpEmbed)
    }

    if(msg.mentions.has(client.user) && !msg.mentions.everyone){
        msg.reply("Hey!!!")
        msg.channel.send(">>> If you need any help talking to me, use !ai help")
    }
})
