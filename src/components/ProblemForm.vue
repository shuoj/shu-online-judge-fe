<template>
  <div class="problem-form">
    <Form :model="problemData" ref="problemForm">
      <FormItem>
        <h2>题目标题</h2>
        <Input v-model="problemData.title" />
      </FormItem>
      <FormItem>
        <h2>题目描述</h2>
        <vue-wangeditor
          style="text-align: left"
          id="editor1"
          :options="options"
          v-model="problemData.description"
          :init-content="dataProp.description"
          :text.sync="text"
        ></vue-wangeditor>
      </FormItem>
      <div class="form-horizontal">
        <FormItem style="width: 40%">
          <h2>时间限制(ms, 范围1-10000ms)</h2>
          <InputNumber v-model="timeLimit" />
        </FormItem>
        <FormItem style="width: 40%; margin-left: 48px">
          <h2>内存限制(MB, 最低16M, Java不能低于32M)</h2>
          <InputNumber v-model="ramLimit" />
        </FormItem>
      </div>
      <div class="form-horizontal">
        <FormItem style="width: 100px">
          <h2>难度</h2>
          <Select v-model="problemData.difficulty" style="width: 100px;">
            <Option value="LOW">简单</Option>
            <Option value="MEDIUM">中等</Option>
            <Option value="HIGH">难</Option>
          </Select>
        </FormItem>
        <FormItem style="width: 10%; margin-left: 48px">
          <h2>前台是否可见</h2>
          <i-switch v-model="problemData.visible" size="large">
            <span slot="open">ON</span>
            <span slot="close">OFF</span>
          </i-switch>
        </FormItem>
        <FormItem style="width: 50%; margin-left: 48px">
          <h2>标签(按回车时创建)</h2>
          <div style="display: flex">
            <Tag
              type="dot"
              closable
              color="primary"
              v-for="item in problemData.tagList"
              :key="item.name"
              :name="item.name"
              @on-close="deleteTag"
              style="margin-right: 18px"
              >{{ item.name }}
            </Tag>
            <div>
              <Input
                @on-enter="addTag"
                @on-focus="dropFocus"
                v-model="tag"
                style="width: 200px;"
              />
              <!--<AutoComplete @enter="addTag" @on-select="selectTag" v-model="tag" style="width: 200px;">-->
              <div class="ivu-select-dropdown my-dropdown" v-if="myDropdown">
                <span
                  v-for="item in allTags"
                  :key="item.id"
                  class="my-item"
                  @click.stop="chooseItem(item)"
                >
                  <div style="margin-left: 8px">{{ item.name }}</div>
                </span>
              </div>
            </div>
            <!--</AutoComplete>-->
          </div>
        </FormItem>
      </div>
      <FormItem>
        <h2>输入描述</h2>
        <vue-wangeditor
          style="text-align: left"
          id="input"
          :options="options"
          v-model="problemData.inputDesc"
          :init-content="dataProp.description"
          :text.sync="text"
        ></vue-wangeditor>
      </FormItem>
      <FormItem>
        <h2>输出描述</h2>
        <vue-wangeditor
          style="text-align: left"
          id="output"
          :options="options"
          v-model="problemData.outputDesc"
          :init-content="dataProp.description"
          :text.sync="text"
        ></vue-wangeditor>
      </FormItem>
      <FormItem>
        <h2>
          样例
          <Button @click="addModal = true">添加</Button>
        </h2>
        <div>
          <div
            v-for="(panel, index) in sampleList"
            :key="index + 1"
            :name="panel.id"
          >
            <span>样例{{ index + 1 }}</span>
            <Button
              @click.stop="deleteSample(index)"
              style="float: right; margin-right: 12px;"
              type="warning"
              >删除
            </Button>
            <div slot="content" class="form-horizontal">
              <div style="width: 45%;">
                <h2>样例输入</h2>
                <div>{{ panel.input }}</div>
              </div>
              <div style="width: 45%; margin-left: 5%">
                <h2>样例输出</h2>
                <div>{{ panel.output }}</div>
              </div>
            </div>
          </div>
        </div>
        <Modal
          v-model="addModal"
          title="添加样例"
          width="80%"
          @on-ok="addPanel"
          @on-cancel="addModal = false"
        >
          <div class="form-horizontal">
            <div style="width: 45%;">
              <h2>样例输入</h2>
              <Input v-model="input" type="textarea" :rows="4" />
            </div>
            <div style="width: 45%; margin-left: 5%">
              <h2>样例输出</h2>
              <Input v-model="output" type="textarea" :rows="4" />
            </div>
          </div>
        </Modal>
      </FormItem>
      <FormItem>
        <h2>
          Special Judge
          <i-switch v-model="problemData.specialJudged"></i-switch>
        </h2>
        <span
          >Special
          Judge用于答案不唯一的情况,需要自己上传判题代码。上传测试用后如需要修改,
          必须重新上传对应类型的新测试用例。
          <a href="https://github.com/QingdaoU/OnlineJudge/wiki/SpecialJudge"
            >帮助和示例</a
          ></span
        >
        <code-mirror
          v-if="problemData.specialJudged"
          :logined="true"
        ></code-mirror>
      </FormItem>
      <FormItem>
        <h2>测试数据</h2>
        <span
          >请将所有测试用例打包在一个zip文件中上传，所有文件要在压缩包的根目录，且输入输出文件名要以从1开始连续数字标识要对应例如：
          1.in 1.out 2.in 2.out(普通题目)或者1.in 2.in 3.in(Special Judge)
          <a
            href="https://github.com/QingdaoU/OnlineJudge/wiki/%E6%B5%8B%E8%AF%95%E7%94%A8%E4%BE%8B%E4%B8%8A%E4%BC%A0"
          >
            帮助</a
          ></span
        >
        <Upload
          :headers="header"
          :action="baseURL + '/api/v1/upload'"
          style="cursor: pointer"
          :on-success="uploadSucc"
          :on-error="uploadErr"
        >
          <Icon type="ios-cloud-upload" size="52"></Icon>
          <p>Click here to upload</p>
        </Upload>
      </FormItem>
      <FormItem>
        <h2>提示</h2>
        <vue-wangeditor
          style="text-align: left"
          id="editor2"
          :options="options"
          v-model="problemData.hint"
          :init-content="dataProp.hint"
          :text.sync="text"
        ></vue-wangeditor>
      </FormItem>
      <FormItem>
        <h2>来源</h2>
        <Input
          v-model="problemData.source"
          @on-enter="handleSubmit('problemForm')"
        />
      </FormItem>
      <Button type="primary" @click="handleSubmit('problemForm')">提交</Button>
    </Form>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch } from 'vue-property-decorator'
