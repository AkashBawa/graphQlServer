const mongoose = require('mongoose');

const BookSchema = mongoose.Schema({
    name : {type : String},
    genre : {type : String},
    authorId : {
        type : mongoose.Types.ObjectId,
        ref : 'Author'
    }
})

module.exports = mongoose.model('Book', BookSchema)