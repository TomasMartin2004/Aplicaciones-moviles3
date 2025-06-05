import express from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { v4 as uuidv4 } from 'uuid';

const __filename = fileURLToPath(import.meta.url);
const __dirname_routes = path.dirname(__filename); 

const router = express.Router();

const DATA_DIR = path.join(__dirname_routes, '../data'); 
const DB_FILE = path.join(DATA_DIR, 'entries.json');

function ensureDataFileExists() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
  if (!fs.existsSync(DB_FILE)) {
    fs.writeFileSync(DB_FILE, JSON.stringify([]));
  }
}

function readEntriesFromFile() {
  ensureDataFileExists();
  try {
    const fileContent = fs.readFileSync(DB_FILE, 'utf8');
    return JSON.parse(fileContent);
  } catch (error) {
    console.error('ROUTES/entries: Error al leer entries.json:', error);
    return [];
  }
}

function writeEntriesToFile(entries) {
  ensureDataFileExists();
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(entries.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)), null, 2));
  } catch (error) {
    console.error('ROUTES/entries: Error al escribir en entries.json:', error);
  }
}

router.get('/', (req, res) => {
  const userId = req.query.userId;
  if (!userId) {
    return res.status(400).json({ error: 'userId es requerido' });
  }
  const allEntries = readEntriesFromFile();
  const userEntries = allEntries.filter(entry => entry.userId === userId);
  res.json(userEntries);
});

router.post('/', (req, res) => {
  const { userId, mood, note, image } = req.body;
  if (!userId) {
    return res.status(400).json({ error: 'userId es requerido para crear una entrada.' });
  }
  const entries = readEntriesFromFile();
  const newEntry = {
    id: uuidv4(),
    userId,
    mood,
    note,
    image,
    createdAt: new Date().toISOString()
  };
  entries.push(newEntry);
  writeEntriesToFile(entries);
  res.status(201).json(newEntry);
});

router.put('/:entryId', (req, res) => {
  const { entryId } = req.params;
  const { userId, mood, note, image } = req.body;
  let entries = readEntriesFromFile();
  const entryIndex = entries.findIndex(e => e.id === entryId);

  if (entryIndex === -1) {
    return res.status(404).json({ error: 'Entrada no encontrada' });
  }
  if (entries[entryIndex].userId !== userId) {
    return res.status(403).json({ error: 'No autorizado para modificar esta entrada.' });
  }
  entries[entryIndex] = {
    ...entries[entryIndex],
    mood: typeof mood !== 'undefined' ? mood : entries[entryIndex].mood,
    note: typeof note !== 'undefined' ? note : entries[entryIndex].note,
    image: typeof image !== 'undefined' ? image : entries[entryIndex].image,
    updatedAt: new Date().toISOString()
  };
  writeEntriesToFile(entries);
  res.json(entries[entryIndex]);
});

router.delete('/:entryId', (req, res) => {
  const { entryId } = req.params;
  const userIdRequestingDelete = req.query.userId;
  let entries = readEntriesFromFile();
  const entryIndex = entries.findIndex(e => e.id === entryId);

  if (entryIndex === -1) {
    return res.status(404).json({ error: 'Entrada no encontrada para eliminar.' });
  }
  if (!userIdRequestingDelete || entries[entryIndex].userId !== userIdRequestingDelete) {
    return res.status(403).json({ error: 'No autorizado para eliminar esta entrada.' });
  }
  
  const filteredEntries = entries.filter(e => e.id !== entryId);
  if (entries.length === filteredEntries.length && entries.length !== 0) {
     return res.status(500).json({ error: 'Error interno al intentar filtrar la entrada.' });
  }
  writeEntriesToFile(filteredEntries);
  res.status(204).send();
});

export default router;