export default function ({ error }, inject) {
  inject('catch', (e) => {
    const statusCode = e?.response?.status || e?.status || 500;
    const message = e?.response?.data || e?.message || 'Internal server error';
    error({ statusCode, message });
    return false;
  });
}
