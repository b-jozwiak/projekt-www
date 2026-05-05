import { API, getGameById, getFavorites, saveFavorites, isFavorite, addFavorite, removeFavorite, getPlaceholderImage, showLoading, showError } from './api.js';

function setupBackLink() {
  const backLink = document.getElementById('back-link');
  if (!backLink) return;
  
  const ref = document.referrer;
  if (ref && ref.includes('favorites.html')) {
    backLink.href = 'favorites.html';
  } else if (ref && ref.includes('search.html')) {
    const savedQuery = sessionStorage.getItem('search-query');
    const savedGenre = sessionStorage.getItem('filter-genre');
    const savedPlatform = sessionStorage.getItem('filter-platform');
    
    let href = 'search.html';
    const params = [];
    if (savedQuery) params.push(`q=${encodeURIComponent(savedQuery)}`);
    if (savedGenre) params.push(`genre=${encodeURIComponent(savedGenre)}`);
    if (savedPlatform) params.push(`platform=${encodeURIComponent(savedPlatform)}`);
    if (params.length > 0) href += '?' + params.join('&');
    
    backLink.href = href;
  } else {
    backLink.href = 'index.html';
  }
}

async function loadGameDetails() {
  const params = new URLSearchParams(window.location.search);
  const id = params.get('id');
  const container = document.getElementById('game-details');

  if (!container) return;

  if (!id) {
    container.innerHTML = '<p class="empty-message">Nie wybrano gry. <a href="index.html">Wróć do listy</a></p>';
    return;
  }

  container.innerHTML = '<p class="loading">Ładowanie...</p>';

  try {
    const game = await getGameById(id);
    const isFav = isFavorite(game.id);

    container.innerHTML = `
      <div class="game-details">
        <img id="game-image" src="${getPlaceholderImage(game.name)}" alt="${game.name}" style="display:block; max-width:100%; height:auto;">
        <h2 id="game-title">${game.name || 'Nieznana gra'}</h2>
        <p id="game-genre"><strong>Gatunek:</strong> ${game.genre || '-'}</p>
        <p id="game-platform"><strong>Platforma:</strong> ${game.platform || '-'}</p>
        <p id="game-release"><strong>Data wydania:</strong> ${game.release || '-'}</p>
        <p id="game-rating"><strong>Ocena:</strong> ${game.rating || '-'}</p>
        <p id="game-description">${game.description || 'Brak opisu.'}</p>
        <button id="add-to-favorites">${isFav ? 'Usuń z ulubionych' : 'Dodaj do ulubionych'}</button>
      </div>
    `;

    const btn = document.getElementById('add-to-favorites');
    if (btn) {
      btn.addEventListener('click', () => toggleFavorite(btn, game));
    }
  } catch (err) {
    console.error(err);
    container.innerHTML = '<p class="error">Błąd ładowania</p>';
  }
}

  function updateFavoriteButton(btn, game) {
    const isFav = isFavorite(game.id);
    btn.textContent = isFav ? 'Usuń z ulubionych' : 'Dodaj do ulubionych';
    btn.dataset.favorite = isFav;
  }

  function toggleFavorite(btn, game) {
    if (isFavorite(game.id)) {
      removeFavorite(game.id);
    } else {
      addFavorite(game);
    }
    updateFavoriteButton(btn, game);
  }

document.addEventListener('DOMContentLoaded', () => {
  setupBackLink();
  loadGameDetails();
});