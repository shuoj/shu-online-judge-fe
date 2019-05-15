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
              </Col>
              <Button type="primary" style="margin-top: 10px" @click="recommend">进行推荐</Button>
              <Modal
                v-model="modal"
                title="推荐"
                width="80%"
                @on-ok="ok"
                @on-cancel="cancel">
                <div v-if="pending" align="center">
                  <Loading/>
                </div>
                <div v-else>
                  <Row style="width: 100%;height: 48px;font-weight: 600;font-size: 18px">
                    <Col span="8" align="left">
                      <div>
                        题目
                      </div>
                    </Col>
                    <Col span="4" align="left">
                      <div>难度</div>
                    </Col>
                    <Col span="12" align="left">
                      <div>标签</div>
                    </Col>
                  </Row>
                  <CheckboxGroup v-model="choose" class="checkgroup">
                    <Row style="padding-bottom: 20px;font-size: 18px">
                      <div v-for="(item, index) in recommendList" style="width: 100%;height: 48px">
                        <Col span="8" align="left">
                          <Checkbox :label="item.id" :key="item.id">
                            <span style="width: 20vw">{{ item.title }}</span>
                          </Checkbox>
                        </Col>
                        <Col span="4" align="left">
                          {{ item.difficulty }}
                        </Col>
                        <Col span="12" align="left">
                          <template v-for="i in item.tagList">
                            <span style="height: 20px;padding: 2px 6px; border: 1px solid #2d8cf0;border-radius: 6px;color:#2d8cf0;margin: 6px 4px; ">{{ i.name }}</span>
                          </template>
                        </Col>
                      </div>
                    </Row>
                  </CheckboxGroup>
                </div>
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
import Loading from '../../components/Loading.vue';
@Component({
  components: { Loading }
})
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
  pending: boolean = true;

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
              Math.floor(item.acceptRate * 100) +
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
    api.setProblemsToContest({
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
    this.pending = true;
    api.getRecommend({
      difficultDegree: this.difficulty,
      count: this.problemNum,
      duration: this.duration,
      interval: this.interval,
      tagIdsInclude: this.include,
      tagIdsExclude: this.exclude,
      userIdList: this.userList
    }).then((res: any) => {
      this.pending = false;
      this.recommendList = res.data;
    }).catch((err: any) => {
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
      .then((res: any) => {
        this.tags = res.data;
      })
      .catch((err: any) => {
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
