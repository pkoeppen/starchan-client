export default function ({ store, redirect, route, error }) {
  const modRoute = store.state.modRoute;
  const sessionData = store.state.api.sessionData;
  if (modRoute) {
    if (!sessionData && route.path !== '/login/') {
      redirect('/login/');
    } else if (sessionData?.expires < Date.now()) {
      store.commit('api/setModData', null);
      store.commit('api/setSessionData', null);
      redirect('/login/');
    }
  } else if (route.path === '/login/') {
    error({ statusCode: 404, message: 'This page could not be found' });
  }
}
