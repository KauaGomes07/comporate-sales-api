import { Request, Response, NextFunction } from 'express';
import jwt, { JwtPayload } from "jsonwebtoken"
import { secretKey } from '../utils/jwt';

export function authMiddleware( req: Request, res: Response, next: NextFunction){
    const authHeader = req.headers.authorization

    //Aqui pego o token na requisição e verifico se ele existe
    if (!authHeader){
        return res.status(401).json({ message: "Token não foi gerado!"})
    }
    
    //Aqui eu somente formato o token para tirar o Bearer
    const token = authHeader?.replace("Bearer ", "")

    try {
        const decoded = jwt.verify(token, secretKey!) as JwtPayload

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