<template>
  <Row>
    <Col span="16" offset="4" style="padding-top: 40px">
      <div
        class="paddingTop"
        v-for="(announcement, index) in announcements"
        :key="index"
      >
        <h1>{{ announcement.title }}</h1>
        <p>
          <span>作者：{{ announcement.authorName }}</span
          ><span>创建时间：{{ announcement.modifiedDate }}</span>
        </p>
        <p class="content" v-html="announcement.content"></p>
      </div>
    </Col>
  </Row>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import api from '../api/api'

@Component
export default class Index extends Vue {
  announcements: any = []

  getAnnouncement() {
    const params = this.$route.params
    const id: string = params.id
    const that = this
    api
      .getAnnouncement({ id })
      .then((res: any) => {
        that.announcements.push({
          authorId: res.data.authorId,
          authorName: res.data.authorName,
          content: res.data.content,
          id: res.data.id,
          modifiedDate: res.data.modifiedDate,
          title: res.data.title,
        })
      })
      .catch((err: any) => {
        ;(this as any).$Message.error(err.data.message)
      })
  }

  mounted() {
    this.getAnnouncement()
  }
}
</script>

<style lang="less" scoped>
.paddingTop {
  padding-top: 30px;
  p {
    padding-top: 20px;
    span {
      margin: 0 20px 0 20px;
    }
  }
}

.content {
  text-align: left;
  min-height: 600px;
}
</style>
