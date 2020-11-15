
const axios = require('axios')

module.exports = {
    askGPT2: async (input) => {

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
    },
    
    askBERT: async (input) => {
    
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
    
    },
    
    askBERTQA: async (input) => {
    
        let output
    
        const context = "This is a server made for testing robots developed by friends. The friends are Andres and Saki. Saki is in 5th grade, Andres is a senior in high school and in 7th grade."
    
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

}


