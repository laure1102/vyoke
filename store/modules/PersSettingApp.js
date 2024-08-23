

const PersSettingApp = {
  state: {
    currentMenu:"",
  },
  mutations:{
    SET_CURRENT_MENU(state,in_currentMenu){
      state.currentMenu = in_currentMenu;
    },
  },
  actions: {
    nuxtServerInit: async ({ commit }, { req, res }) => {
    }
  }
}

export default PersSettingApp
