<template>
  <div>
    <Row>
      <Col span="20" offset="2">
        <div class="my-info">
          <p>我的数据: 通过的题目数量: {{acCount}} 总提交数量: {{submitCount}}</p>
        </div>
      </Col>
    </Row>
    <Row>
      <Col span="20" offset="2">
        <Row class="list" style="color: #17233d;font-size: 14px;font-weight: 500">
          <Col span="1">
            <p style="color: #515a6e">#</p>
          </Col>
          <Col span="4" offset="1">
            <div class="list-title">
              <router-link to="/register"><p style="color: #515a6e">用户名</p></router-link>
            </div>
          </Col>
          <Col span="10" align="left">
            <p>签名</p>
          </Col>
          <Col span="3">
            <p>通过的题目数量</p>
          </Col>
          <Col span="3">
            <p>总提交数量</p>
          </Col>
          <Col span="2">
            <p>AC 率</p>
          </Col>
        </Row>
        <Row v-for="(item, index) in ranks" class="list" :key="index">
          <Col span="1">
            <p style="color: #515a6e">{{index+1}}</p>
          </Col>
          <Col span="4" offset="1">
            <div class="list-title">
              <a style="color: #2d8cf0" @click="toPersonal(item.id)">{{item.username}}</a>
            </div>
          </Col>
          <Col span="10" align="left">
            <p>{{item.sign}}</p>
            <p v-if="item.sign === null">暂无</p>
          </Col>
          <Col span="3">
            <p>{{item.ac}}</p>
          </Col>
          <Col span="3">
            <p>{{item.submit}}</p>
          </Col>
          <Col span="2">
            <p>{{item.rate}}</p>
          </Col>
        </Row>
      </Col>
      <Col span="20" offset="2" style="padding-top: 30px;">
        <Page :total="total" show-sizer @on-change="pageChange" @on-page-size-change="pageSizeChange"/>
      </Col>
    </Row>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import api from '../api/api';

@Component
export default class Index extends Vue {
  acCount: any = 0;
  submitCount: any = 0;
  ranks: any = [];
  page: number = 0;
  pageSize: number = 10;
  total: number = 0;

  pageChange(pages: number) {
    this.page = pages - 1;
    this.getRanking(pages - 1, this.pageSize);
  }

  pageSizeChange(size: number) {
    this.getRanking(this.page, size);
    this.pageSize = size;
  }

  getInfo() {
    const { userInfo } = this.$store.state
    const { acCount, submitCount } = userInfo;
    this.submitCount = submitCount;
    this.acCount = acCount;
  }

  getRanking(page: any = 0, pageSize: any = 10) {
    api.getRank({
      page: page,
      size: pageSize
    }).then((res: any) => {
      const that = this;
      this.total = res.data.total;
      res.data.list.forEach(function (item: any) {
        that.ranks.push({
          'id': item.id,
          'username': item.username,
          'ac': item.acCount,
          'sign': item.signature,
          'submit': item.submitCount,
          'rate': (item.submitCount !== 0) ? (item.acCount / item.submitCount * 100).toFixed(0) + '%' : '0%'
        });
      });
    }).catch((err: any) => {
      console.log(err, 'err');
    });
  }

  toPersonal(id: number) {
    this.$router.push({
      path: `/personal/${id}`
    });
  }
  mounted() {
    this.getInfo();
    this.getRanking();
  }
}
</script>

<style lang="less" scoped>
  @import '../style/base';

  .my-info {
    text-align: left;
    color: #808695;
    padding: 20px 0;
  }

  .list {
    border-bottom: 1px solid #ddd;
    font-weight: 400;
    padding: 15px 0 15px 0;
    &:nth-child(even) {
      background-color: #f9f9f9;
    }
    .list-title {
      text-align: left;
      color: rgba(0, 0, 0, 0.7);
    }
  }

</style>
