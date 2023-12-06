//models are always singular routers are plural

//importing mongoose
const mongoose = require('mongoose');
//schema
const schemaDefinition = {
    name: {
        type: String,
        required: true
    },
    value: {
        type: String,
        required: true
    },
    purchDate: {
        type: Date,
        required: true
    },
    soldOn: {
        type: Date,
        
    },



};

// mongoose schema
var mongooseSchema = new mongoose.Schema(schemaDefinition);

//create and export data model
module.exports = mongoose.model('stock', mongooseSchema);