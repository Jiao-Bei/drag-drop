<template>
  <!-- 组件列表 -->
    <!--
      这里就不再加一层组件了，意义不是很大吗？
      已知我必做X个任务组件，在父层传入X就好了
    -->
    <!--
      mousedown是鼠标落下的事件
      他是基本固化的，没有太多事件
    -->
    <el-card
      v-for="widget in list"
      :key="widget.type"
      draggable="true"
      @mousedown="(e) => onWidgetMouseDown(e, widget)"
      class="widget"
      shadow="hover"
    >
      <el-col>
        {{ widget.label }}
      </el-col>

    </el-card>

</template>

<script>

let currentWidget = null;

export default {
  // 此为组件，实现父向内部组件传参
  // 要实现该功能，触发自定义事件来实现
  // 为上文 $emit 来实现该功能
  // props 是上文传入的
  // data是本层固化的，我们走固化路线
  emits:['getCurrentWidget'], // 这里是widget声明一下，防报错
  props: {},
  data() {
    return {
      list: [
        {
          type: "pie",
          label: "饼图",
        },
        {
          type: "line",
          label: "折线图",
        },
        {
          type: "开发",
          label: "饼图2",
        },
      ],
    };
  },
  methods:{
      onWidgetMouseDown(e,widget){
          console.log("点击事件》》",e.offsetX,e.offsetY)
          currentWidget = widget;
          // 实现子向父传数据
          this.$emit('getCurrentWidget',e,currentWidget)
      }
  }
};
</script>

<style>
.widget {
  width: 100px;
  height: 100px;
  font: size 50px;
  text-align: center;
  line-height: 100px;
  margin: 10px 20px;
}
.widget-list {
  width: 30vw;
  background-color: #e9e9e9;
}
</style>