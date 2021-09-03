// import * as querystring from 'querystring';

export const state = () => ({
  authenticating: false,
  userData: null,
  sessionData: null,
});

export const actions = {
  /*
   * Logs a user in.
   */
  logIn(context, { recaptcha, formData }) {
    context.commit('setAuthenticating', true);
    return this.$axios
      .post(`/users/login?recaptcha=${recaptcha}`, formData)
      .then(({ data }) => {
        const { user: userData, ...sessionData } = data;
        context.commit('setUserData', userData);
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
      .post(`/users/logout`)
      .catch(this.$catch)
      .finally(() => {
        setTimeout(() => {
          context.commit('setUserData', null);
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
   * Lists (up to 10) sticky threads.
   */
  listStickyThreads(context, { boardId, take }) {
    return this.$axios
      .get(`/threads/${boardId}/sticky`, { params: { take } })
      .then(({ data }) => data);
  },

  /*
   * Lists the latest 10 threads.
   */
  listLatestThreads(context, { boardId, take }) {
    return this.$axios
      .get(`/threads/${boardId}/latest`, { params: { take }, progress: false })
      .then(({ data }) => data);
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
   * Gets multiple posts.
   */
  getPosts(context, { boardId, ...params }) {
    return this.$axios
      .get(`/posts/${boardId}`, { params })
      .then(({ data }) => data)
      .catch(this.$catch);
  },

  /*
   * Adds a post reply to the given thread.
   */
  addPost(context, { recaptcha, formData }) {
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
   * Searches posts by text.
   */
  search(context, params) {
    return this.$axios
      .get(`/search`, { params, progress: false }, { progress: false })
      .then(({ data }) => data)
      .catch(this.$catch);
  },

  /*
   * Gets multiple reports.
   */
  getReports(context, params) {
    return this.$axios
      .get(`/reports`, { params })
      .then(({ data }) => data)
      .catch(this.$catch);
  },

  /*
   * Submits a new report on the given post.
   */
  addReport(context, { recaptcha, formData }) {
    return this.$axios
      .put(`/reports?recaptcha=${recaptcha}`, formData)
      .then(({ data }) => data)
      .catch(this.$catch);
  },

  /*
   * Deletes a report by ID.
   */
  deleteReport(context, { reportId }) {
    return this.$axios
      .delete(`/reports/${reportId}`)
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

  /*
   * Updates a thread by ID.
   */
  updateThread(context, { boardId, threadId, formData }) {
    return this.$axios
      .post(`/threads/${boardId}/${threadId}`, formData)
      .then(({ data }) => data);
  },

  /*
   * Gets multiple bans.
   */
  getBans(context, params) {
    return this.$axios
      .get(`/bans`, { params })
      .then(({ data }) => data)
      .catch(this.$catch);
  },

  /*
   * Creates a new ban for the given IP address.
   */
  addBan(context, { formData }) {
    return this.$axios
      .put(`/bans`, formData)
      .then(({ data }) => data)
      .catch(this.$catch);
  },

  /*
   * Deletes a ban by ID.
   */
  deleteBan(context, { banId }) {
    return this.$axios
      .delete(`/bans/${banId}`)
      .then(({ data }) => data)
      .catch(this.$catch);
  },

  /*
   * Updates a board by ID.
   */
  updateBoard(context, { boardId, formData }) {
    return this.$axios
      .post(`/boards/${boardId}`, formData)
      .then(({ data }) => data)
      .catch(this.$catch);
  },

  /*
   * Gets multiple users.
   */
  getUsers(context, params) {
    return this.$axios
      .get(`/users`, { params })
      .then(({ data }) => data)
      .catch(this.$catch);
  },

  /*
   * Updates a user by ID.
   */
  updateUser(context, { userId, formData }) {
    return this.$axios
      .post(`/users/${userId}`, formData)
      .then(({ data }) => data)
      .catch(this.$catch);
  },

  /*
   * Gets multiple log entries.
   */
  getLogEntries(context, params) {
    return this.$axios
      .get(`/log`, { params })
      .then(({ data }) => data)
      .catch(this.$catch);
  },

  /*
   * Starts a chat room with the given author ID.
   */
  startChat(context, { recaptcha, formData }) {
    return this.$axios
      .put(`/chat?recaptcha=${recaptcha}`, formData)
      .then(({ data }) => data);
  },
};

export const mutations = {
  setAuthenticating(_state, authenticating) {
    _state.authenticating = authenticating;
  },
  setUserData(_state, userData) {
    _state.userData = userData;
    if (process.browser && !userData) {
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
  const expiry = +new Date(0);
  // sub.domain.com:3000 -> domain.com
  const domain = window.location.host
    .split(':')[0]
    .split('.')
    .slice(-2)
    .join('.');
  document.cookie = `${name}=; expires=${expiry}; domain=${domain}; path=/`;
}
