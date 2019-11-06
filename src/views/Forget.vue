<template>
  <Row>
    <Col span="4" offset="10" style="padding-top: 80px">
      <div v-if="revise">
        <Input v-model="password" type="password" placeholder="输入密码" style="margin-bottom: 20px"/>
        <Button type="info" @click="revisePassword">重置密码</Button>
      </div>
      <div v-else>
        <div v-if="reset" style="text-align: left;">
          <div style="margin-bottom: 20px">问题：{{this.question.question}}
            <Input v-model="answer" placeholder="输入答案" /></div>
          <Button type="info" @click="check">验证答案</Button>
        </div>
        <div v-else>
          <Input v-model="username" placeholder="请输入用户名" style="margin-bottom: 30px;"/>
          <Button type="info" @click="resetPwd">回答密保问题</Button>
        </div>
      </div>
    </Col>
  </Row>
</template>

<script lang="ts">
  import { Component, Vue } from 'vue-property-decorator';
  import api from '../api/api';
  import md5 from 'js-md5';

  @Component
  export default class Forget extends Vue {
    reset: boolean = false;
    username: string = '';
    question: any = '';
    answer: any = '';
    revise: boolean = false;
    password: string = '';

    resetPwd () {
      if (this.username) {
        this.reset = true;
        const username = this.username;
        api.getOwnQuestion({ username }).then((res: any) => {
          this.question = res.data;
        }).catch((err) => {
          (this as any).$Message.error(err.data.message);
        });
      } else {
        (this as any).$Message.warning('用户名不能为空');
      }
    }

    check () {
      api.checkAnswer({
        username: this.username,
        id: this.question.id,
        answer: this.answer
      }).then((res: any) => {
        this.reset = false;
        this.revise = true;
        window.localStorage.setItem('token', res.data.token);
      }).catch((err: any) => {
        (this as any).$Message.error(err.data.message);
      });
    }

    revisePassword () {
      const password = md5(this.password);
      api.forgetPassword({ password }).then((res: any) => {
        (this as any).$Message.success('成功');
        this.$router.push({
          path: `/login`
        });
      }).catch((err: any) => {
        (this as any).$Message.error(err.data.message);
      });
    }
  }
</script>
