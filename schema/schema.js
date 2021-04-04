const graphql = require('graphql');

const {
    GraphQLObjectType, 
    GraphQLString, 
    GraphQLSchema,
    GraphQLID, GraphQLList} = graphql;
const _ = require('lodash')

const BookModel= require('../models/book');
const AuthorModel = require('../models/author');
const Mongoose  = require('mongoose');


const BookSchema = new GraphQLObjectType({
    name : "Book",
    fields : ()=> ({
        _id : {type : GraphQLID},
        name : {type : GraphQLString},
        genre : {type : GraphQLString},
        authorId : {
            type : AuthorSchema,
            async resolve(parents, args){
                console.log("parents in book", parents),
                console.log("args in book", args)
                // return _.find(dummyAuthor, {id : parents.authorId})
                return await AuthorModel.findOne({"_id" : Mongoose.Types.ObjectId(parents.authorId)})
            }
        }
    })
})

const AuthorSchema = new GraphQLObjectType({
    name : "Author",
    fields : ()=> ({
        _id : {type : GraphQLID},
        name : {type : graphql.GraphQLString},
        age : {type : graphql.GraphQLInt},
        books : {
            type : GraphQLList(BookSchema), 
            resolve(parents, args){
                // return _.filter(dummyData, {authorId : parents.id})
                return BookModel.find({"authorId" : parents._id})
            }
        }
    })
});

const MutationQuery = new GraphQLObjectType({
    name : "Mutation",
    fields :{
        addAuthor :{
            type : AuthorSchema,
            args :{ 
                name : {type: new graphql.GraphQLNonNull(GraphQLString)}, 
                age : {type : new graphql.GraphQLNonNull(graphql.GraphQLInt)} 
            },
            resolve(parent, args){
                console.log("args in mutation addAuthor", args)
                let author = new AuthorModel({
                    name : args.name,
                    age : args.age
                });

                return  author.save()
            }
        },

        addBook : {
            type : BookSchema,
            args : {
                name : {type : new graphql.GraphQLNonNull(graphql.GraphQLString)},
                authorId : {type : new graphql.GraphQLNonNull(graphql.GraphQLString)},
                genre : {type : new graphql.GraphQLNonNull(graphql.GraphQLString)},
            },
            async resolve(parents, args){

                if(!args.name || !args.authorId || !args.genre){
                    throw new Error('pass valid parameters');
                }
                
                let  book = await new BookModel({
                    name : args.name,
                    authorId : args.authorId,
                    genre : args.genre
                }).save();
                return book;
            }

        }
    }
})


const RootQuery = new GraphQLObjectType({
    name : "Root",
    fields : {
        book : {                                    // define the entry point .... If someone query for book, then this will execute
            type : BookSchema,
            args : {id : {type : GraphQLID}},
            resolve(parent, args){
                // write code to fetch data from database
                console.log("parent function", parent);
                console.log("args", args)

                return BookModel.find({"_id" : args._id})
                // return _.find(dummyData, {id : args.id})
            }
        },

        author : {
            type : AuthorSchema,
            args : {id : {type : graphql.GraphQLID}},
            resolve(parent, args){
                // return _.find(dummyAuthor, {id : args.id})
                return AuthorModel.findOne({_id : args._id})
            }
        },

        books : {
            type : GraphQLList(BookSchema),
            async resolve(parent,args){
                return await BookModel.find({});
            }
        },

        authors : {
            type : GraphQLList(AuthorSchema),
            resolve(parnts,args){
                return AuthorModel.find({})
            }
        }
    }
}) 

module.exports = new GraphQLSchema({
    query : RootQuery,
    mutation : MutationQuery
})