const database = process.env.DATABASE_ADDRESS;
const bcrypt = require('bcrypt');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
mongoose.connect(database)
    .then(() => {
        console.log('connected datbase');
    })
    .catch((error) => {
        console.log(error);
    })

const schema = mongoose.Schema({
    name: { type: String, lowercase: true, trim: true },
    username: { type: String, trim: true },
    email: { type: String, lowercase: true, trim: true },
    phone: { type: Number, trim: true },
    password: { type: String, trim: true },
    conformpassword: { type: String },
    age: { type: Number },
    gender: { type: String, lowercase: true, trim: true },
    address: { type: String, lowercase: true, trim: true },
    profession: { type: String, lowercase: true, trim: true },
    tokens: [{ token: { type: String } }]
})


// schema.pre("save",async function(next){
//     this.password=await bcrypt.hash(this.password,12);
//     next();
// })

schema.methods.generate = async function () {
    const token = await jwt.sign({ _id: this._id.toString() }, process.env.SEQUERTY_KEY);
    this.tokens = this.tokens.concat({ token: token })
    await this.save();
    return token;
}

const models = mongoose.model('usersforms', schema);

module.exports = models;
