<template>
  <div id="app" class="app-container">
    <header class="header">
      <div class="header-content">
        <div class="header-logo">
          <img src="./assets/PokeHaven.png" alt="Pokeball Logo">
        </div>
        <div class="search-container">
          <i class="fas fa-search search-icon"></i>
          <input class="search-input" type="text" placeholder="Search..." v-model="search" @input="searchPokemons">
          <i v-if="search" @click="clearSearch" class="fas fa-times clear-icon"></i>
        </div>
      </div>
    </header>
    <div class="main-content">
      <aside class="sidebar">
        <div class="nav-menu">
          <button @click="filterByType('')" class="type-button all-types">
            <i class="fas fa-globe"></i> <span>ALL TYPES</span>
          </button>
          <button v-for="type in allTypes" :key="type" @click="filterByType(type)" :class="['type-button', type]">
            <i :class="['fas', typeIcon(type)]"></i> <span>{{ type.toUpperCase() }}</span>
          </button>
        </div>
      </aside>
      <div class="container">
        <div class="pagination-wrapper">
          <div class="pagination-controls">
            <button @click="prevPage" :disabled="currentPage === 1">&laquo;</button>
            <span v-if="pageNumbers[0] > 1" @click="goToPage(1)">1</span>
            <span v-if="pageNumbers[0] > 2">...</span>
            <span v-for="page in pageNumbers" :key="page" @click="goToPage(page)" :class="{ active: currentPage === page }">{{ page }}</span>
            <span v-if="pageNumbers[pageNumbers.length - 1] < totalPages - 1">...</span>
            <span v-if="pageNumbers[pageNumbers.length - 1] < totalPages" @click="goToPage(totalPages)">{{ totalPages }}</span>
            <button @click="nextPage" :disabled="currentPage === totalPages">&raquo;</button>
          </div>
        </div>
        <div v-if="isLoading" class="loading-spinner">
          <i class="fas fa-spinner fa-spin"></i> Loading...
        </div>
        <div v-else class="columns">
          <div class="column" v-for="(poke, index) in paginatedPokemons" :key="poke.url">
            <PokemonCard :name="poke.name" :url="poke.url" :num="(currentPage - 1) * itemsPerPage + index + 1" :types="poke.types" @click="openModal(poke, (currentPage - 1) * itemsPerPage + index + 1)" />
          </div>
        </div>
      </div>
    </div>
    <PokemonModal :isActive="isModalActive" :pokemonData="selectedPokemon" :num="selectedPokemonNum" @close="closeModal" />
    <SpeedInsights />
  </div>
</template>

<script>
import axios from 'axios';
import PokemonCard from './components/PokemonCard.vue';
import PokemonModal from './components/PokemonModal.vue';
import debounce from 'lodash.debounce';
import '@fortawesome/fontawesome-free/css/all.css';
import { SpeedInsights } from "@vercel/speed-insights/vue";

