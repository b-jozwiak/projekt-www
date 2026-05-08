import { API, getGames, getPlaceholderImage, createGameCard, showLoading, showError } from './api.js';

let allGames = [];
let currentPage = 1;
const GAMES_PER_PAGE = 12;

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

  const endIndex = currentPage * GAMES_PER_PAGE;
  const gamesToShow = games.slice(0, endIndex);

  let grid = listEl.querySelector('.game-grid');

  if (currentPage === 1 || !grid) {
    if (grid) grid.remove();
    grid = document.createElement('div');
    grid.className = 'game-grid';
    listEl.innerHTML = '';
    listEl.appendChild(grid);
    gamesToShow.forEach(game => {
      grid.appendChild(createGameCard(game));
    });
  } else {
    const existingIds = new Set(
      [...grid.querySelectorAll('.game-item')].map(el => Number(el.dataset.id))
    );
    gamesToShow.forEach(game => {
      if (!existingIds.has(game.id)) {
        grid.appendChild(createGameCard(game));
      }
    });
  }

  const existingBtn = document.getElementById('load-more');
  if (existingBtn) existingBtn.remove();

  if (endIndex < games.length) {
    const btn = document.createElement('button');
    btn.id = 'load-more';
    btn.className = 'load-more-btn';
    btn.textContent = 'Pokaż więcej';
    btn.addEventListener('click', () => {
      currentPage++;
      renderGames(games);
    });
    listEl.appendChild(btn);
  }
}

async function loadGames() {
  const listEl = document.getElementById('game-list');
  if (!listEl) return;

  showLoading('game-list');
  currentPage = 1;

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

  currentPage = 1;
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