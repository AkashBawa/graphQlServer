const express = require('express');
const graphqlHTTP = require('express-graphql').graphqlHTTP;
const schema = require('./schema/schema');
const cors = require('cors');   

require('./settings/dbConnction')();

const app = express();

app.use(cors());

app.use('/graphql', graphqlHTTP({
    schema : schema,
    graphiql : true
}))

app.listen(3000, ()=>{
    console.log("Listening to port 3000")
});

