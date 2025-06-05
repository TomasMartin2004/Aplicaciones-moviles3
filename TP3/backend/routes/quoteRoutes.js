import express from 'express';
import fetch from 'node-fetch';

const router = express.Router();
const quoteAPI_URL = 'https://dummyjson.com/quotes/random';

router.get('/', async (req, res) => {
  try {
    const response = await fetch(quoteAPI_URL);
    if (!response.ok) {
      let errorBody = `Error de ${quoteAPI_URL}: ${response.status} ${response.statusText}`;
      try { errorBody = await response.text(); } catch(e) {}
      throw new Error(errorBody);
    }
    const data = await response.json();
    if (data && data.quote && data.author) {
      res.json(data);
    } else {
      throw new Error(`Respuesta inesperada de ${quoteAPI_URL}`);
    }
  } catch (error) {
    console.error('ROUTES /quote: Error al obtener frase:', error.message);
    res.status(500).json({ error: `No se pudo obtener la frase. Detalle: ${error.message}` });
  }
});

export default router;