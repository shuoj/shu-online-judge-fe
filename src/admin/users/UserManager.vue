<template>
  <div style="padding-top: 30px;" class="user-manage">
    <h2>批量生成用户</h2>
    <div v-for="item in users">{{item.name}}</div>
  </div>
</template>

<script lang="ts">
  import { Component, Vue } from 'vue-property-decorator';
  import api from '@/api/api';

  @Component
  export default class UserManager extends Vue {
    users: any = [];

    getUsers () {
      api.getUser({
        username: '', size: 10, page: 0
      }).then((res: any) => {
        this.users = res.data.list;
      }).catch((err) => {
        console.log(err);
      });
    }
    mounted() {
      this.getUsers();
    }
  }
</script>

<style lang="less" scoped>
.user-manage {
  text-align: left;
}
</style>
