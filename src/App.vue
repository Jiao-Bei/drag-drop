<script setup>
import { RouterLink, RouterView } from "vue-router";
import {reactive, ref} from "vue";
import HelloWorld from "./components/HelloWorld.vue";
</script>

<template>
  <el-container id="app">
    <!--  组件列表  -->
    <!--
       此处的widgetList应当指App.vue 中的data中的 widgetList
       这里算是父向组件穿参数，可想象的，父向子传参再向子传参，是树形结构啊
       此处的@onWidgetMouseDown 是子暴露出的接口，需要实现，实现者是我们的onWidgetMouseDown
      ？？？
      他凭什么确定css？？？ 
      组件已经确定css 为 widget-list和widget了，app层实现了这两个class
      组件列表嘛.....
      我觉得还是把该在下层确定的东西放下层比较好
    -->
    <el-aside class="widget-list"  >
      <WidgetList @getCurrentWidget="getCurrentWidget"  />
    </el-aside>
    
    <!-- 操作面板 -->
    <!--
      在dragover事件上弹出一个表单，
      位置就和下面哪个div差不多就行了，如果失去focus，把表单隐藏起来 
      表单应该是要组件化的，传入当前widget应该就行了
      也就是表单要有一个loseFocus事件
      可以在组件里实现loseFocus，
      不对，组件里实现losefocus这个东西就不能传到panel了
      也就只能在本层实现loseFocus，该事件砍掉本层的这个task，同时隐藏form
      那么确定按钮呢？确定应该在子做还是在本层做？
      在子做吧，不同按钮我估计要接不同的接口，但是上传内容可以确定为必须
      然后这个表单，应该也是固化的，整体做一个组件，不用再改了
    -->
    <el-main class="panel" @drop="onDrop" @dragover="(e) => e.preventDefault()">
      <!--
      在这一层载入任务组件，本层也当作组件
      任务组件要实现右键功能，实现双击功能。
      用$emit抛出，在本层确定type然后实现具体的右键功能。要写个switch
    -->

      <!-- <Lines></Lines> -->
      <Tasks :taskLists="tasks" @getCurrentTask="getCurrentTask">
      </Tasks>
      <WidgetForm v-show="isDisplay" @unDisplayForm="unDisplayForm" @cancel="cancel" @submit="submit" v-focus="isDisplay" ref="wForm"
      :style="
          'transform:translate(' +
          formX + 'px,' + 
          formY + 'px);'+ 
          'position:absolute;'"/>
    </el-main>
  </el-container>
</template>
<script>
import WidgetList from "@/components/widgetList/index.vue";
import Tasks from "@/components/tasks.vue";
import WidgetForm from "@/components/widgetForm.vue"
import Lines from "@/components/lines/index.vue"

let fromList = 0; // 该值确定两种drag，也就是从list来的是1，从pannel来的是0
let currentId = 0;
let widgetX = 0;
let widgetY = 0;
let currentWidget = null;
let currentTask = null;
export default {
  name: "App",
  components: {
    WidgetList,
    Tasks,
    WidgetForm,
    Lines
  },

  // 在父里面的这一段代码实现了props更新到子组件里面

  // setup(){
  //   let tasks = reactive({

  //   })
  //   return {...toRefs(tasks)}
  // },

  data() {
    return {
      formX:0,
      formY:0,
      tasks: [],
      widgetList: [
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
          label: "饼图",
        },
      ],
      isDisplay:false
    };
  },
  methods: {
    onDrop(e) { // 右侧的pannel落地的drop事件
      // 放置在pannel上的事件
      let time = new Date();
      console.log("拖拽结束：", e.offsetX, e.offsetY);
      console.log(this.tasks)
      if(fromList == 1){ // 从widgetList来的拖拉事件
        this.formX = e.pageX
        this.formY = e.pageY
        this.tasks.push({
          id: currentId++,
          type: currentWidget.type,
          offsetX: e.offsetX - widgetX,
          offsetY: e.offsetY - widgetY,
          // form指定
          endTime: "",
          name:"很长很长的名字",
          description: "描述aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa", // 接form给的东西
          creater: "root", // 记得变动态
          createrId: 0,
          level: 5,
          // 剩下几个要在详情页里面指定
          operatorIds:["1","2"],
          operators: ["op1","op2"],
          createTime: Date.now,
          state:"未开始"
        });
        // 唤醒一个表单
        this.isDisplay = true
        // 锁定currentTask
        currentTask = this.tasks[this.tasks.length - 1]
        
      }
      if(fromList == 0){// 接pannel中的移动事件
        currentTask.offsetX = e.offsetX - widgetX;
        currentTask.offsetY = e.offsetY - widgetY;
        // 如有权限还要接一个向上传递的能力。
        console.log(currentTask.offsetY)
      }
      console.log(e);
    },
    getCurrentTask(e, task) {
      // 组件(左侧)鼠标落下时产生的事件
      widgetX = e.offsetX;
      widgetY = e.offsetY;
      currentTask = task;
      console.log("左侧模板")
      fromList = 0;
    },
    getCurrentWidget(e,widget){
      // pannel(右侧)上鼠标落下时产生的事件
      fromList = 1;
      // console.log("到APP的E.offsetX:",e.offsetX)
      // console.log("到APP的E.offsetY:",e.offsetY)
      currentWidget = widget;
      if(this.isDisplay){
        this.cancel()
      }
      widgetX = e.offsetX;
      widgetY = e.offsetY;
    },
    unDisplayForm(){
      this.isDisplay = false
    },
    cancel(){ // 实现form的cancel事件
      // console.log("cancel事件？")
      this.tasks.splice(this.tasks.indexOf(currentTask),1)
    },
    submit(){ // 实现form的提交事件
      // console.log("submit?",currentTask)
      console.log(this.$refs.wForm.task)
      this.updateTaskView(this.$refs.wForm.task)
    },
    updateTaskView(task){ // Task事件的更新
      console.log("update:" + task)
      currentTask.endTime = task.endTime
      currentTask.level = task.level
      currentTask.operators = task.operators
      currentTask.name = task.name
    }

  },
  directives: {
    // 自定义的v-事件  如下是v-focus 当发生内部的value变化的时候，el所指向的控件执行变化
    // 此处可选择的事件有 mounted updated unmounted 及他们的before（形如beforemounted
    Focus: {
      updated: function (el, { value }) {
        if (value) {
          // if(true)就聚焦 
          // 废弃
          // console.log(el)
          el.focus()
        }
      },
    },
  },
};
</script>

<style>

* {
  margin: 0;
}

body {
  margin: 0;
  padding: 0 0;
}

#app {
  /* 去除边框 */
  position: absolute;
  display: flex !important;
  width: 100%;
  height: 100%;
  padding: 0 0 !important;
  margin: 0 0;
  top: 0;
  left: 0;
}

.panel {
  flex: 1;
  background-color: #f6f6f6;
  float: left;
  position: relative;
}

.box {
  outline: 1px solid black;
  position: absolute;
}


.widgetHead {
  width: 100vw;
  font-size: 15px;
  color: black;
  outline: 1px solid black;
  float: top;
  position: relative;
}

.widget-list {
  width: 250px;
  background-color: #e9e9e9;
}

.widgetItem {
  width: 100%;
  height: auto;
}

.clearfix:before,
.clearfix:after {
  display: table;
  content: "";
}

.clearfix:after {
  clear: both
}

.cardTitle{
  font : 700 15px 'Microsoft Yahei', 'Hei', Tahoma, 'SimHei', sans-serif;
}

.text {
  font-size: 14px;
}

.item {
  margin-bottom: 18px;
}


</style>