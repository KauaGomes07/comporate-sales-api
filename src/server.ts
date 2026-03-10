import express from 'express';
import { authRoutes } from './routes/authRoutes';

const app = express();

app.use(express.json());

app.use('/', authRoutes)

app.listen(3000, () => console.log('Servidor rodando na porta 3000'));