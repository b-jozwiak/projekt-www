export const API = 'http://localhost:3001';
const FAVORITES_KEY = 'favorite_games';

const FAV_FILL_COL = '#ef4444';
let _platformsDocInit = false;

export function getPlaceholderImage(name) {
  const colors = ['3b82f6', '8b5cf6', '10b981', 'f59e0b', 'ef4444', 'ec4899'];
  const color = colors[(name?.length || 0) % colors.length];
  const initial = name ? name.charAt(0).toUpperCase() : '?';
  return `https://placehold.co/300x200/${color}/ffffff?text=${initial}`;
}

export function getFavorites() {
  const data = localStorage.getItem(FAVORITES_KEY);
  if (!data) return [];
  let parsed;
  try { parsed = JSON.parse(data); } catch { return []; }
  if (parsed.length > 0 && typeof parsed[0] === 'object') {
    const ids = parsed.map(g => Number(g.id)).filter(n => !isNaN(n) && n > 0);
    saveFavorites(ids);
    return ids;
  }
  const valid = parsed.filter(n => typeof n === 'number' && !isNaN(n) && n > 0);
  if (valid.length !== parsed.length) saveFavorites(valid);
  return valid;
}

export function saveFavorites(favs) {
  localStorage.setItem(FAVORITES_KEY, JSON.stringify(favs));
}

export function isFavorite(id) {
  const favs = getFavorites();
  return favs.includes(id);
}

export function addFavorite(id) {
  const favs = getFavorites();
  if (!isFavorite(id)) {
    favs.push(id);
    saveFavorites(favs);
    document.dispatchEvent(new CustomEvent('favorites-changed'));
    return true;
  }
  return false;
}

export function removeFavorite(id, silent = false) {
  let favs = getFavorites();
  favs = favs.filter(favId => favId !== id);
  saveFavorites(favs);
  if (!silent) {
    document.dispatchEvent(new CustomEvent('favorites-changed'));
  }
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
  ratingBadge.textContent = game.rating.toFixed(1) || '-';
  imageWrapper.appendChild(ratingBadge);

  const favBtnOverlay = document.createElement('button');
  favBtnOverlay.className = 'game-item__fav-btn' + (isFav ? ' is-favorite' : '');
  favBtnOverlay.dataset.id = game.id;
  favBtnOverlay.title = isFav ? 'Usuń z ulubionych' : 'Dodaj do ulubionych';
  favBtnOverlay.style.width = '2em';
  favBtnOverlay.style.height = '2em';

  const heartSvg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  heartSvg.setAttribute('viewBox', '0 0 24 24');
  heartSvg.setAttribute('width', '16');
  heartSvg.setAttribute('height', '16');
  heartSvg.setAttribute('stroke', 'white');
  heartSvg.setAttribute('stroke-width', '2');
  heartSvg.setAttribute('stroke-linejoin', 'round');
  heartSvg.setAttribute('fill', isFav ? FAV_FILL_COL : 'none');

  const heartPath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
  heartPath.setAttribute('d', 'M12 21C12 21 3 13.5 3 8a5 5 0 0 1 9-3 5 5 0 0 1 9 3c0 5.5-9 13-9 13z');
  heartSvg.appendChild(heartPath);
  favBtnOverlay.appendChild(heartSvg);
  favBtnOverlay.addEventListener("click", (ev) => {
    ev.preventDefault();
    ev.stopPropagation();

    if (isFavorite(game.id)) {
      removeFavorite(game.id);
      favBtnOverlay.classList.remove('is-favorite');
      favBtnOverlay.title = 'Dodaj do ulubionych';
      heartSvg.setAttribute('fill', 'none');
      showToast('Usunięto z ulubionych');
    } else {
      addFavorite(game.id);
      favBtnOverlay.classList.add('is-favorite');
      favBtnOverlay.title = 'Usuń z ulubionych';
      heartSvg.setAttribute('fill', FAV_FILL_COL);
      showToast('Dodano do ulubionych');
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

  if (game.platforms && game.platforms.length > 0) {
    const platformDiv = document.createElement('div');
    platformDiv.className = 'game-item__platforms';

    const MAX_SHOWN = 2;
    const list = game.platforms;
    const hiddenBadges = [];

    list.forEach((p, i) => {
      const badge = document.createElement('span');
      badge.className = 'game-item__platform-badge';
      if (i >= MAX_SHOWN) {
        badge.classList.add('game-item__platform-badge--hidden');
        hiddenBadges.push(badge);
      }
      badge.textContent = p;
      platformDiv.appendChild(badge);
    });

    if (list.length > MAX_SHOWN) {
      const extra = document.createElement('span');
      extra.className = 'game-item__platform-badge game-item__platform-badge--extra';
      extra.textContent = `+${list.length - MAX_SHOWN}`;
      platformDiv.appendChild(extra);

      platformDiv.addEventListener('click', (e) => {
        const wasExpanded = platformDiv.classList.contains('game-item__platforms--expanded');

        if (!wasExpanded) {
          e.preventDefault();
          e.stopPropagation();
        }
        platformDiv.classList.toggle('game-item__platforms--expanded');
      });
    }

    if (!_platformsDocInit) {
      _platformsDocInit = true;
      document.addEventListener('click', (e) => {
        document.querySelectorAll('.game-item__platforms--expanded').forEach(el => {
          if (!el.contains(e.target)) {
            el.classList.remove('game-item__platforms--expanded');
          }
        });
      });
    }

    imageWrapper.appendChild(platformDiv);
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

let toastTimer = null;

export function showToast(message) {
  const existing = document.querySelector('.toast-notification');
  if (existing) {
    existing.remove();
    if (toastTimer) clearTimeout(toastTimer);
  }
  const el = document.createElement('div');
  el.className = 'toast-notification';
  el.textContent = message;
  document.body.appendChild(el);
  requestAnimationFrame(() => el.classList.add('toast-visible'));
  toastTimer = setTimeout(() => {
    el.classList.remove('toast-visible');
    setTimeout(() => el.remove(), 300);
    toastTimer = null;
  }, 2500);
}

export async function getGames() {
  const res = await fetch(`${API}/games`);
  if (!res.ok) throw new Error('Błąd pobierania gier');
  return res.json();
}

export async function getGameById(id) {
  if (id == null || isNaN(id)) throw new Error('Nieprawid�owe ID gry');
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