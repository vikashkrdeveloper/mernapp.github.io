const jwt = require('jsonwebtoken');
const database = require('../db/connection');

const authontication = async (req, res, next) => {
    try {
        const token = req.cookies.jwtokens;
        const verfiytoken = jwt.verify(token, process.env.SEQUERTY_KEY);
        const rootUser = await database.findOne({ _id: verfiytoken._id, "tokens.token": token })
        console.log(verfiytoken)
        if (!rootUser) {
            throw new Error('user not found');

        }
        req.token = token;
        req.rootUser = rootUser;
        req.userId = rootUser._id;
        next();
    }
    catch (error) {
        res.status(400).send('User not login ');

    }
}

module.exports = authontication;