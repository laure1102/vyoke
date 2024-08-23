<template>
  <div>
    <span>你好,{{name}}</span>
    <br>
    <span>message:</span><br>
    <span>abcde</span>
  </div>
</template>

<script>
export default {
  async asyncData({ params,query, $axios }) {
    return {
      name:'laure',
      res: "nononoo"
    }
  },
  mounted(){
  },

  methods: {
  }
}
</script>
