const express = require('express');
require('dotenv').config();
const cors = require('cors');
const app = express();
const cookie = require('cookie-parser');
const port = process.env.PORT || 5000;
const bodyparser = require('body-parser');
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(bodyparser.json());
app.use(bodyparser.urlencoded({ extended: false }));
app.use(cors());
app.use(cookie());
app.use(require('../routes/auth'));



if (process.env.NODE_ENV == "production") {
    app.use(express.static("client/build"));
    const path = require("path");
    app.get("*", (req, res) => {
        res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
    })
}
app.all('*', (req, res) => {
    res.send('Ooops page not found');
})
app.listen(port, (req, res) => {
    console.log(`http://localhost:${port}`);
})