<template>
  <Menu mode="horizontal" :active-name="activeName">
    <MenuItem name="home" class="oj-logo" to="/">SHU Online Judge</MenuItem>
    <div class="layout-nav">
      <div class="nav-left">
        <MenuItem name="problems" to="/problems">题目</MenuItem>
        <MenuItem name="status" to="/status">状态</MenuItem>
        <MenuItem name="contests" to="/contests">比赛</MenuItem>
        <MenuItem name="group" to="/group">小组</MenuItem>
        <MenuItem name="rank" to="/rank">排名</MenuItem>
        <Submenu name="3">
          <template slot="title">
            关于
          </template>
          <MenuItem name="help" to="/help">帮助</MenuItem>
          <MenuItem name="about" to="/about">关于</MenuItem>
        </Submenu>
      </div>
      <div class="nav-right">
        <Dropdown @on-click="handleMenu" v-if="loginStatus" style="cursor: pointer">
          {{Username}}
          <Icon type="ios-arrow-down"></Icon>
          <DropdownMenu slot="list">
            <DropdownItem name="admin" v-if="isAdmin">后台管理</DropdownItem>
            <DropdownItem divided v-if="isAdmin" name="personal">我的主页</DropdownItem>
            <DropdownItem v-else name="personal">我的主页</DropdownItem>
            <DropdownItem name="submission">我的提交</DropdownItem>
            <DropdownItem name="setting">设置</DropdownItem>
            <DropdownItem name="logout" divided>注销</DropdownItem>
          </DropdownMenu>
        </Dropdown>
        <span v-else>
                <MenuItem name="login" to="/login">登录</MenuItem>
                <MenuItem name="register" to="/register">注册</MenuItem>
         </span>
      </div>
    </div>
  </Menu>
</template>

<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator';
import api from '../api/api';

@Component
export default class Navbar extends Vue {
  activeName: string = 'home';

  get loginStatus() {
    return this.Username;
  }

  get isAdmin() {
    if (this.$store.state.userInfo) {
      return this.$store.state.userInfo.authorities[0].authority.indexOf('USER') === -1;
    }
    return false;
  }

  get Username() {
    return this.$store.state.username || window.localStorage.getItem('username');
  }

  @Watch('$route')
  handleRoute(to: any, from: any) {
    this.activeName = to.name;
  }

  @Watch('loginStatus')
  handleInfo(status: boolean) {
    if (status) {
      api.getUserInfo().then((res: any) => {
        this.$store.commit('setUserInfo', res.data);
      }).catch((err: any) => {
        (this as any).$Message.error(err.data.message);
      });
    }
  }

  handleMenu(name: string) {
    if (name === 'logout') {
      this.logout();
    }
    if (name === 'admin') {
      this.$router.push('/admin');
    }
    if (name === 'personal') {
      const id = this.$store.state.userInfo.id;
      this.$router.push({
        path: `/personal/${id}`
      });
    }
    if (name === 'submission') {
      const id = this.$store.state.userInfo.id;
      this.$router.push({
        path: `/submission/${id}`
      });
    }
    if (name === 'setting') {
      const id = this.$store.state.userInfo.id;
      this.$router.push({
        path: `/setting/${id}`
      });
    }
  }

  logout() {
    this.$store.dispatch('logout')
      .then(() => {
        this.$router.replace('/');
      })
      .catch((err: any) => console.log('logout' + err));
  }
}
</script>

<style lang="less" scoped>
  @import '../style/base';

  .ivu-layout {
    background-color: @background-base !important;
  }

  .content-background {
    background-color: @background-base !important;
  }

  .oj-logo {
    text-align: center;
    width: 260px;
    height: 60px;
    font-size: 20px;
    font-weight: normal;
    /*font-family: code-font;*/
    color: #515a6e !important;
    border-bottom: 0.5px solid transparent !important;
  }

  .layout-nav {
    display: flex;
    justify-content: space-between;
  }

  .nav-right {
    margin-right: 32px;
  }
</style>
