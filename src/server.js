const PORT = process.env.PORT || 3000

const express = require('express')
const app = express()
const path = require('path')

app.use(express.static(path.join(__dirname, 'public')))


app.get('*', (req, res) => {
    return res.sendFile(path.join(__dirname, 'public', 'index.html'))
})


app.listen(PORT, () => console.log(`Server running and listing on port ${PORT}`))