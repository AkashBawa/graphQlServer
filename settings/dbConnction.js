const mongoose = require('mongoose');

module.exports = function(){

    mongoose.connect('mongodb://localhost:27017/graphql' , {useNewUrlParser : true, useUnifiedTopology: true});

    mongoose.connection.once('open',()=>{
        console.log('Database connected')
    })
}