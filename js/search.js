const API = 'http://localhost:3001';

async function searchGames() {
  const form = document.querySelector('form');
  const listEl = document.getElementById('search-results');
  if (!form || !listEl) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const query = document.getElementById('search-query').value;
    const genre = document.getElementById('filter-genre').value;

    const params = new URLSearchParams();
    if (query) params.append('name_like', query);
    if (genre) params.append('genre', genre);

    try {
      const url = params.toString() ? `${API}/games?${params}` : `${API}/games`;
      const res = await fetch(url);
      const games = await res.json();

      if (games.length === 0) {
        listEl.innerHTML = '<p class="empty-message">Brak wyników.</p>';
        return;
      }

      listEl.innerHTML = games.map(game => `
        <article class="game-item">
          <h2>${game.name}</h2>
          <p class="meta">${game.genre} • ${game.platform}</p>
          <p>Ocena: ${game.rating}</p>
          <a href="game-details.html?id=${game.id}">Zobacz szczegóły</a>
        </article>
      `).join('');
    } catch (err) {
      listEl.innerHTML = '<p class="empty-message">Błąd wyszukiwania.</p>';
    }
  });
}

document.addEventListener('DOMContentLoaded', searchGames);