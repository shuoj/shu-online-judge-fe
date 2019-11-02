<template>
  <div class="index">
    <div v-if="groupShow&&modifyShow">
      <h2>小组管理</h2>
      <ul style="font-weight: 700" class="pro-table">
        <li class="id">ID</li>
        <li class="title">名称</li>
        <li class="time">创建时间</li>
        <li class="id">人数</li>
        <li class="time">操作</li>
      </ul>
      <div class="no-member" v-if="noGroup">
        没有群组
      </div>
      <ul v-for="(group, index) in groups" :key="group.id" class="pro-table"
          :class="[index % 2 ===0 ? 'bg': '']">
        <li class="id">{{index+1}}</li>
        <li class="title">{{group.name}}</li>
        <li class="time">{{group.createDate}}</li>
        <li class="id">{{group.number}}</li>
        <li class="time">
          <Button @click="groupDetail(group)">详情</Button>
          <Button @click="modify(group)" type="info" style="margin-left: 8px">修改群组</Button>
          <Button @click="deleteGroup(group)" type="error" style="margin-left: 8px">删除群组</Button>
        </li>
      </ul>
    </div>
    <Modal v-model="deleteModal" @on-ok="confirmDelete">
      确认删除这个群组吗?
    </Modal>
    <div v-if="!groupShow">
      <div style="text-align: left">
        <Button @click="backToList" class="btn-top">
          <Icon type="md-arrow-round-back" size="28"/>
          返回
        </Button>
      </div>
      <div style="display: flex">
        <h2>
          小组成员管理
        </h2>
        <Button type="primary" style="height: 36px" @click="modal = true">
          批量创建成员
        </Button>
        <Upload
          :headers="header"
          :action="'http://10.0.3.31:53927' + '/api/v1/upload'"
          style="cursor: pointer"
          :on-success="uploadMembers"
          :on-error="uploadErr">
          <Icon type="ios-cloud-upload" size="52"></Icon>
          <p>批量上传文件创建用户</p>
        </Upload>
      </div>
      <ul style="font-weight: 700" class="pro-table">
        <li class="id">ID</li>
        <li class="title">用户名</li>
        <li class="time">真实姓名</li>
        <li class="time">操作</li>
      </ul>
      <div v-if="memberShow" class="no-member">
        <span>暂无成员</span>
      </div>
      <ul v-for="(user, index) in users" :key="index" class="pro-table"
          :class="[index % 2 ===0 ? 'bg': '']">
        <li class="id">{{index+1}}</li>
        <li class="title">{{user.name}}</li>
        <li class="time">{{user.username}}</li>
        <li class="time">
          <!--<Button style="margin-right: 8px">设为管理员</Button>-->
          <Button type="error" @click="deleteUser(user)"> 移除</Button>
        </li>
      </ul>
      <h2 style="padding-top: 40px">添加小组成员</h2>
      <AutoComplete v-model="member" icon="ios-search" @on-change="debounceFunc" @on-select="pushInto"
                    style="width: 300px;" placement="bottom">
        <Option v-for="(item, index) in searchData" :value="item.id" :key="index">
          <div class="option-two">
            <span>用户名: {{item.username}}</span>
          </div>
        </Option>
      </AutoComplete>
    </div>
    <div v-if="!modifyShow">
      <div style="text-align: left">
        <Button @click="modifyBackToList" class="btn-top">
          <Icon type="md-arrow-round-back" size="28"/>
          返回
        </Button>
        <GroupForm :typeProp="2" :dataProp="thisGroup"></GroupForm>
      </div>
    </div>
    <Modal
      v-model="modal"
      title="批量添加数目"
      width="40%"
      @on-ok="createMembers"
      @on-cancel="modal = false">
      <Input v-model="quantity" placeholder="请输入数目"/>
    </Modal>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import api from '@/api/api.ts';
import GroupForm from '@/components/CreateGroup.vue';
import { debounce } from '@/util/util.ts';
import { VUE_APP_BASE_URL } from '@/api/constant';

@Component({
  components: {
    GroupForm
  }
})
export default class GroupList extends Vue {
  groups: Array<any> = [];
  users: Array<any> = [];
  groupShow: boolean = true;
  noGroup: boolean = false;
  modifyShow: boolean = true;
  thisGroup: any = {};
  deleteModal: boolean = false;
  member: string = '';
  searchData: Array<any> = [];
  debounceFunc: () => void;
  modal: boolean = false;
  quantity: string = '';
  baseURL: any = VUE_APP_BASE_URL;

  get memberShow() {
    if (this.users) {
      return this.users.length === 0;
    }
  }
  get header() {
    return {
      Authorization: 'Bearer ' + window.localStorage.getItem('token')
    };
  }
  getMemberId() {
    if (this.member) {
      api.getUser({ username: this.member, size: 10, page: 0 }).then((res: any) => {
        this.searchData.splice(0, this.searchData.length);
        const list = res.data.list;
        list.forEach((item: any) => {
          this.searchData.push({
            id: item.id,
            username: item.username
          });
        });
      }).catch(() => {
        console.log('error');
      });
    }
  }

