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
    baseDataUrl: 'https://s3.amazonaws.com/data.starchan.org',
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
    siteKey:
      '6LcD-tcUAAAAAGDzZoPmqTrPkXLQgixHGIWhc5v1' ||
      process.env.RECAPTCHA_PUBLIC_KEY, // todo
    version: 3,
  },
  axios: {
    baseURL: 'http://local.starchan.org:3001',
    credentials: true,
    init(axios) {
      axios.defaults.withCredentials = true;
    },
  },
  content: {},
  build: {},
};
