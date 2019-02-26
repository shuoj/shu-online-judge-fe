<template>
  <div style="padding-top: 30px;" class="user-manage">
    <!-- <h1>用户信息</h1>
    <Row>
      <Col span="24">
        <Table :columns="title" :data="users"></Table>
      </Col>
    </Row> -->
    <h2>批量生成用户</h2>
    
  </div>
</template>

<script lang="ts">
  import { Component, Vue } from 'vue-property-decorator';

  @Component
  export default class UserManager extends Vue {
    users: any = [];

    getUsers () {
      // api.getUser({
      //   username: '', size: 10, page: 0
      // }).then((res: any) => {
      //
      // }).catch((err) => {
      //   console.log(err);
      // });
    }

  }
</script>

<style lang="less" scoped>
.user-manage {
  text-align: left;
}
</style>
