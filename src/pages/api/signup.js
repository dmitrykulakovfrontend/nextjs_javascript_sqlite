import prisma from "@/db";
import {z} from "zod";
import bcrypt from "bcryptjs";

const signupUserSchema = z.object({
    username: z.string().regex(/^[a-z0-9_-]{3,15}$/g, "Invalid username"),
    password: z.string().min(8, "Password should be minimum 8 characters"),
});

export default async function handler(req, res) {
    const {username, password} = signupUserSchema.parse(req.body);
    const user = await prisma.user.findUnique({
        where: {username},
    });
    if (user !== null) {
        return res.send({user: null, message: "User already exists"});
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await prisma.user.create({
        data: {
            username,
            password: hashedPassword,
        },
    });

    return res.send({user: newUser, message: "User created successfully"});
}
