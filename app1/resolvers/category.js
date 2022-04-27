exports.Category = {
    products: ({ id: categoryId }, {filter}, { db }) => {
        const categoryProducts = db.products.filter(el => el.categoryId === categoryId);
        let filteredCategoryProducts = categoryProducts;

        if(filter){
            if(filter.onSale === true){
                filteredCategoryProducts = filteredCategoryProducts.filter(el => el.onSale);
            }
        }
        return filteredCategoryProducts;
    },
}
