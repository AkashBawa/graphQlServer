const mongoose = require('mongoose');

const authorSchema = mongoose.Schema({
    name : {type : String},
    age : {type : Number},
    // id : {type : String}
})

module.exports = mongoose.model('Author', authorSchema)