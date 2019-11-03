<template>
  <div class="problem">
    <problem-form @problem-data="getData" :dataProp="problemDetail"></problem-form>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import ProblemForm from '@/components/ProblemForm.vue';
import api from '@/api/api';

@Component({
  components: {
    ProblemForm
  }
})
export default class Createproblem extends Vue {
  problemDetail: any = {};

  getData(data: any) {
    const id = this.$store.state.userInfo.id;
    data.authorId = id;
    console.log(data)
    api.createProblem(data).then((res: any) => {
      console.log(res)
      if (res.data.code) {
        (this as any).$Message.error(res.data.message);
      } else {
        (this as any).$Message.success('创建成功');
        this.$router.push({
          path: `/admin/problems-list`
        });
      }
    }).catch((err: any) => {
      (this as any).$Message.error(err.data.message);
    });
  }
}
</script>

<style lang="less" scoped>

</style>
