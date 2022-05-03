import { userLoader } from './../src/loaders/userLoaders';
import { Context } from './../src/index';

interface PostParentType {
    authorId: number;
}

export const Post = {
    user: (parent: PostParentType, __: any, { prisma }: Context) => {
        return userLoader.load(parent.authorId);
    },
}