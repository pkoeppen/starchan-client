import Vue from 'vue';
import Identicon from 'identicon.js';
import Simplebar from 'simplebar-vue';
import TimeAgo from 'javascript-time-ago';
import en from 'javascript-time-ago/locale/en';

Vue.component('Simplebar', Simplebar);

TimeAgo.addLocale(en);
const timeAgo = new TimeAgo('en-US');

export default async function ({ store }, inject) {
  if (process.browser) {
    await store.dispatch('nuxtClientInit');
  }

  inject('timeAgo', (time) => {
    return timeAgo.format(new Date(time));
  });

  inject('identicon', (str, options = {}) => {
    try {
      const identicon = new Identicon(str, {
        margin: 0.2,
        size: 32,
        format: 'svg',
        ...options,
      });
      return identicon;
    } catch (error) {
      // Probably the 'hash of at least 15 characters is required' error.
      return null;
    }
  });
}
