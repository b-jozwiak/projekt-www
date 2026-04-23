import { API, getGameById, getFavorites, saveFavorites, isFavorite, addFavorite, removeFavorite, getPlaceholderImage, showLoading, showError } from './api.js';

function showLoading() {
  const heading = document.getElementById('game-title');
  const img = document.getElementById('game-image');
  if (heading) heading.textContent = 'Ładowanie...';
  if (img) img.style.display = 'none';
}

function setupBackLink() {
  const backLink = document.getElementById('back-link');
  if (!backLink) return;
  
  const ref = document.referrer;
  if (ref && ref.includes('favorites.html')) {
    backLink.href = 'favorites.html';
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

    showLoading('game-details');

    try {
      const game = await getGameById(id);

      const heading = document.getElementById('game-title');
      if (heading) heading.textContent = game.name;
      
      const genre = document.getElementById('game-genre');
      if (genre) genre.textContent = game.genre;
      
      const platform = document.getElementById('game-platform');
      if (platform) platform.textContent = game.platform;
      
      const release = document.getElementById('game-release');
      if (release) release.textContent = game.release;
      
      const rating = document.getElementById('game-rating');
      if (rating) rating.textContent = game.rating;
      
      const desc = document.getElementById('game-description');
      if (desc) desc.textContent = game.description;
      
      const img = document.getElementById('game-image');
      if (img) {
        img.src = getPlaceholderImage(game.name);
        img.alt = game.name;
        img.style.display = 'block';
      }

      const btn = document.getElementById('add-to-favorites');
      if (btn) {
        updateFavoriteButton(btn, game);
        btn.addEventListener('click', () => toggleFavorite(btn, game));
      }
    } catch (err) {
      console.error(err);
      showError('game-details', 'Błąd ładowania');
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