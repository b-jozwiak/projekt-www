import { getFavorites, getGameById, createGameCard } from './api.js';

const GAMES_PER_PAGE = 12;
let currentPage = 1;
let allFavIds = [];
let previousFavIds = [];

function renderFavoritesPage(games) {
  const listEl = document.getElementById('favorites-list');
  if (!listEl) return;

  let grid = listEl.querySelector('.game-grid');
  if (!grid) {
    grid = document.createElement('div');
    grid.className = 'game-grid';
    listEl.innerHTML = '';
    listEl.appendChild(grid);
  }

  const existingIds = new Set(
    [...grid.querySelectorAll('.game-item')].map(el => Number(el.dataset.id))
  );

  games.forEach(game => {
    if (!existingIds.has(game.id)) {
      grid.appendChild(createGameCard(game));
    }
  });

  const existingBtn = document.getElementById('load-more-fav');
  if (existingBtn) existingBtn.remove();

  if (currentPage * GAMES_PER_PAGE < allFavIds.length) {
    const btn = document.createElement('button');
    btn.id = 'load-more-fav';
    btn.className = 'load-more-btn';
    btn.textContent = 'Pokaż więcej';
    btn.addEventListener('click', loadMore);
    listEl.appendChild(btn);
  }
}

async function loadMore() {
  currentPage++;
  const listEl = document.getElementById('favorites-list');
  if (!listEl) return;

  const start = (currentPage - 1) * GAMES_PER_PAGE;
  const end = currentPage * GAMES_PER_PAGE;
  const pageIds = allFavIds.slice(start, end);

  const results = await Promise.allSettled(
    pageIds.map(id => getGameById(id))
  );

  const games = results
    .filter(r => r.status === 'fulfilled')
    .map(r => r.value);

  renderFavoritesPage(games);
}

async function loadFavoritesList() {
  const listEl = document.getElementById('favorites-list');
  if (!listEl) return;

  const newIds = getFavorites();

  if (newIds.length === 0) {
    listEl.innerHTML = '<p class="empty-message">Brak ulubionych gier.</p>';
    allFavIds = [];
    previousFavIds = [];
    currentPage = 1;
    return;
  }

  const grid = listEl.querySelector('.game-grid');

  if (grid && previousFavIds.length > 0) {
    const removedIds = previousFavIds.filter(id => !newIds.includes(id));
    for (const id of removedIds) {
      const card = grid.querySelector(`[data-id="${id}"]`);
      if (card) card.classList.add('game-item--removing');
    }
    setTimeout(() => {
      for (const id of removedIds) {
        const card = grid.querySelector(`[data-id="${id}"]`);
        if (card) card.remove();
      }
      if (grid.children.length === 0) {
        listEl.innerHTML = '<p class="empty-message">Brak ulubionych gier.</p>';
      }
    }, 300);

    allFavIds = newIds;
    previousFavIds = newIds;
    return;
  }

  listEl.innerHTML = '<p class="loading">Ladowanie...</p>';

  allFavIds = newIds;
  previousFavIds = newIds;
  currentPage = 1;

  const pageIds = allFavIds.slice(0, GAMES_PER_PAGE);

  const results = await Promise.allSettled(
    pageIds.map(id => getGameById(id))
  );

  const games = results
    .filter(r => r.status === 'fulfilled')
    .map(r => r.value);

  if (games.length === 0) {
    listEl.innerHTML = '<p class="empty-message">Brak ulubionych gier.</p>';
    return;
  }

  renderFavoritesPage(games);
}

document.addEventListener('DOMContentLoaded', loadFavoritesList);
document.addEventListener('favorites-changed', loadFavoritesList);
