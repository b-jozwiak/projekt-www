const API = 'http://localhost:3001';
const FAVORITES_KEY = 'favorite_games';

function getFavorites() {
  const data = localStorage.getItem(FAVORITES_KEY);
  return data ? JSON.parse(data) : [];
}

function saveFavorites(favs) {
  localStorage.setItem(FAVORITES_KEY, JSON.stringify(favs));
}

function isFavorite(id) {
  return getFavorites().some(f => f.id === id);
}

function getPlaceholderImage(name) {
  const colors = ['3b82f6', '8b5cf6', '10b981', 'f59e0b', 'ef4444', 'ec4899'];
  const color = colors[name.length % colors.length];
  const initial = name.charAt(0).toUpperCase();
  return `https://placehold.co/400x250/${color}/ffffff?text=${initial}`;
}

async function loadGameDetails() {
  const params = new URLSearchParams(window.location.search);
  const id = params.get('id');
  const container = document.getElementById('game-details');
  if (!container || !id) return;

  try {
    const res = await fetch(`${API}/games/${id}`);
    if (!res.ok) throw new Error('Gra nie znaleziona');
    const game = await res.json();

    document.getElementById('game-title').textContent = game.name;
    document.getElementById('game-genre').textContent = game.genre;
    document.getElementById('game-platform').textContent = game.platform;
    document.getElementById('game-release').textContent = game.release;
    document.getElementById('game-rating').textContent = game.rating;
    document.getElementById('game-description').textContent = game.description;
    
    const img = document.getElementById('game-image');
    if (img) {
      img.src = getPlaceholderImage(game.name);
      img.alt = game.name;
    }

    const btn = document.getElementById('add-to-favorites');
    if (btn) {
      updateFavoriteButton(btn, game);
      btn.addEventListener('click', () => toggleFavorite(btn, game));
    }
  } catch (err) {
    container.innerHTML = '<p class="empty-message">Błąd ładowania szczegółów.</p>';
  }
}

function updateFavoriteButton(btn, game) {
  const isFav = isFavorite(game.id);
  btn.textContent = isFav ? 'Usuń z ulubionych' : 'Dodaj do ulubionych';
  btn.dataset.favorite = isFav;
}

function toggleFavorite(btn, game) {
  const favs = getFavorites();
  const isFav = btn.dataset.favorite === 'true';

  if (isFav) {
    const updated = favs.filter(f => f.id !== game.id);
    saveFavorites(updated);
  } else {
    favs.push(game);
    saveFavorites(favs);
  }
  updateFavoriteButton(btn, game);
}

document.addEventListener('DOMContentLoaded', loadGameDetails);