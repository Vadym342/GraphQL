import { Post, Prisma } from '@prisma/client';
import { Context } from '../../src/index';
import { canUserMutatePost } from '../../src/utils/canUserMutatePost';

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
    postCreate: async (_: any, { post }: PostArgs, { prisma, userInfo }: Context)
        : Promise<PostPayloadType> => {

        if (!userInfo) {    // /* Middleware
            return {
                userErrors: [{
                    message: "Forbidden access (unauthenticated)",
                }],
                post: null,
            };
        }

        const { title, content } = post;
        if (!title || !content) {
            return {
                userErrors: [{
                    message: "Should be not empty field",
                }],
                post: null
            };
        }
        return {
            userErrors: [],
            post: await prisma.post.create({
                data: {
                    title,
                    content,
                    authorId: userInfo.userId,
                }
            })
        };
    },
    postUpdate: async (_: any, { post, postId }: { postId: string, post: PostArgs["post"] },
        { prisma, userInfo }: Context): Promise<PostPayloadType> => {
        const { title, content } = post;

        if (!userInfo) {  // /* Middleware
            return {
                userErrors: [{
                    message: "Forbidden access (unauthenticated)",
                }],
                post: null,
            };
        }

        const error = await canUserMutatePost({
            userId: userInfo.userId,
            postId: +postId,
            prisma
        });

        if (error) return error; // */ Middleware

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
    postDelete: async (_: any, { postId }: { postId: string }, { prisma, userInfo }: Context)
        : Promise<PostPayloadType> => {

        if (!userInfo) {
            return {
                userErrors: [{
                    message: "Forbidden access (unauthenticated)",
                }],
                post: null,
            };
        }

        const error = await canUserMutatePost({
            userId: userInfo.userId,
            postId: +postId,
            prisma
        });

        if (error) return error;

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
    },
    postPublish: async (_: any, { postId }: { postId: string }, { prisma, userInfo }: Context)
        : Promise<PostPayloadType> => {
        if (!userInfo) {
            return {
                userErrors: [{
                    message: "Forbidden access (unauthenticated)",
                }],
                post: null,
            };
        }

        const error = await canUserMutatePost({
            userId: userInfo.userId,
            postId: +postId,
            prisma
        });

        if (error) return error;

        return {
            userErrors: [],
            post: prisma.post.update({
                where: {
                    id: +postId,
                },
                data: {
                    published: true
                }
            })
        };
    },
    postUnpublish: async (_: any, { postId }: { postId: string }, { prisma, userInfo }: Context)
        : Promise<PostPayloadType> => {
        if (!userInfo) {
            return {
                userErrors: [{
                    message: "Forbidden access (unauthenticated)",
                }],
                post: null,
            };
        }

        const error = await canUserMutatePost({
            userId: userInfo.userId,
            postId: +postId,
            prisma
        });

        if (error) return error;

        return {
            userErrors: [],
            post: prisma.post.update({
                where: {
                    id: +postId,
                },
                data: {
                    published: false
                }
            })
        };
    }
}