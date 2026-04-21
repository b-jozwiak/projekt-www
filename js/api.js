const API = 'http://localhost:3001';
const FAVORITES_KEY = 'favorite_games';

export function getPlaceholderImage(name) {
  const colors = ['3b82f6', '8b5cf6', '10b981', 'f59e0b', 'ef4444', 'ec4899'];
  const color = colors[(name?.length || 0) % colors.length];
  const initial = name ? name.charAt(0).toUpperCase() : '?';
  return `https://placehold.co/300x200/${color}/ffffff?text=${initial}`;
}

export function getFavorites() {
  const data = localStorage.getItem(FAVORITES_KEY);
  return data ? JSON.parse(data) : [];
}

export function saveFavorites(favs) {
  localStorage.setItem(FAVORITES_KEY, JSON.stringify(favs));
}

export function isFavorite(id) {
  const favs = getFavorites();
  return favs.some(g => g.id === id);
}

export function addFavorite(game) {
  const favs = getFavorites();
  if (!isFavorite(game.id)) {
    favs.push(game);
    saveFavorites(favs);
    return true;
  }
  return false;
}

export function removeFavorite(id) {
  let favs = getFavorites();
  favs = favs.filter(g => g.id !== id);
  saveFavorites(favs);
}

export function createGameCard(game) {
  const imageUrl = game.image || getPlaceholderImage(game.title);
  const isFav = isFavorite(game.id);
  return `
    <article class="game-card" data-id="${game.id}">
      <a href="game-details.html?id=${game.id}">
        <img src="${imageUrl}" alt="${game.title}" />
        <h3>${game.title}</h3>
        <p><strong>Gatunek:</strong> ${game.genre}</p>
        <p><strong>Platforma:</strong> ${game.platform}</p>
        <p><strong>Ocena:</strong> ${game.rating}</p>
      </a>
      <button class="fav-btn ${isFav ? 'is-favorite' : ''}" data-id="${game.id}">
        ${isFav ? 'Usuń z ulubionych' : 'Dodaj do ulubionych'}
      </button>
    </article>
  `;
}

export function showLoading(containerId) {
  const container = document.getElementById(containerId);
  if (container) {
    container.innerHTML = '<p class="loading">Ładowanie...</p>';
  }
}

export function showError(containerId, message = 'Wystąpił błąd.') {
  const container = document.getElementById(containerId);
  if (container) {
    container.innerHTML = `<p class="error">${message}</p>`;
  }
}

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