import { API, getGames, getPlaceholderImage, createGameCard, showLoading, showError } from './api.js';

async function loadGames() {
  const listEl = document.getElementById('game-list');
  if (!listEl) return;

  showLoading('game-list');

  try {
    const games = await getGames();

    if (!games || games.length === 0) {
      showError('game-list', 'Brak gier.');
      return;
    }

    const grid = document.createElement('div');
    grid.className = 'game-grid';
    games.forEach(game => {
      grid.appendChild(createGameCard(game));
    });
    listEl.innerHTML = '';
    listEl.appendChild(grid);
  } catch (err) {
    console.error(err);
    showError('game-list', 'Błąd ładowania gier. Upewnij się, że json-server działa na porcie 3001.');
  }
}

document.addEventListener('DOMContentLoaded', loadGames);