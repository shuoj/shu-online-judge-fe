<template>
  <div class="container">
    <Form :model="groupData" ref="groupForm" :rules="ruleValidate">
      <FormItem prop="name">
        <h3>小组名</h3>
        <Input v-model="groupData.name" />
      </FormItem>
      <!--
      <FormItem prop="des">
        <h3>描述</h3>
        <Input v-model="groupData.des" type="textarea" :rows="4"/>
      </FormItem>
      <FormItem>
        <h3>加入小组设置</h3>
        <div style="text-align: left">
          <RadioGroup v-model="groupData.setting">
            <Radio label="any">允许任何人加入</Radio>
            <Radio label="check">提交请求后管理员审核</Radio>
            <Radio label="nobody">不允许任何人加入</Radio>
          </RadioGroup>
        </div>
      </FormItem>
      -->
      <Button
        type="primary"
        @click.once="handleSubmit('groupForm')"
        v-if="typeProp === 1"
        >创建小组</Button
      >
      <Button
        type="primary"
        @click="handleSubmit('groupForm')"
        v-if="typeProp === 2"
        >修改小组</Button
      >
    </Form>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch } from 'vue-property-decorator'
import api from '@/api/api.ts'

@Component
export default class GroupForm extends Vue {
  groupData: any = {
    name: '',
    id: '',
    // des: '',
    // setting: 'any'
  }
  @Prop({}) dataProp: any
  @Prop({ default: 1 }) typeProp: number
  // 1 创建 2 修改
  ruleValidate: any = {
    name: [
      { required: true, message: '请填写名称', trigger: 'blur' },
      { type: 'string', max: 20, message: '名称不能超过20字', trigger: 'blur' },
    ],
    // des: [{ required: true, message: '请填写描述', trigger: 'blur' }]
  }

  @Watch('dataProp')
  handleChange() {
    if (this.dataProp) {
      this.groupData = this.dataProp
    }
  }

  handleSubmit(name: string) {
    ;(this.$refs[name] as any).validate((valid: boolean) => {
      if (valid) {
        if (this.typeProp === 1) {
          api
            .createGroup({ name: this.groupData.name })
            .then((res: any) => {
              ;(this as any).$Message.success('创建成功!')
            })
            .catch(() => {
              ;(this as any).$Message.error('创建失败!')
            })
        }
        if (this.typeProp === 2) {
          if (this.groupData.name === this.dataProp.name) {
            ;(this as any).$Message.error('两次名称不能相同')
          } else {
            api
              .modifyGroup({ id: this.dataProp.id, name: this.groupData.name })
              .then((res: any) => {
                ;(this as any).$Message.success('修改成功!')
              })
              .catch(() => {
                ;(this as any).$Message.error('修改失败!')
              })
          }
        }
      } else {
        ;(this as any).$Message.error('校验失败!')
      }
    })
  }

  mounted() {
    if (this.dataProp) {
      this.groupData.name = this.dataProp.name
    }
  }
}
</script>

<style lang="stylus" scoped>
h2 {
  font-weight: 500;
  font-size: 36px;
  text-align: left;
  margin: 12px auto 18px 0;
}

h3 {
  text-align: left;
  font-weight: 700;
  font-size: 16px;
}

.container {
  text-align: left;
  margin-top: 24px;
}
</style>
