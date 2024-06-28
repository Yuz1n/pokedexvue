<template>
  <div class="card-container">
    <div class="card pokemon-card" :style="{ backgroundColor: typeColor, '--hover-background': isHovered ? typeBackground : '' }" @mouseover="isHovered = true" @mouseleave="isHovered = false">
      <div class="card-content">
        <div class="circle-background"></div>
        <figure class="image is-96x96">
          <img v-lazy="pokemon.front" alt="Pokemon image">
        </figure>
        <div class="media-content">
          <p class="pokemon-number">{{ formattedNum }}</p>
          <p class="pokemon-name">{{ upperName }}</p>
          <div class="pokemon-types">
            <span v-if="pokemon.type_primary" :class="['type-badge', pokemon.type_primary]">{{ pokemon.type_primary.toUpperCase() }}</span>
            <span v-if="pokemon.type_secundary" :class="['type-badge', pokemon.type_secundary]">{{ pokemon.type_secundary.toUpperCase() }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'PokemonCard',
  data() {
    return {
      pokemon: {
        type_primary: '',
        type_secundary: '',
        front: '',
        back: ''
      },
      isHovered: false,
      typeColors: {
        grass: '#A7D796',
        fire: '#F5A152',
        water: '#90B4F8',
        bug: '#C8DB8C',
        normal: '#BBBB99',
        poison: '#D16BD1',
        electric: '#F6DA69',
        ground: '#DFC274',
        fairy: '#F6A7B9',
        fighting: '#E1524A',
        psychic: '#FC78A0',
        rock: '#BBA750',
        ghost: '#856DAF',
        ice: '#A2DEDE',
        dragon: '#8151F7',
        dark: '#746256',
        steel: '#C2C2D7',
        flying: '#BBA5FB'
      },
      typeBackgrounds: {
        fire: 'url("https://pokedex.johanalves.com/img/fire-background.gif")',
        grass: 'url("https://pokedex.johanalves.com/img/grass-background.gif")',
        water: 'url("https://pokedex.johanalves.com/img/water-background.gif")',
        electric: 'url("https://pokedex.johanalves.com/img/eletric-background.gif")',
        ice: 'url("https://i.pinimg.com/originals/02/e0/be/02e0be2271aca12287d673a01c7a93f3.gif")',
        fighting: 'url("https://i.pinimg.com/originals/fe/7d/dc/fe7ddc354ae4ddc7df12e3ca9cd061f8.gif")',
        poison: 'url("https://i.pinimg.com/originals/00/4a/52/004a52a4e7902ad319bd144612e8fa48.gif")',
        ground: 'url("https://i.pinimg.com/originals/65/74/21/6574217794ecd6308f40c8ebef07490c.gif")',
        flying: 'url("https://i.pinimg.com/originals/62/c3/83/62c38337b5b08da09f4219cf5c5c3dd7.gif")',
        psychic: 'url("https://i.pinimg.com/originals/ba/85/b6/ba85b69da2fcb86ec5740f8e0f2f08e6.gif")',
        bug: 'url("https://i.pinimg.com/originals/8a/69/45/8a6945be929c637c1fef046f319cdf30.gif")',
        rock: 'url("https://i.pinimg.com/originals/dc/c0/ec/dcc0ecd5efce49527589ff31c9aef9c5.gif")',
        ghost: 'url("https://i.pinimg.com/originals/7f/91/60/7f91604ce51abbf2f6454d801fae31be.gif")',
        dragon: 'url("https://i.pinimg.com/originals/32/58/f9/3258f9d89b079057ac1576e4a3ab8139.gif")',
        dark: 'url("https://i.pinimg.com/originals/fb/95/bf/fb95bfaf7793e153e424185bbb691e77.gif")',
        steel: 'url("https://i.pinimg.com/originals/c0/9f/3b/c09f3b64b96cf6b583f7d5c96ba70389.gif")',
        fairy: 'url("https://i.pinimg.com/originals/71/16/38/71163866696dece4477ab32aa114ad89.gif")'
      }
    };
  },
  props: {
    name: String,
    url: String,
    num: Number
  },
  computed: {
    upperName() {
      if (!this.name) return '';
      return this.name.charAt(0).toUpperCase() + this.name.slice(1);
    },
    typeColor() {
      return this.typeColors[this.pokemon.type_primary] || '#FFFFFF';
    },
    typeBackground() {
      return this.typeBackgrounds[this.pokemon.type_primary] || 'none';
    },
    formattedNum() {
      return `#${String(this.num).padStart(4, '0')}`;
    }
  },
  created() {
    axios.get(this.url).then(response => {
      if (response.data.types.length > 1) {
        this.pokemon.type_primary = response.data.types[0].type.name;
        this.pokemon.type_secundary = response.data.types[1].type.name;
      } else {
        this.pokemon.type_primary = response.data.types[0].type.name;
        this.pokemon.type_secundary = '';
      }
      this.pokemon.front = response.data.sprites.front_default;
      this.pokemon.back = response.data.sprites.back_default;
    });
  }
};
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Roboto:wght@400;700&display=swap');
.card-container {
  flex: 1;
  padding: 10px;
  display: flex;
  justify-content: center;
}

