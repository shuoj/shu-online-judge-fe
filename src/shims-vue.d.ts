// TS 默认不识别*.vue文件，下面代码告诉TS *.vue后缀文件可以交给Vue模块处理
declare module '*.vue' {
  import Vue from 'vue';
  export default Vue;
}

declare module 'iview' {
  const Iview: any;
  export default Iview;
}

declare module 'vue-wangeditor-simple' {
  const VueWangeditor: any;
  export default VueWangeditor;
}

declare module 'js-md5' {
  const jsMd5: any;
  export default jsMd5;
}

declare module 'vue-codemirror'
declare module 'vue-highlightjs'
