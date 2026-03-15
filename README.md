# Knex Case Backend

Backend básico para case técnico — Node + TypeScript + Express + Prisma (MongoDB)

## Requisitos
- Node.js 18+ e npm/yarn
- MongoDB acessível (URI via env)

## Variáveis de ambiente
Crie um arquivo `.env` com as seguintes variáveis (exemplo em `.env.example`):

- `DATABASE_URL` — string de conexão MongoDB
- `JWT_SECRET` — segredo para assinar tokens JWT
- `PORT` — porta opcional (padrão 3000)

## Instalação

Instale dependências:

```bash
npm install
```

## Scripts úteis

- `npm run dev` — roda o servidor em modo desenvolvimento (tsx watch)
- `npm run build` — transpila TypeScript para `dist/` usando `tsc`
- `npm run start` — roda a build compilada (`node dist/server.js`)
- `npm run prisma:generate` — gera o client do Prisma
- `npm run migrate` — aplica migrations (Prisma)
- `npm run studio` — abre o Prisma Studio

## Uso rápido

1. Criar `.env` com `DATABASE_URL` e `JWT_SECRET`.
2. Rodar `npm install`.
3. (Opcional) `npm run prisma:generate` e `npm run migrate`.
4. `npm run dev` para desenvolvimento.

## Endpoints principais
- `POST /auth/register` — cria usuário
- `POST /auth/login` — obtém token JWT
- `GET/POST /companies` — rotas de empresas
- `GET/POST /products` — rotas de produtos
- `GET/POST /orders` — rotas de pedidos

Consulte a pasta `src/routes` e `src/controllers` para detalhes.