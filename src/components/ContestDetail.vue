<template>
  <Row>
    <Col span="22" offset="1">
      <Modal
        v-model="modalPassword"
        title="密码验证"
        @on-ok="sendPassword"
        @on-cancel="cancel">
        <h2>如要加入，请输入密码</h2>
        <Input v-model="password" type="password" placeholder="输入比赛加入密码：" style="width: 200px" />
      </Modal>
      <Modal
        v-model="modal"
        :title="modalTitle"
        @on-ok="cancel"
        @on-cancel="cancel">
        <p>{{modalContent}}</p>
      </Modal>
      <Tabs value="detail" style="padding-top: 40px;" v-on:on-click="onTabChange">
        <TabPane label="比赛详情" name="detail" class="pane-padding">
          <h1>{{contest.name}}</h1>
          <h3 style="text-align: left;font-weight: 600;">描述:</h3>
          <p class="description" v-html="contest.description"></p>
          <Table stripe :columns="columns" :data="data"></Table>
        </TabPane>
        <TabPane label="题目列表" name="problem" class="pane-padding">
          <Table :columns="title" :data="problems"></Table>
        </TabPane>
        <TabPane label="排名" name="rank" style="text-align: left" class="pane-padding">
          <span style="font-weight: 500;margin: 0 10px 0 10px;">自动刷新:</span>
          <i-switch v-model="autoRefresh" @on-change="refreshAuto" />
          <table style="margin-top: 20px;">
            <tbody>
              <tr class="first-title">
                <td style="width:30px;">#</td>
                <td style="width:100px;">用户名</td>
                <td style="width:100px;">AC/总提交</td>
                <td style="width:100px;">用时 + 罚时</td>
                <td v-for="item in problemNumber" :key="item" style="width: 100px;">{{alphabet[item-1]}}</td>
              </tr>
              <tr class="second-title" v-for="(user, index) in ranking" :key="index">
                <td>{{index+1}}</td>
                <td>{{user.userName}}</td>
                <td>{{user.acceptCount}}/{{user.submitCount}}</td>
                <td>
                  <p v-html="timetrans(user.totalTime.totalTime)"></p>
                  <p v-if="user.totalTime.errorCount !== 0" >(-{{user.totalTime.errorCount}})</p>
                </td>
                <template v-for="(problem, index) in user.timeList">
                  <template v-if="problem.submitted === true">
                    <td v-if="problem.passed === true" :class="choose(problem.firstPassed)">
                      <div>{{timetrans(problem.totalTime)}}</div>
                      <div v-if="problem.errorCount !== 0">(-{{problem.errorCount}})</div>
                    </td>
                    <td v-else class="red">
                      <p v-html="timetrans(problem.totalTime)"></p>
                      <p v-if="problem.errorCount !== 0">(-{{problem.errorCount}})</p>
                    </td>
                  </template>
                  <td v-else class="not-submitted">
                  </td>
                </template>
              </tr>
            </tbody>
          </table>
        </TabPane>
      </Tabs>
    </Col>
  </Row>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';
import api from '@/api/api';
import md5 from 'js-md5';

@Component
export default class ContestDetail extends Vue {
  modalPassword: boolean = false;
  modal: boolean = false;
  modalTitle: any = '';
  modalContent: any = '';
  password: any = '';
  alphabet: any = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L'];
  index = 0;
  contest: any = {};
  columns: any = [
    {
      title: '开始时间',
      key: 'start'
    },
    {
      title: '结束时间',
      key: 'end'
    },
    {
      title: '状态',
      key: 'status'
    },
    {
      title: '比赛类型',
      key: 'type'
    },
    {
      title: '创建者',
      key: 'name'
    }
  ];
  data: any = [];
  title: any = [
    {
      title: 'ID',
      key: 'id',
      render: (h: any, obj: any) => {
        return h(
          'span',
          this.alphabet[obj.row.index]);
      },
      width: 80
    },
    {
      title: '题目名称',
      key: 'problemTitle',
      className: 'pointer-class',
      render: (h: any, obj: any) => {
        return h(
          'span', {
            on: {
              click: () => {
                this.toContestProblem(obj.row.id);
              }
            }
          }, obj.row.title);
      }
    },
    {
      title: '通过率',
      key: 'authorName',
      className: 'pointer-class',
      render: (h: any, obj: any) => {
        return h(
          'span',
          Math.floor(obj.row.acceptRate * 100) + '%(' + String(obj.row.acceptCount) + ' / ' + String(obj.row.submitCount) + ')');
      }
    }
  ];
  problems: any = [];
  problemDetail: any = [];
  autoRefresh: any = false;
  ranking: any = [];
  problemNumber: any = '';

  timetrans(time: string) {
    const date = new Date(time);
    const h = ((date.getHours() - 8) < 10 ? '0' + (date.getHours() - 8) : (date.getHours() - 8));
    const m = (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes());
    const s = (date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds());
    return h + ':' + m + ':' + s;
  }

  onTabChange(name: any) {
    switch (name) {
      case 'rank':
        this.getContestRanking();
        break;
      case 'problem':
        this.getContestProblems();
    }
  }

  choose(status: boolean) {
    if (status === true) {
      return 'deepGreen';
    } else {
      return 'green';
    }
  }

  refreshAuto(status: any) {
    if (status === true) {
      (this as any).$Message.success('自动刷新开');
    } else {
      (this as any).$Message.success('自动刷新关');
    }

  }

