const API = 'http://localhost:3001';

function getPlaceholderImage(name) {
  const colors = ['3b82f6', '8b5cf6', '10b981', 'f59e0b', 'ef4444', 'ec4899'];
  const color = colors[(name?.length || 0) % colors.length];
  const initial = name ? name.charAt(0).toUpperCase() : '?';
  return `https://placehold.co/300x200/${color}/ffffff?text=${initial}`;
}

async function loadGames() {
  const listEl = document.getElementById('game-list');
  if (!listEl) return;

  listEl.innerHTML = '<div class="loading-spinner"></div>';

  try {
    const res = await fetch(`${API}/games`);
    if (!res.ok) throw new Error('Błąd pobierania');
    const games = await res.json();

    if (!games || games.length === 0) {
      listEl.innerHTML = '<p class="empty-message">Brak gier.</p>';
      return;
    }

    const images = games.map(game => getPlaceholderImage(game.name));

    listEl.innerHTML = '<div class="game-grid">' + games.map((game, i) => `
      <a href="game-details.html?id=${game.id}" class="game-item">
        <img class="game-item__image" src="${images[i]}" alt="${game.name || 'Gra'}">
        <div class="game-item__content">
          <h2>${game.name || 'Gra'}</h2>
          <p class="meta">${game.genre || ''} • ${game.platform || ''}</p>
          <p>Ocena: ${game.rating || '-'}</p>
        </div>
      </a>
    `).join('') + '</div>';
  } catch (err) {
    console.error(err);
    listEl.innerHTML = '<p class="empty-message">Błąd ładowania gier. Upewnij się, że json-server działa na porcie 3001.</p>';
  }
}

document.addEventListener('DOMContentLoaded', loadGames);