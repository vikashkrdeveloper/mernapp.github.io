const express = require('express');
const route = express.Router();
const database = require('../db/connection')
const bcrypt = require('bcrypt');
const path = require('path');
const authontication = require('../middlewares/authontication');
route.get('/', (req, res) => {
    res.send('Home Page ');
})
route.post('/register', async (req, res) => {
    try {
        const { name, username, email, phone, password, conformpassword, age, address, profession } = req.body;
        const readdata = await database.findOne({ email });
        if (readdata) {
            res.status(400).send();

        }
        else {
            if (name && username && email && phone && password && conformpassword && age && address && profession) {
                if (password === conformpassword) {
                    const inserdata = new database({ name, username, email, phone, password, conformpassword, age, address, profession });
                    const result = await inserdata.save();
                    if (result === "null") {
                        res.status(408).send();
                    }
                    else {
                        const token = await inserdata.generate();
                        res.status(200).send();
                    }
                }
                else {
                    res.status(401).send();
                }
            }
            else {
                res.status(500).send();

            }


        }
    }

    catch (error) {
        res.status(404).send('Sum techinical issues ');
    }
})
route.post('/signin', async (req, res) => {
    const { email, password } = req.body;
    try {
        const readdata = await database.findOne({ email });
        if (readdata) {

            // const verifypassword =await bcrypt.compare(password,readdata.password)
            // console.log(verifypassword)
            // if (verifypassword) {
            if (password === readdata.password) {
                const token = await readdata.generate();
                res.cookie('jwtokens', token, { httpOnly: true });
                res.status(200).send();
            } else {
                res.status(400).send();
            }


        }
        else {
            res.status(401).send();
        }

    }
    catch (error) {
        res.status(404).send('Sum techinical issues ');
    }

})

route.get('/about', authontication, (req, res) => {
    res.send(req.rootUser);
    res.status(200).send();

})
route.get('/getdata', authontication, (req, res) => {
    res.send(req.rootUser);
    res.status(200).send();

})
route.get('/logout',(req, res) => {
    res.clearCookie('jwtokens',{path:'/'});
    res.status(200).send();

})

module.exports = route;