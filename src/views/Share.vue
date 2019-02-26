<template>
  <div class="container">
    <h2>代码分享({{title}}):</h2>
    <div v-highlightjs="sourceCode">
      <pre>
        <code class="cpp"></code>
      </pre>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import api from '../api/api';

@Component
export default class Share extends Vue {
  sourceCode: string = '';
  title: string = '';

  mounted() {
    const params = this.$route.params;
    api.getCommit({ id: params.id }).then(res => {
      this.sourceCode = res.data.code;
      this.title = res.data.problemTitle;
    }).catch(err => {
      console.log(err);
    });
  }
}
</script>

<style lang="less" scoped>
@media (min-width: 1200px) {
    .container {
      width: 1170px;
      margin: 0 auto;
      padding-top: 24px;
    }
}
.container {
  text-align: left;
}
</style>
