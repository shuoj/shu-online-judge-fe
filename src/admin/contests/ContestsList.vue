<template>
<div>
  <Row v-if="!editorContest">
    <Col span="24" align="left" style="padding-top: 30px;">
      <h1>比赛列表</h1>
    </Col>
    <Col span="24" align="left" >
      <Modal
        v-model="modal1"
        title="修改是否可见"
        @on-ok="setVisible"
        @on-cancel="cancel">
        <p v-if="modalVisible === true">确定要修改为不可见吗？</p>
        <p v-else="modalVisible === false">确定要修改为可见吗？</p>
      </Modal>
      <Modal
        v-model="modal2"
        title="修改状态"
        @on-ok="setStatus"
        @on-cancel="cancel">
        <RadioGroup v-model="modalStatus">
          <Radio label="NOT_STARTED">未开始</Radio>
          <Radio label="PROCESSING">正在进行</Radio>
          <Radio label="ENDED">已结束</Radio>
        </RadioGroup>
      </Modal>
      <Row class="list" style="color: #17233d;font-size: 14px;font-weight: 500;">
        <Col span="1">
          <p>ID</p>
        </Col>
        <Col span="6">
          <p>标题</p>
        </Col>
        <Col span="1">
          <p>排名</p>
        </Col>
        <Col span="4" align="center">
          <p>开始时间</p>
        </Col>
        <Col span="2" align="center">
          <p>可见</p>
        </Col>
        <Col span="3" align="center">
          <p>创建者</p>
        </Col>
        <Col span="2">
          <p>状态</p>
        </Col>
        <Col span="4" align="center">
          <p>操作</p>
        </Col>
      </Row>
      <Row v-for="(item, index) in contests" class="item" :key="item.id">
        <Col span="1">
          <p>{{index+1}}</p>
        </Col>
        <Col span="6">
          <p>{{item.name}}</p>
        </Col>
        <Col span="1">
          <p>{{item.rank}}</p>
        </Col>
        <Col span="4" align="center">
          <p>{{item.startDate}}</p>
        </Col>
        <Col span="2" align="center">
          <a style="color: #2d8cf0" @click="makeVisible(item.id, item.visible)">{{item.visible}}</a>
        </Col>
        <Col span="3" align="center">
          <p>{{item.authorName}}</p>
        </Col>
        <Col span="2">
          <div style="color: #2d8cf0" v-if="item.status === 'NOT_STARTED'"><a @click="reviseStatus(item.id, item.status)">未开始</a></div>
          <div v-else-if="item.status === 'PROCESSING'"><a @click="reviseStatus(item.id, item.status)">正在进行</a></div>
          <div v-else="item.status === 'ENDED'"><a @click="reviseStatus(item.id, item.status)">已经结束</a></div>
        </Col>
        <Col span="1" align="center">
          <Button type="text" style="color: #2d8cf0;padding-top: 0" @click="editor(item.id)">编辑</Button>
        </Col>
        <Col span="1" align="center">
          <Button type="text" style="color: #2d8cf0;padding-top: 0" @click="toMember(item.id)">成员</Button>
        </Col>
        <Col span="1" align="center">
          <Button type="text" style="color: #2d8cf0;padding-top: 0" @click="toProblem(item.id)">题目</Button>
        </Col>
        <Col span="1" align="center">
          <Button type="text" style="color: #2d8cf0;padding-top: 0" @click="deleteContest(item.id)">删除</Button>
        </Col>
      </Row>
      <Row>
        <Col span="24" style="padding-top: 30px;text-align: center">
          <Page :total="total" show-sizer @on-change="pageChange" @on-page-size-change="pageSizeChange"/>
        </Col>
      </Row>
    </Col>
  </Row>
  <div v-if="editorContest" style="padding-top: 40px;text-align: left">
    <Row>
      <Col span="23">
        <Button @click="backToList" style="margin-bottom: 4px">
          <Icon type="md-arrow-round-back" size="28"/>
          返回
        </Button>
      </Col>
    </Row>
    <Row>
      <Col span="23" align="left" style="padding-top: 30px;">
        <Alert type="warning">注意！管理员在测试比赛题目的时候请务必保持比赛状态为没有开始，这时只有管理员可以正常查看和提交题目，而且不会产生排名。</Alert>
        <div class="item-padding">
          <h3>比赛名称</h3>
          <Input v-model="name" placeholder="" style="width: 100%" />
        </div>
        <div class="item-padding">
          <h3>比赛介绍</h3>
          <vue-wangeditor style="text-align: left" id="editor" :options="options" v-model="description" :initContent="initContent" :text.sync="text"></vue-wangeditor>
        </div>
        <div>
          <Row>
            <Col span="11">
              <div class="item-padding">
                <h3>开始时间</h3>
                <DatePicker type="datetime" placeholder="选择开始时间" v-model="startDate"></DatePicker>
              </div>
            </Col>
            <Col span="11" offset="2">
              <div class="item-padding">
                <h3>结束时间</h3>
                <DatePicker type="datetime" placeholder="选择结束时间" v-model="endDate"></DatePicker>
              </div>
            </Col>
            <Col span="11">
              <div class="item-padding">
                <h3>实时排名</h3>
                <Checkbox v-model="judgeType">如果不勾选，排名会被缓存，不会更新，而且只显示自己的提交。用于 acm 封榜。rank页面url后面增加?force_real_time_rank=true可以在管理员身份下查看最新排名。</Checkbox>
              </div>
            </Col>
            <Col span="11" offset="2">
              <div class="item-padding">
                <h3>是否可见</h3>
                <Checkbox v-model="visible">可见</Checkbox>
              </div>
            </Col>
          </Row>
        </div>
        <div class="item-padding">
          <Row>
            <Col span="11" style="height:100px">
              <div class="item-padding">
                <h3>比赛类型</h3>
                <RadioGroup v-model="contestType">
                  <Radio label="PUBLIC">公开赛</Radio>
                  <Radio label="SECRET_WITH_PASSWORD">私密赛（可加入）</Radio>
                  <Radio label="SECRET_WITHOUT_PASSWORD">私密赛（不可加入）</Radio>
                </RadioGroup>
              </div>
            </Col>
            <Col v-if="contestType === 'SECRET_WITH_PASSWORD'" span="11" offset="2">
              <div class="item-padding">
                <h3>邀请密码</h3>
                <Input v-model="password" placeholder="留空则只有小组内可以参加" style="width: 100%" />
              </div>
            </Col>
          </Row>
          <Col span="2">
            <Button @click="backToList">返回</Button>
          </Col>
          <Col span="2">
            <Button type="primary" @click="updateContest">修改</Button>
          </Col>
        </div>
      </Col>
    </Row>
  </div>
