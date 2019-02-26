<template>
  <Row>
    <Col span="20" offset="2" style="text-align: left;padding-top: 30px">
      <div class="item">
        <h2>知识点:</h2>
        <CheckboxGroup v-model="label" class="checkgroup">
          <Checkbox label="动态规划">
          </Checkbox>
          <Checkbox label="数组">
          </Checkbox>
          <Checkbox label="贪心">
          </Checkbox>
          <Checkbox label="分治法">
          </Checkbox>
        </CheckboxGroup>
      </div>
      <div class="item">
        <h2>难度系数:</h2>
        <InputNumber :max="1" :min="0" :step="0.01" v-model="difficulty"></InputNumber>
      </div>
      <div class="item">
        <h2>选题：</h2>
        <Transfer
          :data="data1"
          :target-keys="targetKeys1"
          :render-format="render1"
          @on-change="handleChange"></Transfer>
        <Button type="primary" style="margin-top: 10px" @click="combine">选择</Button>
      </div>
      <div class="item">
        <h2>设置分数：</h2>
        <Row class="row-height title" class-name="row-title">
          <Col span="2" style="text-align: center">#</Col>
          <Col span="6">题目</Col>
          <Col span="4">难度</Col>
          <Col span="3">正确率</Col>
          <Col span="5">上次使用时间</Col>
          <Col span="4">设置分数(总分100)</Col>
        </Row>
        <Row class="row-height" v-for="problem in problems" :key="problem.index">
          <Col span="2" style="text-align: center">{{problem.id}}</Col>
          <Col span="6">{{problem.name}}</Col>
          <Col span="4">{{problem.difficult}}</Col>
          <Col span="3">{{problem.correct}}</Col>
          <Col span="5">{{problem.last}}</Col>
          <Col span="4"><Input placeholder="" style="width: 30px"></Input></Col>
        </Row>
        <Button type="primary" style="margin-top: 10px" @click="">完成组卷</Button>
      </div>
    </Col>
  </Row>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';

@Component({
  components: {
  }
})
export default class App extends Vue {
}
</script>

<style lang="less" scoped>

</style>
