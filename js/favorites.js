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

async function toggleFavorite(game) {
  if (isFavorite(game.id)) {
    removeFavorite(game.id);
  } else {
    const completeGame = await fetch(`${API}/games/${game.id}`).then(r => r.json());
    addFavorite(completeGame);
  }
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
    <article class="game-item">
      <img class="game-item__image" src="${getPlaceholderImage(game.name)}" alt="${game.name}">
      <div class="game-item__content">
        <h2>${game.name}</h2>
        <p class="meta">${game.genre} • ${game.platform}</p>
        <p>Ocena: ${game.rating}</p>
        <button class="remove-fav" data-id="${game.id}">Usuń</button>
        <a href="game-details.html?id=${game.id}">Szczegóły</a>
      </div>
    </article>
  `).join('') + '</div>';

  document.querySelectorAll('.remove-fav').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      removeFavorite(parseInt(e.target.dataset.id));
      loadFavoritesList();
    });
  });
}

function getPlaceholderImage(name) {
  const colors = ['3b82f6', '8b5cf6', '10b981', 'f59e0b', 'ef4444', 'ec4899'];
  const color = colors[name.length % colors.length];
  const initial = name.charAt(0).toUpperCase();
  return `https://placehold.co/300x200/${color}/ffffff?text=${initial}`;
}

document.addEventListener('DOMContentLoaded', loadFavoritesList);