<template>
  <div class="modal" :class="{ 'is-active': isActive }">
    <div class="modal-background" @click="closeModal"></div>
    <div class="modal-card">
      <button class="delete close" aria-label="close" @click="closeModal"></button>
      <div class="columns is-mobile">
        <div class="column is-one-third left-container has-text-centered" :style="{ backgroundImage: `url(${backgroundImage})` }">
          <div class="image">
            <img :src="pokemon.front" alt="Pokemon image" id="js-image-pokemon-modal">
          </div>
        </div>
        <div class="column right-container">
          <div class="name">
            <h2 id="js-name-pokemon-modal">{{ upperName }}</h2>
            <span id="js-code-pokemon-modal">{{ formattedNum }}</span>
          </div>
          <ul class="type" id="js-types-pokemon">
            <li v-for="type in pokemon.types" :key="type">
              <span :class="['tag-type', type]">{{ type.toUpperCase() }}</span>
            </li>
          </ul>
          <ul class="info">
            <li>
              <span>Height</span>
              <p id="js-height-pokemon">{{ pokemon.height / 10 }} m</p>
            </li>
            <li>
              <span>Weight</span>
              <p id="js-weight-pokemon">{{ pokemon.weight / 10 }} kg</p>
            </li>
            <li class="abilities">
              <span>Abilities</span>
              <div id="js-main-abilities">
                <div v-for="ability in pokemon.abilities" :key="ability" class="ability">{{ ability }}</div>
              </div>
            </li>
          </ul>
          <div class="weak">
            <h4>Weaknesses</h4>
            <ul id="js-area-weak">
              <li v-for="weakness in weaknesses" :key="weakness">
                <span :class="['tag-type', weakness]">{{ weakness }}</span>
              </li>
            </ul>
          </div>
          <div class="stats">
            <h5>Status</h5>
            <div class="all">
              <div class="item" v-for="stat in pokemon.stats" :key="stat.name">
                <span>{{ stat.name.toUpperCase() }}</span>
                <div class="bar-status">
                  <div class="bar" :style="{ width: stat.value + '%' }"></div>
                  <ul class="separator">
                    <li></li>
                    <li></li>
                    <li></li>
                    <li></li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'PokemonModal',
  props: {
    isActive: Boolean,
    pokemonData: Object,
    num: Number
  },
  data() {
    return {
      pokemon: {
        name: '',
        front: '',
        types: [],
        height: 0,
        weight: 0,
        abilities: [],
        stats: []
      },
      weaknesses: [],
      superEffective: [],
      typeIcon: ''
    };
  },
  computed: {
    upperName() {
      return this.pokemon.name.charAt(0).toUpperCase() + this.pokemon.name.slice(1);
    },
    formattedNum() {
      return `#${String(this.num).padStart(4, '0')}`;
    },
    typeClass() {
      return this.pokemon.types.length > 0 ? this.pokemon.types[0] : '';
    },
    backgroundImage() {
      if (this.pokemon.types.length > 0) {
        const mainType = this.pokemon.types[0];
        return require(`@/assets/backgroundModal/${mainType}.svg`);
      }
      return '';
    }
  },
  watch: {
    pokemonData: {
      immediate: true,
      handler(newVal) {
        if (newVal) {
          this.fetchPokemonDetails(newVal);
        }
      }
    }
  },
  methods: {
    fetchPokemonDetails(pokemonData) {
      axios.get(pokemonData.url).then(response => {
        const data = response.data;
        this.pokemon.name = data.name;
        this.pokemon.front = data.sprites.other.home.front_default;
        this.pokemon.types = data.types.map(typeInfo => typeInfo.type.name);
        this.pokemon.height = data.height;
        this.pokemon.weight = data.weight;
        this.pokemon.abilities = data.abilities.map(abilityInfo => abilityInfo.ability.name);
        this.pokemon.stats = data.stats.map(statInfo => ({
          name: statInfo.stat.name,
          value: statInfo.base_stat
        }));
        // Fetch Weaknesses and Super Effective Types
        this.fetchWeaknessesAndEffectiveTypes(data.types);
      });
    },
    fetchWeaknessesAndEffectiveTypes(types) {
      const promises = types.map(typeInfo => axios.get(typeInfo.type.url));

      Promise.all(promises).then(responses => {
        const weaknessesSet = new Set();
        const superEffectiveSet = new Set();

        responses.forEach(response => {
          const damageRelations = response.data.damage_relations;

          damageRelations.double_damage_from.forEach(type => weaknessesSet.add(type.name));
          damageRelations.double_damage_to.forEach(type => superEffectiveSet.add(type.name));
        });

        this.weaknesses = Array.from(weaknessesSet);
        this.superEffective = Array.from(superEffectiveSet);
      });
    },
    closeModal() {
      this.$emit('close');
    }
  }
};
</script>

