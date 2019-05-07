<template>
  <div>
    <Row>
      <Col span="24" align="left" class="item-padding">
        <Button @click="backToContest()" style="margin-bottom: 4px">
          <Icon type="md-arrow-round-back" size="28" />
          返回
        </Button>
      </Col>
      <Col span="24" align="left" class="item-padding" style="margin-bottom: 40px">
        <Tabs value="name1">
          <TabPane label="自动组卷" name="auto" style="padding: 0 20px">
            <Row>
              <Col span="24" style="text-align: left;">
                <div class="part">
                  <h2>需要的知识点:</h2>
                  <CheckboxGroup v-model="include" class="checkgroup">
                    <template v-for="(item, index) in tags">
                      <Checkbox :label="item.id" :key="item.id">
                        {{ item.name }}
                      </Checkbox>
                    </template>
                  </CheckboxGroup>
                </div>
              </Col>
              <Col span="24" style="text-align: left;">
                <div class="part">
                  <h2>不需要的知识点:</h2>
                  <CheckboxGroup v-model="exclude" class="checkgroup">
                    <template v-for="(item, index) in tags">
                      <Checkbox :label="item.id" :key="item.id">
                        {{ item.name }}
                      </Checkbox>
                    </template>
                  </CheckboxGroup>
                </div>
              </Col>
              <Col span="12" style="text-align: left;padding-top: 30px">
                <div class="part">
                  <h2>难度系数(0-10):</h2>
                  <InputNumber
                    :max="10"
                    :min="0"
                    :step="1"
                    v-model="difficulty"
                  ></InputNumber>
                </div>
                <div class="part">
                  <h2>题目数目:</h2>
                  <InputNumber
                    :max="10"
                    :min="0"
                    :step="1"
                    v-model="problemNum"
                  ></InputNumber>
                </div>
              </Col>
              <Col span="12" style="text-align: left;padding-top: 30px">
                <div class="part">
                  <h2>比赛时长（分钟）:</h2>
                  <InputNumber
                    :max="10000"
                    :min="0"
                    :step="1"
                    v-model="duration"
                  ></InputNumber>
                </div>
                <div class="part">
                  <h2>距离上次使用最短时间（天）:</h2>
                  <InputNumber
                    :max="10000"
                    :min="0"
                    :step="1"
                    v-model="interval"
                  ></InputNumber>
                </div>
                <!--<div class="part">-->
                <!--<h2>设置分数：</h2>-->
                <!--<Row class="row-height title" class-name="row-title">-->
                <!--<Col span="2" style="text-align: center">#</Col>-->
                <!--<Col span="6">题目</Col>-->
                <!--<Col span="4">难度</Col>-->
                <!--<Col span="3">正确率</Col>-->
                <!--<Col span="5">上次使用时间</Col>-->
                <!--<Col span="4">设置分数(总分100)</Col>-->
                <!--</Row>-->
                <!--<Row class="row-height" v-for="problem in recommend" :key="problem.index">-->
                <!--<Col span="2" style="text-align: center">{{problem.id}}</Col>-->
                <!--<Col span="6">{{problem.name}}</Col>-->
                <!--<Col span="4">{{problem.difficult}}</Col>-->
                <!--<Col span="3">{{problem.correct}}</Col>-->
                <!--<Col span="5">{{problem.last}}</Col>-->
                <!--<Col span="4"><Input placeholder="" style="width: 30px"></Input></Col>-->
                <!--</Row>-->
                <!--<Button type="primary" style="margin-top: 10px" @click="">完成组卷</Button>-->
                <!--</div>-->
              </Col>
              <Button type="primary" style="margin-top: 10px" @click="recommend">进行推荐</Button>
              <Modal
                v-model="modal"
                title="推荐"
                width="60vw"
                @on-ok="ok"
                @on-cancel="cancel">
                <div style="width: 100%;display: flex;height: 48px;font-weight: 600;font-size: 18px">
                  <div style="width: 30%">
                    题目
                  </div>
                  <div style="width: 20%">难度</div>
                  <div>标签</div>
                </div>
                <CheckboxGroup v-model="choose" class="checkgroup">
                  <div v-for="(item, index) in recommendList" style="width: 100%;display: flex;height: 48px">
                    <div style="width: 30%">
                      <Checkbox :label="item.id" :key="item.id">
                        <span style="width: 20vw">{{ item.title }}</span>
                      </Checkbox>
                    </div>
                    <div style="width: 20%">{{ item.difficulty }}</div>
                    <template v-for="i in item.tagList">
                      <div>
                        <span style="height: 20px;padding: 2px 6px; border: 1px solid #2d8cf0;border-radius: 6px;color:#2d8cf0 ">{{ i.name }}</span>
                      </div>
                    </template>
                  </div>
                </CheckboxGroup>
              </Modal>
            </Row>
          </TabPane>
          <TabPane label="手动组卷" name="hand">
            <Row style="text-align: left;padding-top: 40px">
              <Col span="24">
                <h2>用题目标题添加：</h2>
              </Col>
              <Col span="14">
                <AutoComplete
                  search
                  v-model="addTitle"
                  icon="ios-search"
                  placeholder="请输入题目"
                  @on-search="getProblemsByTitle"
                  @on-select="pushInto"
                  style="width: 100%;"
                  placement="bottom"
                >
                  <Option
                    v-for="(item, index) in searchData"
                    :value="item.id"
                    :key="index"
                  >
                    <div class="option-two">
                      <span>{{ item.title }}</span>
                    </div>
                  </Option>
                </AutoComplete>
              </Col>
            </Row>
          </TabPane>
        </Tabs>
      </Col>
      <Col span="24" align="left" style="padding: 40px 0px;border-top: 1px solid #e9e9e9;">
        <h1>已添加题目</h1>
        <Row
          class="list"
          style="color: #17233d;font-size: 14px;font-weight: 500;padding-bottom: 10px"
        >
          <Col span="2">
            <p>题号</p>
          </Col>
          <Col span="10">
            <p>题目</p>
          </Col>
          <Col span="6">
            <p>最后更新</p>
          </Col>
          <Col span="4">
            <p>通过次数/提交总数</p>
          </Col>
          <Col span="2" style="text-align: center">
            <p>操作</p>
          </Col>
        </Row>
        <Row v-for="(item, index) in problems" class="item" :key="item.id">
          <Col span="2">
            <p>{{ alphabet[index] }}</p>
          </Col>
          <Col span="10">
            <a @click="toProblem(item.id)">{{ item.title }}</a>
          </Col>
          <Col span="6">
            <p>{{ item.create }}</p>
          </Col>
          <Col span="4">
            <p>{{ item.rate }}</p>
          </Col>
          <Col span="2" style="text-align: center">
            <Button
              type="text"
              style="color: #2d8cf0"
              @click="deleteProblem(item.id)"
            >删除</Button
            >
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
  alphabet: any = [
    'A',
    'B',
    'C',
    'D',
    'E',
    'F',
    'G',
    'H',
    'I',
    'J',
    'K',
    'L',
    'M',
    'N',
    'O',
    'P',
    'Q',
    'R',
    'S',
    'T',
    'U',
    'V',
    'W',
    'X',
    'Y',
    'Z'
  ];
  searchData: any = [];
  problems: any = [];
  addTitle: any = '';
  tags: any = [];
  include: Array<string> = [];
  exclude: Array<string> = [];
  choose: Array<string> = [];
  difficulty: Number = 5;
  problemNum: Number = 5;
  interval: Number = 20;
  duration: Number = 60;
  userList: Array<string> = [];
  recommendList: Array<string> = [];
  modal: boolean = false;

  getAllProblemsFromASpecificContest() {
    const params = this.$route.params;
    const id: string = params.id;
    const that = this;
    that.problems = [];
    api
      .getAllProblemsFromASpecificContest({ id })
      .then((res: any) => {
        res.data.forEach(function(item: any) {
          that.problems.push({
            id: item.id,
            title: item.title,
            create: item.lastUsedDate,
            rate:
              item.acceptRate.toFixed(2) * 100 +
              '%(' +
              String(item.acceptCount) +
              ' / ' +
              String(item.submitCount) +
              ')'
          });
        });
      })
      .catch((err: any) => {
        console.log(err);
      });
  }

  ok () {
    const params = this.$route.params;
    const contestId: any = params.id;
    api
      .setProblemsToContest({
        id: contestId,
        problemId: this.choose
      })
      .then((res: any) => {
        (this as any).$Message.success('添加成功');
        this.getAllProblemsFromASpecificContest();
      })
      .catch((err: any) => {
        console.log(err);
        (this as any).$Message.error('添加失败');
      });
  }

  cancel () {
    (this as any).$Message.info('取消');
  }
  recommend() {
    api.getRecommend({
      difficultDegree: this.difficulty,
      count: this.problemNum,
      duration: this.duration,
      interval: this.interval,
      tagIdsInclude: this.include,
      tagIdsExclude: this.exclude,
      userIdList: this.userList
    }).then((res) => {
      this.recommendList = res.data;
      console.log(res.data);
    }).catch(err => {
      console.log(err);
    });
    this.modal = true;
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
      api
        .getProblemsIdByTitle({
          title: this.addTitle
        })
        .then((res: any) => {
          console.log(res.data);
          this.searchData = res.data.list;
        })
        .catch((err: any) => {
          console.log(err);
        });
    }
  }

  pushInto(id: any) {
    this.addTitle = '';
    if (id) {
      const params = this.$route.params;
      const contestId: any = params.id;
      api
        .setProblemsToContest({
          id: contestId,
          problemId: [id]
        })
        .then((res: any) => {
          (this as any).$Message.success('添加成功');
          this.getAllProblemsFromASpecificContest();
        })
        .catch((err: any) => {
          console.log(err);
          (this as any).$Message.error('添加失败');
        });
    }
  }

  getTagId() {
    api
      .getTags()
      .then(res => {
        this.tags = res.data;
      })
      .catch(err => {
        console.log(err);
      });
  }
  deleteProblem(itemId: any) {
    const params = this.$route.params;
    const id: any = params.id;
    const idArray: Array<number> = [];
    idArray.push(itemId);
    api
      .deleteProblemsInContest({
        id: id,
        problemArray: idArray
      })
      .then((res: any) => {
        console.log(res.data);
        (this as any).$Message.success('删除成功');
        this.getAllProblemsFromASpecificContest();
      })
      .catch((err: any) => {
        (this as any).$Message.success('删除失败');
        console.log(err);
      });
  }

  getUser() {
    const params = this.$route.params;
    const id: any = params.id;
    api
      .getAllUserFromContest({ id })
      .then((res: any) => {
        res.data.forEach((item: any) => {
          this.userList.push(item.id);
        });
      })
      .catch((err: any) => {
        console.log(err);
      });
  }

  mounted() {
    this.getTagId();
    this.getUser();
    this.getAllProblemsFromASpecificContest();
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
