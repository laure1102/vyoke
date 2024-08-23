<template>
  <div class="error-500">
    <h1>{{error.statusCode}} happened</h1>
    <p>{{error.msg}}</p>
  </div>
</template>
<script>
export default {
  name: 'error-500',
  props: {
    error: {
      type: Object,
      default: () => {},
    },
  },
};
</script>
