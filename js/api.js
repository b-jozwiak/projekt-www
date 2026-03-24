const API = 'http://localhost:3001';

export async function getGames() {
  const res = await fetch(`${API}/games`);
  if (!res.ok) throw new Error('Błąd pobierania gier');
  return res.json();
}

export async function getGameById(id) {
  const res = await fetch(`${API}/games/${id}`);
  if (!res.ok) throw new Error('Gra nie znaleziona');
  return res.json();
}

export async function getGamesWithFilters(filters = {}) {
  const params = new URLSearchParams();
  if (filters.genre) params.append('genre', filters.genre);
  if (filters.platform) params.append('platform', filters.platform);
  if (filters.q) params.append('name_like', filters.q);

  const url = params.toString() ? `${API}/games?${params}` : `${API}/games`;
  const res = await fetch(url);
  if (!res.ok) throw new Error('Błąd filtrowania');
  return res.json();
}