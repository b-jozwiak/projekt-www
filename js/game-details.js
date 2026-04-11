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
  const color = colors[(name?.length || 0) % colors.length];
  const initial = name ? name.charAt(0).toUpperCase() : '?';
  return `https://placehold.co/400x250/${color}/ffffff?text=${initial}`;
}

function showLoading() {
  const heading = document.getElementById('game-title');
  const img = document.getElementById('game-image');
  if (heading) heading.textContent = 'Ładowanie...';
  if (img) img.style.display = 'none';
}

async function loadGameDetails() {
  const params = new URLSearchParams(window.location.search);
  const id = params.get('id');
  const container = document.getElementById('game-details');
  
  if (!container) return;
  
  if (!id) {
    container.innerHTML = '<p class="empty-message">Nie wybrano gry. <a href="index.html">Wróć do listy</a></p>';
    return;
  }

  showLoading();

  try {
    const res = await fetch(`${API}/games/${id}`);
    if (!res.ok) throw new Error('Gra nie znaleziona');
    const game = await res.json();

    const heading = document.getElementById('game-title');
    if (heading) heading.textContent = game.name;
    
    const genre = document.getElementById('game-genre');
    if (genre) genre.textContent = game.genre;
    
    const platform = document.getElementById('game-platform');
    if (platform) platform.textContent = game.platform;
    
    const release = document.getElementById('game-release');
    if (release) release.textContent = game.release;
    
    const rating = document.getElementById('game-rating');
    if (rating) rating.textContent = game.rating;
    
    const desc = document.getElementById('game-description');
    if (desc) desc.textContent = game.description;
    
    const img = document.getElementById('game-image');
    if (img) {
      img.src = getPlaceholderImage(game.name);
      img.alt = game.name;
      img.style.display = 'block';
    }

    const btn = document.getElementById('add-to-favorites');
    if (btn) {
      updateFavoriteButton(btn, game);
      btn.addEventListener('click', () => toggleFavorite(btn, game));
    }
  } catch (err) {
    console.error(err);
    const heading = document.getElementById('game-title');
    if (heading) heading.textContent = 'Błąd ładowania';
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