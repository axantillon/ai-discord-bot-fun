require('dotenv').config()
const axios = require('axios')

const Discord = require('discord.js')
const client = new Discord.Client()
client.login(Nzc2NTAwNTM0MzgyOTUyNDc4.X61yeg.v6CcZC4Mt8JdSiSXYnq1oaYg9jc)

console.log("Bot getting ready... ✨")

client.on('ready', () => {
    console.log("up and running! 🎉")
})

client.on('message', async (msg) => {
    if(msg.channel.id == '776501886404526120') {

        let input = removePrefix(msg)

        //Handle GPT2 Responses
        if(msg.content.startsWith("!ai complete this: ") 
        || msg.content.startsWith("!gpt2 ")) {

            const response = await askGPT2(input)
            msg.reply(response)

        }

        if(msg.content.startsWith("!ai fill this in: ") 
        || msg.content.startsWith("!bert ")){

            const response = await askBERT(input)
            msg.reply(response)

        }
    }
})

function removePrefix(message){
    const prefix = ["!ai complete this: ", "!gpt2 ", "!ai fill this in: ", "!bert "]

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

    if (input.substr(input.length-1) !== "."){
        input = input.concat(".")
    }

    if(input.search("-blank-") == -1){
        return "You need to specify what you want me to guess by using -blank-"
    }else {
        input = input.replace("-blank-", "[MASK]")
    }

    let output

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