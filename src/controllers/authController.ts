import { Request, Response } from "express"
import { prisma } from "../prisma/client"
import bcrypt from "bcryptjs"
import { secretKey } from "../utils/jwt"
import jwt from "jsonwebtoken"

export const register = async (req: Request, res: Response) => {
    const { email, password, companyId } = req.body

    if (!email || !password) {
        return res.status(400).json({ error: 'Email e senha são obrigatórios.' })
    }

    try {
        const hasUser = await prisma.user.findUnique({ where: { email } })
        if (hasUser) {
            return res.status(409).json({ error: "Usuário com este email já existe." })
        }

        //Crio o hash da senha usando bcrypt
        const hashPassword = await bcrypt.hash(password, 10)

        const user = await prisma.user.create({
            data: {
                email,
                password: hashPassword,
                companyId: companyId || null
            }
        })
        // Removo a senha para não retornar no response
        const { password: _, ...userWithoutPassword } = user

        return res.status(201).json({ message: "Usuário criado com sucesso!", userWithoutPassword })
    }
    catch (err) {
        console.error('Register error:', err)
        return res.status(500).json({ err: "Erro interno ao cadastrar usuário." })
    }
};

export const login = async (req: Request, res: Response) => {
    const { email, password } = req.body

    if (!email || !password) {
        return res.status(400).json({ error: 'Email e senha são obrigatórios.' })
    }
    
    try {
        const user = await prisma.user.findUnique({
            where: {
                email: email
            }
        })
        if (!user){
            return res.status(401).json({ error: "Dados inválidos, tente novamente!"})
        }
        //Essa função do bcrypt compara a senha fornecida com o hash armazenado no banco de dados
        const match = await bcrypt.compare(password, user.password)
        if (!match) {
            return res.status(401).json({ error: "Dados inválidos, tente novamente!"})
        }
        //Aqui cria o token JWT
        const token = jwt.sign({ userId: user.id, companyId: user.companyId }, secretKey!, { expiresIn: "1h" })
        return res.json({ token })
    }
    catch (err) {
        console.error('Login error:', err)
        return res.status(500).json({ err: "Erro interno ao realizar login." })
    }
}