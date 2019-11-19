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
        <div v-if="errMsg.result === 'COMPILE_ERROR'">
          <h4>运行：</h4>
          <div class="error">{{ errMsg.message }}</div>
        </div>
        <div
          v-if="
            errMsg.result !== 'COMPILE_ERROR' &&
              errMsg.result !== 'SYSTEM_ERROR'
          "
        >
          <table>
            <tr>
              <th>Debug 信息:</th>
            </tr>
            <tr>
              <td>内存:</td>
              <td>{{ errMsg.memory }}</td>
            </tr>
            <tr>
              <td>实际时间:</td>
              <td>{{ errMsg.realTime }}</td>
            </tr>
            <tr>
              <td>CPU Time Limit Exceeded:</td>
              <td>{{ errMsg.cpuTimeLimitExceededCount }}</td>
            </tr>

            <tr>
              <td>Memory Limit Exceeded:</td>
              <td>{{ errMsg.memoryLimitExceededCount }}</td>
            </tr>

            <tr>
              <td>Time Limit Exceeded:</td>
              <td>{{ errMsg.timeLimitExceededCount }}</td>
            </tr>
            <tr>
              <td>Wrong Answer:</td>
              <td>{{ errMsg.wrongAnswerCount }}</td>
            </tr>
            <tr>
              <td>样例通过/总数</td>
              <td>{{ errMsg.passedCount }} / {{ errMsg.totalCount }}</td>
            </tr>
          </table>
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
td {
  padding-right: 15px;
}
</style>
