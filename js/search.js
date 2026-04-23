import { API, getGamesWithFilters, getPlaceholderImage, createGameCard, showLoading, showError } from './api.js';

async function searchGames() {
  const form = document.querySelector('form');
  const listEl = document.getElementById('search-results');
  if (!form || !listEl) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const query = document.getElementById('search-query').value;
    const genre = document.getElementById('filter-genre').value;

    showLoading('search-results');

    try {
      const filters = {};
      if (query) filters.q = query;
      if (genre) filters.genre = genre;

      const games = await getGamesWithFilters(filters);

      if (!games || games.length === 0) {
        showError('search-results', 'Brak wyników.');
        return;
      }

      listEl.innerHTML = '<div class="game-grid">' + games.map(game => createGameCard(game)).join('') + '</div>';
    } catch (err) {
      console.error(err);
      showError('search-results', 'Błąd wyszukiwania.');
    }
  });
}

document.addEventListener('DOMContentLoaded', searchGames);