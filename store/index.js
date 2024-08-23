import Vue from 'vue'
import Vuex from 'vuex'
import PersSettingApp from "./modules/PersSettingApp"
Vue.use(Vuex)

const store = () =>
  new Vuex.Store({
    state: {
    },
    getters: {
    },
    mutations: {
    },
    actions: {
      nuxtServerInit: async ({ commit }, { req, res }) => {
      }
    },
    modules: {
      PersSettingApp,
    }
  })

export default store
