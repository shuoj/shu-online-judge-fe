<template>
  <Row>
    <Col span="10" offset="3">
      <div v-if="$store.state.role !== 'ROLE_USER'" class="top">
        <Button type="primary" @click="rejudge">重判</Button>
      </div>
    </Col>
    <Col span="8">
      <div class="top">
        <Select v-model="select" style="width:200px">
          <Option v-for="item in submitList" :value="item" :key="item">{{
            item
          }}</Option>
        </Select>
        <Button type="primary" @click="judge(select)">改判</Button>
      </div>
    </Col>
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
  select: string = 'ACCEPTED'
  submitList: Array<string> = [
    'ACCEPTED',
    'RUNTIME_ERROR',
    'CPU_TIME_LIMIT_EXCEEDED',
    'TIME_LIMIT_EXCEEDED',
    'MEMORY_LIMIT_EXCEEDED',
    'COMPILE_ERROR',
    'WRONG_ANSWER',
  ]

  rejudge() {
    const params = this.$route.params
    api
      .rejudge({
        id: params.id,
      })
      .then(res => {
        console.log(res.data)
        this.getCommit()
      })
      .catch((err: any) => {
        ;(this as any).$Message.error(err.data.message)
      })
  }

  judge(result: string) {
    const params = this.$route.params
    api
      .resetJudge({
        id: params.id,
        result: result,
      })
      .then(res => {
        this.getCommit()
      })
      .catch((err: any) => {
        ;(this as any).$Message.error(err.data.message)
      })
  }

  getCommit() {
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

  mounted() {
    this.getCommit()
  }
}
</script>

<style lang="less" scoped>
.top {
  text-align: left;
  padding-top: 20px;
}
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
