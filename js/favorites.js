import { getFavorites, saveFavorites, isFavorite, addFavorite, removeFavorite, getPlaceholderImage, createGameCard } from './api.js';

function loadFavoritesList() {
  const listEl = document.getElementById('favorites-list');
  if (!listEl) return;

  const favs = getFavorites();
  if (favs.length === 0) {
    listEl.innerHTML = '<p class="empty-message">Brak ulubionych gier.</p>';
    return;
  }

  const grid = document.createElement('div');
  grid.className = 'game-grid';
  favs.forEach(game => {
    const card = createGameCard(game);
    grid.appendChild(card);
  });
  listEl.innerHTML = '';
  listEl.appendChild(grid);
}

document.addEventListener('DOMContentLoaded', loadFavoritesList);