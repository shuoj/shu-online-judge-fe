<template>
  <div>
    <Row>
      <Col span="22" offset="1" align="left" class="item-padding">
        <h1>比赛成员列表</h1>
      </Col>
    </Row>
    <Row
      class="item-padding"
      style="vertical-align: middle;text-align: left;margin-bottom: 50px;"
    >
      <Col span="10" offset="1">
        <h2 style="padding-bottom: 20px;">
          导入小组成员（已经添加的可以不用再选）
        </h2>
      </Col>
      <Col span="2">
        <Button type="primary" @click="addGroupsToContest">添加</Button>
      </Col>
      <Col span="22" offset="1">
        <CheckboxGroup
          v-model="groupAdd"
          v-for="(item, index) in groups"
          :key="item.id"
        >
          <Checkbox :label="item.id" class="label">{{ item.name }}</Checkbox>
        </CheckboxGroup>
      </Col>
    </Row>
    <Row style="text-align: left">
      <Col span="22" offset="1">
        <h2>添加成员</h2>
        <AutoComplete
          v-model="member"
          icon="ios-search"
          @on-change="getMemberId"
          @on-select="pushInto"
          style="width: 300px;"
          placement="bottom"
        >
          <Option
            v-for="(item, index) in searchData"
            :value="item.id"
            :key="index"
          >
            <div class="option-two">
              <span>用户名: {{ item.username }}</span>
            </div>
          </Option>
        </AutoComplete>
      </Col>
      <Col span="22" offset="1" align="left">
        <Row
          class="list"
          style="color: #17233d;font-size: 14px;font-weight: 600;padding-bottom: 10px"
        >
          <Col span="2" style="text-align: center">
            <p>#</p>
          </Col>
          <Col span="8" offset="2">
            <p>用户名</p>
          </Col>
          <Col span="8">
            <p>状态</p>
          </Col>
          <Col span="4">
            <p>操作</p>
          </Col>
        </Row>
        <Row v-for="(item, index) in users" class="item" :key="index">
          <Col span="2" style="text-align: center">
            <p>{{ index + 1 }}</p>
          </Col>
          <Col span="8" offset="2">
            <p><span v-if="!item.userName">未知</span>{{ item.userName }}</p>
          </Col>
          <Col span="8">
            <p>{{ item.acceptCount }} / {{ item.submitCount }}</p>
          </Col>
          <Col span="4">
            <a style="color: #2d8cf0" @click="deleteMember(item.id)">删除</a>
          </Col>
        </Row>
      </Col>
    </Row>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import api from '../../api/api'

@Component
export default class Index extends Vue {
  groups: any = ''
  groupAdd: any = []
  users: any = []
  member: any = ''
  searchData: any = []

  getMemberId() {
    if (this.member) {
      api
        .getUser({ query: { username: this.member }, size: 10, page: 0 })
        .then((res: any) => {
          this.searchData.splice(0, this.searchData.length)
          const list = res.data.list
          list.forEach((item: any) => {
            this.searchData.push({
              id: item.id,
              username: item.username,
            })
          })
        })
        .catch(() => {
          console.log('error')
        })
    }
  }

  pushInto(id: any) {
    const params = this.$route.params
    const contestId: any = params.id
    this.member = ''
    if (id) {
      const userId: Array<number> = [id]
      api
        .addUserToContest({ id: contestId, userId: userId })
        .then((res: any) => {
          this.users = res.data
          ;(this as any).$Message.success('添加成功')
        })
        .catch(() => {
          ;(this as any).$Message.error('添加失败')
        })
    }
  }

  getAllGroup() {
    this.groupAdd = []
    const that = this
    api
      .getGroups()
      .then((res: any) => {
        that.groups = res.data.list
      })
      .catch((err: any) => {
        ;(this as any).$Message.error(err.data.message)
      })
  }

  getUser() {
    const params = this.$route.params
    const id: any = params.id
    api
      .getAllUserFromContest({ id })
      .then((res: any) => {
        this.users = res.data
      })
      .catch((err: any) => {
        ;(this as any).$Message.error(err.data.message)
      })
  }

  addGroupsToContest() {
    const params = this.$route.params
    const id: any = params.id
    const groupArray: Array<number> = []
    this.groupAdd.forEach(function(item: any) {
      groupArray.push(item)
    })
    api
      .addGroupsToContest({
        id: id,
        groupId: groupArray,
      })
      .then((res: any) => {
        ;(this as any).$Message.success('添加成功')
        this.getUser()
      })
      .catch((err: any) => {
        ;(this as any).$Message.error(err.data.message)
      })
  }

  deleteMember(userId: number) {
    const params = this.$route.params
    const id: any = params.id
    const groupArray: Array<number> = []
    groupArray.push(userId)
    api
      .deleteUserFromContest({
        id: id,
        userId: groupArray,
      })
      .then((res: any) => {
        this.getUser()
        ;(this as any).$Message.success('删除成功')
      })
      .catch((err: any) => {
        ;(this as any).$Message.error(err.data.message)
      })
  }

  mounted() {
    this.getAllGroup()
    this.getUser()
  }
}
</script>

<style scoped>
.item-padding {
  padding: 30px 0 0 0;
}

.list {
  margin-top: 40px;
  text-align: left;
  color: #17233d;
  font-size: 14px;
  font-weight: 600;
  border-bottom: 1px solid #e8eaec;
  padding-bottom: 10px;
}

.label {
  float: left;
  padding-right: 10px;
}

.item {
  text-align: left;
  border-bottom: 1px solid #e8eaec;
  padding: 15px 0 15px 0;
}

.username {
  padding-right: 15px;
  float: left;
}
</style>
