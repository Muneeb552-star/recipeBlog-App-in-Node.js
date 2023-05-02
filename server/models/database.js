const mongoose = require('mongoose')

mongoose.set('strictQuery', true)
mongoose.connect(process.env.DB_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
const db = mongoose.connection
db.on('error', console.error.bind(console, 'connection error'))
db.once('open', function () {
  console.log('Connected')
})

require('./Category')
require('./Recipe')
