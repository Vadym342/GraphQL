const { products } = require('../consts/products');

exports.Category = {
    products: ({ id: categoryId }, {filter}, { products }) => {
        const categoryProducts = products.filter(el => el.categoryId === categoryId);
        let filteredCategoryProducts = categoryProducts;

        if(filter){
            if(filter.onSale === true){
                filteredCategoryProducts = filteredCategoryProducts.filter(el => el.onSale);
            }
        }
        return filteredCategoryProducts;
    },
}
