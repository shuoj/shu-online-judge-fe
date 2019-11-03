<template>
  <div style="padding-top: 30px;" class="user-manage">
    <div style="display: flex;">
      <h2>用户管理</h2>
      <div style="height:80px;padding-top: 10px;">
        <Button type="primary" @click="newMoal = true">创建用户</Button>
      </div>
    </div>
    <Row>
      <Col span="24">
        <ul style="font-weight: 700" class="pro-table">
          <li class="name">姓名</li>
          <li class="username">用户名</li>
          <li class="mail">邮箱</li>
          <li class="diff">提交</li>
          <li class="diff">通过率</li>
          <li class="rate">角色</li>
          <li class="rate">操作</li>
        </ul>
        <ul v-for="(user, index) in users" :key="user.id" class="pro-table"
            :class="[index % 2 ===0 ? 'bg': '']">
          <li class="name">{{user.name}}</li>
          <li class="username">{{user.username}}</li>
          <li class="mail">{{user.email}}</li>
          <li class="diff">{{user.acCount}}/{{user.submitCount}}</li>
          <li class="diff">{{(user.acRate * 100).toFixed(2)}}%</li>
          <li class="rate">{{getRole(user.authorities[0].authority)}}</li>
          <li class="rate">
            <Button type="primary" class="btn-primary" @click="reviseModal = true, userInfo = user">修改信息</Button>
            <Button type="primary" class="btn-primary" @click="deleteUser(user.id)">删除</Button>
          </li>
        </ul>
      </Col>
      <Modal
        v-model="newModal"
        title="创建用户"
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
            <Input v-model="newUser.username"/>
            <Input v-model="newUser.email"/>
            <Input v-model="newUser.firstname"/>
            <Input v-model="newUser.lastname"/>
            <Input v-model="newUser.school"/>
          </div>
        </div>
      </Modal>
      <Modal
        v-model="reviseModal"
        title="修改用户信息"
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
      <Col span="24" class="card-margin">
        <Page :total="total" show-sizer @on-change="pageChange" @on-page-size-change="pageSizeChange"/>
      </Col>
    </Row>
  </div>
</template>

<script lang="ts">
  import { Component, Vue } from 'vue-property-decorator';
  import api from '@/api/api';

  @Component
  export default class UserManager extends Vue {
    users: any = [];
    pageSize: number = 10;
    page: number = 0;
    total: any = 0;
    userInfo: any = {};
    newModal: boolean = true;
    reviseModal: boolean = false;

    getRole(type: string) {
      switch (type) {
        case 'ROLE_ADMIN':
          return '管理员';
        case 'ROLE_USER':
          return '普通用户';
        case 'ROLE_STUFF':
          return '教师';
      }
    }
    pageChange(pages: number) {
      this.page = pages - 1;
      this.getUsers(pages - 1, this.pageSize);
    }

    pageSizeChange(size: number) {
      this.getUsers(this.page, size);
      this.pageSize = size;
    }

    handleUser(id: string) {
      api.deleteUser({
        list: [id]
      }).then((res) => {
        console.log(res);
        (this as any).$Message.success('修改成功');
      }).catch((err) => {
        (this as any).$Message.error(err.data.message);
      });
    }

    deleteUser(id: string) {
      api.deleteUser({
        list: [id]
      }).then((res) => {
        console.log(res);
        (this as any).$Message.success('修改成功');
      }).catch((err) => {
        (this as any).$Message.error(err.data.message);
      });
    }

    getUsers (page: number, size: number) {
      api.getUser({
        username: '',
        size: size,
        page: page
      }).then((res: any) => {
        this.users = res.data.list;
        this.total = res.data.total;
      }).catch((err) => {
        console.log(err);
      });
    }
    mounted() {
      this.getUsers(0, 10);
    }
  }
</script>

<style lang="less" scoped>
.user-manage {
  text-align: left;
}

.card-margin {
  margin-top: 20px;
  display: flex;
  justify-content: center;
  button {
    margin-right: 2px;
    padding: 3px 7px 3px;
  }
}
.pro-table {
  list-style: none;
  display: flex;
  justify-content: space-between;
  height: 48px;
  line-height: 48px;
  text-align: left;
  border-bottom: rgb(221, 221, 221) solid 1px;
  .name {
    width: 10%;
    cursor: pointer;
    &:hover {
      color: rgb(17, 85, 204);
    }
  }
  .username {
    width: 20%;
    cursor: pointer;
    &:hover {
      color: rgb(17, 85, 204);
    }
  }
  .mail {
    width: 20%;
  }
  .diff {
    width: 10%;
  }
  .rate {
    width: 20%;
    text-align: center;
  }
  .btn-primary {
    margin-left: 10px;
  }
}
h2 {
  font-weight: 500;
  font-size: 36px;
  text-align: left;
  margin: 12px auto 18px 0;
}
</style>
