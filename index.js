const { ApolloServer, gql } = require("apollo-server");
const { categories } = require('./consts/categories');
const { products } = require('./consts/products');
const { reviews } = require('./consts/reviews');
const { typeDefs} = require('./schema');
const { Query } = require('./resolvers/query');
const { Category } = require('./resolvers/category');
const { Product } = require('./resolvers/product');

const server = new ApolloServer({
    typeDefs,
    resolvers:{
        Query,
        Category,
        Product
    },
    context: {
        categories,
        products,
        reviews
    }
});

server.listen().then(({ url }) => {
    console.log("Server is ready at" + url);
})