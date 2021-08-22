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
    baseDataUrl: getBaseDataUrl(),
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
    // The host 'starchan-server' is set by Docker.
    // When making a server-side request, stay within the VPC
    // instead of sending the request out and back in again.
    baseURL: 'http://starchan-server:3001',
    browserBaseURL: getBrowserBaseUrl(),
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
      poll: 1000
    }
  },
};

function getBrowserBaseUrl() {
  console.log('NODE_ENV:', process.env.NODE_ENV);
  switch (process.env.NODE_ENV) {
    case 'production':
      return 'https://api.starchan.org';
    case 'development':
      return 'https://api-dev.starchan.org';
    case 'local':
      return 'http://local.starchan.org:3001';
    default:
      throw new Error('Invalid NODE_ENV. Could not set base browser API URL');
  }
}

function getBaseDataUrl() {
  switch (process.env.NODE_ENV) {
    case 'production':
      return 'https://data.starchan.org';
    case 'development':
      return 'https://s3.amazonaws.com/data.starchan.org'; // todo
    case 'local':
      return 'https://s3.amazonaws.com/data.starchan.org'; // todo
    default:
      throw new Error('Invalid NODE_ENV. Could not set base data URL');
  }
}
