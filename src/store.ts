import Vue from 'vue';
import Vuex from 'vuex';
import api from './api/api';
Vue.use(Vuex);

export default new Vuex.Store({
  // 全局变量
  state: {
    userInfo: '',
    token: '',
    username: '',
    loginStatus: '',
    role: ''
  },
  // 修改全局变量必须通过mutations中的方法
  // mutations只能采用同步方法
  mutations: {
    login(state, payload) {
      state.username = payload.username;
      state.token = payload.token;
      window.localStorage.setItem('token', payload.token);
      window.localStorage.setItem('username', payload.username);
    },
    logout(state) {
      console.log('注销成功');
      state.username = '';
      state.token = '';
      window.localStorage.setItem('token', '');
      window.localStorage.setItem('username', '');
      window.localStorage.setItem('times', '');
      window.localStorage.setItem('role', '');
    },
    refresh(state, payload) {
      state.token = payload.token;
      window.localStorage.setItem('token', payload.token);
    },
    setUserInfo(state, payload) {
      state.userInfo = payload;
      window.localStorage.setItem('userInfo', JSON.stringify(payload));
    },
    setRole(state, payload) {
      state.role = payload;
      window.localStorage.setItem('role', payload);
    }
  },
  actions: {
    login(context, payload) {
      return new Promise((resolve, reject) => {
        api
          .login(payload)
          .then((res: any) => {
            context.commit('login', {
              token: res.data.token,
              username: payload.username
            });
            resolve(res);
          })
          .catch((err: any) => {
            reject(err);
          });
      });
    },
    logout(context) {
      context.commit('logout');
    },
    refresh(context, payload) {
      api
        .refresh(payload)
        .then((res: any) => {
          context.commit('refresh', {
            token: res.data.token
          });
        })
        .catch((err: any) => {
          console.log(err, 'errRefresh');
        });
    }
  }
});
