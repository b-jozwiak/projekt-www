import { API, getGames, getPlaceholderImage, createGameCard, showLoading, showError } from './api.js';

let allGames = [];

function sortGames(games, sortType) {
  const sorted = [...games];
  switch (sortType) {
    case 'rating-desc':
      return sorted.sort((a, b) => (b.rating || 0) - (a.rating || 0));
    case 'rating-asc':
      return sorted.sort((a, b) => (a.rating || 0) - (b.rating || 0));
    case 'name-asc':
      return sorted.sort((a, b) => (a.name || '').localeCompare(b.name || ''));
    case 'name-desc':
      return sorted.sort((a, b) => (b.name || '').localeCompare(a.name || ''));
    case 'release-desc':
      return sorted.sort((a, b) => (b.release || '').localeCompare(a.release || ''));
    case 'release-asc':
      return sorted.sort((a, b) => (a.release || '').localeCompare(b.release || ''));
    default:
      return sorted;
  }
}

function renderGames(games) {
  const listEl = document.getElementById('game-list');
  if (!listEl) return;

  if (!games || games.length === 0) {
    listEl.innerHTML = '<p class="empty-message">Brak gier.</p>';
    return;
  }

  const grid = document.createElement('div');
  grid.className = 'game-grid';
  games.forEach(game => {
    grid.appendChild(createGameCard(game));
  });
  listEl.innerHTML = '';
  listEl.appendChild(grid);
}

async function loadGames() {
  const listEl = document.getElementById('game-list');
  if (!listEl) return;

  showLoading('game-list');

  try {
    allGames = await getGames();

    if (!allGames || allGames.length === 0) {
      showError('game-list', 'Brak gier.');
      return;
    }

    const sortSelect = document.getElementById('sort-by');
    const sortType = sortSelect ? sortSelect.value : 'rating-desc';
    const sortedGames = sortGames(allGames, sortType);
    renderGames(sortedGames);
  } catch (err) {
    console.error(err);
    showError('game-list', 'Błąd ładowania gier. Upewnij się, że json-server działa na porcie 3001.');
  }
}

function handleSortChange() {
  const sortSelect = document.getElementById('sort-by');
  if (!sortSelect || allGames.length === 0) return;

  const sortedGames = sortGames(allGames, sortSelect.value);
  renderGames(sortedGames);
}

document.addEventListener('DOMContentLoaded', () => {
  loadGames();

  const sortSelect = document.getElementById('sort-by');
  if (sortSelect) {
    sortSelect.addEventListener('change', handleSortChange);
  }
});