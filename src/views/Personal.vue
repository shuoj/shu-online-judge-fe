<template>
  <Row>
    <Modal
      v-model="reviseModal"
      title="修改个人信息"
      width="50%"
      @on-ok="reviseUserInfo"
      @on-cancel="reviseModal = false"
    >
      <div style="display: flex;">
        <div
          style="display: flex;height: 150px;padding-top:10px;width: 30px;flex-direction: column;justify-content: space-between"
        >
          <div>姓名</div>
          <div>邮箱</div>
          <div>姓</div>
          <div>名</div>
          <div>学校</div>
        </div>
        <div>
          <Input v-model="reviseUser.username" />
          <Input v-model="reviseUser.email" />
          <Input v-model="reviseUser.firstname" />
          <Input v-model="reviseUser.lastname" />
          <Input v-model="reviseUser.school" />
        </div>
      </div>
    </Modal>
    <Col span="8" offset="1">
      <div class="user">
        <div class="operate" v-if="user.id === userInfo.id">
          <Button type="info" @click="reviseModal = true">修改信息</Button>
        </div>
        <Card dis-hover>
          <div slot="title">
            <Row>
              <Col span="11" offset="1">
                <p style="font-weight: normal;font-size: 20px">
                  <Icon type="md-person"></Icon>
                  {{ user.username }}
                </p>
                <p style="font-weight: normal;margin-top: 10px">
                  <span>简介：</span>
                  <span v-if="user.signature === null">此人暂无简介</span>
                  <span v-else>{{ user.signature }}</span>
                </p>
              </Col>
              <Col span="10" offset="2">
                <p style="font-weight: normal;font-size: 14px">
                  <Icon type="md-body" /><span style="padding-left: 10px">{{
                    user.name
                  }}</span>
                </p>
                <p style="font-weight: normal;font-size: 14px">
                  <Icon type="md-mail" /><span style="padding-left: 10px">{{
                    user.email
                  }}</span>
                </p>
                <p style="font-weight: normal;font-size: 14px">
                  <Icon type="md-school" /><span style="padding-left: 10px">{{
                    user.school
                  }}</span>
                </p>
              </Col>
            </Row>
          </div>
          <Row style="text-align: center;">
            <Col span="8" style="border-right:1px solid #dfdfdf">
              <p>Solved</p>
              <p>{{ user.acCount }}</p>
            </Col>
            <Col span="8" style="border-right:1px solid #dfdfdf">
              <p>Submission</p>
              <p>{{ user.submitCount }}</p>
            </Col>
            <Col span="8">
              <p>Rate</p>
              <p>{{ (user.acRate * 100).toFixed(1) }} %</p>
            </Col>
          </Row>
        </Card>
      </div>
    </Col>
    <Col span="13" offset="1">
      <div class="charts">
        <div class="positive-charts">
          <div id="positive"></div>
        </div>
        <div class="negative-charts">
          <div id="negative"></div>
        </div>
      </div>
    </Col>
  </Row>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import api from '../api/api'
import echarts from 'echarts'

@Component
export default class Personal extends Vue {
  user: any = {}
  reviseUser: any = {}
  reviseModal: boolean = false
  positiveDataAxis = ['数组', '排序', '链表', '树', '动态规划']
  positiveData = [32, 24, 13, 10, 0]
  negativeDataAxis = ['贪心算法', '字典树', '二叉搜索树', '递归', '回溯算法']
  negativeData = [-1, -1, -3, -8, -12]
  dataShadow = [40, 40, 40, 40, 40]
  negativeDataShadow = [10, 10, 10, 10, 10]

  negativeOption = {
    title: {
      text: '题目类别掌握度评分Bottom5',
    },
    xAxis: {
      data: this.negativeDataAxis,
      axisLabel: {
        inside: false,
        textStyle: {
          color: 'black',
        },
      },
      axisTick: {
        show: false,
      },
      axisLine: {
        show: false,
      },
      z: 10,
    },
    yAxis: {
      axisLine: {
        show: false,
      },
      axisTick: {
        show: false,
      },
      axisLabel: {
        textStyle: {
          color: '#999',
        },
      },
    },
    dataZoom: [
      {
        type: 'inside',
      },
    ],
    series: [
      {
        type: 'bar',
        itemStyle: {
          normal: { color: 'rgba(0,0,0,0)' },
        },
        barGap: '-100%',
        barCategoryGap: '40%',
        data: this.negativeDataShadow,
        animation: false,
      },
      {
        type: 'bar',
        itemStyle: {
          normal: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              { offset: 0, color: '#a39aaf' },
              { offset: 0.5, color: '#5e556a' },
              { offset: 1, color: '#463f4e' },
            ]),
          },
        },
        data: this.negativeData,
      },
    ],
  }
  positiveOption = {
    title: {
      text: '题目类别掌握度评分Top5',
    },
    xAxis: {
      data: this.positiveDataAxis,
      axisLabel: {
        inside: false,
        textStyle: {
          color: 'black',
        },
      },
      axisTick: {
        show: false,
      },
      axisLine: {
        show: false,
      },
      z: 10,
    },
    yAxis: {
      axisLine: {
        show: false,
      },
      axisTick: {
        show: false,
      },
      axisLabel: {
        textStyle: {
          color: '#999',
        },
      },
    },
    dataZoom: [
      {
        type: 'inside',
      },
    ],
    series: [
      {
        type: 'bar',
        itemStyle: {
          normal: { color: 'rgba(0,0,0,0)' },
        },
        barGap: '-100%',
        barCategoryGap: '40%',
        data: this.dataShadow,
        animation: false,
      },
      {
        type: 'bar',
        itemStyle: {
          normal: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              { offset: 0, color: '#a39aaf' },
              { offset: 0.5, color: '#5e556a' },
              { offset: 1, color: '#463f4e' },
            ]),
          },
        },
        data: this.positiveData,
      },
    ],
  }

  get userInfo() {
    return this.$store.state.userInfo
  }

  reviseUserInfo() {
    api.user
      .updateMyInfo({
        username: this.reviseUser.username,
        email: this.reviseUser.mail,
        firstname: this.reviseUser.firstname,
        lastname: this.reviseUser.lastname,
        name: this.reviseUser.lastname + this.reviseUser.firstname,
        school: this.reviseUser.school,
      })
      .then(res => {
        this.user = JSON.parse(JSON.stringify(res.data))
        this.reviseUser = JSON.parse(JSON.stringify(res.data))
        ;(this as any).$Message.success('修改成功')
      })
      .catch((err: any) => {
        ;(this as any).$Message.error(err.data.message)
      })
  }

  updateUserInfo() {
    const params = this.$route.params
    if (params.id !== this.userInfo.id) {
      api.user
        .getUserInfo({
          id: params.id,
        })
        .then((res: any) => {
          this.user = res.data
          this.reviseUser = JSON.parse(JSON.stringify(res.data))
        })
        .catch((err: any) => {
          ;(this as any).$Message.error(err.data.message)
        })
    } else {
      this.user = this.userInfo
    }
  }

  mounted() {
    this.updateUserInfo()
    const positive = echarts.init(document.getElementById('positive'))
    positive.setOption(this.positiveOption)
    const negative = echarts.init(document.getElementById('negative'))
    negative.setOption(this.negativeOption)
  }
}
</script>

<style lang="less" scoped>
.user {
  margin-top: 80px;
  text-align: left;
}
.operate {
  padding-bottom: 10px;
}
.charts {
  margin-top: 80px;
  text-align: left;
}
#positive {
  width: 600px;
  height: 400px;
}
#negative {
  width: 600px;
  height: 400px;
}
</style>
