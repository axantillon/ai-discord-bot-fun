module.exports = {
    extractInfo: (prefix, message) => {
        const command =  message.content.slice(prefix.length).split(' ')[0]
        const input = message.content.slice(prefix.length + command.length).trim()

        return [command, input]
    }
}
