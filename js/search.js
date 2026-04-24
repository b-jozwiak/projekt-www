import { API, getGamesWithFilters, getPlaceholderImage, createGameCard, showLoading, showError } from './api.js';

async function searchGames() {
  const form = document.querySelector('form');
  const listEl = document.getElementById('search-results');
  if (!form || !listEl) return;

  const performSearch = async () => {
    const query = document.getElementById('search-query').value;
    const genre = document.getElementById('filter-genre').value;
    const platform = document.getElementById('filter-platform').value;

    showLoading('search-results');

    try {
      const filters = {};
      if (query) filters.q = query;
      if (genre) filters.genre = genre;
      if (platform) filters.platform = platform;

      const games = await getGamesWithFilters(filters);

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