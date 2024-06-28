# PokeHaven

## 📕 Descrição
O PokeHaven é uma aplicação web que permite aos usuários buscar, filtrar e visualizar detalhes sobre Pokémon. Utilizando a API do PokeAPI, a aplicação exibe informações detalhadas sobre cada Pokémon, incluindo seus tipos, habilidades, e estatísticas. Desenvolvida com Vue.js, a interface é interativa e responsiva, proporcionando uma experiência de usuário envolvente.

## 💻 Tecnologias Utilizadas
- **Vue.js**: Framework JavaScript para construção de interfaces de usuário
- **Axios**: Cliente HTTP baseado em Promises
- **Lodash.debounce**: Utilitário para otimização de funções
- **@fortawesome/fontawesome-free**: Biblioteca de ícones
- **PokeAPI**: API para obtenção dos dados dos Pokémon

## ⚒️ Requisitos
- **Node.js** (versão 14 ou superior)
- **NPM** (versão 6 ou superior)
- **Git** (para controle de versão)

## 📁 Configuração do Projeto
1. **Clone o repositório:**
   ```bash
   git clone https://github.com/seu-usuario/pokehaven.git
   cd pokehaven
   npm install
   npm run serve
   ```
## 🧑🏻‍💻 Funcionalidades
- **Pesquisa de Pokémon:** Utilize a barra de pesquisa para encontrar Pokémon pelo nome.
- **Filtragem por Tipo:** Filtre os Pokémon por tipo utilizando o menu lateral.
- **Paginação:** Navegue entre as páginas para visualizar mais Pokémon.
- **Detalhes do Pokémon:** Clique em um Pokémon para ver detalhes como tipos, altura, peso, habilidades e estatísticas.

## 🔍 Componentes
  ### App.vue
  - Estrutura principal da aplicação, incluindo o cabeçalho, barra de pesquisa, menu de filtros, e área principal de exibição dos Pokémon.
  ### PokemonCard.vue
  - Exibe informações resumidas de cada Pokémon, incluindo imagem, número, nome e tipos.
  ### PokemonModal.vue
  - Modal que exibe informações detalhadas do Pokémon selecionado, como tipos, altura, peso, habilidades e estatísticas.

## Deploy da Aplicação
- A aplicação pode ser facilmente acessada em https://pokedexvuejs.vercel.app/
