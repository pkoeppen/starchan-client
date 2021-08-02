// import * as querystring from 'querystring';

export const state = () => ({
  authenticating: false,
  modData: null,
  sessionData: null,
});

export const actions = {
  /*
   * Logs a user in.
   */
  logIn(context, { recaptcha, formData }) {
    context.commit('setAuthenticating', true);
    return this.$axios
      .post(`/mod/login?recaptcha=${recaptcha}`, formData)
      .then(({ data }) => {
        const { mod: modData, ...sessionData } = data;
        context.commit('setModData', modData);
        context.commit('setSessionData', sessionData);
      })
      .catch(this.$catch)
      .finally(() => context.commit('setAuthenticating', false));
  },

  /*
   * Logs a user out.
   */
  logOut(context) {
    return this.$axios
      .post(`/mod/logout`)
      .catch(this.$catch)
      .finally(() => {
        setTimeout(() => {
          context.commit('setModData', null);
          context.commit('setSessionData', null);
        }, 0);
      });
  },

  /*
   * Lists all boards.
   */
  getBoards(context, params) {
    return this.$axios
      .get(`/boards`, { params })
      .then(({ data }) => data)
      .catch(this.$catch);
  },

  /*
   * Gets multiple threads.
   */
  getThreads(context, { boardId, ...params }) {
    return this.$axios
      .get(`/threads/${boardId}`, { params })
      .then(({ data }) => data)
      .catch(this.$catch);
  },

  /*
   * Gets one thread.
   */
  getThread(context, { boardId, threadId }) {
    return this.$axios
      .get(`/threads/${boardId}/${threadId}`)
      .then(({ data }) => data)
      .catch(this.$catch);
  },

  /*
   * Adds a post reply to the given thread.
   */
  addPost(context, { recaptcha, threadId, formData }) {
    return this.$axios
      .put(`/posts?recaptcha=${recaptcha}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
      .then(({ data }) => data)
      .catch(this.$catch);
  },

  /*
   * Deletes a post by ID.
   */
  deletePost(context, { postId, formData }) {
    return this.$axios
      .delete(`/posts/${postId}`, { data: formData })
      .then(({ data }) => data)
      .catch(this.$catch);
  },

  /*
   * Adds a new thread.
   */
  addThread(context, { boardId, recaptcha, formData }) {
    return this.$axios
      .put(`/threads/${boardId}?recaptcha=${recaptcha}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
      .then(({ data }) => data)
      .catch(this.$catch);
  },
};

export const mutations = {
  setAuthenticating(_state, authenticating) {
    _state.authenticating = authenticating;
  },
  setModData(_state, modData) {
    _state.modData = modData;
    if (process.browser && !modData) {
      const cookies = document.cookie.split(';');
      for (let i = 0; i < cookies.length; i++)
        clearCookie(cookies[i].split('=')[0]);
    }
  },
  setSessionData(_state, sessionData) {
    _state.sessionData = sessionData;
  },
};

/*
 * Deletes a cookie.
 */
function clearCookie(name) {
  const domain = 'local.starchan.org'; // TODO - change this for prod
  const expiry = +new Date(0);
  document.cookie = `${name}=; expires=${expiry}; domain=${domain}; path=/`;
}
