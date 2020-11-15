require('dotenv').config()
const huggingface_api = require('./helpers/huggingface_api.js')
const utils = require('./helpers/utils.js')

const Discord = require('discord.js')
const client = new Discord.Client()
client.login(process.env.BOT_TOKEN)

console.log("Bot getting ready... ✨")

client.once('ready', () => {
    console.log("up and running! 🎉")
})

client.on('message', async (msg) => {

    if( msg.author.bot ) return

    let input = utils.removePrefix(msg)

    //Handle GPT2 Responses
    if(msg.content.startsWith("!ai complete this: ") 
    || msg.content.startsWith("!gpt2 ")) {

        const response = await huggingface_api.askGPT2(input)
        msg.reply(response)

    }

    //Handle BERT Responses
    if(msg.content.startsWith("!ai fill this in: ") 
    || msg.content.startsWith("!bert ")){

        const response = await huggingface_api.askBERT(input)
        msg.reply(response)

    }

    //Handle BERTQA Responses
    if(msg.content.startsWith("!qa ")){

        const response = await huggingface_api.askBERTQA(input)
        msg.reply(response)
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
