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
              <Col span="6" offset="4">
                <p style="font-weight: normal;font-size: 14px">
                  <Icon type="md-body" /><span style="padding-left: 10px">{{user.firstname}} {{user.lastname}}</span>
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
              <p>{{user.acRate}}</p>
            </Col>
          </Row>
        </Card>
      </div>
    </Col>
  </Row>
</template>

<script lang="ts">
  import { Component, Vue, Watch } from 'vue-property-decorator';
  import api from '../api/api';

  @Component
  export default class Personal extends Vue {
    user: any = '';

    @Watch('$route')
    handleRoute() {
      // 直接输路由时都没有变化
      this.updateUserInfo();
    }

    updateUserInfo() {
      const query = this.$route.query;
      const params = this.$route.params;
      if (query.others) {
        api.getOtherUserInfo({
          id: params.id
        }).then((res: any) => {
          this.user = res.data;
        }).catch((err: any) => {
          console.log(err);
        });
      } else {
        api.getUserInfo().then((res: any) => {
          this.user = res.data;
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
