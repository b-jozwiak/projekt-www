const API = 'http://localhost:3001';

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
  } catch (err) {
    container.innerHTML = '<p class="empty-message">Błąd ładowania szczegółów.</p>';
  }
}

document.addEventListener('DOMContentLoaded', loadGameDetails);