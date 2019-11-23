<template>
  <div class="status">
    <Row justify="center" class="contain-padding">
      <h1 style="margin-bottom: 20px;">我的提交</h1>
      <Col span="20" offset="2">
        <Table :columns="title" :data="status"></Table>
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
import api from '../api/api'

@Component
export default class Status extends Vue {
  total: number = 10
  pageSize: number = 10
  page: number = 0
  title: any = [
    {
      title: '#',
      key: 'id',
      width: 78,
    },
    {
      title: '用户',
      key: 'authorName',
      className: 'pointer-class',
    },
    {
      title: '题目名称',
      key: 'problemTitle',
      className: 'pointer-class',
      render: (h: any, obj: any) => {
        return h(
          'span',
          {
            on: {
              click: () => {
                this.toProblem(obj.row.problemId)
              },
            },
          },
          obj.row.problemTitle
        )
      },
    },
    {
      title: '提交时间',
      key: 'createDate',
    },
    {
      title: '语言',
      key: 'language',
      filters: [
        {
          label: 'C',
          value: 1,
        },
        {
          label: 'CPP',
          value: 2,
        },
        {
          label: 'JAVA',
          value: 3,
        },
      ],
      filterMultiple: false,
      filterMethod(value: any, row: any) {
        if (value === 1) {
          return row.language === 'C'
        } else if (value === 2) {
          return row.language === 'CPP'
        } else if (value === 3) {
          return row.language === 'JAVA'
        }
      },
    },
    {
      title: '运行时间',
      key: 'duration',
      render: (h: any, obj: any) => {
        return h('span', (obj.row.duration || 0) + ' ms')
      },
    },
    {
      title: '结果',
      key: 'result',
      width: 350,
      align: 'center',
      filters: [
        {
          label: 'Accepted',
          value: 1,
        },
        {
          label: 'Wrong Answer',
          value: 2,
        },
        {
          label: 'Runtime Error',
          value: 3,
        },
        {
          label: 'Time Limit Exceeded',
          value: 4,
        },
        {
          label: 'Memory Limit Exceeded',
          value: 5,
        },
        {
          label: 'Compile Error',
          value: 6,
        },
        {
          label: 'Format Error',
          value: 7,
        },
      ],
      filterMultiple: false,
      filterMethod(value: any, row: any) {
        if (value === 1) {
          return row.result === 'Accepted'
        } else if (value === 2) {
          return row.result === 'Wrong Answer'
        } else if (value === 3) {
          return row.result === 'Runtime Error'
        } else if (value === 4) {
          return row.result === 'Time Limit Exceeded'
        } else if (value === 5) {
          return row.result === 'Memory Limit Exceeded'
        } else if (value === 6) {
          return row.result === 'Compile Error'
        } else if (value === 7) {
          return row.result === 'Format Error'
        }
      },
    },
  ]
  status: any = []

  toProblem(id: any) {
    this.$router.push({
      name: 'problem',
      params: { id: id },
    })
  }

  pageChange(pages: number) {
    this.page = pages - 1
    this.getStatus(pages - 1, this.pageSize)
  }

  pageSizeChange(size: number) {
    this.getStatus(this.page, size)
    this.pageSize = size
  }

  getStatus(page: number = 0, pageSize: number = 10) {
    api
      .getStatus({
        page: page,
        size: pageSize,
        username: this.$store.state.userInfo.username,
      })
      .then((res: any) => {
        this.status = []
        let id = 0
        this.status = res.data.list.map((item: any) => {
          id += 1
          item.id = id
          if (item.result === 'ACCEPTED') {
            return {
              ...item,
              cellClassName: {
                result: 'accept-class',
              },
            }
          } else {
            return {
              ...item,
              cellClassName: {
                result: 'err-class',
              },
            }
          }
        })
        this.total = res.data.total
      })
      .catch((err: any) => {
        console.log(err, 'err')
      })
  }

  mounted() {
    this.getStatus()
  }
}
</script>

<style lang="less">
.contain-padding {
  padding-top: 60px;
}

.pointer-class {
  cursor: pointer;
  &:hover {
    color: #15c;
  }
}

.ivu-table .accept-class {
  color: rgb(60, 118, 61) !important;
  background-color: rgb(223, 240, 216) !important;
}

.ivu-table .err-class {
  color: #a94442 !important;
  background-color: rgb(242, 222, 222) !important;
}
</style>
