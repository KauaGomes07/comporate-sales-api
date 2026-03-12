import { Request, Response, NextFunction } from 'express';
import jwt from "jsonwebtoken"
import { secretKey } from '../utils/jwt';
import { TokenPayload } from '../types/token';

export function authMiddleware( req: Request, res: Response, next: NextFunction){
    const authHeader = req.headers.authorization

    //Aqui pego o token na requisição e verifico se ele existe
    if (!authHeader){
        return res.status(401).json({ message: "Token não foi gerado!"})
    }
    
    //Aqui eu somente formato o token para tirar o Bearer
    const token = authHeader?.replace("Bearer ", "")

    try {
        const decoded = jwt.verify(token, secretKey!) as TokenPayload

        req.user = {
            id: decoded.id,
            companyId: decoded.companyId
        }

        next()
    }
    catch(err){
        return res.status(401).json({ message: "Token inválido!"})
    }
}