export default {
  name: 'App',
  components: {
    PokemonCard,
    PokemonModal,
    SpeedInsights
  },
  data() {
    return {
      allPokemons: [],
      pokemons: [],
      filteredPokemons: [],
      search: '',
      allTypes: ['normal', 'fire', 'water', 'electric', 'grass', 'ice', 'fighting', 'poison', 'ground', 'flying', 'psychic', 'bug', 'rock', 'ghost', 'dragon', 'dark', 'steel', 'fairy'],
      selectedType: '',
      currentPage: 1,
      itemsPerPage: 21,
      isLoading: false,
      isLoadingSearch: false,
      isModalActive: false,
      selectedPokemon: null,
      selectedPokemonNum: null
    };
  },
  created() {
    this.fetchAllPokemons();
  },
  methods: {
    fetchAllPokemons() {
      this.isLoading = true;
      axios.get("https://pokeapi.co/api/v2/pokemon?limit=1500&offset=0").then(response => {
        const results = response.data.results;
        const promises = results.map(result => axios.get(result.url).then(res => {
          const data = res.data;
          return {
            name: data.name,
            url: result.url,
            types: data.types.map(typeInfo => typeInfo.type.name)
          };
        }));
        Promise.all(promises).then(pokemons => {
          this.allPokemons = pokemons;
          this.applyFilters();
          this.isLoading = false;
        });
      }).catch(() => {
        this.isLoading = false;
      });
    },
    searchPokemons() {
      this.isLoadingSearch = true;
      this.isLoading = true;
      this.currentPage = 1;
      this.applyFilters();
      this.isLoading = false;
      this.isLoadingSearch = false;
    },
    filterByType(type) {
      this.isLoading = true;
      this.selectedType = type; //tipo selecionado
      this.currentPage = 1;
      this.applyFilters();
      this.isLoading = false;
    },
    applyFilters() {
      const searchTerm = this.search.trim().toLowerCase();
      this.pokemons = this.allPokemons.filter(pokemon => {
        const matchesSearch = searchTerm === '' || pokemon.name.includes(searchTerm);
        const matchesType = this.selectedType === '' || pokemon.types.includes(this.selectedType);
        return matchesSearch && matchesType;
      });
      this.filteredPokemons = this.pokemons;
    },
    nextPage() {
      if (this.currentPage < this.totalPages) {
        this.currentPage++;
      }
    },
    prevPage() {
      if (this.currentPage > 1) {
        this.currentPage--;
      }
    },
    openModal(pokemon, num) {
      this.selectedPokemon = pokemon;
      this.selectedPokemonNum = num;
      this.isModalActive = true;
    },
    closeModal() {
      this.isModalActive = false;
      this.selectedPokemon = null;
      this.selectedPokemonNum = null;
    },
    goToPage(page) {
      this.currentPage = page;
    },
    getPageNumbers() {
      const totalPages = this.totalPages;
      const currentPage = this.currentPage;
      const maxPagesToShow = 5;
      let startPage, endPage;

      if (totalPages <= maxPagesToShow) {
        startPage = 1;
        endPage = totalPages;
      } else {
        if (currentPage <= Math.ceil(maxPagesToShow / 2)) {
          startPage = 1;
          endPage = maxPagesToShow;
        } else if (currentPage + Math.floor(maxPagesToShow / 2) >= totalPages) {
          startPage = totalPages - maxPagesToShow + 1;
          endPage = totalPages;
        } else {
          startPage = currentPage - Math.floor(maxPagesToShow / 2);
          endPage = currentPage + Math.floor(maxPagesToShow / 2);
        }
      }

      const pages = [];
      for (let i = startPage; i <= endPage; i++) {
        pages.push(i);
      }

      return pages;
    },
    clearSearch() {
      this.search = '';
      this.searchPokemons();
    },
    typeIcon(type) {
      const icons = {
        normal: 'fa-circle',
        fire: 'fa-fire',
        water: 'fa-tint',
        electric: 'fa-bolt',
        grass: 'fa-leaf',
        ice: 'fa-snowflake',
        fighting: 'fa-fist-raised',
        poison: 'fa-skull-crossbones',
        ground: 'fa-mountain',
        flying: 'fa-feather-alt',
        psychic: 'fa-brain',
        bug: 'fa-bug',
        rock: 'fa-gem',
        ghost: 'fa-ghost',
        dragon: 'fa-dragon',
        dark: 'fa-moon',
        steel: 'fa-cogs',
        fairy: 'fa-magic'
      };
      return icons[type] || 'fa-circle';
    }
  },
  computed: {
    totalPages() {
      return Math.ceil(this.pokemons.length / this.itemsPerPage);
    },
    paginatedPokemons() {
      const start = (this.currentPage - 1) * this.itemsPerPage;
      const end = start + this.itemsPerPage;
      return this.filteredPokemons.slice(start, end);
    },
    pageNumbers() {
      return this.getPageNumbers();
    }
  },
  watch: {
    search: debounce(function () {
      this.searchPokemons();
    }, 300)
  }
};
</script>

<style scoped>
@font-face {
  font-family: 'Pokemon Solid';
  src: url('./assets/Pokemon\ Solid.ttf') format('truetype');
}
@import url('https://fonts.googleapis.com/css2?family=Roboto:wght@400;700&display=swap');

body,
html {
  height: 100%;
  margin: 0;
  font-family: 'Roboto', sans-serif;
  background-color: #f4f4f9;
}

.app-container {
  background: url('https://i.pinimg.com/originals/a1/86/a8/a186a8aff83506c70b0b307e3fb062c8.png') no-repeat center center fixed;
  background-color: #ffffff;
  background-size: cover;
  height: 100%;
  overflow: hidden;
}

