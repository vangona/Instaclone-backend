import client from "../../client";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { protectedResolver } from "../users.utils";
import { GraphQLUpload } from "graphql-upload";

export default {
    Upload: GraphQLUpload,
    Mutation: {
        editProfile: protectedResolver(
            async (_, 
                { 
                    firstName,
                    lastName,
                    username,
                    email,
                    password:newPassword,
                    bio,
                },
                { 
                    loggedInUser
                }
            ) => {
                let uglyPassword = null;
                if (newPassword) {
                    uglyPassword = await bcrypt.hash(newPassword, 10)
                }
                const updatedUser = await client.user.update({
                    where:{
                        id: loggedInUser.id,
                    }, 
                        data:{
                        firstName,
                        lastName,
                        username,
                        email,
                        bio,
                        ...(uglyPassword && { password: uglyPassword }),
                    },
                    })
                    if (updatedUser.id) {
                        return {
                            ok: true
                        }
                    } else {
                        return {
                            ok: false,
                            error: "Could not update profile."
                        }
                    }
            }
        )
    },
};