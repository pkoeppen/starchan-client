export default function ({ $axios, store, redirect }) {
  $axios.interceptors.request.use((config) => {
    const sessionData = store.state.api.sessionData;
    if (sessionData) {
      const token = sessionData.token;
      // If session is expired, remove session and mod data.
      if (!sessionData.expires || sessionData.expires < Date.now()) {
        store.commit('api/setSessionData', null);
        store.commit('api/setModUser', null);
        redirect('/login/');
      } else {
        // This will be used server-side to authenticate requests.
        config.headers.common.jwt = token;
      }
    }
    return config;
  });
}
