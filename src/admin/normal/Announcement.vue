<template>
  <Row>
    <Col span="24" align="left">
      <h1 class="admin-title">公告管理</h1>
    </Col>
    <Col span="24" align="left">
      <Row
        class="list"
        style="color: #17233d;font-size: 14px;font-weight: 500;padding-bottom: 10px"
      >
        <Col span="2">
          <p>编号</p>
        </Col>
        <Col span="8">
          <p>标题</p>
        </Col>
        <Col span="6">
          <p>最后更新时间</p>
        </Col>
        <Col span="4">
          <p>创建者</p>
        </Col>
        <Col span="4" align="center">
          <p>操作</p>
        </Col>
      </Row>
      <Row v-for="(item, index) in announcements" class="item" :key="item.id">
        <Col span="2">
          <p style="color: #515a6e">{{ index + 1 }}</p>
        </Col>
        <Col span="8">
          <div class="list-title">
            <a @click="announcementDetail(item.id)">{{ item.title }}</a>
          </div>
        </Col>
        <Col span="6">
          <p>{{ item.modifiedDate }}</p>
        </Col>
        <Col span="4">
          <p>{{ item.authorName }}</p>
        </Col>
        <Col span="2" align="center">
          <Button type="text" style="color: #2d8cf0" @click="edit(item.id)"
            >编辑</Button
          >
        </Col>
        <Col span="2" align="center">
          <Button
            type="text"
            style="color: #2d8cf0"
            @click="removeItem(item.id)"
            >删除</Button
          >
        </Col>
      </Row>
      <Row>
        <Col span="24" style="margin-bottom: 40px">
          <h1 class="publish-title ">发布公告</h1>
          <div class="publish-part">
            <h4>标题</h4>
            <Input v-model="title" placeholder="" style="width: 100%" />
          </div>
          <div class="publish-part">
            <h4>内容</h4>
            <vue-wangeditor
              style="text-align: left"
              id="editor"
              :options="options"
              v-model="content"
              :init-content="initContent"
              :text.sync="text"
            ></vue-wangeditor>
          </div>
          <Button :class="classA" @click="publish()" :disabled="this.disabledA"
            >发布</Button
          >
          <Button
            :class="classB"
            @click="revise()"
            :disabled="this.disabledB"
            style="margin-left: 10px;"
            >修改</Button
          >
        </Col>
      </Row>
    </Col>
  </Row>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import api from '../../api/api'

@Component
export default class Admin extends Vue {
  text: any = '' // 不含html标签，纯文本
  initContent = ''
  options: any = {
    width: '100%',
    height: '300px',
  }

  classA: any = 'publish'
  classB: any = 'disabled'
  announcements: any = []
  title: any = ''
  content: any = 'ggg'
  id: any = ''
  disabledA: boolean = false
  disabledB: boolean = true

  getAllAnnouncements() {
    api
      .getAllAnnouncements({})
      .then((res: any) => {
        this.announcements = res.data
      })
      .catch((err: any) => {
        console.log(err, 'err')
      })
  }

  announcementDetail(id: string) {
    this.$router.push({
      path: `/announcement/${id}`,
    })
  }

  edit(id: string) {
    this.disabledA = true
    this.disabledB = false
    this.classA = 'disabled'
    this.classB = 'publish'
    api
      .getAnnouncement({ id })
      .then((res: any) => {
        this.title = res.data.title
        this.initContent = res.data.content
        this.content = res.data.content
        this.id = res.data.id
      })
      .catch((err: any) => {
        ;(this as any).$Message.error(err.data.message)
      })
  }

  revise() {
    api
      .updateAnnouncement({
        id: this.id,
        title: this.title,
        content: this.content,
      })
      .then((res: any) => {
        this.classB = 'disabled'
        this.classA = 'publish'
        this.disabledA = false
        this.disabledB = true
        this.title = ''
        this.content = ''
        this.initContent = ''
        ;(this as any).$Message.success('修改成功')
        this.getAllAnnouncements()
      })
      .catch((err: any) => {
        ;(this as any).$Message.error(err.data.message)
      })
  }

  removeItem(id: string) {
    api
      .removeAnnouncement({ id })
      .then((res: any) => {
        ;(this as any).$Message.success('删除成功')
        this.getAllAnnouncements()
      })
      .catch((err: any) => {
        ;(this as any).$Message.error(err.data.message)
      })
  }

  publish() {
    if (this.title !== null && this.content !== null) {
      api
        .createAnnouncement({
          title: this.title,
          content: this.content,
        })
        .then((res: any) => {
          this.title = ''
          this.content = ''
          this.initContent = ''
          ;(this as any).$Message.success('创建成功')
          this.getAllAnnouncements()
        })
        .catch((err: any) => {
          ;(this as any).$Message.error(err.data.message)
        })
    } else {
      ;(this as any).$Message.error('不能为空')
    }
  }

  mounted() {
    this.getAllAnnouncements()
  }
}
</script>

<style scoped>
.admin-title {
  padding: 20px 0 20px 0;
}

.publish-title {
  padding: 60px 0 0 0;
}

.publish-part {
  padding: 20px 0 20px 0;
}

.disabled {
  cursor: not-allowed;
  display: inline-block;
  margin-bottom: 0;
  font-weight: 400;
  text-align: center;
  -ms-touch-action: manipulation;
  touch-action: manipulation;
  border: 1px solid #dcdee2;
  white-space: nowrap;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
  padding: 6px 15px;
  line-height: 1.5;
  border-radius: 4px;
  transition: color 0.2s linear, background-color 0.2s linear,
    border 0.2s linear, box-shadow 0.2s linear;
  color: #515a6e;
  background-color: #fff;
}

.publish {
  color: #fff;
  background-color: #2d8cf0;
  padding: 6px 15px;
  border-radius: 4px;
  vertical-align: middle;
  line-height: 1.5;
  display: inline-block;
  margin-bottom: 0;
  font-weight: 400;
  text-align: center;
  -ms-touch-action: manipulation;
  touch-action: manipulation;
  cursor: pointer;
  border: 1px solid #2d8cf0;
  white-space: nowrap;
}

.item {
  border-bottom: 1px solid #e8eaec;
  padding-top: 10px;
}
</style>
