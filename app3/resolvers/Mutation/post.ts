import { Post, Prisma } from '@prisma/client';
import { Context } from '../../src/index';

interface PostArgs {
    post: {
        title?: string,
        content?: string,
    }
}

interface PostPayloadType {
    userErrors: {
        message: string
    }[],
    post: Post | Prisma.Prisma__PostClient<Post> | null;
}


export const postResolvers = {
    postCreate: async (_: any, { post }: PostArgs, { prisma }: Context)
        : Promise<PostPayloadType> => {
        const { title, content } = post;
        if (!title || !content) {
            return {
                userErrors: [{
                    message: "Should be not empty field",
                }],
                post: null
            }
        }
        return {
            userErrors: [],
            post: await prisma.post.create({
                data: {
                    title,
                    content,
                    authorId: 1
                }
            })
        };
    },
    postUpdate: async (_: any, { post, postId }: { postId: string, post: PostArgs["post"] }, { prisma }: Context)
        : Promise<PostPayloadType> => {
        const { title, content } = post;
        if (!title && !content) {
            return {
                userErrors: [{
                    message: "Need to have at least on e field to update ",
                }],
                post: null
            }
        }
        const existingPost = await prisma.post.findUnique({
            where: {
                id: +postId
            }
        });
        if (!existingPost) {
            return {
                userErrors: [{
                    message: "Post does not exist ",
                }],
                post: null
            }
        }
        let payloadToUpdate = {
            title,
            content
        }
        if (!title) delete payloadToUpdate.title;
        if (!content) delete payloadToUpdate.content;
        return {
            userErrors: [],
            post: prisma.post.update({
                data: {
                    ...payloadToUpdate,
                },
                where: {
                    id: +postId,
                }
            })
        };
    },
    postDelete: async (_: any, { postId }: { postId: string }, { prisma }: Context)
        : Promise<PostPayloadType> => {
        const post = await prisma.post.findUnique({
            where: {
                id: +postId,
            }
        });

        if (!post) {
            return {
                userErrors: [{
                    message: "Post does not exist ",
                }],
                post: null
            }
        }
        await prisma.post.delete({
            where: {
                id: +postId
            }
        });

        return {
            userErrors: [],
            post
        };
    }
}