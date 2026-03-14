import { Request, Response } from "express"
import { prisma } from "../prisma/client"

export const createCompany = async (req: Request, res: Response) => {
    try {
        const { name } = req.body
        const userId = req.user?.id

        //Verifica se o usuário já tem uma empresa
        if (req.user?.companyId){
            return res.status(400).json({ message: "Usuário já pertence a uma empresa" })
        }
        //Verifico se foi passado o nome da empresa
        if (!name){
            return res.status(400).json({ message: "Nome da empresa é obrigatório" })
        }

        if (!userId) {
            return res.status(401).json({ message: "Usuário não autenticado" })
        }
        //Crio a empresa
        const company = await prisma.company.create({
            data: {
                name
            }
        })
        //Aqui eu associo o usuário que criou a empresa à empresa, atualizando seu companyId
        await prisma.user.update({
            where: { id: userId },
            data: {
                companyId: company.id
            }
        })
        
         return res.status(201).json(company)
    }
    catch (err) {
        console.error(err)
        return res.status(500).json({ message: "Erro ao criar empresa" })
    }
}

export const getMyCompany = async (req: Request, res: Response) => {
    try {

        const companyId = req.user?.companyId

        if (!companyId){
            return res.status(403).json({ message: "Usuário não pertence a uma empresa" })
        }

        const company = await prisma.company.findUnique({
            where: { id: companyId },
            include: {
                products: true
            }
        })
        if (!company){
            return res.status(404).json({ message: "Empresa não encontrada" })
        }

        return res.status(200).json(company)
    }
    catch (err) {
        console.error(err)
        return res.status(500).json({ message: "Erro ao buscar empresa" })
    }
}

export const getCompanyProducts = async (req: Request, res: Response) => {
    try {
        const { id } = req.params

        const company = await prisma.company.findUnique({
            where: { id: id as string },
            include: {
                products: true
            }
        })

        if (!company){
            return res.status(404).json({ message: "Empresa não encontrada" })
        }

        return res.status(200).json(company.products)
    }
    catch(err){
        console.error(err)
        return res.status(500).json({ message: "Erro ao buscar produtos da empresa" })
    }
}

export const updateCompany = async (req: Request, res: Response) => {
    try {
        const companyId = req.user?.companyId
        const { name } = req.body

        if (!name){
            return res.status(400).json({ message: "Campo obrigatório" })
        }
        if (!companyId){
            return res.status(403).json({ message: "Usuário não pertence a uma empresa" })
        }

        const company = await prisma.company.update({
            where: { id: companyId },
            data: {
                name
            }
        })

        return res.json(company)
    }
    catch(err){
        console.error(err)
        return res.status(500).json({ message: "Erro ao atualizar empresa" })
    }
}

