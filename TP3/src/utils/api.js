import Constants from 'expo-constants';

const API_URL = Constants.expoConfig?.extra?.API_URL || 'http://localhost:4000';

export async function getEntries(userId) {
  if (!userId) {
    console.warn('API: getEntries llamado sin userId. Devolviendo array vacío.');
    return [];
  }
  const res = await fetch(`${API_URL}/entries?userId=${userId}`);
  if (!res.ok) {
    let errorBody = "Error response from server.";
    try { errorBody = await res.text(); } catch(e) {
      console.error('API: Imposible parsear cuerpo de error en GET /entries', e);
    }
    console.error('API: Error GET /entries', res.status, errorBody);
    throw new Error('Error al obtener entradas');
  }
  return res.json();
}

export async function createEntry(entryData) {
  const res = await fetch(`${API_URL}/entries`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(entryData),
  });
  if (!res.ok) {
    let errorBody = "Error response from server.";
    try { errorBody = await res.text(); } catch(e) {
      console.error('API: Imposible parsear cuerpo de error en POST /entries', e);
    }
    console.error('API: Error POST /entries', res.status, errorBody);
    throw new Error('Error al crear entrada');
  }
  return res.json();
}

export async function updateEntry(id, entryData) {
  const res = await fetch(`${API_URL}/entries/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(entryData),
  });
  if (!res.ok) {
    let errorBody = "Error response from server.";
    try { errorBody = await res.text(); } catch(e) {
      console.error('API: Imposible parsear cuerpo de error en PUT /entries/:id', e);
    }
    console.error('API: Error PUT /entries/:id', res.status, errorBody);
    throw new Error('Error al actualizar entrada');
  }
  return res.json();
}

export async function deleteEntry(id, userId) {
  if (!userId) {
    console.warn('API: deleteEntry llamado sin userId. No se puede eliminar.');
    throw new Error('userId es requerido para eliminar una entrada.');
  }
  try {
    const res = await fetch(`${API_URL}/entries/${id}?userId=${userId}`, {
      method: 'DELETE',
    });
    if (!res.ok) {
      const errorText = await res.text();
      console.error('API FRONTEND: Error en la respuesta del servidor al eliminar:', errorText, 'Status:', res.status);
      throw new Error(`Error del servidor al eliminar (status: ${res.status}) - ${errorText}`);
    }
    return true;
  } catch (error) {
    console.error('API FRONTEND: Catch - Error en fetch o procesamiento para deleteEntry. ID:', id, 'Error:', error.message ? error.message : error);
    throw error;
  }
}