.header {
  background: linear-gradient(90deg, rgba(255,0,0,1) 0%, rgba(255,50,50,1) 100%);
  padding: 20px 0;
  text-align: center;
  color: white;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}

.header-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 20px;
  margin: 0 auto;
}

.header-logo {
  display: flex;
  width: 150px;
  height: 90px;
  margin-right: 20px;
}

.search-container {
  position: relative;
  flex-grow: 1;
  max-width: 900px;
  display: flex;
  align-items: center;
  margin-right: 28%;
}

.search-input {
  width: 100%;
  border-radius: 25px;
  border: 1px solid #ccc;
  padding: 10px 40px 10px 40px;
  background-color: white;
  color: black;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  font-size: 1rem;
}

.search-icon {
  position: absolute;
  left: 10px;
  top: 50%;
  transform: translateY(-50%);
  color: #ccc;
}

.clear-icon {
  position: absolute;
  right: 10px;
  top: 50%;
  transform: translateY(-50%);
  cursor: pointer;
  color: #ccc;
}

.clear-icon:hover {
  color: #333;
}

.main-content {
  display: flex;
  gap: 20px;
  padding: 20px;
}

.sidebar {
  width: 200px;
  background-color: #ffffff;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}

.nav-menu {
  display: flex;
  flex-direction: column;
  margin-top: 2em;
}

.type-button {
  margin: 10px 0;
  padding: 10px 20px;
  border-radius: 25px;
  color: white;
  cursor: pointer;
  text-transform: uppercase;
  font-weight: bold;
  font-size: 0.9rem;
  border: none;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  transition: background-color 0.3s, transform 0.2s;
  display: flex;
  align-items: center;
  overflow: hidden;
  position: relative;
}

.type-button::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-size: cover;
  opacity: 0;
  transition: opacity 0.3s;
  z-index: 1;
}

.type-button:hover::after {
  opacity: 0.1;
}

.type-button i {
  margin-right: 10px;
  transition: transform 0.2s;
  z-index: 2;
}

.type-button span {
  display: none;
  transition: display 0.2s;
  z-index: 2;
}

.type-button:hover span {
  display: inline;
}

.type-button:hover i {
  transform: translateX(-10px);
}

.type-button.normal {
  background-color: #A8A77A;
}

.type-button.fire {
  background-color: #EE8130;
}

.type-button.fire::after {
  background: url('https://pokedex.johanalves.com/img/fire-background.gif') no-repeat center center;
}

.type-button.water {
  background-color: #6390F0;
}

.type-button.water::after {
  background: url('https://pokedex.johanalves.com/img/water-background.gif') no-repeat center center;
}

.type-button.electric {
  background-color: #F7D02C;
}

.type-button.electric::after {
  background: url('https://pokedex.johanalves.com/img/eletric-background.gif') no-repeat center center;
}

.type-button.grass {
  background-color: #7AC74C;
}

.type-button.grass::after {
  background: url('https://pokedex.johanalves.com/img/grass-background.gif') no-repeat center center;
}

.type-button.ice {
  background-color: #96D9D6;
}

.type-button.ice::after {
  background: url('https://i.pinimg.com/originals/02/e0/be/02e0be2271aca12287d673a01c7a93f3.gif') no-repeat center center;
}

.type-button.fighting {
  background-color: #C22E28;
}

.type-button.fighting::after {
  background: url('https://i.pinimg.com/originals/18/6e/40/186e40c38bf0ca670f8e484cf00bfe52.gif') no-repeat center center;
}

.type-button.poison {
  background-color: #A33EA1;
}

.type-button.poison::after {
  background: url('https://i.pinimg.com/originals/d1/2a/eb/d12aeb087d5f9763cdf9619a618ad83c.gif') no-repeat center center;
}

.type-button.ground {
  background-color: #E2BF65;
}

.type-button.ground::after {
  background: url('https://i.pinimg.com/originals/65/74/21/6574217794ecd6308f40c8ebef07490c.gif') no-repeat center center;
}


.type-button.flying {
  background-color: #A98FF3;
}

.type-button.flying::after {
  background: url('https://i.pinimg.com/originals/62/c3/83/62c38337b5b08da09f4219cf5c5c3dd7.gif') no-repeat center center;
}

.type-button.psychic {
  background-color: #F95587;
}

