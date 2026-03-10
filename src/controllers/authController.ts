import { Request, Response } from "express"
import { prisma } from "../prisma/client"
import bcrypt from "bcryptjs"

export const register = async (req: Request, res: Response) => {
    const { email, password, companyId } = req.body

    const hashPassword = await bcrypt.hash(password, 10)

    try {
        const user = prisma.user.create({
            data: {
                email: email,
                password: hashPassword,
                companyId: companyId || null
            }
        })

        return res.status(201).json({ message: "Usuário criado com sucesso!" })
    }
    catch(err){
        return res.status(400).json({ err: "Erro ao cadastrar usuário!" })
    }
};