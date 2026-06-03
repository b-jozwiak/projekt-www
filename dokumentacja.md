# Dokumentacja projektu

## Opis

Aplikacja webowa do przegladania katalogu gier. Dane pobierane sa z lokalnego REST API (json-server) i wyswietlane w formie kart. Dostepne jest wyszukiwanie, filtrowanie, sortowanie, lista ulubionych oraz statystyki.

---

## Struktura plikow i katalogow

```
projekt-www/
  .git/                   - Repozytorium git (utworzone przez GitHub)
  .gitignore              - Plik ignorowanych sciezek dla gita
  node_modules/           - Zależności npm (json-server)

  db.json                 - Plik bazy danych (JSON). Zawiera tablice "games" z 20 obiektami.
                            Uruchamiana przez json-server jako REST API.

  images/                 - Lokalne obrazki okladek gier (20 plikow, .jpg i .png).
                            Sciezki: "images/game-{id}.{ext}"

  package.json            - Konfiguracja projektu npm. Skrypt "server" uruchamia json-server.
  package-lock.json       - Blokada wersji zaleznosci.

  ---- HTML ----

  index.html              - Strona glowna. Wyswietla liste gier z sortowaniem.
  game-details.html       - Strona szczegolow wybranej gry. Pobiera id z parametru URL (?id=).
  search.html             - Wyszukiwarka z filtrowaniem po gatunku i platformie.
  favorites.html          - Lista ulubionych gier zapisanych w localStorage.
  stats.html              - Statystyki: liczba gier, srednia ocena, wykres gatunkow.

  ---- CSS ----

  css/style.css           - Jeden plik CSS dla calej aplikacji.

  ---- JS (moduly ES6) ----

  js/api.js               - Funkcje wspoldzielone: polaczenie z API, tworzenie kart gier,
                            zarzadzanie ulubionymi, placeholder obrazka, toasty.

  js/index.js             - Logika strony glownej: ladowanie gier, sortowanie, paginacja.

  js/search.js            - Logika wyszukiwarki: obsluga formularza, filtry, paginacja,
                            zapisywanie stanu w sessionStorage.

  js/favorites.js         - Logika ulubionych: ladowanie z localStorage, usuwanie z animacja,
                            paginacja.

  js/game-details.js      - Logika szczegolow gry: pobieranie danych, wypelnianie DOM,
                            przycisk ulubionych.

  js/stats.js             - Logika statystyk: obliczanie sredniej oceny, wykres gatunkow.
```

---

## Dane (db.json)

Kazdy obiekt w tablicy `games` zawiera:

| Pole          | Typ                | Przyklad                          |
|---------------|--------------------|-----------------------------------|
| id            | number             | 1                                 |
| name          | string             | "The Witcher 3: Wild Hunt"        |
| genre         | string             | "RPG"                             |
| platforms     | array of strings   | ["PC", "PlayStation", "Xbox"]     |
| release       | string (YYYY-MM-DD)| "2015-05-19"                      |
| rating        | number (0-10)      | 9.8                               |
| description   | string             | "Epicka RPG o wiedzminie..."      |
| image         | string             | "images/game-1.jpg"               |

Dostepne gatunki: RPG, Akcja, Sandbox, Przygoda, Logiczna, Spolecznosciowa, Symulacja, Platformowa, Roguelike.

---

## Funkcje JS

### js/api.js (modul wspoldzielony)

| Funkcja                         | Opis                                                      |
|---------------------------------|-----------------------------------------------------------|
| `getGames()`                    | Pobiera liste wszystkich gier z `GET /games`.             |
| `getGameById(id)`               | Pobiera pojedyncza gre z `GET /games/{id}`.               |
| `getGamesWithFilters(filters)`  | Pobiera gry z filtrami (q, genre, platform).              |
| `createGameCard(game)`          | Tworzy element DOM karty gry (article z obrazkiem, ocena, platformami, przyciskiem ulubionych). |
| `getPlaceholderImage(name)`     | Generuje fallback URL z placehold.co (uzywane gdy gra nie ma lokalnego obrazka). |
| `getFavorites()`                | Odczytuje tablice ID ulubionych z localStorage.           |
| `saveFavorites(favs)`           | Zapisuje tablice ID ulubionych do localStorage.           |
| `isFavorite(id)`                | Sprawdza czy dane ID jest w ulubionych.                   |
| `addFavorite(id)`               | Dodaje ID do ulubionych i wysyla event.                   |
| `removeFavorite(id)`            | Usuwa ID z ulubionych (opcjonalnie cicho).                |
| `showLoading(containerId)`      | Wstawia "Ladowanie..." do kontenera.                      |
| `showError(containerId, msg)`   | Wstawia komunikat bledu do kontenera.                     |
| `showToast(message)`            | Pokazuje tymczasowe powiadomienie (znika po 2.5s).        |

