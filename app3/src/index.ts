import { getUserFromToken } from './utils/getUserFromToken';
import { Prisma, PrismaClient } from "@prisma/client";
import { ApolloServer, gql } from "apollo-server";
import { typeDefs } from "./schema";
import { Mutation, Query, Profile, Post, User } from "../resolvers";

export const prisma = new PrismaClient();

export interface Context {
  prisma: PrismaClient<Prisma.PrismaClientOptions,
    never, Prisma.RejectOnNotFound | Prisma.RejectPerOperation | undefined>;
  userInfo: {
    userId: number,
  } | null;
}

const server = new ApolloServer({
  typeDefs,
  resolvers: {
    Query,
    Mutation,
    Profile,
    Post,
    User,
  },
  context: async ({ req }: any): Promise<Context> => {
    const userInfo = await getUserFromToken(req.headers.authorization);
    return {
      prisma,
      userInfo,
    }
  }
});

server.listen().then(({ url }) => {
  console.log(`Server ready on ${url}`);
});
