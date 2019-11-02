<template>
  <Row>
    <Col span="4">
      <Menu theme="light"  active-name="$route.path" style="width:auto;padding-left: 20px;">
        <RouterLink to="/">
          <div class="icon-title" style="color: #515a6e">SHU OJ</div>
        </RouterLink>
        <MenuGroup title="首页" align="left">
          <MenuItem name="/admin/index" to="/admin/index">
            <Icon type="md-clipboard" />主页
          </MenuItem>
          <MenuItem name="/admin/judge-server" to="/admin/judge-server">
            <Icon type="ios-archive" />判题服务器
          </MenuItem>
        </MenuGroup>
        <MenuGroup title="通用" align="left">
          <MenuItem name="/admin/admin-announcement" to="/admin/admin-announcement">
            <Icon type="ios-paper"/>公告管理
          </MenuItem>
        </MenuGroup>
        <MenuGroup title="题目" align="left">
          <MenuItem name="/admin/problems-list" to="/admin/problems-list">
            <Icon type="md-list" />题目列表
          </MenuItem>
          <MenuItem name="/admin/create-problem" to="/admin/create-problem">
            <Icon type="ios-create" />创建题目
          </MenuItem>
        </MenuGroup>
        <MenuGroup title="比赛" align="left">
          <MenuItem name="/admin/contests-list" to="/admin/contests-list">
            <Icon type="md-list" />比赛列表
          </MenuItem>
          <MenuItem name="/admin/create-contest" to="/admin/create-contest">
            <Icon type="ios-create" />创建比赛
          </MenuItem>
        </MenuGroup>
        <MenuGroup title="小组" align="left">
          <MenuItem name="/admin/group-list" to="/admin/group-list">
            <Icon type="md-list" />小组列表
          </MenuItem>
        </MenuGroup>
        <MenuGroup title="用户" align="left">
          <MenuItem name="/admin/user-manager" to="/admin/user-manager">
            <Icon type="md-person" />用户管理
          </MenuItem>
          <MenuItem name="/admin/logs" to="/admin/logs">
            <Icon type="md-person" />学习记录
          </MenuItem>
        </MenuGroup>
      </Menu>
    </Col>
    <Col span="18" offset="1">
      <router-view></router-view>
    </Col>
  </Row>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';

@Component
export default class Admin extends Vue {

}
</script>

<style lang="less" scoped>
  @import '../style/base';

  .icon-title {
    font-size: 24px;
    font-weight: 500;
    margin-bottom: 12px;
    margin-top: 18px;
  }

</style>
