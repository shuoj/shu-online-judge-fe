<template>
  <div>
    <Row justify="center" class="contain-padding">
      <Col span="20" offset="2">
        <Table :columns="title" :data="groups"></Table>
      </Col>
    </Row>
    <Row style="margin-top: 36px">
      <Page
      :total="total"
      show-sizer
      @on-change="pageChange"
      @on-page-size-change="pageSizeChange"
      />
    </Row>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import api from '@/api/api.ts'

@Component
export default class Group extends Vue {
  total: number = 10
  groups: any = []
  title: any = [
    {
      title: '#',
      key: 'idx',
      width: 80,
    },
    {
      title: '名称',
      key: 'name',
      render: (h: any, obj: any) => {
        return h(
          'span',
          {
            on: {
              click: () => {
                // this.toGroupDetail(obj.row.id);
              },
            },
          },
          obj.row.name
        )
      },
    },
    {
      title: '创建者',
      key: 'authorName',
    },
    {
      title: '创建时间',
      key: 'createDate',
    },
  ]
  page: number = 0
  pageSize: number = 10

  pageChange(pages: number) {
    this.page = pages - 1
    this.getGroups(pages - 1, this.pageSize)
  }

  pageSizeChange(size: number) {
    this.getGroups(this.page, size)
    this.pageSize = size
  }

  getGroups(page: number = 0, pageSize: number = 10) {
    api
      .getGroups({
        page: page,
        size: pageSize,
      })
      .then((res: any) => {
        this.total = res.data.total
        this.groups = res.data.list
      })
      .catch(() => {
        ;(this as any).$Message.error('获取失败')
      })
  }

  mounted() {
    this.getGroups()
  }
}
</script>

<style lang="stylus" scoped>
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
