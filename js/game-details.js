const API = 'http://localhost:3001';

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
    if (img) img.src = game.image;
  } catch (err) {
    container.innerHTML = '<p class="empty-message">Błąd ładowania szczegółów.</p>';
  }
}

document.addEventListener('DOMContentLoaded', loadGameDetails);