.pokemon-card {
  width: 200px;
  height: 300px;
  border-radius: 5px!important;
  border: 8px solid gold; /* Moldura dourada */
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2)!important;
  transition: transform 0.2s;
  text-align: center;
  padding: 20px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  position: relative;
  overflow: hidden;
  background-size: cover;
  --hover-background: url('../assets/backgroundCard/backgroundCard.jpg');
}

.pokemon-card::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-image: var(--hover-background);
  background-size: cover;
  background-position: center;
  opacity: 0.15; /* Opacidade baixa */
  z-index: 0;
  transition: background-image 0.3s, opacity 0.3s;
}

.pokemon-card:hover::after {
  opacity: 0.1; /* Ajuste a opacidade conforme necessário */
}

.pokemon-card:hover {
  transform: scale(1.05);
}

.circle-background {
  width: 110px;
  height: 110px;
  background-color: rgba(255, 255, 255, 0.575);
  border-radius: 50%;
  position: absolute;
  top: 30%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 1;
}

.image {
  margin: 0 auto;
  filter: drop-shadow(0 0 15px rgba(0, 0, 0, 0.8));
  z-index: 2;
}

.pokemon-number {
  font-family: 'Roboto', sans-serif;
  font-weight: bold;
  font-size: 1.2rem;
  color: #ffffff;
  margin-bottom: 5px;
  z-index: 2;
  position: relative;
}

.pokemon-name {
  font-family: 'Roboto', sans-serif;
  font-weight: bold;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  font-size: 1.5rem;
  margin-bottom: 5px;
  line-height: 1.2;
  color: #ffffff;
  z-index: 2;
  position: relative;
}

.pokemon-types {
  display: flex;
  gap: 5px;
  justify-content: center;
  z-index: 2;
  position: relative;
}

.type-badge {
  padding: 5px 10px;
  border-radius: 5px;
  color: white;
  text-transform: uppercase;
  font-weight: bold;
  font-size: 0.8rem;
  border: 1px solid rgba(0, 0, 0, 0.3);
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
  text-shadow: 1px 1px 2px rgba(0, 0, 0, .7);
  z-index: 2;
  position: relative;
}

.type-badge.grass { background-color: #78C850; }
.type-badge.fire { background-color: #F08030; }
.type-badge.water { background-color: #6890F0; }
.type-badge.bug { background-color: #A8B820; }
.type-badge.normal { background-color: #A8A878; }
.type-badge.poison { background-color: #A040A0; }
.type-badge.electric { background-color: #F8D030; }
.type-badge.ground { background-color: #E0C068; }
.type-badge.fairy { background-color: #EE99AC; }
.type-badge.fighting { background-color: #C03028; }
.type-badge.psychic { background-color: #F85888; }
.type-badge.rock { background-color: #B8A038; }
.type-badge.ghost { background-color: #705898; }
.type-badge.ice { background-color: #98D8D8; }
.type-badge.dragon { background-color: #7038F8; }
.type-badge.dark { background-color: #705848; }
.type-badge.steel { background-color: #B8B8D0; }
.type-badge.flying { background-color: #A890F0; }

.pokemon-subtitle {
  font-family: inherit;
  font-weight: normal;
  font-size: 0.9rem;
  margin-top: 0;
  color: #ffffff;
  z-index: 2;
  position: relative;
}

.media-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  z-index: 2;
  position: relative;
}
</style>
