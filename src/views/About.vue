<template>
  <Row>
    <Col span="20" offset="2">
      <div class="wrapper-content ivu-article">
        <article>
          <h1>ACM 简介</h1>
          <img src="@/assets/acm_logo.png" width="40%">
          <div class="content">
            <p align="left">
              ACM国际大学生程序设计竞赛（英语：ACM International Collegiate Programming Contest,
              ICPC）是由美国电脑协会（ACM）主办的，一项旨在展示大学生创新能力、团队精神和在压力下编写程序、分析和解决问题能力的年度竞赛。
              经过30多年的发展，ACM国际大学生程序设计竞赛已经发展成为最具影响力的大学生计算机竞赛。赛事目前由IBM公司赞助。
            </p>
          </div>
          <!-- 请使用这套程序的朋友不要删除"开源"这部分 -->
          <h1>开源</h1>
          <div class="content">
            <p align="left">
              <b>致谢:</b>本项目由
              <a href="https://github.com/QingdaoU/OnlineJudge">QingdaoU/OnlineJudge</a>修改而来，感谢该项目所作的工作
            </p>
            <p align="left" class="qd-link">
              <a href="https://github.com/QingdaoU/OnlineJudge" target="_blank">GitHub</a>
              <a href="https://github.com/QingdaoU/OnlineJudge/issues" target="_blank">问题反馈</a>
              <a href="https://github.com/QingdaoU/OnlineJudge/wiki/dev-team" target="_blank">开发团队</a>
            </p>
          </div>
          <!-- end -->
        </article>
      </div>
    </Col>
  </Row>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';

@Component
export default class About extends Vue {

}
</script>

<style lang="less" scoped>
  @import '../style/base';

  .wrapper-content {
    padding: 20px 25px;
    position: relative;
  }

  .content {
    padding: 20px 0 40px 0
  }

  .qd-link > a {
    margin-right: 10px;
  }
</style>
