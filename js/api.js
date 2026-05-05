export const API = 'http://localhost:3001';
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
  const imageUrl = getPlaceholderImage(game.name || game.title || 'Gra');
  const isFav = isFavorite(game.id);

  const article = document.createElement('article');
  article.className = 'game-item';
  article.dataset.id = game.id;

  const link = document.createElement('a');
  link.href = `game-details.html?id=${game.id}`;

  const imageWrapper = document.createElement('div');
  imageWrapper.className = 'game-item__image-wrapper';

  const img = document.createElement('img');
  img.src = imageUrl;
  img.alt = game.name || game.title || 'Gra';
  img.className = 'game-item__image';
  imageWrapper.appendChild(img);

  const ratingBadge = document.createElement('span');
  ratingBadge.className = 'game-item__rating-badge';
  ratingBadge.textContent = game.rating || '-';
  imageWrapper.appendChild(ratingBadge);

  const favBtnOverlay = document.createElement('button');
  favBtnOverlay.className = 'game-item__fav-btn' + (isFav ? ' is-favorite' : '');
  favBtnOverlay.dataset.id = game.id;
  favBtnOverlay.textContent = isFav ? '♥' : '♡';
  favBtnOverlay.title = isFav ? 'Usuń z ulubionych' : 'Dodaj do ulubionych';
  favBtnOverlay.style.width = '2em';
  favBtnOverlay.style.height = '2em';
  favBtnOverlay.addEventListener("click", (ev) => {
    ev.preventDefault();
    ev.stopPropagation();

    if (isFavorite(game.id)) {
      removeFavorite(game.id);
      favBtnOverlay.textContent = '♡';
      favBtnOverlay.classList.remove('is-favorite');
      favBtnOverlay.title = 'Dodaj do ulubionych';
    } else {
      addFavorite(game);
      favBtnOverlay.textContent = '♥';
      favBtnOverlay.classList.add('is-favorite');
      favBtnOverlay.title = 'Usuń z ulubionych';
    }
  });
  imageWrapper.appendChild(favBtnOverlay);

  link.appendChild(imageWrapper);

  const content = document.createElement('div');
  content.className = 'game-item__content';

  const h3 = document.createElement('h3');
  h3.className = 'game-item__title';
  h3.textContent = game.name || game.title || 'Gra';
  content.appendChild(h3);

  if (game.platform) {
    const platformP = document.createElement('p');
    platformP.className = 'game-item__platform';
    platformP.textContent = game.platform;
    content.appendChild(platformP);
  }

  const genreP = document.createElement('p');
  genreP.className = 'game-item__genre';
  genreP.textContent = game.genre || '';
  content.appendChild(genreP);

  link.appendChild(content);
  article.appendChild(link);

  return article;
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