</div>
</template>

<script lang="ts">
  import { Component, Vue } from 'vue-property-decorator';
  import api from '../../api/api';

  @Component
  export default class Index extends Vue {
    // 修改可见的modal
    modal1: boolean = false;
    modalVisible: boolean = false;
    // 修改status的modal
    modal2: boolean = false;
    modalStatus: any = '';
    modalId: any = '';
    total: number = 0;
    editorContest: boolean = false;
    pageSize: number = 20;
    page: number = 0;
    contests: any = [];
    changeContest: any = [];
    rank: any = '';

    // 文本编辑器配置
    text: any = '';
    options: any = {
      width: '100%',
      height: '100px'
    };
    initContent: any = '';

    contestId: any = '';
    // contest参数
    authorId: any = this.$store.state.userInfo.id;
    name: any = '';
    description: any = '';
    contestType: any = 'PUBLIC';
    judgeType: any = '';
    enable: any = true;
    visible: any = 'true';
    startDate: any = '';
    endDate: any = '';
    password: any = '';

    pageChange(pages: number) {
      this.page = pages - 1;
      this.getContests(pages - 1, this.pageSize);
    }

    pageSizeChange(size: number) {
      this.getContests(this.page, size);
      this.pageSize = size;
    }

    getContests(page: number = 0, pageSize: number = 10) {
      this.contests = [];
      api.getContests({
        page: page,
        size: pageSize
      }).then((res: any) => {
        console.log(res.data.list);
        const that = this;
        that.total = res.data.total;
        let visibility = '';
        that.contests = res.data.list.map((item: any) => {
          item.rank = (item.judgeType === 'IMMEDIATELY') ? '实时' : '不实时';
          visibility = (item.visible === true) ? '可见' : '不可见';
          return {
            ...item,
            visibility: visibility
          };
        });
        this.changeContest = this.contests.slice();
      }).catch((err: any) => {
        console.log(err, 'err');
      });
    }

    editor(id: string) {
      // 编辑问题
      const that = this;
      that.contestId = id;
      api.getContestDetail({ id: id }).then((res: any) => {
        console.log('编辑contest');
        console.log(res.data);
        that.name = res.data.name;
        that.initContent = res.data.description;
        that.description = res.data.description;
        that.startDate = res.data.startDate;
        that.endDate = res.data.endDate;
        that.contestType = res.data.contestType;
        that.judgeType = (res.data.judgeType === 'IMMEDIATELY');
        that.visible = (res.data.visible === true);
      }).catch((err: any) => {
        console.log(err, 'err');
      });
      this.editorContest = !this.editorContest;
    }

    backToList() {
      const that = this;
      that.name = '';
      that.initContent = '';
      that.description = '';
      that.startDate = '';
      that.endDate = '';
      that.enable = '';
      that.contestType = '';
      that.judgeType = '';
      that.visible = '';
      this.editorContest = !this.editorContest;
    }

    computeDate(date: string) {
      const start = new Date(date);
      const year = start.getFullYear();
      const mon = start.getMonth() + 1;
      const month = () => {
        if (mon < 10) {
          return '0' + mon;
        } else {
          return mon;
        }
      };
      const day = () => {
        if (start.getDate() < 10) {
          return '0' + start.getDate();
        } else {
          return start.getDate();
        }
      };
      const hour = () => {
        if (start.getHours() < 10) {
          return '0' + start.getHours();
        } else {
          return start.getHours();
        }
      };
      const min = () => {
        if (start.getMinutes() < 10) {
          return '0' + start.getMinutes();
        } else {
          return start.getMinutes();
        }
      };
      const second = () => {
        if (start.getSeconds() < 10) {
          return '0' + start.getSeconds();
        } else {
          return start.getSeconds();
        }
      };
      return year + '-' + month() + '-' + day() + ' ' + hour() + ':' + min() + ':' + second();
    }

    updateContest() {
      const that = this;
      const start = this.computeDate(that.startDate);
      const end = this.computeDate(that.endDate);
      api.updateContest({
        contestId: that.contestId,
        contest: {
          authorId: that.authorId,
          name: that.name,
          description: that.description,
          contestType: that.contestType,
          judgeType: (that.judgeType === true) ? 'IMMEDIATELY' : 'DELAY',
          enable: that.enable,
          visible: that.visible,
          startDate: start,
          endDate: end,
          password: that.password
        }
      }).then((res: any) => {
        (this as any).$Message.success('修改成功');
        that.$router.push({
          path: `/admin/contests-list`
        });
        console.log(res);
      }).catch((err: any) => {
        (this as any).$Message.error('修改出错');
        console.log(err);
      });
    }

    deleteContest(id: string) {
      api.deleteContest({ id }).then((res: any) => {
        (this as any).$Message.success('删除成功');
        this.getContests();
      }).catch((err: any) => {
        console.log(err);
        (this as any).$Message.error('删除失败');
      });
    }

    makeVisible(id: any, visible: any) {
      this.modal1 = true;
      this.modalVisible = (visible === '可见');
      this.modalId = id;
    }

    reviseStatus(id: any, status: any) {
      this.modal2 = true;
      this.modalStatus = status;
      this.modalId = id;
      console.log(status);
    }

    setVisible () {
      api.setVisibleContest({
        id: this.modalId,
        visible: !this.modalVisible
      }).then((res: any) => {
        (this as any).$Message.success('修改成功');
        this.getContests();
      }).catch((err: any) => {
        console.log(err);
      });
    }

    setStatus () {
      let option: any = '';
      if (this.modalStatus === 'NOT_STARTED') {
        option = 'RESET';
      } else if (this.modalStatus === 'PROCESSING') {
        option = 'ENABLE';
      } else {
        option = 'DISABLE';
      }
      api.setStatusContest({
        id: this.modalId,
        option: option
      }).then((res: any) => {
        (this as any).$Message.success('修改成功');
        this.getContests();
      }).catch((err: any) => {
        console.log(err);
      });
    }

    cancel () {
      (this as any).$Message.info('修改取消');
    }

    toMember(id: string) {
      this.$router.push({
        path: `/admin/contest-member/${id}`
      });
    }

    toProblem(id: string) {
      this.$router.push({
        path: `/admin/contest-problems/${id}`
      });
    }

    mounted() {
      this.getContests();
    }
  }
</script>

<style scoped lang="less">
  .list {
    border-bottom: 1px solid #ddd;
    font-weight: 400;
    padding: 15px 0 15px 0;
    .list-title {
      text-align: left;
      color: rgba(0, 0, 0, 0.7);
    }
  }

  .item {
    border-bottom: 1px solid #e8eaec;
    padding-top: 10px;
    &:nth-child(odd) {
       background-color: #f9f9f9;
     }
  }
  .item-padding {
    padding: 20px 0 20px 0;
  }
</style>
