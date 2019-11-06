<template>
  <div style="padding-top: 30px;" class="logs">
    <Row justify="center">
      <Col span="11">
        <h2>最近登录</h2>
        <div style="text-align: center">
          <Table :columns="columns" :data="logs"></Table>
          <div style="margin-top: 36px;">
            <Page :total="total" show-sizer @on-change="pageChange" @on-page-size-change="pageSizeChange"/>
          </div>
        </div>
      </Col>
      <Col span="11" offset="2">
        <h2>查询某学生的学习记录</h2>
        <Input v-model="name" placeholder="输入姓名" style="width: 300px" />
        <Button type="primary" @click="search(pageStudent, pageSizeStudent)">查询</Button>
        <div v-if="searchArray.length > 0" style="padding-top: 30px">
          <Table :columns="columns" :data="searchArray"></Table>
          <div style="margin-top: 36px;text-align: center">
            <Page :total="totalStudent" show-sizer @on-change="pageChangeStudent" @on-page-size-change="pageSizeChangeStudent"/>
          </div>
        </div>
      </Col>
    </Row>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import api from '../../api/api';

@Component
export default class UserManager extends Vue {
  columns: any = [
    {
      title: '姓名',
      key: 'name'
    },
    {
      title: '用户名',
      key: 'username'
    },
    {
      title: '上次登录时间',
      key: 'timestamp'
    }
  ];
  logs: any = [];
  total: number = 10;
  pageSize: number = 10;
  page: number = 0;
  totalStudent: number = 10;
  pageSizeStudent: number = 10;
  pageStudent: number = 0;
  name: string = '';
  searchArray: Array<any> = [];

  getLogs (page: number = 0, size: number = 10, name: string = '') {
    api.getLogs({
      name: name, size: size, page: page
    }).then((res: any) => {
      this.total = res.data.total;
      this.logs = res.data.list;
    }).catch((err: any) => {
      (this as any).$Message.error(err.data.message);
    });
  }

  pageChange(pages: number) {
    this.page = pages - 1;
    this.getLogs(pages - 1, this.pageSize);
  }

  pageSizeChange(size: number) {
    this.getLogs(this.page, size);
    this.pageSize = size;
  }

  pageChangeStudent(pages: number) {
    this.pageStudent = pages - 1;
    this.search(pages - 1, this.pageSizeStudent);
  }

  pageSizeChangeStudent(size: number) {
    this.search(this.pageStudent, size);
    this.pageSizeStudent = size;
  }

  search(page: number, pageSize: number) {
    api.getLogs({
      name: this.name, size: pageSize, page: page
    }).then((res: any) => {
      this.totalStudent = res.data.total;
      this.searchArray = res.data.list;
    }).catch((err: any) => {
      (this as any).$Message.error(err.data.message);
    });
  }

  mounted() {
    this.getLogs();
  }
}
</script>

<style lang="less" scoped>
  .logs {
    text-align: left;
  }
</style>
