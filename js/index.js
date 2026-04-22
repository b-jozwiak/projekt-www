import { API, getGames, getPlaceholderImage, createGameCard, showLoading, showError } from './api.js';

async function loadGames() {
  const listEl = document.getElementById('game-list');
  if (!listEl) return;

  showLoading('game-list');

  try {
    const games = await getGames();

    if (!games || games.length === 0) {
      listEl.innerHTML = '<p class="empty-message">Brak gier.</p>';
      return;
    }

    listEl.innerHTML = '<div class="game-grid">' + games.map(game => createGameCard(game)).join('') + '</div>';
  } catch (err) {
    console.error(err);
    showError('game-list', 'Błąd ładowania gier. Upewnij się, że json-server działa na porcie 3001.');
  }
}

document.addEventListener('DOMContentLoaded', loadGames);