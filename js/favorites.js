import { getFavorites, saveFavorites, isFavorite, addFavorite, removeFavorite, getPlaceholderImage, createGameCard } from './api.js';

function loadFavoritesList() {
  const listEl = document.getElementById('favorites-list');
  if (!listEl) return;

  const favs = getFavorites();
  if (favs.length === 0) {
    listEl.innerHTML = '<p class="empty-message">Brak ulubionych gier.</p>';
    return;
  }

    listEl.innerHTML = '<div class="game-grid">' + favs.map(game => createGameCard(game)).join('') + '</div>';

  document.querySelectorAll('.remove-fav').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      removeFavorite(parseInt(e.target.dataset.id));
      loadFavoritesList();
    });
  });
}

document.addEventListener('DOMContentLoaded', loadFavoritesList);