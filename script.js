// Store favorite Pokémon in local storage or a temporary array
let favorites = JSON.parse(localStorage.getItem('favorites')) || [];

// Fetch and display all Pokémon
async function fetchPokemon(limit = 1500) {
  const url = `https://pokeapi.co/api/v2/pokemon?limit=${limit}`;
  const response = await fetch(url);
  const data = await response.json();
  const pokemonPromises = data.results.map((pokemon) => fetchPokemonDetails(pokemon.url));
  const pokemonData = await Promise.all(pokemonPromises);
  displayPokemon(pokemonData);
}

// Fetch individual Pokémon details
async function fetchPokemonDetails(url) {
  const response = await fetch(url);
  return response.json();
}

// Display Pokémon on the main page
function displayPokemon(pokemonList) {
  const pokedexContainer = document.getElementById('pokedex');
  pokedexContainer.innerHTML = '';  // Clear previous Pokémon
  
  pokemonList.forEach((pokemon) => {
    const types = pokemon.types.map((typeInfo) => typeInfo.type.name).join(', ');
    const card = document.createElement('div');
    card.classList.add('card');
    card.innerHTML = `
      <img src="${pokemon.sprites.front_default}" alt="${pokemon.name}">
      <h3>${pokemon.name}</h3>
      <p>Types: ${types}</p>
      <button onclick="viewDetails('${pokemon.name}')">View Details</button>
      <button onclick="addToFavorites('${pokemon.name}', '${pokemon.sprites.front_default}')">Add to Favorites</button>
    `;
    pokedexContainer.appendChild(card);
  });
}

// Add Pokémon to favorites
function addToFavorites(name, image) {
  // Check if the Pokémon is already in the favorites array
  if (!favorites.some(favorite => favorite.name === name)) {
    const newFavorite = { name, image };
    favorites.push(newFavorite);
    localStorage.setItem('favorites', JSON.stringify(favorites));
    alert(`${name} added to your favorites!`);  // Feedback to the user
  } else {
    alert(`${name} is already in your favorites!`);
  }
}

// View Pokémon details
function viewDetails(name) {
  // Store Pokémon name in localStorage to retrieve later
  localStorage.setItem('currentPokemon', name);
  // Redirect to the detail page
  window.location.href = 'poke-detail.html';
}

// Display the details of the selected Pokémon on the detail page
async function displayPokemonDetails() {
  const pokemonName = localStorage.getItem('currentPokemon');
  
  if (!pokemonName) {
    alert('No Pokémon selected.');
    return;
  }
  
  const url = `https://pokeapi.co/api/v2/pokemon/${pokemonName}`;
  const response = await fetch(url);
  const pokemon = await response.json();
  
  // Display Pokémon details
  const name = document.getElementById('pokemon-name');
  const image = document.getElementById('pokemon-image');
  const stats = document.getElementById('pokemon-stats');
  const abilities = document.getElementById('pokemon-abilities');
  
  name.textContent = pokemon.name;
  image.innerHTML = `<img src="${pokemon.sprites.front_default}" alt="${pokemon.name}">`;
  
  // Display stats
  stats.innerHTML = '<h3>Stats</h3>';
  pokemon.stats.forEach(stat => {
    stats.innerHTML += `<p>${stat.stat.name}: ${stat.base_stat}</p>`;
  });
  
  // Display abilities
  abilities.innerHTML = '<h3>Abilities</h3>';
  pokemon.abilities.forEach(ability => {
    abilities.innerHTML += `<p>${ability.ability.name}</p>`;
  });
}

// Add Pokémon to favorites from the detail page
function addToFavoritesFromDetails() {
  const pokemonName = localStorage.getItem('currentPokemon');
  
  if (!pokemonName) {
    alert('No Pokémon selected.');
    return;
  }
  
  const url = `https://pokeapi.co/api/v2/pokemon/${pokemonName}`;
  fetch(url)
    .then(response => response.json())
    .then(pokemon => {
      const newFavorite = { name: pokemon.name, image: pokemon.sprites.front_default };
      
      if (!favorites.some(favorite => favorite.name === pokemon.name)) {
        favorites.push(newFavorite);
        localStorage.setItem('favorites', JSON.stringify(favorites));
        alert(`${pokemon.name} added to your favorites!`);
      } else {
        alert(`${pokemon.name} is already in your favorites!`);
      }
    });
}

// Fetch and display Pokémon on the Pokédex page
if (document.getElementById('pokedex')) {
  fetchPokemon();
}

// Display Pokémon details on the Pokémon Detail page
if (document.getElementById('pokemon-name')) {
  displayPokemonDetails();
}

// Update the Favorites display section
function updateFavorites() {
  const favoritesList = document.getElementById('favorites-list');
  favoritesList.innerHTML = ''; // Clear the current favorites

  // Loop through the favorites and add them to the section
  favorites.forEach(pokemon => {
    const card = createPokemonCard(pokemon);
    favoritesList.appendChild(card); // Append the Pokémon to the favorites list
  });
}

// Create Pokémon card element for the favorites list
function createPokemonCard(pokemon) {
  const card = document.createElement('div');
  card.classList.add('card');
  card.innerHTML = `
    <img src="${pokemon.image}" alt="${pokemon.name}" />
    <h3>${pokemon.name}</h3>
    <button onclick="removeFromFavorites('${pokemon.name}')">Remove from Favorites</button>
  `;
  return card;
}

// Function to remove Pokémon from favorites
function removeFromFavorites(pokemonName) {
  favorites = favorites.filter(pokemon => pokemon.name !== pokemonName);
  localStorage.setItem('favorites', JSON.stringify(favorites)); // Save updated favorites to localStorage
  updateFavorites(); // Update the favorites list after removal
}

// Initialize the page with the Pokémon list
if (document.getElementById('pokedex')) {
  fetchPokemon();
}

// Initialize the Favorites section
if (document.getElementById('favorites-list')) {
  updateFavorites();
}