import CodeMirror from '@/components/CodeMirror.vue'
import api from '@/api/api'
import { VUE_APP_BASE_URL } from '@/api/constant'

@Component({
  components: {
    CodeMirror,
  },
})
export default class Problemform extends Vue {
  problemData: any = {
    authorId: '',
    title: '',
    description: '',
    timeLimit: 0,
    ramLimit: 0,
    difficulty: '',
    tagList: [],
    inputDesc: '',
    outputDesc: '',
    sampleIO: '',
    testData: '',
    hint: '',
    source: '',
    specialJudged: false,
  }
  timeLimit: number = 0
  ramLimit: number = 0
  baseURL: any = VUE_APP_BASE_URL
  sampleList: Array<object> = []
  @Prop({}) dataProp: any
  tag: string = ''
  collapseList: Array<string> = ['0']
  allTags: any = []
  myDropdown: boolean = false
  options: any = {
    width: '100%',
    height: '300px',
  }
  initContent = '题目描述'
  text: any = '' // 不含html标签，纯文本
  addModal: boolean = false
  input: string = ''
  output: string = ''

  @Watch('dataProp')
  handleData() {
    if (this.dataProp) {
      const tagTemp = this.dataProp.tagList
      const tags: any[] = []
      tagTemp.forEach((item: any) => {
        tags.push(item)
      })
      this.timeLimit = Number(this.problemData.timeLimit)
      this.ramLimit = Number(this.problemData.ramLimit)
      this.problemData = this.dataProp
      if (this.dataProp.sampleIO) {
        this.sampleList = JSON.parse(this.dataProp.sampleIO)
      }
      this.problemData.tagList = tags
    }
  }

  get header() {
    return {
      Authorization: 'Bearer ' + window.localStorage.getItem('token'),
    }
  }

  addTag() {
    if (this.tag) {
      // 新建tag
      this.problemData.tagList.push({
        name: this.tag,
      })
      this.tag = ''
      this.myDropdown = false
    }
  }

  dropFocus() {
    this.myDropdown = true
  }

  chooseItem(item: any) {
    this.myDropdown = false
    this.problemData.tagList.push(item)
  }

  deleteTag(event: any, name: string) {
    const temp: any = []
    this.problemData.tagList.forEach((item: any) => {
      if (item.name !== name) {
        temp.push(item)
      }
    })
    this.problemData.tagList = temp
  }

  addPanel() {
    this.sampleList.push({
      input: this.input,
      output: this.output,
    })
    this.problemData.sampleIOList = this.sampleList
    this.addModal = false
  }

  uploadSucc(response: any, file: any, fileList: any) {
    this.problemData.testData = response.data
    ;(this as any).$Message.success('上传成功')
  }

  uploadErr(response: any, file: any, fileList: any) {
    ;(this as any).$Message.error('上传失败')
  }

  deleteSample(index: number) {
    if (this.sampleList.length === 1) {
      ;(this as any).$Notice.open({
        title: '这是最后一条了，不能删除',
      })
    } else {
      this.problemData.sampleIOList = this.sampleList.splice(index, 1)
    }
  }

  handleSubmit(name: string) {
    // (this.$refs[name] as any).validate((valid: boolean) => {
    //   if (valid) {
    //     (this as any).$Message.success('Success!');
    //   } else {
    //     (this as any).$Message.error('Fail!');
    //   }
    // });
    const temp: any = []
    this.problemData.tagList.forEach((item: any) => {
      if (item.id) {
        temp.push(item)
      } else {
        temp.push({
          name: item.name,
        })
      }
    })
    this.problemData.tagList = temp
    if (this.sampleList) {
      this.problemData.sampleIO = JSON.stringify(this.sampleList)
      this.problemData.sampleIOList = this.sampleList
    }
    this.problemData.timeLimit = this.timeLimit
    this.problemData.ramLimit = this.ramLimit
    this.$emit('problem-data', this.problemData)
  }

  getTags() {
    api
      .getTags()
      .then((res: any) => {
        this.allTags = res.data
      })
      .catch(err => {
        ;(this as any).$Message.error(err.data.message)
      })
  }

  mounted() {
    this.getTags()
  }
}
</script>

<style lang="less" scoped>
.problem-form {
  text-align: left !important;
}

h2 {
  text-align: left;
  font-weight: 700;
  font-size: 16px;
}

.form-horizontal {
  display: flex;
}

.my-dropdown {
  width: 200px;
}

.my-item {
  cursor: pointer;
  &:hover {
    background: #f3f3f3;
  }
}
</style>