  findStatus(value: any) {
    let status = '';
    if (value === 'NOT_STARTED') {
      status = '未开始';
    } else if (value === 'PROCESSING') {
      status = '正在进行';
    } else {
      status = '已经结束';
    }
    return status;
  }

  findType(t: string) {
    let type = '';
    if (t === 'PUBLIC') {
      type = '公开赛';
    } else if (t === 'SECRET_WITH_PASSWORD') {
      type = '私密赛(可加入)';
    } else if (t === 'SECRET_WITHOUT_PASSWORD') {
      type = '私密赛(不可加入)';
    }
    return type;
  }

  getContestDetail() {
    const params = this.$route.params;
    const id: any = params.id;
    const that = this;
    api.getContestDetail({ id }).then((res: any) => {
      that.contest = res.data;
      const status = this.findStatus(res.data.status);
      const t = res.data.contestType;
      const type = this.findType(t);
      that.data.push({
        'start': res.data.startDate,
        'end': res.data.endDate,
        'status': status,
        'type': type,
        'name': res.data.authorName
      });
    }).catch((err: any) => {
      console.log(err);
      if (err.status === 400) {
        switch (err.data.code) {
          // 比赛未开始
          case -2:
            this.modal = true;
            this.modalTitle = '未开始';
            this.modalContent = '比赛还未开始，无权查看比赛消息';
            break;
          // 没有这个比赛
          case -3:
            this.modal = true;
            this.modalTitle = '没有这个比赛';
            this.modalContent = '你似乎进入了未知的区域！';
            break;
          // 比赛不可加入
          case -4:
            this.modal = true;
            this.modalTitle = '无权限';
            this.modalContent = '不好意思，此比赛是私密不可加入的呢！快去加入别的比赛吧！';
            break;
          // 需要密码
          case -5:
            this.modalPassword = true;
            break;
          default:
            break;
        }
      }
    });
  }

  getContestProblems() {
    this.problems = [];
    const params = this.$route.params;
    const id: string = params.id;
    const that = this;
    api.getAllProblemsFromASpecificContest({ id }).then((res: any) => {
      let index = -1;
      that.problems = res.data.map((item: any) => {
        index = index + 1;
        item.index = index;
        return {
          ...item,
          index: index
        };
      });
    }).catch((error: any) => {
      console.log(error);
    });
  }

  toContestProblem(problemId: string) {
    const params = this.$route.params;
    const id: string = params.id;
    this.$router.push({
      path: `/contests/${id}/problems/${problemId}`
    });
  }

  sendPassword() {
    const pwd = md5(this.password);
    const params = this.$route.params;
    const id: string = params.id;
    api.sendPassword({
      id: id,
      password: pwd
    }).then((res: any) => {
      if (res.data.message === '密码错误') {
        (this as any).$Message.error('密码错误');
        this.password = '';
        this.getContestDetail();
      } else if (res.data.message === '加入成功') {
        this.password = '';
        this.getContestDetail();
      }
    }).catch((err: any) => {
      console.log(err);
      (this as any).$Message.error('加入失败');
      this.cancel();
    });
  }

  cancel() {
    this.$router.push({
      path: '/contests'
    });
  }

  getContestRanking() {
    const params = this.$route.params;
    const id: string = params.id;
    const that = this;
    api.getRanking({ id }).then((res: any) => {
      this.problemNumber = res.data.rankingUserList[0].timeList.length;
      that.ranking = res.data.rankingUserList;
    }).catch((err: any) => {
      console.log(err);
    });
  }

  mounted() {
    this.getContestDetail();
  }
}
</script>

<style lang="less" scoped>
  @import '../style/base';

  .pane-padding {
    padding-top: 30px;
  }

  h1 {
    font-size: 30px;
    font-weight: 400;
    margin-bottom: 20px;;
  }

  .description {
    text-align: left;
    padding: 20px 0 40px 0;
  }

  .red {
    color: #a94442;
    background-color: #f2dede;
  }

  .deepGreen {
    background-color: #3c9;
    color: #3c763d;
  }

  .green {
    color: #3c763d;
    background-color: #dff0d8;
  }

  .list {
    margin-top: 40px;
    text-align: left;
    color: #17233d;
    font-size: 14px;
    font-weight: 600;
    border-bottom: 1px solid #e8eaec;
    padding-bottom: 10px;
  }

  .item {
    text-align: left;
    border-bottom: 1px solid #e8eaec;
    padding-top: 10px;
    padding-bottom: 10px;
  }

  table {
    border-collapse: collapse;
  }

  td,tr {
    text-align: center!important;
  }

  .first-title {
    width: 100%;
    height: 40px;
    white-space: nowrap;
    overflow: hidden;
    background-color: #f8f8f9;
    td {
      min-width: 0;
      height: 48px;
      box-sizing: border-box;
      text-overflow: ellipsis;
      vertical-align: middle;
      border: 1px solid #e8eaec;
    }
  }

  .second-title {
    width: 100%;
    height: 40px;
    white-space: nowrap;
    overflow: hidden;
    td {
      transition: background-color .2s ease-in-out;
      min-width: 0;
      height: 48px;
      box-sizing: border-box;
      text-align: left;
      text-overflow: ellipsis;
      vertical-align: middle;
      border: 1px solid #e8eaec;
    }
  }
</style>