.type-button.psychic::after {
  background: url('https://i.pinimg.com/originals/79/f6/e5/79f6e59d8daeb46b4ed9ce29b7fe1546.gif') no-repeat center center;
}

.type-button.bug {
  background-color: #A6B91A;
}

.type-button.bug::after {
  background: url('https://i.pinimg.com/originals/8a/69/45/8a6945be929c637c1fef046f319cdf30.gif') no-repeat center center;
}

.type-button.rock {
  background-color: #B6A136;
}

.type-button.rock::after {
  background: url('https://i.pinimg.com/originals/dc/c0/ec/dcc0ecd5efce49527589ff31c9aef9c5.gif') no-repeat center center;
}

.type-button.ghost {
  background-color: #735797;
}

.type-button.ghost::after {
  background: url('https://i.pinimg.com/originals/67/a0/19/67a0195dd92ce3126507e84a390dccdf.gif') no-repeat center center;
}

.type-button.dragon {
  background-color: #6F35FC;
}

.type-button.dragon::after {
  background: url('https://i.pinimg.com/originals/2d/b4/eb/2db4eb59c577ee62ece5660c568ac101.gif') no-repeat center center;
}

.type-button.dark {
  background-color: #705746;
}

.type-button.dark::after {
  background: url('https://i.pinimg.com/originals/fb/95/bf/fb95bfaf7793e153e424185bbb691e77.gif') no-repeat center center;
}

.type-button.steel {
  background-color: #B7B7CE;
}

.type-button.steel::after {
  background: url('https://i.pinimg.com/originals/3c/29/28/3c29288d05aa4658a1d381e2e2a021af.gif') no-repeat center center;
}

.type-button.fairy {
  background-color: #D685AD;
}

.type-button.fairy::after {
  background: url('https://i.pinimg.com/originals/ab/93/38/ab93387a2449869fada997090714ea37.gif') no-repeat center center;
}

.type-button.all-types {
  background-color: #666666;
}

.container {
  padding: 20px;
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.columns {
  display: grid !important;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 20px;
}

.column {
  display: flex;
  justify-content: center;
}

.card {
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  transition: transform 0.3s, box-shadow 0.3s;
  border-radius: 10px;
  overflow: hidden;
  background-color: #ffffff;
}

.card:hover {
  transform: scale(1.05);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
}

.pagination-wrapper {
  display: flex;
  justify-content: center;
  width: 100%;
}

.pagination-controls {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 5px;
  padding: 5px 10px;
  margin-bottom: 10px;
  background-color: #f0f0f0;
  border-radius: 25px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  max-width: fit-content;
}

.pagination-controls button,
.pagination-controls span {
  padding: 5px 10px;
  font-size: 14px;
  border: none;
  border-radius: 50%;
  background-color: #ffffff;
  color: #666;
  cursor: pointer;
  transition: background-color 0.3s, transform 0.2s, box-shadow 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.pagination-controls button:disabled {
  background-color: #eee;
  cursor: not-allowed;
  color: #ccc;
}

.pagination-controls button:not(:disabled):hover {
  background-color: #e0e0e0;
  transform: scale(1.05);
}

.pagination-controls .active {
  background-color: #007bff;
  color: white;
  box-shadow: 0 2px 4px rgba(0, 123, 255, 0.3);
}

.pagination-controls span {
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 5px 10px;
  cursor: pointer;
  transition: background-color 0.3s, transform 0.2s, box-shadow 0.2s;
}

.pagination-controls span:hover {
  background-color: #e0e0e0;
  transform: scale(1.05);
}

@media screen and (max-width: 768px) {
  .pagination-controls {
    flex-wrap: wrap;
    gap: 5px;
  }

  .pagination-controls button,
  .pagination-controls span {
    padding: 5px 10px;
    font-size: 12px;
  }
}

.loading-spinner {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  font-size: 2rem;
  color: #000;
}

.loader {
  border: 4px solid #f3f3f3;
  border-top: 4px solid #3498db;
  border-radius: 50%;
  width: 24px;
  height: 24px;
  animation: spin 1s linear infinite;
  position: absolute;
  right: 10px;
  top: 50%;
  transform: translateY(-50%);
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }

  100% {
    transform: rotate(360deg);
  }
}

@media screen and (min-width: 1408px) {
  .container:not(.is-max-desktop):not(.is-max-widescreen) {
    max-width: 1800px;
  }
}
</style>