### js/index.js (strona glowna)

| Funkcja                         | Opis                                                      |
|---------------------------------|-----------------------------------------------------------|
| `sortGames(games, sortType)`    | Sortuje tablice gier po: ratingu, nazwie, dacie wydania.  |
| `renderGames(games)`            | Renderuje karty do `.game-grid` z paginacja (12 na strone) i przyciskiem "Pokaz wiecej". |
| `loadGames()`                   | Laduje gry z API, sortuje, wywoluje render.               |
| `handleSortChange()`            | Resetuje strone i renderuje po zmianie sortowania.        |

### js/search.js (wyszukiwarka)

| Funkcja                         | Opis                                                      |
|---------------------------------|-----------------------------------------------------------|
| `renderSearchResults(games)`    | Renderuje wyniki w `.game-grid` z paginacja.              |
| `searchGames()`                 | Inicjalizuje wyszukiwarke: przywraca zapisany stan z sessionStorage, obsluguje zdarzenia formularza i filtrow. |
| `performSearch()`               | Wykonuje zapytanie do API, filtruje po platformie, renderuje wyniki. Zapisuje stan do sessionStorage. |

### js/favorites.js (ulubione)

| Funkcja                         | Opis                                                      |
|---------------------------------|-----------------------------------------------------------|
| `renderFavoritesPage(games)`    | Renderuje ulubione gry w `.game-grid` z paginacja.        |
| `loadMore()`                    | Laduje kolejna strone ulubionych.                         |
| `loadFavoritesList()`           | Laduje pelna liste ulubionych z API. Obsluguje animacje usuwania i pusty stan. Odswieza sie na event `favorites-changed`. |

### js/game-details.js (szczegoly gry)

| Funkcja                         | Opis                                                      |
|---------------------------------|-----------------------------------------------------------|
| `setupBackLink()`               | Ustawia przycisk "Wroc" w zaleznosci skad przyszlismy (favorites, search, index). |
| `setMessage(type, text)`        | Pokazuje komunikat (ladowanie/error/pusta).               |
| `showGameDetails(game)`         | Wypelnia DOM danymi gry: tytul, obrazek, gatunek, platformy, ocena, opis, przycisk ulubionych. |
| `loadGameDetails()`             | Pobiera id z URL, laduje gre z API, wywoluje showGameDetails. |
| `toggleFavorite(btn)`           | Przelacza stan ulubionych dla biezacej gry.              |

### js/stats.js (statystyki)

| Funkcja                         | Opis                                                      |
|---------------------------------|-----------------------------------------------------------|
| `loadStats()`                   | Pobiera wszystkie gry z API, wyswietla liczbe gier, srednia ocene oraz wykres slupkowy gatunkow. |

---

## Uruchomienie

1. Sklonowac repozytorium:
```
git clone https://github.com/b-jozwiak/projekt-www.git
cd projekt-www
```

2. Zainstalowac zaleznosci:
```
npm install
```

3. Uruchomic serwer API (json-server na porcie 3001):
```
npm run server
```

4. Otworzyc w przegladarce:
   - Plik HTML bezposrednio - `index.html` (otworzyc z eksploratora plikow)
   - Lub przez serwer statyczny - wejdz na `http://localhost:3001/` (json-server serwuje tez pliki statyczne dzieki `--static ./`)

API jest dostepne pod `http://localhost:3001/games`.

---

## Autorzy

- Bartosz Jozwiak (119694)
- Mikolaj Dumala (119665)
