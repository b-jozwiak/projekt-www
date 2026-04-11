const API = 'http://localhost:3001';

function getPlaceholderImage(name) {
  const colors = ['3b82f6', '8b5cf6', '10b981', 'f59e0b', 'ef4444', 'ec4899'];
  const color = colors[(name?.length || 0) % colors.length];
  const initial = name ? name.charAt(0).toUpperCase() : '?';
  return `https://placehold.co/300x200/${color}/ffffff?text=${initial}`;
}

async function searchGames() {
  const form = document.querySelector('form');
  const listEl = document.getElementById('search-results');
  if (!form || !listEl) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const query = document.getElementById('search-query').value;
    const genre = document.getElementById('filter-genre').value;

    listEl.innerHTML = '<div class="loading-spinner"></div>';

    const params = new URLSearchParams();
    if (query) params.append('name_like', query);
    if (genre) params.append('genre', genre);

    try {
      const url = params.toString() ? `${API}/games?${params}` : `${API}/games`;
      const res = await fetch(url);
      const games = await res.json();

      if (!games || games.length === 0) {
        listEl.innerHTML = '<p class="empty-message">Brak wyników.</p>';
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
      listEl.innerHTML = '<p class="empty-message">Błąd wyszukiwania.</p>';
    }
  });
}

document.addEventListener('DOMContentLoaded', searchGames);