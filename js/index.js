const API = 'http://localhost:3001';

async function loadGames() {
  const listEl = document.getElementById('game-list');
  if (!listEl) return;

  try {
    const res = await fetch(`${API}/games`);
    if (!res.ok) throw new Error('Błąd pobierania');
    const games = await res.json();

    if (games.length === 0) {
      listEl.innerHTML = '<p class="empty-message">Brak gier.</p>';
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
    listEl.innerHTML = '<p class="empty-message">Błąd ładowania gier.</p>';
  }
}

document.addEventListener('DOMContentLoaded', loadGames);