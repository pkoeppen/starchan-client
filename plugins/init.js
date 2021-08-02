import Vue from 'vue';
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
}
