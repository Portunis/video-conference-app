import { createApp } from 'vue'
import App from './App.vue'
import {router, store} from "./provides";
import './styles/index.css'
export const application = createApp(App).use(router).use(store)
