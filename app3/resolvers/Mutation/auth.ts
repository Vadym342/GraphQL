import { Context } from '../../src/index';
import validator from 'validator';
import bcrypt from 'bcryptjs';
import JWT from 'jsonwebtoken';
import { JWT_SIGNATURE } from '../../src/keys';


interface SignUpArgs {
    credentials: {
        email: string,
        password: string,
    }
    bio: string,
    name: string,
}

interface SigninArgs {
    credentials: {
        email: string,
        password: string,
    };
}

interface UserPayload {
    userErrors: {
        message: string,
    }[],
    token: string | null,
}

export const authResolvers = {
    signup: async (_: any, { credentials, bio, name }: SignUpArgs, { prisma }: Context)
        : Promise<UserPayload> => {
        const { email, password } = credentials;
        const isEmail = validator.isEmail(email);
        const isValidPassword = validator.isLength(password, {
            min: 5
        })
        if (!isValidPassword) {
            return {
                userErrors: [{
                    message: "Invalid password",
                }],
                token: null
            }
        }
        if (!isEmail) {
            return {
                userErrors: [{
                    message: "Invalid Email",
                }],
                token: null
            }
        }
        if (!name || !bio) {
            return {
                userErrors: [{
                    message: "Invalid name or bio",
                }],
                token: null
            }
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await prisma.user.create({
            data: {
                email,
                name,
                password: hashedPassword,
            },
        });

        await prisma.profile.create({
            data: {
                bio,
                userId: user.id
            },
        });

        return {
            userErrors: [],
            token: JWT.sign(
                {
                    userId: user.id,
                },
                JWT_SIGNATURE,
                {
                    expiresIn: 360000,
                })
        }
    },
    signin: async (_: any, { credentials }: SigninArgs, { prisma }: Context)
        : Promise<UserPayload> => {
        const { email, password } = credentials;

        const user = await prisma.user.findUnique({
            where: {
                email
            }
        });

        if (!user) {
            return {
                userErrors: [{
                    message: "Invalid credentials",
                }],
                token: null
            };
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return {
                userErrors: [{
                    message: "Invalid credentials",
                }],
                token: null
            };
        }

        return {
            userErrors: [],
            token: JWT.sign(
                {
                    userId: user.id
                },
                JWT_SIGNATURE,
                {
                    expiresIn: 360000,
                })
        }

    }
}