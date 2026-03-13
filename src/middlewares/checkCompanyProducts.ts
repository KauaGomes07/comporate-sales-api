import { Request, Response, NextFunction } from "express"
import { prisma } from "../prisma/client"

export const checkCompanyProduct = async (req: Request, res: Response, next: NextFunction) => {
  const companyId = req.user?.companyId;
  const productId = req.params.id

  if (!companyId){
    return res.status(403).json({ message: "Usuário não pertence a uma empresa" })
  }

  if (!productId || Array.isArray(productId)) {
    return res.status(400).json({ message: "ID do produto inválido" })
  }

  const product = await prisma.product.findFirst({
    where:{
      id: productId,
      companyId
    }
  })
  if (!product){
    return res.status(403).json({ message: "Produto não pertence à sua empresa" })
  }

  req.product = product;

  next();
}