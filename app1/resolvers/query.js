exports.Query = {
    products: (param, { filter }, { db }) => {
        let filteredProducts = db.products;
        if (filter) {
            const { onSale, avgRating } = filter;
            if (onSale === true) {
                filteredProducts = filteredProducts.filter(el => el.onSale);
            }
            if ([1, 2, 3, 4, 5].includes(avgRating)) {
                filteredProducts = filteredProducts.filter(el => {
                    let sumRating = 0;
                    let numOfReviews = 0;
                    db.reviews.forEach(reviews => {
                        if (reviews.productId === el.id) {
                            sumRating += reviews.rating;
                            numOfReviews++;
                        }
                    });
                    const avgProductRating = sumRating/numOfReviews;
                    return avgProductRating >= avgRating;
                })
            }
        }

        return filteredProducts
    },

    product: (param, { id }, { db }) => db.products.find(el => el.id === id),

    categories: (param, args, { db }) => db.categories,

    category: (param, { id }, { db }) => db.categories.find(el => el.id === id),
}