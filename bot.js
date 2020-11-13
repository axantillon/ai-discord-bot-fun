require('dotenv').config()
const axios = require('axios')

const Discord = require('discord.js')
const client = new Discord.Client()
client.login(process.env.BOT_TOKEN)

console.log("Bot getting ready... ✨")

client.once('ready', () => {
    console.log("up and running! 🎉")
})

client.on('message', async (msg) => {

    if( msg.author.bot ) return

    let input = removePrefix(msg)

    //Handle GPT2 Responses
    if(msg.content.startsWith("!ai complete this: ") 
    || msg.content.startsWith("!gpt2 ")) {

        const response = await askGPT2(input)
        msg.reply(response)

    }

    //Handle BERT Responses
    if(msg.content.startsWith("!ai fill this in: ") 
    || msg.content.startsWith("!bert ")){

        const response = await askBERT(input)
        msg.reply(response)

    }

    //Handle BERTQA Responses
    if(msg.content.startsWith("!qa ")){

        const response = await askBERTQA(input)
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

function removePrefix(message){
    const prefix = ["!ai complete this: ", "!gpt2 ", "!ai fill this in: ", "!bert ", "!qa"]

    for(i = 0; i < prefix.length; i++){
        if(message.content.startsWith(prefix[i])){
            return message.content.slice(prefix[i].length).trim()
        }
    }
}

async function askGPT2(input) {

    response_length = Math.floor(1 + Math.random() * 20)*5
    let output

    await axios.post("https://api-inference.huggingface.co/models/gpt2", {
        "inputs": input,
        "parameters": {
            "max_length": response_length
        }
    }).then(function (response){
        output = response
    }).catch(function(error){
        console.log(error)
    })

    return output.data[0].generated_text
}

async function askBERT(input) {

    let output

    if (input.substr(input.length-1) !== "."){
        input = input.concat(".")
    }

    if(input.search("-blank-") == -1){
        return "You need to specify what you want me to guess by using -blank-"
    }else {
        input = input.replace("-blank-", "[MASK]")
    }

    await axios.post("https://api-inference.huggingface.co/models/bert-base-uncased", {
        "inputs": input,
        "parameters": {
            "top_k": 1
        }
    }).then(function (response){
        console.log(response)
        output = response
    }).catch(function(error){
        console.log(error)
    })

    return input.replace("[MASK]", ("**" + output.data[0].token_str +"**"))

}

async function askBERTQA(input) {

    let output

    const context = "This is a server made for testing robots developed by friends"

    //console.log(input)

    await axios.post("https://api-inference.huggingface.co/models/deepset/bert-large-uncased-whole-word-masking-squad2", {
        "context": context,
        "question": input
    }).then(function (response){
        output = response
    }).catch(function(error){
        console.log(error)
    })

    return output.data.answer
}