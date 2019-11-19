<template>
  <Row>
    <Col span="18" offset="3">
      <div class="container">
        <h2>
          代码分享自题目：
          <RouterLink :to="'/problems/' + commit.problemId"
            >{{ title }}
          </RouterLink>
        </h2>
        <div v-highlightjs="sourceCode">
          <pre>
            <code class="cpp"></code>
          </pre>
        </div>
        <h2>状态：{{ errMsg.result }}</h2>
        <div v-if="errMsg.result !== 'ACCEPTED'">
          <div v-if="errMsg.result === 'COMPILE_ERROR'">
            <h4>运行：</h4>
            <div class="error">{{ errMsg.message }}</div>
          </div>
          <div v-if="errMsg.result === 'WRONG_ANSWER'">
            <h4>cpu时间：{{ errMsg.cpuTime }}</h4>
            <h4>超出CPU限制数目：{{ errMsg.cpuTimeLimitExceededCount }}</h4>
            <h4>内存: {{ errMsg.memory }}</h4>
            <h4>超出内存限制数目: {{ errMsg.memoryLimitExceededCount }}</h4>
            <h4>通过数目: {{ errMsg.passedCount }}</h4>
            <h4>真实时间: {{ errMsg.realTime }}</h4>
            <h4>超出时间限制数目: {{ errMsg.timeLimitExceededCount }}</h4>
            <h4>总样例数目: {{ errMsg.totalCount }}</h4>
            <h4>样例出错数目: {{ errMsg.wrongAnswerCount }}</h4>
          </div>
        </div>
      </div>
    </Col>
  </Row>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import api from '../api/api'

@Component
export default class Share extends Vue {
  commit: any = {}
  sourceCode: string = ''
  title: string = ''
  errMsg: any = {}

  mounted() {
    const params = this.$route.params
    api
      .getCommit({ id: params.id })
      .then((res: any) => {
        this.commit = res.data
        this.sourceCode = res.data.code.replace(/\\n/g, '\n')
        this.title = res.data.problemTitle
        this.errMsg = JSON.parse(res.data.resultDetail)
      })
      .catch((err: any) => {
        ;(this as any).$Message.error(err.data.message)
      })
  }
}
</script>

<style lang="stylus" scoped>
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
.error {
  white-space: pre-line;
  padding: 20px;
  border: 1px solid rgba(0, 0, 0, 0.08);
  border-radius: 6px;
  background-color: rgba(0, 0, 0, 0.05);
}
</style>
