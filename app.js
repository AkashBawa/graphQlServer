const express = require('express');
const graphqlHTTP = require('express-graphql').graphqlHTTP;
const schema = require('./schema/schema');

require('./settings/dbConnction')();

const app = express();

app.use('/graphql', graphqlHTTP({
    schema : schema,
    graphiql : true
}))

app.listen(3000, ()=>{
    console.log("Listening to port 3000")
});

