const mongoose = require('mongoose')
const { app } = require('./app')

const PORT = 8000
const DATABASE_URL = 'mongodb://localhost:27017/houserental'

const main = async () => {
    try {
        await mongoose.connect(DATABASE_URL)

        app.listen(PORT, () => {
            console.log(`Server up an running on port ${PORT}`)
        })
    } catch {
        console.log('Error connecting to database')
        process.exit(1)
    }
}

main()