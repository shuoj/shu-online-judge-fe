<template>
  <div class="container">
    <GroupForm :typeProp="1"></GroupForm>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import GroupForm from '@/components/CreateGroup.vue'

@Component({
  components: {
    GroupForm,
  },
})
export default class CreateGroup extends Vue {}
</script>

<style lang="less" scoped>
h2 {
  font-weight: 500;
  font-size: 36px;
  text-align: left;
  margin: 12px auto 18px 0;
}
</style>
