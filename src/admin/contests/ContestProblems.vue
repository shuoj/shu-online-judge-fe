<template>
  <div>
    <Row>
      <Col span="22" offset="1" align="left" class="item-padding">
        <Button @click="backToContest()" style="margin-bottom: 4px">
          <Icon type="md-arrow-round-back" size="28"/>
          返回
        </Button>
      </Col>
      <Col span="22" offset="1" align="left" class="item-padding">
        <h1>比赛题目列表</h1>
      </Col>
    </Row>
    <Row  class="item-padding" style="vertical-align: middle;text-align: left">
      <Col span="22" offset="1">
        <h2>用题目标题添加：</h2>
      </Col>
      <Col span="13" offset="1">
        <AutoComplete search v-model="addTitle" icon="ios-search" placeholder="请输入题目" @on-search="getProblemsByTitle" @on-select="pushInto"
                      style="width: 500px;" placement="bottom">
          <Option v-for="(item, index) in searchData" :value="item.id" :key="index">
            <div class="option-two">
              <span>{{item.title}}</span>
            </div>
          </Option>
        </AutoComplete>
      </Col>
      <!--<Col span="5" align="left">-->
        <!--<Button type="primary" @click="setProblem()">添加题目</Button>-->
      <!--</Col>-->
      <!--<Col span="22" offset="1" class="item-padding">-->
        <!--<Tag type="dot" closable color="primary" v-for="item in tagName" :key="item.id" :name="item.id" closable @on-close="handleClose">{{item.title}}</Tag>-->
      <!--</Col>-->
      <Col span="22" offset="1" align="left">
        <!--<Row class="list" style="color: #17233d;font-size: 14px;font-weight: 500;padding-bottom: 10px">-->
          <!--<Col span="2">-->
            <!--<p>题号</p>-->
          <!--</Col>-->
          <!--<Col span="10">-->
            <!--<p>题目</p>-->
          <!--</Col>-->
          <!--<Col span="6">-->
            <!--<p>最后更新</p>-->
          <!--</Col>-->
          <!--<Col span="4">-->
            <!--<p>通过次数/提交总数</p>-->
          <!--</Col>-->
          <!--<Col span="2" style="text-align: center">-->
            <!--<p>操作</p>-->
          <!--</Col>-->
        <!--</Row>-->
        <!--<Row v-for="(item, index) in problems" class="item" :key="item.id">-->
          <!--<Col span="2">-->
            <!--<p>{{alphabet[index]}}</p>-->
          <!--</Col>-->
          <!--<Col span="10">-->
            <!--<a @click="toProblem(item.id)">{{item.title}}</a>-->
          <!--</Col>-->
          <!--<Col span="6">-->
            <!--<p>{{item.create}}</p>-->
          <!--</Col>-->
          <!--<Col span="4">-->
            <!--<p>{{item.rate}}</p>-->
          <!--</Col>-->
          <!--<Col span="2" style="text-align: center">-->
            <!--<Button type="text" style="color: #2d8cf0" @click="deleteProblem(item.id)">删除</Button>-->
          <!--</Col>-->
        <!--</Row>-->
        <Row>
          <Col span="24" style="text-align: left;padding-top: 30px">
            <div class="part">
              <h2>知识点:</h2>
              <CheckboxGroup v-model="label" class="checkgroup">
                <Checkbox label="动态规划">
                </Checkbox>
                <Checkbox label="数组">
                </Checkbox>
                <Checkbox label="贪心">
                </Checkbox>
                <Checkbox label="分治法">
                </Checkbox>
              </CheckboxGroup>
            </div>
            <div class="part">
              <h2>难度系数:</h2>
              <InputNumber :max="1" :min="0" :step="0.01" v-model="difficulty"></InputNumber>
            </div>
            <div class="part">
              <h2>选题：</h2>
              <Transfer
                :data="data1"
                :target-keys="targetKeys1"
                :render-format="render1"
                @on-change="handleChange"></Transfer>
              <Button type="primary" style="margin-top: 10px" @click="combine">选择</Button>
            </div>
            <div class="part">
              <h2>设置分数：</h2>
              <Row class="row-height title" class-name="row-title">
                <Col span="2" style="text-align: center">#</Col>
                <Col span="6">题目</Col>
                <Col span="4">难度</Col>
                <Col span="3">正确率</Col>
                <Col span="5">上次使用时间</Col>
                <Col span="4">设置分数(总分100)</Col>
              </Row>
              <Row class="row-height" v-for="problem in recommend" :key="problem.index">
                <Col span="2" style="text-align: center">{{problem.id}}</Col>
                <Col span="6">{{problem.name}}</Col>
                <Col span="4">{{problem.difficult}}</Col>
                <Col span="3">{{problem.correct}}</Col>
                <Col span="5">{{problem.last}}</Col>
                <Col span="4"><Input placeholder="" style="width: 30px"></Input></Col>
              </Row>
              <Button type="primary" style="margin-top: 10px" @click="">完成组卷</Button>
            </div>
          </Col>
        </Row>
      </Col>
    </Row>
  </div>
