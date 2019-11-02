<template>
  <div>
  <Row>
    <Col span="20" offset="2">
      <Row>
        <Col align="left" span="10" class="card-margin">
          <h1>所有比赛</h1>
        </Col>
        <Col span="5" class="card-margin tag-padding">
          <span style="color:#2d8cf0;padding: 4px 8px 0 0;">比赛类型</span>
          <Select v-model="type" size="small" style="width:120px" @on-change="onTypeChanged">
            <Option v-for="item in typeType" :value="item.value" :key="item.value">{{ item.label }}</Option>
          </Select>
        </Col>
        <Col span="4" class="card-margin tag-padding">
          <span style="color:#2d8cf0;padding: 4px 8px 0 0;">状态</span>
          <Select v-model="status" size="small" style="width:100px" @on-change="onChanged">
            <Option v-for="item in endType" :value="item.value" :key="item.value">{{ item.label }}</Option>
          </Select>
        </Col>
        <Col span="4" class="card-margin">
          <Input search enter-button
                 v-model="keyword"
                 @on-search="keywordSearch(keyword)"
                 autofocus
                 @on-change="keywordEmpty()"
                 placeholder="请输入关键词" />
        </Col>
      </Row>
    </Col>
  </Row>
  <Row>
    <Col span="20" offset="2">
      <a @click="contestDetail(item.id)" v-for="(item, index) in contests"  :key="item.id">
        <Row class="list">
          <Col span="1">
            <div class="idx">{{item.idx}}</div>
          </Col>
          <Col span="2">
            <img src="../assets/contest.png" style="width:40px;margin-top:10px;"/>
          </Col>
          <Col span="8">
            <div class="list-title">
              <p style="color: #515a6e">{{item.name}}</p>
            </div>
            <div class="list-subtitle">
              <p style="width:200px;float: left">
                <Icon type="ios-calendar-outline" color="#2db7f5"/>{{item.startDate}}
              </p>
              <p style="float: left;">
                <Icon type="ios-clock-outline" color="#2db7f5"/>{{item.interval}}
              </p>
            </div>
          </Col>
          <Col span="4" offset="2">
            <div class="type">
              <span v-if="item.contestType === 'SECRET_WITH_PASSWORD'"><Icon type="md-unlock" color="#515a6e"/>私有赛(可加入)</span>
              <span v-else-if="item.contestType === 'PUBLIC'"><Icon type="ios-unlock-outline" color="#515a6e"/>公开赛</span>
              <span v-else-if="item.contestType === 'SECRET_WITHOUT_PASSWORD'"><Icon type="md-lock" color="#515a6e"/>私有赛(不可加入）</span>
            </div>
          </Col>
          <Col span="4" offset="3">
            <div class="status">
              <span v-if="item.status === 'PROCESSING'" class="text"><Icon type="ios-cafe" color="#2db7f5"/>正在进行</span>
              <span v-else-if="item.status === 'ENDED'" class="text"><Icon type="ios-checkmark-circle-outline" color="#ed4014"/>已结束</span>
              <span v-else="item.status === 'NOT_STARTED'" class="text"><Icon type="ios-cafe" color="#19be6b"/>即将开始</span>
            </div>
          </Col>
        </Row>
      </a>
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
export default class About extends Vue {
  total: number = 0;
  type: any = '';
  typeType: any = [
    {
      value: '',
      label: '所有的'
    },
    {
      value: 'SECRET_WITH_PASSWORD',
      label: '私有赛（可加入）'
    },
    {
      value: 'PUBLIC',
      label: '公开赛'
    },
    {
      value: 'SECRET_WITHOUT_PASSWORD',
      label: '私有赛（不可加入）'
    }];

  status: any = '';
  endType: any = [
    {
      value: '',
      label: '全部'
    },
    {
      value: 'NOT_STARTED',
      label: '即将开始'
    },
    {
      value: 'PROCESSING',
      label: '正在进行'
    },
    {
      value: 'ENDED',
      label: '已结束'
    }];
  keyword: string = '';
  contests: any = [];

  pageSize: number = 10;
  page: number = 0;

  pageChange(pages: number) {
    this.page = pages - 1;
    this.getContests(pages - 1, this.pageSize, this.status, this.type, this.keyword);
  }

  pageSizeChange(size: number) {
    this.getContests(this.page, size, this.status, this.type, this.keyword);
    this.pageSize = size;
  }

  onTypeChanged(type: any) {
    this.getContests(this.page, this.pageSize, this.status, type, this.keyword);
  }

  onChanged(status: any) {
    this.getContests(this.page, this.pageSize, status, this.type, this.keyword);
  }

  countInterval(sd: any, ed: any) {
    const interval: any = (ed - sd) / 1000;
    let continued = '';
    if (interval > 3600) {
      continued = (interval / 3600) + '小时';
      if (0 !== (interval % 60)) {
        continued += (interval % 60) + '分';
      }
    } else if (interval > 60 && interval < 3600) {
      continued = (interval / 60) + '分';
    }
    return continued;
  }

  getContests(page: number = 0, pageSize: number = 10, status: any = '', type: any = '', keyword: any = '') {
    api.getContests({
      page: page,
      size: pageSize,
      status: status,
      type: type,
      name: keyword
    }).then((res: any) => {
      this.contests = [];
      const that = this;
      const list = res.data.list;
      this.total = res.data.total;
      list.forEach(function (item: any) {
        const sd = new Date(Date.parse(item.startDate.replace(/-/g, '/')));
        const ed = new Date(Date.parse(item.endDate.replace(/-/g, '/')));
        const rest = new Date();
        const interval = that.countInterval(sd, ed);
        that.contests.push({
          'authorId': item.authorId,
          'authorName': item.authorName,
          'contestType': item.contestType,
          'createDate': item.createDate,
          'endDate': item.endDate,
          'startDate': item.startDate,
          'interval': interval,
          'description': item.description,
          'enable': item.enable,
          'id': item.id,
          'idx': item.idx,
          'judgeType': item.judgeType,
          'name': item.name,
          'rest': rest,
          'status': item.status
        });
      });
    }).catch((err: any) => {
      console.log(err, 'err');
    });
  }

  keywordSearch(keyword: any) {
    this.getContests(this.page, this.pageSize, this.status, this.type, keyword);
  }

  keywordEmpty() {
    if (this.keyword === '') {
      this.getContests(this.page, this.pageSize, this.status, this.type, this.keyword);
    }
  }

  contestDetail(id: number) {
    this.$router.push({
      path: `/contests/${id}`
    });
  }

  mounted() {
    this.getContests();
  }
}
</script>

<style lang="less" scoped>
  @import '../style/base';
  .card-margin {
    margin-top: 40px;
    margin-bottom: 40px;
    text-align: left;
  }

  .idx {
    font-size: 24px;
    color: #666;
    font-weight: 700;
  }

  .tag-padding {
    padding-top:10px;
  }

  .list {
    cursor: pointer;
    border-bottom: 1px solid #ddd;
    font-weight: 400;
    padding: 20px 0 20px 0;
    .list-title {
      text-align: left;
      font-size: 24px;
      color: rgba(0, 0, 0, 0.7);
    }
    .list-subtitle {
      text-align: left;
      font-size: 14px;
      color: rgba(0, 0, 0, 0.5);
    }
  }

  .status {
    vertical-align: middle;
    .text {
      box-sizing: border-box;
      border: 1px solid #e9eaec!important;
      border-radius: 3px;
      vertical-align: middle;
      text-align: center;
      color: rgba(0, 0, 0, 0.7);
      font-size: 14px;
      height: 50px;
      line-height: 54px;
      overflow: hidden;
      cursor: pointer;
      padding: 8px 12px;
      margin-top: 10px;
    }
  }

  .type {
    height: 20px;
    line-height: 54px;
    vertical-align: middle;
    text-align: left;
    font-size: 14px;
  }
</style>
