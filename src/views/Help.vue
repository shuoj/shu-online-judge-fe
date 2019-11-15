<template>
  <Row>
    <Col span="20" offset="2">
      <div class="wrapper-content ivu-article">
        <article>
          <h1>判题系统</h1>
          <div class="ivu-anchor">
            <h2 align="left">判题结果</h2>
          </div>
          <div class="content">
            <ul>
              <li>Accepted: 你的答案符合判题标准</li>
              <li>
                Runtime Error:
                你的程序运行时出现错误（指针越界，栈溢出，有未处理的异常，主函数返回值非零等）
              </li>
              <li>Time Limit Exceeded: 你的程序执行时间超出题目要求</li>
              <li>Memory Limit Exceeded: 你的程序内存使用超出题目要求</li>
              <li>Compile Error: 你的程序在编译（包括链接）时出现错误</li>
              <li>Wrong Answer: 你的程序输出的答案不符合判题标准</li>
              <li>System Error: 判题系统发生故障，请等待重判</li>
              <li>Waiting: 你的提交正在等待处理</li>
            </ul>
          </div>
          <div class="ivu-anchor">
            <h2 align="left">编译参数</h2>
          </div>
          <div class="content">
            <ul id="code">
              <li>
                C（GCC 4.8）
                <pre>
gcc -DONLINE_JUDGE -O2 -w -std=c99 {src_path} -lm -o {exe_path}main</pre
                >
              </li>
              <li>
                C++（G++ 4.3）
                <pre>
g++ -DONLINE_JUDGE -O2 -w -std=c++11 {src_path} -lm -o {exe_path}main</pre
                >
              </li>
              <li>
                Java（Oracle JDK 1.7）
                <pre>//编译<br>javac {src_path} -d {exe_path}<br>//运行<br>java -cp {exe_path} Main</pre>
              </li>
            </ul>
          </div>
          <div class="ivu-anchor">
            <h2 align="left">常见问题</h2>
          </div>
          <div class="content">
            <ul>
              <li>无特殊说明，请使用标准输入输出。</li>
              <li>
                Java 代码需使用 Main 作为主类名。C/C++代码使用<code
                  >int main()</code
                >，并且需要<code>return 0;</code>。
              </li>
              <li>
                C/C++ 的64位整数类型，请使用 <code>long long</code> 声明，使用
                <code>cin/cout</code> 或 <code>%lld</code> 输入输出。
                使用<code>__int64</code>会导致编译错误。
              </li>
              <li>
                程序执行时间指CPU时间，占用内存按执行过程中内存消耗的峰值计，有多组测试数据时以最大的时间和内存消耗为准
              </li>
              <li>
                判题的时候会去除你的输出的最后的换行和空格，然后与去除最后的换行和空格的答案做比较，如果不一致就是
                Wrong Answer。
                其余的行末空格和空行不去除，看清楚题目的要求。没有格式错误。
              </li>
            </ul>
          </div>
        </article>
      </div>
    </Col>
  </Row>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'

@Component
export default class Help extends Vue {}
</script>

<style lang="less" scoped>
@import '../style/base';

.wrapper-content {
  padding: 20px 25px;
  position: relative;
}

.content {
  padding: 20px 0 40px 0;
}

#code > li > pre {
  padding: 5px 10px;
  white-space: pre-wrap;
  margin-top: 15px;
  margin-bottom: 15px;
  background: #f8f8f9;
  border: 1px dashed #e9eaec;
}

code {
  font-family: Consolas, Menlo, Courier, monospace;
  font-size: 1em;
  display: inline-block;
  background: #f7f7f7;
  margin: 0 3px;
  padding: 1px 5px;
  border-radius: 3px;
  color: #666;
  border: 1px solid #eee;
}

ul {
  text-align: left;
  list-style: disc !important;
}

li {
  list-style: disc !important;
}
</style>
