<template>
  <Row>
    <Col span="6" offset="9">
      <div class="register">
        <h1>用户注册</h1>
        <Form
          ref="registerForm"
          :model="register"
          :rules="registerRule"
          :label-width="80"
        >
          <FormItem label="用户名" prop="username">
            <Input
              v-model="register.username"
              placeholder="请输入用户名"
            ></Input>
          </FormItem>
          <FormItem label="邮箱" prop="mail">
            <Input
              type="email"
              v-model="register.mail"
              placeholder="请输入邮箱"
            ></Input>
          </FormItem>
          <FormItem label="密码" prop="password">
            <Input
              type="password"
              v-model="register.password"
              placeholder="请输入密码"
            ></Input>
          </FormItem>
          <FormItem label="再次输入密码" prop="passwdCheck">
            <Input
              type="password"
              v-model="register.passwdCheck"
              placeholder="请再次输入密码"
            ></Input>
          </FormItem>
          <FormItem label="姓" prop="lastname">
            <Input v-model="register.lastname" placeholder="请输入姓"></Input>
          </FormItem>
          <FormItem label="名" prop="firstname">
            <Input
              v-model="register.firstname"
              placeholder="请输入名字"
            ></Input>
          </FormItem>
          <FormItem label="学校" prop="school">
            <Input v-model="register.school" placeholder="请输入学校"></Input>
          </FormItem>
          <FormItem>
            <div class="footer-between">
              <Button type="primary" @click="handleSubmit('registerForm')"
                >注册</Button
              >
              <Button @click="handleReset()">重置</Button>
            </div>
          </FormItem>
        </Form>
      </div>
    </Col>
  </Row>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import api from '../api/api'
import md5 from 'js-md5'

@Component
export default class About extends Vue {
  register: any = {
    username: '',
    mail: '',
    password: '',
    passwdCheck: '',
    firstname: '',
    lastname: '',
    school: '',
  }

  validatePassCheck = (rule: any, value: string, callback: any) => {
    if (value === '') {
      callback(new Error('请再次输入密码'))
    } else if (value !== this.register.password) {
      callback(new Error('两次密码不相符'))
    } else {
      callback()
    }
  }

  registerRule: any = {
    username: [
      { required: true, message: '用户名不能为空', trigger: 'blur' },
      {
        type: 'string',
        min: 4,
        message: '用户名最小不能小于4位',
        trigger: 'blur',
      },
    ],
    firstname: [{ required: true, message: '姓不能为空', trigger: 'blur' }],
    lastname: [{ required: true, message: '名不能为空', trigger: 'blur' }],
    school: [{ required: true, message: '学校不能为空', trigger: 'blur' }],
    mail: [
      { required: true, message: '邮箱不能为空', trigger: 'blur' },
      { type: 'email', message: '格式不正确', trigger: 'blur' },
    ],
    passwdCheck: [{ validator: this.validatePassCheck, trigger: 'blur' }],
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
        api.user
          .register({
            username: this.register.username,
            password: md5(this.register.password),
            email: this.register.mail,
            firstname: this.register.firstname,
            lastname: this.register.lastname,
            name: this.register.lastname + this.register.firstname,
            school: this.register.school,
          })
          .then((res: any) => {
            ;(this as any).$Message.success('注册成功')
            this.handleReset()
          })
          .catch((err: any) => {
            ;(this as any).$Message.error(err.data.message)
          })
      }
    })
  }

  handleReset() {
    this.register = {
      username: '',
      mail: '',
      password: '',
      passwdCheck: '',
      firstname: '',
      lastname: '',
      school: '',
    }
  }
}
</script>

<style lang="less" scoped>
.register {
  margin-top: 50px;
  margin-bottom: 100px;
}

.input-form {
  padding-top: 20px;
  padding-bottom: 5px;
  text-align: left;
}

h1 {
  font-weight: 400;
  margin-bottom: 30px;
}

.footer-between {
  display: flex;
  justify-content: space-around;
  margin-left: -50px;
}
</style>