</template>

<script lang="ts">
  import { Component, Vue } from 'vue-property-decorator';
  import api from '../../api/api';

  @Component
  export default class Admin extends Vue {
    alphabet: any = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];
    searchData: any = [];
    problems: any = [];
    addTitle: any = '';
    data1: any = this.getMockData();
    targetKeys1: any = this.getTargetKeys();
    label: Array<string> = [];
    difficulty: Number = 0.5;
    recommend: any = [
      {
        id: 1,
        name: 'two sum',
        difficult: 'hard',
        last: '2018-05-05',
        correct: '30/50（60%）'
      },
      {
        id: 2,
        name: 'two sum',
        difficult: 'hard',
        last: '2018-05-05',
        correct: '30/50（60%）'
      },
      {
        id: 3,
        name: 'two sum',
        difficult: 'hard',
        last: '2018-05-05',
        correct: '30/50（60%）'
      }
    ];

    getAllProblemsFromASpecificContest() {
      const params = this.$route.params;
      const id: string = params.id;
      const that = this;
      that.problems = [];
      api.getAllProblemsFromASpecificContest({ id }).then((res: any) => {
        console.log(res.data);
        res.data.forEach(function (item: any) {
          that.problems.push({
            'id': item.id,
            'title': item.title,
            'create': item.lastUsedDate,
            'rate': item.acceptRate.toFixed(2)*100 + '%(' + String(item.acceptCount) + ' / ' + String(item.submitCount) + ')'
          });
        });
      }).catch((err: any) => {
        console.log(err);
      });
    }

    backToContest() {
      this.$router.push({
        path: `/admin/contests-list`
      });
    }

    toProblem(id: string) {
      this.$router.push({
        path: `/problems/${id}`
      });
    }

    getProblemsByTitle() {
      if (this.addTitle !== '') {
        api.getProblemsIdByTitle({
          title: this.addTitle
        }).then((res: any) => {
          console.log(res.data);
          this.searchData = res.data.list;
        }).catch((err: any) => {
          console.log(err);
        });
      }
    }

    pushInto(id: any) {
      this.addTitle = '';
      if (id) {
        const params = this.$route.params;
        const contestId: any = params.id;
        api.setProblemsToContest({
          id: contestId,
          problemId: [id]
        }).then((res: any) => {
          (this as any).$Message.success('添加成功');
          this.getAllProblemsFromASpecificContest();
        }).catch((err: any) => {
          console.log(err);
          (this as any).$Message.error('添加失败');
        });
      }
    }

    // handleClose (event: any, name: any) {
    //   const index = this.tagId.indexOf(name);
    //   this.tagId.splice(index, 1);
    //   this.tagName = this.tagName.filter((item: any) => item.id !== name);
    // }

    deleteProblem(itemId: any) {
      const params = this.$route.params;
      const id: any = params.id;
      const idArray: Array<number> = [];
      idArray.push(itemId);
      api.deleteProblemsInContest({
        id: id,
        problemArray: idArray
      }).then((res: any) => {
        console.log(res.data);
        (this as any).$Message.success('删除成功');
        this.getAllProblemsFromASpecificContest();
      }).catch((err: any) => {
        (this as any).$Message.success('删除失败');
        console.log(err);
      });
    }

    mounted() {
      this.getAllProblemsFromASpecificContest();
    }

    getMockData () {
      const mockData = [];
      for (let i = 1; i <= 20; i++) {
        mockData.push({
          key: i.toString(),
          label: '题目 ' + i,
          description: '题目简介 ' + i,
          disabled: Math.random() * 3 < 1
        });
      }
      return mockData;
    }
    getTargetKeys () {
      return this.getMockData()
        .filter(() => Math.random() * 2 > 1)
        .map(item => item.key);
    }
    render1 (item: any) {
      return item.label;
    }
    handleChange (newTargetKeys: any, direction: any, moveKeys: any) {
      this.targetKeys1 = newTargetKeys;
    }
    combine () {
      // this.targetKeys1
    }
  }
</script>

<style lang="less" scoped>
  .item-padding {
    padding: 30px 0 0 0;
  }

  .list {
    margin-top: 40px;
    text-align: left;
    color: #17233d;
    font-size: 14px;
    font-weight: 600;
    border-bottom: 1px solid #e8eaec;
    padding-bottom: 10px;
  }

  .item {
    text-align: left;
    border-bottom: 1px solid #e8eaec;
    padding-top: 10px;
  }

  .part {
    padding-top: 30px;
  }

  .title {
    font-weight: bold;
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
