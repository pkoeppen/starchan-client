import Vue from 'vue';
const bus = new Vue();
export default function (context, inject) {
  inject('bus', bus);
}
