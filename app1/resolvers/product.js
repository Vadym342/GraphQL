exports.Product = {
    category: ({ categoryId }, args, { db }) => db.categories.find(el => el.id === categoryId),

    reviews: ({ id }, args, { db }) => db.reviews.filter(el => el.productId === id),
}