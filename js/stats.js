import { API } from './api.js';

function loadStats() {
  const totalEl = document.getElementById('total-games');
  const avgEl = document.getElementById('avg-rating');
  const chartContainer = document.getElementById('chart-container');

  if (!totalEl || !avgEl || !chartContainer) return;

  fetch(`${API}/games`)
    .then(res => {
      if (!res.ok) throw new Error('Błąd pobierania danych');
      return res.json();
    })
    .then(games => {
      totalEl.textContent = games.length;

      const validRatings = games.filter(g => g.rating && !isNaN(g.rating));
      if (validRatings.length > 0) {
        const avgRating = validRatings.reduce((sum, g) => sum + parseFloat(g.rating), 0) / validRatings.length;
        avgEl.textContent = avgRating.toFixed(2);
      } else {
        avgEl.textContent = '-';
      }

      const genreCounts = {};
      games.forEach(g => {
        const genre = g.genre || 'Nieznany';
        genreCounts[genre] = (genreCounts[genre] || 0) + 1;
      });

      const sortedGenres = Object.entries(genreCounts).sort((a, b) => b[1] - a[1]);

      chartContainer.innerHTML = sortedGenres.map(([genre, count]) => {
        const percentage = ((count / games.length) * 100).toFixed(1);
        return `
          <div class="bar-chart-item">
            <span class="bar-label">${genre}</span>
            <div class="bar-wrapper">
              <div class="bar" style="width: ${percentage}%">${count}</div>
            </div>
          </div>
        `;
      }).join('');
    })
    .catch(err => {
      console.error(err);
      if (totalEl) totalEl.textContent = 'Błąd';
      if (avgEl) avgEl.textContent = 'Błąd';
      if (chartContainer) chartContainer.innerHTML = '<p class="error">Nie udało się pobrać danych.</p>';
    });
}

document.addEventListener('DOMContentLoaded', loadStats);
