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
    <Col span="8" offset="8">
      <div class="user">
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
        <div class="operate" v-if="user.id === userInfo.id">
          <Button type="info" @click="reviseModal = true">修改信息</Button>
        </div>
      </div>
    </Col>
    <Col span="11" offset="1">
      <div class="charts">
        <div class="positive-charts">
          <div id="positive"></div>
        </div>
      </div>
    </Col>
    <Col span="10">
      <div class="charts">
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

  negativeOption = {
    title: {
      text: '题目类别综合掌握度Bottom5',
    },
    dataset: {
      source: [
        ['score', '分数', '考点'],
        [-2, -2, '拓扑排序'],
        [-6, -6, '树状数组'],
        [-12, -12, '回溯算法'],
        [-18, -18, '几何'],
        [-32, -32, '贪心算法'],
      ],
    },
    grid: { containLabel: true },
    xAxis: { name: 'amount' },
    yAxis: { type: 'category' },
    visualMap: {
      orient: 'horizontal',
      left: 'center',
      min: -40,
      max: 0,
      text: ['掌握度高', '掌握度低'],
      dimension: 0,
      inRange: {
        color: ['#a39aaf', '#463f4e'],
      },
    },
    series: [
      {
        type: 'bar',
        encode: {
          x: 'amount',
          y: '考点',
        },
      },
    ],
  }

  positiveOption = {
    title: {
      text: '题目类别综合掌握度Top5',
    },
    dataset: {
      source: [
        ['score', '分数', '考点'],
        [2, 2, '树'],
        [6, 6, '二分查找'],
        [12, 12, '双指针'],
        [18, 18, '排序'],
        [32, 32, '链表'],
      ],
    },
    grid: { containLabel: true },
    xAxis: { name: '分数' },
    yAxis: { type: 'category' },
    visualMap: {
      orient: 'horizontal',
      left: 'center',
      dimension: 0,
      min: 0,
      max: 40,
      text: ['掌握度高', '掌握度低'],
      inRange: {
        color: ['#a39aaf', '#463f4e'],
      },
    },
    series: [
      {
        type: 'bar',
        encode: {
          x: '分数',
          y: '考点',
        },
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
  text-align: right;
  padding-top: 10px;
}
.charts {
  margin-top: 80px;
  text-align: left;
}
#positive {
  width: 100%;
  height: 400px;
}
#negative {
  width: 100%;
  height: 400px;
}
</style>
