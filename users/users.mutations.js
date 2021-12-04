import client from "../client";
import bcrypt from "bcrypt";

export default {
    Mutation: {
        createAccount: async (
            _, 
            { firstName, lastName, username, email, password }
        ) => {
            // check if username or email are already on DB.
            const existingUser = await client.user.findFirst({
                where: {
                    OR: [
                        {
                            username,
                        },
                        {
                            email,
                        },
                    ],
                },
            });
            const uglyPassword = await bcrypt.hash(password, 10);
            return client.user.create({data: {
                username, 
                email, 
                firstName, 
                lastName, 
                paassword: uglyPassword,
            },
        });
        },
    },
};
