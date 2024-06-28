import { createApp } from 'vue'
import App from './App.vue'
import VueLazyload from 'vue-lazyload'
import "../node_modules/bulma/css/bulma.css"

const app = createApp(App);

app.use(VueLazyload);

app.mount('#app');
