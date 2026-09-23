import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"
import connectDb from "./lib/db"
import User from "./models/user.model";
import bcrypt from "bcryptjs";
import Google from "next-auth/providers/google";


export const { handlers, signIn, signOut, auth } = NextAuth({
    providers: [
        Credentials({ //object
            credentials: {
                email: {
                    type: "email",
                    label: "Email",
                    placeholder: "johndoe@gmail.com",
                },
                password: {
                    type: "password",
                    label: "Password",
                    placeholder: "*****",
                },
            },

            async authorize(credentials, request) {
                if (!credentials.email || !credentials.password) {
                    throw Error("missing credentials");
                }

                const email = credentials.email;
                const password = credentials.password as string;

                await connectDb()

                //  check if user is exist?, if not then do sign up
                const user = await User.findOne({ email })
                if (!user) {
                    throw Error("User doesn't exist!");
                }

                if (!user.password) {
                    throw Error("User doesn't have a password!");
                }

                // check password with database stored password
                const isMatch = await bcrypt.compare(password, user.password)
                if (!isMatch) {
                    throw Error("Incorrect Password!");
                }

                return {
                    id: user._id.toString(),
                    name: user.name,
                    email: user.email,
                    role: user.role
                }
            }
        }),

        Google({
            clientId: process.env.AUTH_GOOGLE_ID,
            clientSecret: process.env.AUTH_GOOGLE_SECRET
        })
    ],

    // When user login and logout what functions should be called is written here 
    callbacks: {

        async signIn({ user, account }) {
            if (account?.provider == "google") {
                await connectDb()


                let dbUser = await User.findOne({ email: user.email })

                if (!dbUser) {
                    // if user is not exist in database then create a new user

                    dbUser = await User.create({
                        name: user.name,
                        email: user.email
                    })
                }

                user.id = dbUser._id.toString()
                user.role = dbUser.role
            }

            return true
        },

        async jwt({ token, user }) {  //user is provided by auth.js 
            if (user) {
                token.name = user.name,
                    token.id = user.id,
                    token.email = user.email,
                    token.role = user.role
            }
            return token
        },

        async session({ token, session }) {

            if (session.user) {
                session.user.name = token.name,
                    session.user.id = token.id as string,
                    session.user.email = token.email as string,
                    session.user.role = token.role as string
            }

            return session
        }
    },

    pages: {
        signIn: "/signin",
        error: "/signin",

    },

    session: {
        strategy: "jwt",
        maxAge: 10 * 24 * 60 * 60
    },
    secret: process.env.BETTER_AUTH_SECRET,
})