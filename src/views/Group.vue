<template>
  <Row>
    <Col span="20" offset="2" style="padding-top: 60px;">
      <Table :columns="title" :data="groups"></Table>
    </Col>
  </Row>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import api from '@/api/api.ts';

@Component
export default class Group extends Vue {
  groups: any = [];
  title: any = [
    {
      title: '#',
      key: 'index',
      width: 80
    },
    {
      title: '名称',
      key: 'name',
      render: (h: any, obj: any) => {
        return h(
          'span', {
            on: {
              click: () => {
                // this.toGroupDetail(obj.row.id);
              }
            }
          }, obj.row.name);
      }
    },
    {
      title: '创建者',
      key: 'creator'

    },
    {
      title: '创建时间',
      key: 'createDate'
    }
  ];
  getGroups() {
    api.getGroups().then((res: any) => {
      let index = 0;
      this.groups = res.data.map((item: any) => {
        index = index + 1;
        item.index = index;
        return {
          ...item,
          index: index,
          creator: 'root'
        };
      });

    }).catch((err: any) => {
      console.log(err);
    });
  }

  mounted() {
    this.getGroups();
  }
}
</script>

<style lang="less" scoped>
  .index {
    width: 1140px;
    margin: 0 auto;
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
      cursor: pointer;
      &:hover {
        color: rgb(17, 85, 204);
      }
    }
    .title {
      flex-grow: 1;
      cursor: pointer;
      &:hover {
        color: rgb(17, 85, 204);
      }
    }
    .way {
      width: 145px;
    }
    .time {
      width: 250px;
    }
  }

  .bg {
    background-color: rgb(249, 249, 249);
  }
</style>
