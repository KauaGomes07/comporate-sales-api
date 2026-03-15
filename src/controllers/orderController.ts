import { Request, Response } from "express"
import { prisma } from "../prisma/client"
import { OrderItemInput } from "../types/orderItemInput" 


export const createOrder = async (req: Request, res: Response) => {
    try {

        const userId = req.user?.id
        const { items }: { items: OrderItemInput[] } = req.body

        if (!userId) {
            return res.status(401).json({ message: "Usuário não autenticado" })
        }
        //verifico se o pedido tem pelo menos um item
        if (!items || items.length === 0) {
            return res.status(400).json({
                message: "O pedido precisa ter pelo menos um item"
            })
        }

        const order = await prisma.$transaction(async (tx) => {

            let total = 0

            const orderItemsData: {
                productId: string
                quantity: number
                price: number
            }[] = []

            // Pega todos os ids dos produtos
            const productIds = items.map(item => item.productId)

            //Busca todos os produtos de uma só vez
            const products = await tx.product.findMany({
                where: {
                id: { in: productIds }
                }
            })
            // Cria um mapa para acesso rápido
            const productMap = new Map(
                products.map(product => [product.id, product])
            )
            
            for (const item of items) {

                const product = productMap.get(item.productId)

                if (!product) {
                    return res.status(404).json({ message: "Produto não encontrado" })
                }

                const subtotal = product.price * item.quantity

                total += subtotal

                orderItemsData.push({
                    productId: product.id,
                    quantity: item.quantity,
                    price: product.price
                })
            }

            const newOrder = await tx.order.create({
                data: {
                    userId,
                    total
                }
            })

            await tx.orderItem.createMany({
                data: orderItemsData.map(item => ({
                    orderId: newOrder.id,
                    productId: item.productId,
                    quantity: item.quantity,
                    price: item.price
                }))
            })

            return newOrder
        })

        return res.status(201).json(order)

    } catch (err) {
        console.error(err)
        return res.status(500).json({ message: "Erro ao criar pedido" })
    }
}

export const getMyOrders = async (req: Request, res: Response) => {
    try {
        const userId = req.user?.id

        if (!userId){
            return res.status(401).json({ message: "Usuário não autenticado" })
        }

        const orders = await prisma.order.findMany({
            where: {
                userId
            },
            include: {
                items: {
                    include: {
                        product: true
                    }
                }
            }
        })
        return res.json(orders)
    }
    catch(err){
        console.error(err)
        return res.status(500).json({ message: "Erro ao buscar pedidos"})
    }
}

export const getOrderById = async (req: Request, res: Response) => {
    try {
        const { id } = req.params
        const userId = req.user?.id

        if (!userId){
            return res.status(401).json({ message: "Usuário não autenticado" })
        }
        
        const order = await prisma.order.findFirst({
            where: { id: id as string },
            include: {
                items: {
                    include: {
                        product:true
                    }
                }
            }
        })

        if (!order){
            return res.status(404).json({ message: "Pedido não encontrado" })
        }

        if (order.userId !== userId){
            return res.status(403).json({ message: "Você não tem acesso a este pedido" })
        }

        return res.json(order)
    }
    catch(err){
        console.error(err)
        return res.status(500).json({ message: "Erro ao buscar pedido" })
    }
}