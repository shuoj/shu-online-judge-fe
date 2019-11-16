<template>
  <Row>
    <Col span="6" offset="9">
      <Form
        ref="loginForm"
        :model="userLogin"
        :rules="loginRule"
        class="login-form"
      >
        <h1>用户登录</h1>
        <FormItem prop="username">
          <Input
            type="text"
            v-model="userLogin.username"
            placeholder="Username"
          >
            <Icon type="ios-person-outline" slot="prepend"></Icon>
          </Input>
        </FormItem>
        <FormItem prop="password">
          <Input
            type="password"
            v-model="userLogin.password"
            placeholder="Password"
            @on-enter="handleSubmit('loginForm')"
          >
            <Icon type="ios-lock-outline" slot="prepend"></Icon>
          </Input>
        </FormItem>
        <FormItem>
          <Button
            type="primary"
            @click="handleSubmit('loginForm')"
            style="width:100%"
            >登录</Button
          >
          <div class="forget-register">
            <p>
              还没注册吗？
              <router-link to="/register">注册</router-link>
            </p>
            <p>
              <router-link to="/forget">忘记密码</router-link>
            </p>
          </div>
        </FormItem>
      </Form>
    </Col>
  </Row>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import md5 from 'js-md5'

@Component
export default class Login extends Vue {
  userLogin: any = {
    username: '',
    password: '',
    role: '',
  }
  loginRule: any = {
    username: [{ required: true, message: '用户名不能为空', trigger: 'blur' }],
    password: [
      { required: true, message: '密码不能为空', trigger: 'blur' },
      {
        type: 'string',
        min: 6,
        message: '密码最小不能小于6位',
        trigger: 'blur',
      },
    ],
  }

  handleSubmit(name: string) {
    ;(this.$refs[name] as HTMLFormElement).validate((valid: any) => {
      if (valid === true) {
        this.$store
          .dispatch('login', {
            // dispatch toLogin action
            username: this.userLogin.username,
            password: md5(this.userLogin.password),
          })
          .then(() => {
            if (Object.getOwnPropertyNames(this.$route.query).length === 0) {
              this.$router.push({
                path: '/problems',
              })
            } else {
              this.$router.replace('/problems')
            }
          })
          .catch(() => {
            ;(this as any).$Message.error('用户名或密码错误')
          })
      }
    })
  }
}
</script>

<style lang="stylus" scoped>
@import '../style/base';

.login-form {
  margin-top: 150px;
  margin-bottom: 200px;
}

.forget-register {
  display: flex;
  justify-content: space-between;
}

h1 {
  font-weight: 400;
  margin-bottom: 30px;
}
</style>
