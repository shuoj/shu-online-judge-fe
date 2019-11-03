<template>
  <Row>
    <Col span="10" offset="7">
      <div style="padding-top: 80px">
        <Card style="text-align: left;padding-top: 10px" dis-hover>
          <div slot="title">
            <Row>
              <Col span="11" offset="1">
                <p style="font-weight: normal;font-size: 20px">
                  <Icon type="md-person"></Icon>
                  {{user.username}}
                </p>
                <p style="font-weight: normal;margin-top: 10px">
                  <span>简介：</span>
                  <span v-if="user.signature === null">此人暂无简介</span>
                  <span v-else>{{user.signature}}</span>
                </p>
              </Col>
              <Col span="10" offset="2">
                <p style="font-weight: normal;font-size: 14px">
                  <Icon type="md-body" /><span style="padding-left: 10px">{{user.name}}</span>
                </p>
                <p style="font-weight: normal;font-size: 14px">
                  <Icon type="md-mail" /><span style="padding-left: 10px">{{user.email}}</span>
                </p>
                <p style="font-weight: normal;font-size: 14px">
                  <Icon type="md-school" /><span style="padding-left: 10px">{{user.school}}</span>
                </p>
              </Col>
            </Row>
          </div>
          <Row style="text-align: center;">
            <Col span="8" style="border-right:1px solid #dfdfdf">
              <p>Solved</p>
              <p>{{user.acCount}}</p>
            </Col>
            <Col span="8" style="border-right:1px solid #dfdfdf">
              <p>Submission</p>
              <p>{{user.submitCount}}</p>
            </Col>
            <Col span="8">
              <p>Rate</p>
              <p>{{user.acRate * 100}} %</p>
            </Col>
          </Row>
        </Card>
        <div style="text-align: right;padding-top: 10px;" v-if="user.id === userInfo.id">
          <Button type="info" @click="reviseModal = true">修改信息</Button>
        </div>
        <Modal
          v-model="reviseModal"
          title="修改个人信息"
          width="50%"
          @on-ok="reviseUserInfo"
          @on-cancel="reviseModal = false">
          <div style="display: flex;">
            <div style="display: flex;height: 150px;padding-top:10px;width: 30px;flex-direction: column;justify-content: space-between">
              <div>姓名</div>
              <div>邮箱</div>
              <div>姓</div>
              <div>名</div>
              <div>学校</div>
            </div>
            <div>
              <Input v-model="reviseUser.username"/>
              <Input v-model="reviseUser.email"/>
              <Input v-model="reviseUser.firstname"/>
              <Input v-model="reviseUser.lastname"/>
              <Input v-model="reviseUser.school"/>
            </div>
          </div>
        </Modal>
      </div>
    </Col>
  </Row>
</template>

<script lang="ts">
  import { Component, Vue, Watch } from 'vue-property-decorator';
  import api from '../api/api';

  @Component
  export default class Personal extends Vue {
    user: any = {};
    reviseUser: any = {};
    reviseModal: boolean = false;

    @Watch('$route')
    handleRoute() {
      // 直接输路由时都没有变化
      this.updateUserInfo();
    }

    get userInfo() {
      return this.$store.state.userInfo;
    }

    reviseUserInfo() {
      api.updateUserInfo({
        username: this.reviseUser.username,
        email: this.reviseUser.mail,
        firstname: this.reviseUser.firstname,
        lastname: this.reviseUser.lastname,
        name: this.reviseUser.lastname + this.reviseUser.firstname,
        school: this.reviseUser.school
      }).then((res) => {
        this.user = res.data;
        this.reviseUser = res.data;
        (this as any).$Message.success('修改成功');
      }).catch((err) => {
        (this as any).$Message.error(err.data.message);
      });
    }

    updateUserInfo() {
      const query = this.$route.query;
      const params = this.$route.params;
      if (query.others) {
        api.getOtherUserInfo({
          id: params.id
        }).then((res: any) => {
          this.user = res.data;
          this.reviseUser = res.data;
        }).catch((err: any) => {
          console.log(err);
        });
      } else {
        api.getUserInfo().then((res: any) => {
          this.user = res.data;
          this.reviseUser = res.data;
        }).catch((err: any) => {
          console.log(err);
        });
      }
    }
    mounted() {
      this.updateUserInfo();
    }
  }
</script>

<style lang="less" scoped>
  @import '../style/base';


</style>