  pushInto(id: any) {
    this.member = '';
    if (id) {
      api.addUserToGroup({ id: this.thisGroup.id, userId: id }).then(() => {
        (this as any).$Message.success('添加成功');
        api.getSpecificGroup({ id: this.thisGroup.id }).then((res: any) => {
          this.groupDetail(res.data);
        }).catch(() => {
          console.log('error');
        });
      }).catch(() => {
        (this as any).$Message.error('添加失败');
      });
    }
  }

  createMembers() {
    const { id } = this.thisGroup;
    if (this.users.length === 0) {
      api.createMembers({
        groupId: id,
        quantity: this.quantity
      }).then(() => {
        this.groupDetail(this.thisGroup);
      }).catch((err) => {
        (this as any).$Message.error(err || '出错啦');
      });
    } else {
      (this as any).$Message.error('群组已经有成员了，不能再批量添加啦');
    }
  }

  uploadMembers (response: any, file: any, fileList: any) {
    const { id } = this.thisGroup;
    api.createMembers({
      groupId: id,
      fileToken: response.data
    }).then(() => {
      this.groupDetail(this.thisGroup);
    }).catch((err) => {
      (this as any).$Message.error(err || '出错啦');
    });
  }

  uploadErr(response: any, file: any, fileList: any) {
    (this as any).$Message.error('上传失败');
  }
  getGroups() {
    this.groups.splice(0, this.groups.length);
    api.getGroups().then((res: any) => {
      if (res.data.code === -1) {
        this.noGroup = true;
      } else {
        res.data.forEach((item: any) => {
          this.groups.push({
            id: item.id,
            name: item.name,
            createDate: item.createDate,
            number: item.jwtUserList.length,
            userList: item.jwtUserList
          });
        });
      }

    }).catch((err: any) => {
      console.log(err);
    });
  }

  groupDetail(group: any) {
    this.thisGroup = {
      id: group.id,
      name: group.name
    };
    this.users.splice(0, this.users.length);
    const list = group.userList || group.jwtUserList;
    list.forEach((item: any) => {
      this.users.push({
        groupId: group.id,
        id: item.id,
        name: item.username,
        username: item.firstname ? (item.lastname + item.firstname) : '未知'
      });
    });
    this.groupShow = false;
  }

  modify(group: any) {
    this.thisGroup = {
      id: group.id,
      name: group.name
    };
    this.modifyShow = false;
  }

  deleteGroup(group: any) {
    this.thisGroup.id = group.id;
    this.deleteModal = true;
  }

  confirmDelete() {
    api.deleteGroup({ id: this.thisGroup.id }).then(() => {
      (this as any).$Message.success('删除成功');
      this.getGroups();
    }).catch(() => {
      (this as any).$Message.error('删除失败');
    });
  }

  deleteUser(user: any) {
    const that = this;
    api.deleteMember({ id: user.groupId, memberId: user.id }).then((res: any) => {
      const groupId = this.users[0].groupId;
      this.users.splice(0, this.users.length);
      const list = res.data.jwtUserList;
      list.forEach((item: any) => {
        this.users.push({
          groupId: groupId,
          id: item.id,
          name: item.username,
          username: item.firstname ? (item.lastname + item.firstname) : '未知'
        });
      });
      (that as any).$Message.success('删除成功');
    }).catch((err: any) => {
      console.log(err);
      (that as any).$Message.success('删除失败');
    });
  }

  backToList() {
    this.groupShow = true;
    this.getGroups();
  }

  modifyBackToList() {
    this.modifyShow = true;
    this.getGroups();
  }

  mounted() {
    this.getGroups();
    this.debounceFunc = debounce(this.getMemberId, 400, this);
  }
}
</script>

<style lang="less" scoped>

  .option-two {
    display: flex;
    justify-content: space-between;
  }

  .btn-top {
    margin-top: 12px;
  }

  .no-member {
    font-size: 24px;
    margin-top: 18px;
    text-align: center;
  }

  h2 {
    font-weight: 500;
    font-size: 36px;
    text-align: left;
    margin: 12px auto 18px 0;
  }

  .index {
    width: 1140px;
    height: 100vh;
    margin: 0 auto;
    text-align: left;
  }

  .pro-table {
    list-style: none;
    display: flex;
    justify-content: space-between;
    height: 48px;
    line-height: 48px;
    text-align: left;
    border-bottom: rgb(221, 221, 221) solid 1px;
    .id {
      width: 50px;
    }
    .title {
      flex-grow: 1;
    }
    .way {
      width: 145px;
    }
    .time {
      width: 300px;
    }
  }

  .bg {
    background-color: rgb(249, 249, 249);
  }
</style>
