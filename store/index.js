import * as cookie from 'cookie';
import Identicon from 'identicon.js';

export const state = () => ({
  modRoute: false,
  showNsfw: false,
  darkMode: false,
  sidebar: true,
  modals: {
    // Login modal.
    auth: {
      visible: false,
      data: {},
    },
    // New thread modal.
    thread: {
      visible: false,
      data: {},
    },
    // File viewer.
    lightbox: {
      visible: false,
      data: {},
    },
    // 'Report post' modal.
    reportPost: {
      visible: false,
      data: {},
    },
    // 'Delete post' modal.
    deletePost: {
      visible: false,
      data: {},
    },
    // 'Ban post' modal.
    banPost: {
      visible: false,
      data: {},
    },
    // Thread options modal.
    editThread: {
      visible: false,
      data: {},
    },
    // Board options modal.
    editBoard: {
      visible: false,
      data: {},
    },
    // Edit user modal.
    editUser: {
      visible: false,
      data: {},
    },
    // "Start chat" modal.
    startChat: {
      visible: false,
      data: {},
    },
  },
  mainScrollElement: null,
  sidebarScrollElement: null,
  agentData: {},
  identicon: '',
});

export const getters = {
  getAgentData(state) {
    return state.agentData;
  },
};

export const actions = {
  /*
   * Client init.
   */
  async nuxtClientInit(context) {
    // Set mod route status.
    const host = window.location.host.split(':')[0];
    context.commit('setModRoute', host.startsWith('mod.'));

    // Set agent data.
    const { data: agentData } = await this.$axios.get(
      'https://www.cloudflare.com/cdn-cgi/trace'
    );
    context.commit('setAgentData', agentData);

    // Set identicon.
    const { ip } = context.getters.getAgentData;
    const identicon = new Identicon(ip.padEnd(15, '#'), {
      margin: 0.2,
      size: 32,
      format: 'svg',
      foreground: [33, 33, 33, 255],
      background: [229, 231, 235, 255],
    });
    context.commit(
      'setIdenticon',
      `data:image/svg+xml;base64,${identicon.toString()}`
    );
  },

  /*
   * Server init.
   */
  nuxtServerInit(context, { req, redirect }) {
    // Set mod route status.
    const host = req.headers.host;
    context.commit('setModRoute', host.startsWith('mod.'));

    // Set identicon.
    const ip = req.connection.remoteAddress;
    const identicon = new Identicon(ip.padEnd(15, '#'), {
      margin: 0.2,
      size: 32,
      format: 'svg',
      foreground: [33, 33, 33, 255],
      background: [229, 231, 235, 255],
    });
    context.commit(
      'setIdenticon',
      `data:image/svg+xml;base64,${identicon.toString()}`
    );

    // Set mod user.
    if (req.headers?.cookie) {
      // Found cookies.
      try {
        const cookies = cookie.parse(req.headers.cookie);
        const token = cookies.token;
        const expires = parseInt(cookies.expires);
        const userData = JSON.parse(cookies.user);

        if (!token || !expires || !userData) {
          throw new Error('Invalid cookie');
        }
        if (expires < Date.now()) {
          throw new Error('Invalid cookie');
        }

        context.commit('api/setUserData', userData);
        context.commit('api/setSessionData', { token, expires });
      } catch (error) {
        context.commit('api/setUserData', null);
        context.commit('api/setSessionData', null);
        if (host.startsWith('mod.')) {
          redirect('/login/');
        }
      }
    } else {
      // No cookies.
      context.commit('api/setUserData', null);
      context.commit('api/setSessionData', null);
    }
  },
};

export const mutations = {
  showModal(_state, { modal, data }) {
    if (data) _state.modals[modal].data = data || {};
    _state.modals[modal].visible = true;
  },
  hideModal(_state, { modal, data }) {
    _state.modals[modal].visible = false;
    if (data) _state.modals[modal].data = data || {};
  },
  setModalData(_state, { modal, data }) {
    _state.modals[modal].data = { ..._state.modals[modal].data, ...data };
  },
  clearModalData(_state, { modal }) {
    _state.modals[modal].data = {};
  },
  toggleSidebar(_state) {
    _state.sidebar = !_state.sidebar;
  },
  updateShowNsfw(_state, value) {
    _state.showNsfw = value;
  },
  updateDarkMode(_state, value) {
    _state.darkMode = value;
  },
  setMainScrollElement(_state, element) {
    _state.mainScrollElement = element;
  },
  setSidebarScrollElement(_state, element) {
    _state.sidebarScrollElement = element;
  },
  scrollTop(_state) {
    setTimeout(() => (_state.mainScrollElement.scrollTop = 0), 0);
  },
  setAgentData(_state, str) {
    const data = {};
    const lines = str.split('\n').filter((line) => line);
    for (const line of lines) {
      const [key, val] = line.split('=');
      data[key] = val;
    }
    _state.agentData = data;
  },
  setIdenticon(_state, value) {
    _state.identicon = value;
  },
  setModRoute(_state, value) {
    _state.modRoute = value;
  },
};
