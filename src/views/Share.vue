<template>
  <Row>
    <Col span="18" offset="3">
      <div class="container">
        <h2>代码分享自题目：{{ title }} </h2>
        <div v-highlightjs="sourceCode">
      <pre>
        <code class="cpp"></code>
      </pre>
        </div>
        <h2>错误信息</h2>
        <h4>信息：{{errMsg.message}}</h4>
        <h4>错误：{{errMsg.error}}</h4>
        <h4>结果：{{errMsg.result}}</h4>
      </div>
    </Col>
  </Row>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import api from '../api/api';

@Component
export default class Share extends Vue {
  sourceCode: string = '';
  title: string = '';
  errMsg: any = {};

  mounted() {
    const params = this.$route.params;
    api.getCommit({ id: params.id }).then((res: any) => {
      this.sourceCode = res.data.code.replace(/\\n/g, '\n');
      this.title = res.data.problemTitle;
      this.errMsg = JSON.parse(res.data.resultDetail);
    }).catch((err: any) => {
      console.log(err);
    });
  }
}
</script>

<style lang="less" scoped>
h2 {
  font-weight: 500;
  font-size: 36px;
  text-align: left;
  margin: 12px auto 18px 0;
}
h4 {
  margin: 10px auto 10px 0;
}
.container {
  padding-top: 24px;
  text-align: left;
}
</style>
