import { API, getGamesWithFilters, getPlaceholderImage, createGameCard, showLoading, showError } from './api.js';

let currentPage = 1;
let lastResults = [];
const GAMES_PER_PAGE = 12;

function renderSearchResults(games) {
  const listEl = document.getElementById('search-results');
  if (!listEl) return;

  if (!games || games.length === 0) {
    listEl.innerHTML = '<p class="empty-message">Brak wyników.</p>';
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

  const existingBtn = document.getElementById('load-more-search');
  if (existingBtn) existingBtn.remove();

  if (endIndex < games.length) {
    const btn = document.createElement('button');
    btn.id = 'load-more-search';
    btn.className = 'load-more-btn';
    btn.textContent = 'Pokaż więcej';
    btn.addEventListener('click', () => {
      currentPage++;
      renderSearchResults(games);
    });
    listEl.appendChild(btn);
  }
}

async function searchGames() {
  const form = document.querySelector('form');
  const listEl = document.getElementById('search-results');
  if (!form || !listEl) return;

  const savedQuery = sessionStorage.getItem('search-query') || '';
  const savedGenre = sessionStorage.getItem('filter-genre') || '';
  const savedPlatform = sessionStorage.getItem('filter-platform') || '';

  document.getElementById('search-query').value = savedQuery;
  document.getElementById('filter-genre').value = savedGenre;
  document.getElementById('filter-platform').value = savedPlatform;

  if (savedQuery || savedGenre || savedPlatform) {
    currentPage = 1;
    await performSearch();
  }

  async function performSearch() {
    const query = document.getElementById('search-query').value;
    const genre = document.getElementById('filter-genre').value;
    const platform = document.getElementById('filter-platform').value;

    sessionStorage.setItem('search-query', query);
    sessionStorage.setItem('filter-genre', genre);
    sessionStorage.setItem('filter-platform', platform);

    showLoading('search-results');

    try {
      const filters = {};
      if (query) filters.q = query;
      if (genre) filters.genre = genre;
      if (platform) filters.platform = platform;

      let games = await getGamesWithFilters(filters);

      if (platform) {
        games = games.filter(game => {
          if (Array.isArray(game.platforms)) {
            return game.platforms.includes(platform);
          }
          return game.platform === platform;
        });
      }

      lastResults = games;
      currentPage = 1;

      if (!games || games.length === 0) {
        showError('search-results', 'Brak wyników.');
        return;
      }

      renderSearchResults(games);
    } catch (err) {
      console.error(err);
      showError('search-results', 'Błąd wyszukiwania.');
    }
  };

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    currentPage = 1;
    performSearch();
  });

  document.getElementById('filter-genre')?.addEventListener('change', () => {
    currentPage = 1;
    performSearch();
  });
  document.getElementById('filter-platform')?.addEventListener('change', () => {
    currentPage = 1;
    performSearch();
  });
}

document.addEventListener('DOMContentLoaded', searchGames);
