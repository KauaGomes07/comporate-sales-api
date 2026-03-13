import { Request, Response } from "express"
import { prisma } from "../prisma/client"

export const createProduct = async (req: Request, res: Response) => {
    try {
        const { name, price } = req.body

        //Verifico se os campos foram preenchidos, price === undefined para quando o usuario digitar 0
        if (!name || price === undefined){
            return res.status(400).json({ message: "Nome e preço são obrigatórios"})
        }
        const companyId = req.user?.companyId

        //Verifico se o usuário possui companhia para conseguir criar o produto
        if (!companyId){
            return res.status(403).json({ message: "Usuário não pertence a uma empresa"})
        }

        const product = await prisma.product.create({
            data: {
                name,
                price,
                companyId
            }
        })
        return res.status(201).json(product)
    }
    catch(err){
        console.error("Product create error:", err)
        return res.status(500).json({ message: "Erro ao criar produto!"})
    }
}

export const getProducts = async (req: Request, res: Response) => {
    //Essa rota lista todos os produtos das empresa
    try {
        //Pega os produtos incluídos na companhia"
        const products = await prisma.product.findMany({
            include: {
                company: true
            }
        })
        
        res.status(200).json({ products })
    }
    catch(err){
        return res.status(500).json({ message: "Erro ao buscar produtos" })
    }
}

export const updateProduct = async (req: Request, res: Response) => {
  try {
    const { name, price } = req.body
    const product = req.product! // já validado no middleware

    if (!name && price === undefined) {
      return res.status(400).json({
        message: "Informe ao menos um campo para atualizar"
      })
    }

    const updatedProduct = await prisma.product.update({
      where: { id: product.id },
      data: {
        //Aqui fiz um spread operator para fazer essa verificação
        ...(name !== undefined && { name }),
        ...(price !== undefined && { price })
      }
    })

    return res.status(200).json(updatedProduct)

  } catch (err) {
    console.error(err)
    return res.status(500).json({
      message: "Erro ao atualizar produto"
    })
  }
}

export const deleteProduct = async (req: Request, res: Response) => {
  try {
    const product = req.product! // já validado no middleware

    await prisma.product.delete({
      where: { id: product.id }
    })

    return res.status(204).send()

  } catch (err) {
    console.error(err)
    return res.status(500).json({
      message: "Erro ao deletar produto"
    })
  }
}