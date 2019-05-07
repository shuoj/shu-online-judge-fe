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
    api.createProblem(data).then((res: any) => {
      (this as any).$Message.success('创建成功');
    }).catch((err: any) => {
      (this as any).$Message.error(err.message);
    });
  }
}
</script>

<style lang="less" scoped>

</style>
