import { getGameById, isFavorite, addFavorite, removeFavorite, getPlaceholderImage, showToast } from './api.js';

let currentGame = null;

function setupBackLink() {
  const backLink = document.getElementById('back-link');
  if (!backLink) return;

  const ref = document.referrer;
  if (ref && ref.includes('favorites.html')) {
    backLink.href = 'favorites.html';
  } else if (ref && ref.includes('search.html')) {
    const savedQuery = sessionStorage.getItem('search-query');
    const savedGenre = sessionStorage.getItem('filter-genre');
    const savedPlatform = sessionStorage.getItem('filter-platform');

    let href = 'search.html';
    const params = [];
    if (savedQuery) params.push(`q=${encodeURIComponent(savedQuery)}`);
    if (savedGenre) params.push(`genre=${encodeURIComponent(savedGenre)}`);
    if (savedPlatform) params.push(`platform=${encodeURIComponent(savedPlatform)}`);
    if (params.length > 0) href += '?' + params.join('&');

    backLink.href = href;
  } else {
    backLink.href = 'index.html';
  }
}

function setMessage(type, text) {
  const msg = document.getElementById('game-details-message');
  const content = document.getElementById('game-details-content');
  if (!msg) return;
  msg.textContent = text;
  msg.className = type;
  msg.style.display = '';
  if (content) content.style.display = 'none';
}

function showGameDetails(game) {
  const msg = document.getElementById('game-details-message');
  const content = document.getElementById('game-details-content');
  if (!content) return;

  if (msg) msg.style.display = 'none';
  content.style.display = '';

  const titleEl = document.getElementById('game-title');
  if (titleEl) titleEl.textContent = game.name || 'Nieznana gra';

  const imgEl = document.getElementById('game-image');
  if (imgEl) {
    imgEl.src = getPlaceholderImage(game.name);
    imgEl.alt = game.name || 'Gra';
  }

  const genreEl = document.getElementById('game-genre');
  if (genreEl) genreEl.textContent = game.genre || '-';

  const platformsEl = document.getElementById('game-platforms');
  if (platformsEl) {
    platformsEl.textContent = '';
    if (game.platforms && game.platforms.length > 0) {
      game.platforms.forEach(p => {
        const badge = document.createElement('span');
        badge.className = 'game-detail__platform-badge';
        badge.textContent = p;
        platformsEl.appendChild(badge);
      });
    } else {
      platformsEl.textContent = '-';
    }
  }

  const releaseEl = document.getElementById('game-release');
  if (releaseEl) releaseEl.textContent = game.release || '-';

  const ratingEl = document.getElementById('game-rating');
  if (ratingEl) ratingEl.textContent = game.rating != null ? String(game.rating) : '-';

  const descEl = document.getElementById('game-description');
  if (descEl) descEl.textContent = game.description || 'Brak opisu.';

  const btn = document.getElementById('add-to-favorites');
  if (btn) {
    btn.textContent = isFavorite(game.id) ? 'Usuń z ulubionych' : 'Dodaj do ulubionych';
  }
}

async function loadGameDetails() {
  const params = new URLSearchParams(window.location.search);
  const id = params.get('id');

  if (!id) {
    setMessage('empty-message', 'Nie wybrano gry.');
    return;
  }

  setMessage('loading', 'Ładowanie...');

  try {
    const game = await getGameById(id);
    currentGame = game;
    showGameDetails(game);
  } catch (err) {
    console.error(err);
    setMessage('error', 'Błąd ładowania');
  }
}

function updateFavoriteButton(btn) {
  if (!currentGame) return;
  const isFav = isFavorite(currentGame.id);
  btn.textContent = isFav ? 'Usuń z ulubionych' : 'Dodaj do ulubionych';
  btn.dataset.favorite = String(isFav);
}

function toggleFavorite(btn) {
  if (!currentGame) return;
  if (isFavorite(currentGame.id)) {
    removeFavorite(currentGame.id);
    showToast('Usunięto z ulubionych');
  } else {
    addFavorite(currentGame.id);
    showToast('Dodano do ulubionych');
  }
  updateFavoriteButton(btn);
}

document.addEventListener('DOMContentLoaded', () => {
  setupBackLink();
  loadGameDetails();

  const btn = document.getElementById('add-to-favorites');
  if (btn) {
    btn.addEventListener('click', () => toggleFavorite(btn));
  }
});
