<template>
  <div class="code-container">
    <card :bordered="false" class="card-class">
      <div class="option-class">
        <Select v-model="codeLanguage" style="width:200px" class="text-left">
          <Option v-for="language in languages" :value="language" :key="language">{{ language }}</Option>
        </Select>
        <Button @click="editorOption = true">设置</Button>
        <Modal v-model="editorOption" @on-ok="optionConfirm">
          <p slot="header">编辑器设置</p>
          <!--<Divider></Divider>-->
          <div class="box-option">
            <span>编辑器主题设置</span>
            <Select v-model="themeDiff" style="width:200px">
              <Option v-for="them in themes" :value="them" :key="them">{{ them }}</Option>
            </Select>
          </div>
          <div class="box-option">
            <span>编辑器快捷键设置</span>
            <Select v-model="keymapDiff" style="width:200px">
              <Option v-for="kmp in keymaps" :value="kmp" :key="kmp">{{ kmp }}</Option>
            </Select>
          </div>
          <div class="box-option">
            <span>编辑器Tab设置</span>
            <Select v-model="tabKey" style="width:200px">
              <Option v-for="tey in tabKeys" :value="tey" :key="tey">{{ tey }}</Option>
            </Select>
          </div>
        </Modal>
      </div>
      <codemirror :value="code" :options="codeOptions"
                  @input="onCmCodeChange"
                  ref="myEditor"></codemirror>
      <Row class="footer-submit">
        <router-link to="/login" v-if="!logined">您还没有登录不能提交代码
        </router-link>
        <Button @click="submitCode" class="btn" :disabled="!logined" :loading="myloading">提交</Button>
      </Row>
    </card>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from 'vue-property-decorator';
import { codemirror } from 'vue-codemirror';

// 支持语言(mode)JS文件
// clike表示类C的语言:C、C++、Java
import 'codemirror/mode/clike/clike.js';
import 'codemirror/mode/python/python.js';

// require active-line.js
import 'codemirror/addon/selection/active-line.js';

// theme
import 'codemirror/theme/monokai.css';
import 'codemirror/theme/solarized.css';
import 'codemirror/theme/material.css';

import 'codemirror/addon/fold/foldgutter.css';
import 'codemirror/addon/fold/foldgutter.js';
import 'codemirror/addon/fold/brace-fold.js';
import 'codemirror/addon/fold/indent-fold.js';

// keymap
import 'codemirror/keymap/sublime.js';
import 'codemirror/keymap/emacs.js';
import 'codemirror/keymap/vim.js';

@Component({
  components: {
    codemirror
  }
})
export default class CodeMirror extends Vue {
  // 本题支持的语言
  @Prop({
    type: Array,
    default: () => {
      return ['C', 'CPP', 'JAVA', 'Python2', 'Python3'];
    }
  }) languages: Array<string>;

  @Prop({
    type: Boolean,
    default: false
  }) logined: boolean;

  @Prop({
    type: Boolean,
    default: false
  }) myloading: boolean;

  // 默认语言
  codeLanguage: string = 'CPP';
  themeDiff: string = 'solarized';
  keymapDiff: string = 'Standand';
  tabKey: string = '2 spaces';

  themes: any = [
    'solarized', 'monokai', 'material'
  ];

  keymaps: any = [
    'Standand', 'Vim', 'Emac'
  ];

  tabKeys: any = [
    '2 spaces', '4 spaces', '8 spaces'
  ];

  editorOption: boolean = false;

  codeOptions: any = {
    autoCloseBrackets: true,
    tabSize: 2,
    styleActiveLine: true,
    lineNumbers: true,
    line: true,
    mode: 'text/x-csrc',
    theme: 'solarized',
    // 表示代码折叠
    foldGutter: true,
    gutters: ['CodeMirror-linenumbers', 'CodeMirror-foldgutter'],
    // 选中文本自动高亮，及高亮方式
    styleSelectedText: true,
    lineWrapping: false,
    highlightSelectionMatches: { showToken: /\w/, annotateScrollbar: true }
  };

  code: string = '';

  get editor() {
    return (this.$refs.myEditor as any).codemirror;
  }

  @Watch('codeLanguage')
  handleCode(val: string) {
    const mode: any = {
      C: 'text/x-csrc',
      CPP: 'text/x-c++src',
      JAVA: 'text/x-java',
      Python3: 'text/x-python',
      Python2: 'text/x-python'
    };
    this.editor.setOption('mode', mode[val]);
  }

  optionConfirm() {
    if (this.keymapDiff === 'Standand') {
      this.editor.setOption('theme', 'default');
    } else {
      this.editor.setOption('theme', this.keymapDiff.toLowerCase());
    }
    this.editor.setOption('theme', this.themeDiff);
    this.editor.setOption('tabSize', this.tabKey[0]);
  }

  onCmCodeChange(newCode: any) {
    this.code = newCode;
  }

  submitCode() {
    const code = this.code.replace(/\n/g, '\\n ');
    this.$emit('codeSubmit', {
      code: code,
      language: this.codeLanguage
    });
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">
  @import '~codemirror/lib/codemirror.css';

  .box-option {
    font-size: 16px;
    font-weight: 500;
    padding: 16px 32px;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .footer-submit {
    margin-top: 16px;
    width: 100%;
    padding: 0 16px;
    height: 32px !important;
    line-height: 32px;
    .btn {
      float: right;
    }
  }

  .vue-codemirror {
    border: 1px solid #eeeeee;
    font-size: 15px;
  }

  .code-container {
    padding-top: 16px;
    width: 100%;
    .card-class {
      box-shadow: 0 1px 6px rgba(0, 0, 0, .2);
      border-color: #eee;
    }
    .text-left {
      text-align: left !important;
    }
    .ivu-select-selected-value {
      padding-left: 16px !important;
    }
  }

  .option-class {
    display: flex;
    justify-content: space-between;
    padding: 0 8px 6px;
    width: 100%;
  }

  .language-choice {
    position: absolute;
    z-index: 999;
    overflow: paged-y;
  }

  .ivu-select-item, .ivu-select-selected-value {
    text-align: left !important;
  }
</style>