<style scoped>
.modal-card {
  max-width: 1200px;
  width: 100%;
  background-color: white;
  border-radius: 10px;
  overflow: hidden;
  position: relative;
}

.modal-background {
  background-color: rgba(10, 10, 10, 0.86);
}

.close {
  position: absolute;
  top: 10px;
  right: 10px;
  background: black;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: black;
  z-index: 10;
}

.columns {
  display: flex;
  flex-wrap: nowrap;
}

.left-container {
  flex: 0 0 33%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-size: cover;
  background-repeat: no-repeat;
  background-position: center;
}

.right-container {
  flex: 1;
  padding: 20px!important;
}

.name {
  display: flex;
  font-family: "Montserrat", sans-serif;
  align-items: baseline;
  margin-bottom: 0.1rem;
}

.name h2 {
  margin-right: 10px;
  color: #2f3133;
  font-size: 1.8em;
  font-weight: 600;
}

.pokemon-number {
  font-size: 0.8em;
  color: rgba(255, 255, 255, 0.8);
}

.type {
  display: flex;
  list-style: none;
  margin-bottom: 1rem;
  padding: 0;
}

.type li {
  margin-right: 10px;
}

.info {
  display: flex;
  list-style: none;
  padding: 0;
  margin: 0;
}

.info li {
  flex-direction: column;
  justify-content: center;
  color: #7a7d8a;
  align-items: center;
  margin-right: 20%;
  font-family: "Inter", sans-serif;
}

.info li p {
  margin: 0;
  color: #2f3133;
  font-weight: 550;
  font-size: 1rem;
}

.abilities {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  text-align: center;
}

.abilities .ability {
  display: block;
  margin-top: 5px;
  color: #2f3133;
  white-space: nowrap;
  font-weight: 550;
}

.weak {
  font-family: "Montserrat", sans-serif;
}

.weak h4 {
  margin-top: 1rem;
  margin-bottom: 0.5rem;
  font-weight: 600;
  color: #4d5053;
}

.weak ul {
  display: flex;
  list-style: none;
  padding: 0;
}

.weak li {
  margin-right: 10px;
  margin-bottom: 0.8rem;
}

.stats h5 {
  margin-top: 1rem;
  margin-bottom: 0.5rem;
  font-weight: 600;
  color: #4d5053;
}

.all {
  display: flex;
  flex-direction: column;
}

.item {
  margin-bottom: 10px;
}

.bar-status {
  display: flex;
  width: 100%;
  align-items: center;
  position: relative;
  background-color: #eff3f6;
}

.bar {
  height: 10px;
  background-color: #4CAF50;
}

.separator {
  display: flex;
  position: absolute;
  width: 100%;
  justify-content: space-between;
  padding: 0;
  margin: 0;
  list-style: none;
}

.separator li {
  width: 2px;
  height: 10px;
  background-color: #fff;
}

.tag-type {
  background-color: #aaa;
  color: white;
  padding: 5px 10px;
  border-radius: 100px;
  text-transform: uppercase;
  font-weight: bold;
  font-size: 0.8em;
  border: 1px solid rgba(0, 0, 0, 0.3);
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
  text-shadow: 1px 1px 2px rgba(0, 0, 0, .7);
}

.grass {
  background-color: #78C850;
}

.poison {
  background-color: #A040A0;
}

.flying {
  background-color: #A890F0;
}

.bug {
  background-color: #A8B820;
}

.fire {
  background-color: #F08030;
}

.ice {
  background-color: #98D8D8;
}

.water {
  background-color: #6890F0;
}

.rock {
  background-color: #B8A038;
}

.ground {
  background-color: #E0C068;
}

.fairy {
  background-color: #EE99AC;
}

.electric {
  background-color: #F8D030;
}

.fighting {
  background-color: #C03028;
}

.psychic {
  background-color: #F85888;
}

.ghost {
  background-color: #705898;
}

.dragon {
  background-color: #7038F8;
}

.dark {
  background-color: #705848;
}
</style>