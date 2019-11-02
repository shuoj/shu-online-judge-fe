<template>
  <div class="container">
    <Tabs @on-click="getSubmission">
      <TabPane label="题目" name="problem">
        <h1>{{problem.title}}</h1>
        <p class="problem-description">发布时间:{{problem.createDate}}&nbsp;&nbsp;最后更新:{{problem.lastUsedDate}}&nbsp;&nbsp;时间限制:{{problem.timeLimit}}ms&nbsp;&nbsp;内存限制:{{problem.ramLimit}}M</p>
        <div>
          <div class="problem-section">
            <h3>描述</h3>
            <p v-html="problem.description"></p>
          </div>
          <div class="problem-section">
            <h3>输入</h3>
            <p>{{problem.inputDesc}}</p>
          </div>
          <div class="problem-section">
            <h3>输出</h3>
            <p>{{problem.outputDesc}}</p>
          </div>
          <div class="problem-section" v-for="(example, index) in JSON.parse(problem.sampleIO)" :key="index">
            <h3>样例输入{{index + 1}}</h3>
            <pre>{{example.input}}</pre>
            <h3>样例输出{{index + 1}}</h3>
            <pre>{{example.output}}</pre>
          </div>
          <div style="display: flex;justify-content: left;">
            <Button type="info" @click="hideInfo" v-if="!hide">查看隐藏信息</Button>
          </div>
          <div class="problem-section" v-if="hide" style="clear: both">
            <h3>标签</h3>
            <p>
              <Tag type="dot" v-for="(tag, index) in problem.tagList" :key="index" color="success">{{tag.name}}</Tag>
            </p>
          </div>
        </div>
        <code-mirror @codeSubmit="getCode" logined="logined" :myloading="codeLoading"></code-mirror>
        <Card v-if="codeStatus" class="pro-status">
          Run Code Status: <span :style="{color: codeColor}">{{codeStatus}}</span>&nbsp;&nbsp;
          <!-- <a target="_blank">查看详情</a> -->
          <router-link :to="shareRoute" target="_blank">查看详情</router-link>
        </Card>
      </TabPane>
      <TabPane label="提交" name="submission">
        <h1>{{problem.title}}</h1>
        <p class="problem-description">发布时间:{{problem.createDate}}&nbsp;&nbsp;最后更新:{{problem.lastUsedDate}}&nbsp;&nbsp;时间限制:{{problem.timeLimit}}ms&nbsp;&nbsp;内存限制:{{problem.ramLimit}}M</p>
        <Table :columns="title" :data="submission" border></Table>
      </TabPane>
    </Tabs>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator';
import api from '@/api/api';
import CodeMirror from '@/components/CodeMirror.vue';

@Component({
  components: {
    CodeMirror
  }
})
export default class ProblemDetail extends Vue {
  problem: any = {};
  submission: any = [];
  hide: boolean = false;
  codeLoading: boolean = false;
  codeStatus: string = '';
  submissionId: string = '1';
  title: any = [
    {
      title: '#',
      key: 'id',
      width: 78,
      className: 'pointer-class',
      render: (h: any, obj: any) => {
        return h(
          'span', {
            on: {
              click: () => {
                this.toShare(obj.row.shareId);
              }
            }
          }, obj.row.id);
      }
    },
    {
      title: '提交时间',
      key: 'createDate'
    },
    {
      title: '语言',
      key: 'language'
    },
    {
      title: '运行时间',
      key: 'duration'
    },
    {
      title: '结果',
      key: 'result'
    }
  ];

  get logined() {
    return window.localStorage.getItem('token');
  }

  get codeColor() {
    if (this.codeStatus === 'ACCEPTED') {
      return 'green';
    } else {
      return 'red';
    }
  }

  get shareRoute() {
    return '/share/' + this.submissionId;
  }

  @Watch('$route')
  handleRoute() {
    // 直接输路由时都没有变化
    this.getProblemDetail();
    this.hide = false;
  }

  hideInfo() {
    this.hide = true;
  }

  toShare(id: string) {
    const routeData = this.$router.resolve({ name: 'share', params: { id: id } });
    window.open(routeData.href, '_blank');
  }

  getCode(code: any) {
    if (code.code) {
      this.codeLoading = true;
      const params = this.$route.params;
      api.createCommit({ id: params.id, language: code.language, code: code.code }).then((res: any) => {
        this.codeLoading = false;
        this.codeStatus = res.data.result;
        this.submissionId = res.data.id;
      }).catch((err: any) => {
        console.log(err);
        this.codeLoading = false;
        // this.codeStatus = 'ACCEPTED';
      });
    } else {
      (this as any).$Message.error('代码不能为空');
    }
  }

  getSubmission(name: string) {
    if (name === 'submission') {
      const params = this.$route.params;
      api.getSpecificCommit({ id: params.id }).then((res: any) => {
        let id = 0;
        this.submission = res.data.map((item: any) => {
          item.shareId = item.id;
          id = id + 1;
          item.id = id;
          item.duration += 'ms';
          if (item.result === 'ACCEPTED') {
            return {
              ...item,
              cellClassName: {
                result: 'accept-class'
              }
            };
          } else {
            return {
              ...item,
              cellClassName: {
                result: 'err-class'
              }
            };
          }
        });
      }).catch(() => {
        console.log('err');
      });
    }
  }

  getProblemDetail() {
    this.codeLoading = false;
    const params = this.$route.params;
    api.getProblemsDetail({ id: params.id }).then((res: any) => {
      this.problem = res.data;
    }).catch((err: any) => {
      console.log(err, 'err');
    });
  }

  mounted() {
    this.getProblemDetail();
  }
}
</script>

<style lang="less" scoped>
  @import '../style/base';

  .pro-status {
    text-align: left;
    margin-top: 32px;
  }

  @media (min-width: 1200px) {
    .container {
      width: 1170px;
      margin: 0 auto;
      padding-top: 24px;
    }
  }

  h1 {
    font-size: 30px;
    font-weight: 500;
    margin-top: 20px;
    margin-bottom: 10px;;
  }

  h3 {
    text-align: left;
    font-size: 16px;
    font-weight: 700;
  }

  .problem-description {
    color: #777;
    font-size: 13px;
    line-height: 1.4;
    margin: 10px 0;
  }

  .problem-section {
    padding: 5px 0;
    p {
      text-align: left;
      font-size: 15px;
      color: rgb(51, 51, 51);
      margin-bottom: 10px;
    }
    pre {
      background-color: white;
      white-space: pre-wrap;
      word-wrap: break-word;
      padding: 9px;
      margin: 2px 0 9px;
      font-size: 12px;
      line-height: 1.4;
      border-radius: 0;
      border: 1px solid #ccc;
      text-align: left;
    }
  }
</style>
