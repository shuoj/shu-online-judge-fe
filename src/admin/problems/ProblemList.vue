<template>
  <div class="problem">
    <div v-if="editorProblem">
      <h2>题目列表</h2>
      <Row class="row-height" class-name="row-title">
        <Col span="1" style="text-align: center">ID</Col>
        <Col span="6">题目</Col>
        <Col span="4">创建时间</Col>
        <Col span="3">作者</Col>
        <Col span="2">可见</Col>
        <Col span="4">通过次数/提交总数</Col>
        <Col span="4"></Col>
      </Row>
      <Row class="row-height" v-for="problem in problems" :key="problem.index">
        <Col span="1" style="text-align: center">{{problem.index}}</Col>
        <Col span="6">{{problem.title}}</Col>
        <Col span="4">{{problem.create}}</Col>
        <Col span="3">{{problem.author}}</Col>
        <Col span="2">{{problem.canSee}}</Col>
        <Col span="4">{{problem.rate}}</Col>
        <Col span="4">
          <Button type="info" @click="editor(problem.index)">编辑</Button>
          <Button type="info" style="margin-left: 8px" @click="deleteProblem(problem.index)">删除</Button>
        </Col>
      </Row>
      <Row class-name="last-row">
        <Col span="4">仅显示可见
          <i-Switch v-model="canSee" @on-change="canSeeChange"></i-Switch>
        </Col>
        <Col offset="10">
          <Page :total="totalPage" show-sizer @on-change="pageChange" @on-page-size-change="pageSizeChange"/>
        </Col>
      </Row>
    </div>
    <div v-if="!editorProblem">
      <Button @click="backToList" style="margin-bottom: 4px">
        <Icon type="md-arrow-round-back" size="28"/>
        返回
      </Button>
      <problem-form :dataProp="problemDetail" @problem-data="getData"></problem-form>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import api from '@/api/api.ts';
import ProblemForm from '@/components/ProblemForm.vue';

@Component({
  components: {
    ProblemForm
  }
})
export default class Problemlist extends Vue {
  problems: Array<any> = [];
  canSee: boolean = true;
  pageSize: number = 10;
  page: number = 0;
  editorProblem: boolean = true;
  problemDetail: any = {};
  totalPage: number = 100;

  getProblems(page: number = 0, pageSize: number = 10) {
    // 清空原来的数据
    this.problems.splice(0, this.problems.length);
    api.getProblems({
      page: page,
      size: pageSize
    }).then((res: any) => {
      this.totalPage = res.data.total;
      const that = this;
      res.data.list.forEach(function (item: any) {
        that.problems.push({
          'index': item.id,
          'title': item.title,
          'level': item.difficulty,
          'rate': item.acceptRate + '%(' + String(item.acceptCount) + ' / ' + String(item.submitCount) + ')',
          'create': item.createDate,
          'author': item.authorName,
          'canSee': item.enabled ? '可见' : '不可见'
        });
      });
    }).catch((err: any) => {
      console.log(err, 'err');
    });
  }

  canSeeChange(now: boolean) {
    // 可见选中
    console.log(now, 'now');
    console.log(this.canSee, 'can');
  }

  pageChange(pages: number) {
    this.page = pages - 1;
    this.getProblems(pages - 1, this.pageSize);
  }

  pageSizeChange(size: number) {
    this.getProblems(this.page, size);
    this.pageSize = size;
  }

  editor(id: string) {
    // 编辑问题
    api.getProblemsDetail({ id: id }).then((res: any) => {
      this.problemDetail = res.data;
    }).catch((err: any) => {
      console.log(err, 'err');
    });
    this.editorProblem = false;
  }

  deleteProblem(id: string) {
    api.deleteProblem({ id: id }).then(() => {
      (this as any).$Message.success('删除成功');
      this.getProblems(this.page, this.pageSize);
    }).catch(() => {
      (this as any).$Message.error('删除失败');
    });
  }

  backToList() {
    // 从问题详情回去
    this.editorProblem = true;
  }

  getData(data: any) {
    api.updateProblem({
      id: this.problemDetail.id,
      problem: data
    }).then((res: any) => {
      (this as any).$Message.success('修改成功');
    }).catch(() => {
      (this as any).$Message.error('修改失败');
    });
  }

  mounted() {
    this.getProblems();
  }
}
</script>

<style lang="less" scoped>

  h2 {
    font-weight: 500;
    font-size: 36px;
    margin-bottom: 24px;
  }

  .problem {
    text-align: left;
    margin-top: 48px;
  }

  .row-height {
    height: 42px;
    line-height: 41px;
    border-top: 1px solid rgb(221, 221, 221);
    &:nth-child(odd) {
      background-color: #f9f9f9;
    }
  }

  .last-row {
    margin-top: 24px;
  }

</style>
