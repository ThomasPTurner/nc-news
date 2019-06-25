const app = require('./app')
//check for this process key.
const PORT = process.port || 9001
app.listen(PORT, ()=> {
    console.log('i am listening. Honest.')
})