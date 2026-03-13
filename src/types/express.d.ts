/*O Express não tem a propriedade user no Request por padrão.
Então o TypeScript reclama.*/

declare namespace Express {
  export interface Request {
    user?: {
      id: string
      companyId?: string
    }
    product?: Product
  }
}