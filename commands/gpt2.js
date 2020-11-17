const { askGPT2 } = require('../helpers/huggingface_api.js')

module.exports = {
    name: 'gpt2',
    description: 'This command will make the bot autocomplete your sentence',
    async execute(message, input) {
        const response = await askGPT2(input)
        message.reply(response)
    }
}