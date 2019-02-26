<template>
  <Row :gutter="16">
    <Col span="16" offset="1" class="card-margin">
      <Row>
        <Col span="6" offset="18">
          <Input search enter-button v-model="keyword" @on-enter="search(keyword)" @click.native="search(keyword)"
                 placeholder="请输入标题名"/>
        </Col>
        <Col span="24" class="card-margin">
          <ul style="font-weight: 700" class="pro-table">
            <li></li>
            <li class="id">#</li>
            <li class="title">题目</li>
            <li class="diff">难度</li>
            <li>通过率</li>
          </ul>
          <ul v-for="(problem, index) in problems" :key="problem.id" class="pro-table"
              :class="[index % 2 ===0 ? 'bg': '']">
            <li></li>
            <li class="id" @click="problemDetail(problem)">{{index+1}}</li>
            <li class="title" @click="problemDetail(problem)">{{problem.title}}</li>
            <li class="diff">{{problem.level}}</li>
            <li>{{problem.rate}}</li>
          </ul>
        </Col>
        <Col span="24" class="card-margin">
          <Page :total="total" show-sizer @on-change="pageChange" @on-page-size-change="pageSizeChange"/>
        </Col>
      </Row>
    </Col>
    <Col span="6" class="card-margin">
      <Card dis-hover align="left">
        <p slot="title">公告</p>
        <li style="list-style: none" v-for="(announcement, index) in announcements" :key="announcement.id" class="item">
          <a @click="announcementDetail(announcement.id)">
            {{index+1}}.
            {{announcement.title}}
          </a>
        </li>
      </Card>
      <Card dis-hover align="left" style="margin-top: 20px">
        <p slot="title">分类</p>
        <Button shape="circle" size="small" @click="getProblems()">
          全部的
        </Button>
        <Button shape="circle" size="small" v-for="(tag, index) in tags" :key="index" @click="addTag(tag.id)">
          {{tag.name}}
          <span class="colored">{{tag.problemCount}}</span>
        </Button>
      </Card>
    </Col>
  </Row>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import api from '../api/api';

@Component
export default class Problems extends Vue {
  announcements: any = [];
  keyword: string = '';
  problems: any = [];
  searchProblems: any = [];
  pageSize: number = 10;
  page: number = 0;
  tags: any = [];
  total: any = 0;
  addTags: Array<number> = [];

  getAllAnnouncements() {
    api.getAllAnnouncements({}).then((res: any) => {
      // console.log(res.data);
      this.announcements = res.data;
    }).catch((err: any) => {
      console.log(err, 'err');
    });
  }

  announcementDetail(id: string) {
    this.$router.push({
      path: `/announcement/${id}`
    });
  }

  pageChange(pages: number) {
    this.page = pages - 1;
    this.getProblems(pages - 1, this.pageSize, this.addTags);
  }

  pageSizeChange(size: number) {
    this.getProblems(this.page, size, this.addTags);
    this.pageSize = size;
  }

  getProblems(page: number = 0, pageSize: number = 10, tags: Array<number> = []) {
    // 清空原来的数据
    const tagIds = tags[0];
    this.problems = [];
    api.getProblems({
      page: page,
      size: pageSize,
      tags: tagIds
    }).then((res: any) => {
      // console.log(res.data);
      this.total = res.data.total;
      const that = this;
      res.data.list.forEach(function (item: any) {
        that.problems.push({
          'index': item.id,
          'title': item.title,
          'level': item.difficulty,
          'rate': item.acceptRate + '%(' + String(item.acceptCount) + ' / ' + String(item.submitCount) + ')'
        });
      });
      that.searchProblems = that.problems;
    }).catch((err: any) => {
      console.log(err, 'err');
    });
  }

  search(keyword: string) {
    api.getProblemsIdByTitle({ title: keyword }).then((res: any) => {
      const that = this;
      const temp: any = [];
      // console.log(res.data);
      this.total = res.data.total;
      res.data.list.forEach(function (item: any) {
        temp.push({
          'index': item.id,
          'title': item.title,
          'level': item.difficulty,
          'rate': item.acceptRate + '%(' + String(item.acceptCount) + ' / ' + String(item.submitCount) + ')'
        });
      });
      that.problems = temp;
    }).catch((err: any) => {
      console.log(err);
    });
  }

  problemDetail(data: any) {
    this.$router.push({
      path: `/problems/${data.index}`
    });
  }

  getAllTags() {
    api.getAllTags({}).then((res: any) => {
      this.tags = res.data;
    }).catch((err: any) => {
      console.log(err, 'err');
    });
  }

  addTag(id: number) {
    this.addTags = [];
    this.addTags.push(id);
    this.getProblems(0, this.pageSize, this.addTags);
  }

  mounted() {
    this.getProblems();
    this.getAllTags();
    this.getAllAnnouncements();
  }
}
</script>

<style lang="less" scoped>
  @import '../style/base';

  .card-margin {
    margin-top: 20px;
    button {
      margin-right: 2px;
      padding: 3px 7px 3px;
    }
  }

  .colored {
    border-radius: 50px;
    background-color: #2db7f5;
    color: white;
    padding: 4px 8px 4px 8px;
  }

  Button {
    margin-bottom: 4px;
  }

  .problem-title {
    list-style: none;
    display: flex;
    justify-content: space-between;
  }

  .pro-table {
    list-style: none;
    display: flex;
    justify-content: space-between;
    height: 48px;
    line-height: 48px;
    text-align: left;
    border-bottom: rgb(221, 221, 221) solid 1px;
    .id {
      width: 35px;
      cursor: pointer;
      &:hover {
        color: rgb(17, 85, 204);
      }
    }
    .title {
      flex-grow: 1;
      cursor: pointer;
      &:hover {
        color: rgb(17, 85, 204);
      }
    }
    .diff {
      width: 90px;
    }
  }

  .pro-table > :first-child {
    width: 30px;
  }

  .pro-table > :last-child {
    width: 150px;
  }

  .bg {
    background-color: rgb(249, 249, 249);
  }
</style>
