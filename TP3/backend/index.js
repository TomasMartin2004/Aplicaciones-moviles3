import cors from 'cors';
import express from 'express';
import entryRoutes from './routes/entryRoutes.js';
import quoteRoutes from './routes/quoteRoutes.js';

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json({ limit: '5mb' }));

app.use('/entries', entryRoutes);
app.use('/quote', quoteRoutes);

app.listen(PORT, () => {
  console.log(`BACKEND: Servidor simplificado escuchando en el puerto ${PORT}`);
});