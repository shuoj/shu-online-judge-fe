<template>
  <Row>
    <Col span="16" offset="4" style="padding-top: 50px">
      <h1>设置密保问题</h1>
    </Col>
    <Col span="8" offset="4" style="padding-top: 50px">
      问题一：
      <Select v-model="model1" style="width:300px" @on-change="select1">
        <Option v-for="item in questions" :value="item.question" :key="item.id">{{ item.question }}</Option>
      </Select>
    </Col>
    <Col span="8" style="padding-top: 50px">
      答案：
      <Input v-model="value1" placeholder="Enter something..." style="width: 300px" />
    </Col>
    <Col span="8" offset="4" style="padding-top: 50px">
      问题二：
      <Select v-model="model2" style="width:300px" @on-change="select2">
        <Option v-for="item in questions" :value="item.question" :key="item.id">{{ item.question }}</Option>
      </Select>
    </Col>
    <Col span="8" style="padding-top: 50px">
      答案：
      <Input v-model="value2" placeholder="Enter something..." style="width: 300px" />
    </Col>
    <Col span="8" offset="4" style="padding-top: 50px">
      问题三：
      <Select v-model="model3" style="width:300px" @on-change="select3">
        <Option v-for="item in questions" :value="item.question" :key="item.id">{{ item.question }}</Option>
      </Select>
    </Col>
    <Col span="8" style="padding-top: 50px">
      答案：
      <Input v-model="value3" placeholder="Enter something..." style="width: 300px" />
    </Col>
    <Col span="24" style="padding-top: 50px;">
      <Button type="info" @click="deleteAnswer()">重置已设置答案</Button>
      <span style="padding:0 10px;"></span>
      <Button type="success" @click="submitAnswer">提交密保问题</Button>
    </Col>
  </Row>
</template>

<script lang="ts">
  import { Component, Vue } from 'vue-property-decorator';
  import api from '../api/api';

  @Component
  export default class Setting extends Vue {
    questions: any = '';
    model1: any = '';
    value1: any = '';
    model2: any = '';
    value2: any = '';
    model3: any = '';
    value3: any = '';
    id1: any = '';
    id2: any = '';
    id3: any = '';

    select1 (value: any) {
      if (value) {
        this.id1 = this.questions.filter((item: any) => item.question === value)[0].id;
      }
    }

    select2 (value: any) {
      if (value) {
        this.id2 = this.questions.filter((item: any) => item.question === value)[0].id;
      }
    }

    select3 (value: any) {
      if (value) {
        this.id3 = this.questions.filter((item: any) => item.question === value)[0].id;
      }
    }

    getAll () {
      api.getAllQuestions().then((res: any) => {
        this.questions = res.data;
      }).catch((err: any) => {
        console.log(err);
      });
    }

    submitAnswer () {
      api.setAnswers([
        {
          'id': this.id1,
          'answer': this.value1
        },
        {
          'id': this.id2,
          'answer': this.value2
        },
        {
          'id': this.id3,
          'answer': this.value3
        }
      ]).then((res: any) => {
        res = res.data;
        if (res.message === '保存成功') {
          (this as any).$Message.success('设置成功');
          this.reset();
        }
        if (res.message === '已有安全问题') {
          (this as any).$Message.error('已有安全问题');
          this.reset();
        }
      }).catch((err: any) => {
        console.log(err);
        (this as any).$Message.error('设置失败');
      });
    }

    reset () {
      this.model1 = '';
      this.value1 = '';
      this.model2 = '';
      this.value2 = '';
      this.model3 = '';
      this.value3 = '';
    }

    deleteAnswer () {
      api.deleteAnswers({}).then((res) => {
        console.log(res.data);
        (this as any).$Message.success('重置成功');
      }).catch((err) => {
        console.log(err);
      });
    }

    mounted () {
      this.getAll();
    }
  }
</script>

<style lang="less" scoped>

</style>
