import { createWriteStream } from "fs";
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
                    avatar,
                },
                { 
                    loggedInUser
                }
            ) => {
                let avatarUrl = null;
                if (avatar) {
                    const {filename, createReadStream} = await avatar;
                    const newFilename= `${loggedInUser.id}-${Date.now()}-${filename}`
                    const readStream = createReadStream();
                    const writeStream = createWriteStream(process.cwd() + "/uploads/" + newFilename);
                    readStream.pipe(writeStream);
                    avatarUrl = `http://localhost:4000/static/${newFilename}`;
                }
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
                        ...(avatarUrl && { avatar: avatarUrl }),
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