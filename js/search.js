import { API, getGamesWithFilters, getPlaceholderImage, createGameCard, showLoading, showError } from './api.js';

async function searchGames() {
  const form = document.querySelector('form');
  const listEl = document.getElementById('search-results');
  if (!form || !listEl) return;

  // Restore previous search criteria from sessionStorage
  const savedQuery = sessionStorage.getItem('search-query') || '';
  const savedGenre = sessionStorage.getItem('filter-genre') || '';
  const savedPlatform = sessionStorage.getItem('filter-platform') || '';

  document.getElementById('search-query').value = savedQuery;
  document.getElementById('filter-genre').value = savedGenre;
  document.getElementById('filter-platform').value = savedPlatform;

  const performSearch = async () => {
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

      if (!games || games.length === 0) {
        showError('search-results', 'Brak wyników.');
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
      showError('search-results', 'Błąd wyszukiwania.');
    }
  };

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    performSearch();
  });

  document.getElementById('filter-genre')?.addEventListener('change', performSearch);
  document.getElementById('filter-platform')?.addEventListener('change', performSearch);
}

document.addEventListener('DOMContentLoaded', searchGames);