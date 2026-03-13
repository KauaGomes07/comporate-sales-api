import { Request, Response } from "express"
import { prisma } from "../prisma/client"

export const createCompany = async (req: Request, res: Response) => {
    try {
        const { name } = req.body
        const userId = req.user?.id
        //Verifico se foi passado o nome da empresa
        if (!name){
            return res.status(400).json({ message: "Nome da empresa é obrigatório" })
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
