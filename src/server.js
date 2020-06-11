const PORT = process.env.PORT || 3000

const express = require('express')
const app = express()


app.get('/', (req, res) => {
    return res.send('HELLO')
})


app.listen(PORT, () => console.log(`Server running and listing on port ${PORT}`))