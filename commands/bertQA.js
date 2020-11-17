const { askBERTQA } = require('../helpers/huggingface_api.js')

module.exports = {
    name: 'bertQA',
    description: 'This command will answer questions about the server',
    async execute(message, input) {
        const response = await askBERTQA(input)
        message.reply(response)
    }
}
