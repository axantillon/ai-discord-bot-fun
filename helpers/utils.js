module.exports = {
    removePrefix: (message) => {
        const prefix = ["!ai complete this: ", "!gpt2 ", "!ai fill this in: ", "!bert ", "!qa"]
    
        for(i = 0; i < prefix.length; i++){
            if(message.content.startsWith(prefix[i])){
                return message.content.slice(prefix[i].length).trim()
            }
        }
    }
}
