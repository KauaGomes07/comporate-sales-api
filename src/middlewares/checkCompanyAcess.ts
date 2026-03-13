import { Request, Response, NextFunction } from "express"

export const checkCompanyAccess = (req: Request, res: Response, next: NextFunction) => {
  
    const userCompanyId = req.user?.companyId
    const { id } = req.params

    if (!userCompanyId) {
        return res.status(403).json({ message: "Usuário não pertence a nenhuma empresa" })
    }

    if (userCompanyId !== id) { 
        return res.status(403).json({ message: "Você não tem acesso a essa empresa" })
    }

    next()
}