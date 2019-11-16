<template>
  <Row>
    <Col span="22" offset="1" style="padding-top: 40px;text-align: left">
      <h1>判题服务器</h1>
      <Card style="width:80%;margin-top: 40px">
        <p slot="title">
          <Icon type="ios-film-outline"></Icon>
          详细信息
        </p>
        <div class="content">
          <Row>
            <Col span="8">
              <p>行为:</p>
              <p>CPU:</p>
              <p>CPU核数:</p>
              <p>host:</p>
              <p>内存:</p>
              <p>判题机version:</p>
              <p>任务数：</p>
              <p>服务器地址：</p>
            </Col>
            <Col span="16">
              <p>{{ status.action }}</p>
              <p>{{ status.cpu }}</p>
              <p>{{ status.cpu_core }}</p>
              <p>{{ status.hostname }}</p>
              <p>{{ status.memory }}</p>
              <p>{{ status.judger_version }}</p>
              <p>
                {{
                  status.running_task_number ? status.running_task_number : 0
                }}
              </p>
              <p>{{ status.service_url }}</p>
            </Col>
          </Row>
        </div>
      </Card>
    </Col>
  </Row>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import api from '@/api/api'

@Component
export default class UserManager extends Vue {
  status: any = {}
  getJudgeServer() {
    api
      .getJudgeServer({})
      .then((res: any) => {
        this.status = res.data[0]
      })
      .catch((err: any) => {
        ;(this as any).$Message.error(err.data.message)
      })
  }

  mounted() {
    this.getJudgeServer()
  }
}
</script>

<style lang="less" scoped>
.content {
  padding: 20px 40px;
  font-size: 16px;
  p {
    padding: 4px 0px;
  }
}
</style>
