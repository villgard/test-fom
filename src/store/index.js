import { createStore } from 'vuex';
import axios from 'axios';

export default createStore({
  state: {
  },
  mutations: {
  },
  actions: {
    async uploadImages(formData) {
      return axios.post('https://httpbin.org/post', formData);
    },
  },
  modules: {
  },
});
