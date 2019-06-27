const app = require('./app')
//check for this process key.
const { PORT = 9090 } = process.env
app.listen(PORT, ()=> {
    console.log(`i am listening. Honest. Port ${PORT}`)
})