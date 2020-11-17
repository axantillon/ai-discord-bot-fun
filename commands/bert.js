const { askBERT } = require('../helpers/huggingface_api.js')

module.exports = {
    name: 'bert',
    description: "This command will fill in the word you declare as '-blank-'.",
    async execute(message, input) {
        const response = await askBERT(input)
        message.reply(response)
    } 
}