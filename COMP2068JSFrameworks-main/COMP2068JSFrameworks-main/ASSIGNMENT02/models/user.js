//models are always singular routers are plural

//importing mongoose
const mongoose = require('mongoose');
const plm = require('passport-local-mongoose');

//schema
const userSchemaDefinition = {
   
    username: {type: String},
    password: {type: String}, // make sure to hash password

    oauthId: {type: String},
    oauthProvider: {type: String},
    created: {type: Date},


};

// mongoose schema
var userSchema = new mongoose.Schema(userSchemaDefinition);
userSchema.plugin(plm);
//create and export data model
module.exports = mongoose.model('User', userSchema);