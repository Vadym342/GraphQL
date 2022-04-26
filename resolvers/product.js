exports.Product = {
    category: ({ categoryId }, args, { categories }) => categories.find(el => el.id === categoryId),

    reviews: ({id}, args, { reviews }) => reviews.filter(el => el.productId ===id),
}