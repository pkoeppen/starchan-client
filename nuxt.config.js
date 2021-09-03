export default {
  head: {
    title: '*chan',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: '' },
    ],
    link: [{ rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }],
  },
  publicRuntimeConfig: {
    env: process.env.NODE_ENV,
    socketUrl: process.env.SOCKET_URL,
    baseDataUrl: process.env.DATA_URL,
    axios: {
      browserBaseURL: process.env.BROWSER_BASE_URL,
    },
  },
  privateRuntimeConfig: {
    axios: {
      baseURL: process.env.BASE_URL,
    },
  },
  router: {
    middleware: ['auth'],
    trailingSlash: true,
  },
  css: [],
  plugins: [
    '~/plugins/init',
    '~/plugins/catch',
    '~/plugins/auth',
    '~/plugins/events',
    '~/plugins/socket',
  ],
  components: true,
  buildModules: [
    '@nuxtjs/eslint-module',
    '@nuxtjs/stylelint-module',
    '@nuxtjs/tailwindcss',
  ],

  modules: ['@nuxtjs/axios', '@nuxtjs/pwa', '@nuxtjs/recaptcha'],
  recaptcha: {
    hideBadge: true,
    siteKey: '6LcD-tcUAAAAAGDzZoPmqTrPkXLQgixHGIWhc5v1',
    version: 3,
  },
  axios: {
    credentials: true,
    init(axios) {
      axios.defaults.withCredentials = true;
    },
  },
  content: {},
  build: {},
  server: {
    host: '0.0.0.0',
    port: 3000,
  },
  watchers: {
    webpack: {
      aggregateTimeout: 300,
      poll: 1000,
    },
  },
};
