const app = require('./src/app')

const {PORT = 8080} = process.env
const server = app.listen(PORT, () => console.log(`Listening on port ${PORT}`))

module.exports = server
