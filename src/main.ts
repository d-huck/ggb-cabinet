import { createApp } from 'vue';
import PrimeVue from 'primevue/config';
import Aura from '@primevue/themes/aura';

import Mapper from './Mapper.vue';
import './index.css';

const app = createApp(Mapper);
app.use(PrimeVue, {
  theme: {
    preset: Aura
  }
});
app.mount('#app');
