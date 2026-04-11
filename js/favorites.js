const API = 'http://localhost:3001';
const FAVORITES_KEY = 'favorite_games';

function getFavorites() {
  const data = localStorage.getItem(FAVORITES_KEY);
  return data ? JSON.parse(data) : [];
}

function saveFavorites(favs) {
  localStorage.setItem(FAVORITES_KEY, JSON.stringify(favs));
}

function addFavorite(game) {
  const favs = getFavorites();
  if (!favs.find(f => f.id === game.id)) {
    favs.push(game);
    saveFavorites(favs);
  }
}

function removeFavorite(id) {
  const favs = getFavorites().filter(f => f.id !== id);
  saveFavorites(favs);
}

function isFavorite(id) {
  return getFavorites().some(f => f.id === id);
}

function getPlaceholderImage(name) {
  const colors = ['3b82f6', '8b5cf6', '10b981', 'f59e0b', 'ef4444', 'ec4899'];
  const color = colors[(name?.length || 0) % colors.length];
  const initial = name ? name.charAt(0).toUpperCase() : '?';
  return `https://placehold.co/300x200/${color}/ffffff?text=${initial}`;
}

function loadFavoritesList() {
  const listEl = document.getElementById('favorites-list');
  if (!listEl) return;

  const favs = getFavorites();
  if (favs.length === 0) {
    listEl.innerHTML = '<p class="empty-message">Brak ulubionych gier.</p>';
    return;
  }

  listEl.innerHTML = '<div class="game-grid">' + favs.map(game => `
    <a href="game-details.html?id=${game.id}" class="game-item">
      <img class="game-item__image" src="${getPlaceholderImage(game.name)}" alt="${game.name || 'Gra'}">
      <div class="game-item__content">
        <h2>${game.name || 'Gra'}</h2>
        <p class="meta">${game.genre || ''} • ${game.platform || ''}</p>
        <p>Ocena: ${game.rating || '-'}</p>
        <button class="remove-fav" data-id="${game.id}">Usuń</button>
      </div>
    </a>
  `).join('') + '</div>';

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