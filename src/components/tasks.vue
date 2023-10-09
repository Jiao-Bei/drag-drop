<template>

  <!--
    // Edge放另一组件里面好了，到时候直接做
    思路上是外界传入整个template数组
    即为应有json数组[
      data:{
        type: string // 类型，幕后
        id: number  // 幕后
        offsetX: number  // 位置
        offsetY: number  // 位置
        description: string // 要看的
        creater: string  // 要看的
        operators： ['string','string'] // 承包者，要看的
        level： // 优先级，要看的
        endTime： // 截止日期，要看的
      }        
    ]
  -->
    <div
        display="block"
        v-for="task in taskLists"
        :key="task.id"
        @mousedown="(e) => onTaskMouseDown(e, task)"
        @contextmenu.prevent.native="openMenu(task.id)"
        draggable="true"
        @click="activeTask(task.id)"
        :class="{concentrate:concentrator==task.id}"
        :style="
          'transform:translate(' +
          task.offsetX + 'px,' + 
          task.offsetY + 'px);'+ 
          'width:' + boxWidth + 'px;'+
          'height:500px;' + 
          'position:absolute;'">
          <el-descriptions direction="vertical" border :title="'[' + task.type + ']'" 
          :style="'background-color:#FFFFFF;' + 'margin: 10px 10px;'">
            <template #extra>
              <el-button>详情</el-button>
            </template>
            <el-descriptions-item label="任务名">{{task.name}}</el-descriptions-item>
            <el-descriptions-item label="创建者">{{task.creater}}</el-descriptions-item>
            <el-descriptions-item label="执行者">{{task.operators}}</el-descriptions-item>
            <el-descriptions-item label="优先级">{{task.level}}</el-descriptions-item>
            <el-descriptions-item label="结束时间">{{task.endTime}}</el-descriptions-item>
            <el-descriptions-item label="任务状态">{{task.state}}</el-descriptions-item>
            <el-descriptions-item label="简述" class-name="labelContext" label-class-name="label">
              {{task.description}}
            </el-descriptions-item>

          </el-descriptions>
      </div>
</template>

<script>
import { getCurrentInstance, onMounted } from '@vue/runtime-core'
let boxWidth = 300
export default {
    emits:['getCurrentTask'],
    props:{
        taskLists:Array
    },
    data(){
      return {
        boxWidth: 300,
        boxHeight: 250,
        concentrator: - 1
      }
    },
    methods:{
      onTaskMouseDown(e,task){
        console.log("task点击事件》》",e.offsetX,e.offsetY)
        // 子向父传数据
        this.$emit('getCurrentTask',e,task)
      },
      activeTask(taskId){
        console.log(taskId)
        this.concentrator = taskId
      },
      openMenu(taskId){
        this.activeTask(taskId)
      }
    },


    // setup(props){
    //     const {proxy} = getCurrentInstance();

    // }
}
</script>

<style>

.box {
  width: 300px;
  height: 200px;
  outline: 1px solid blue;
  position:relative;
}

.labelContext{
  word-break: break-all;
  overflow:hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 4;
  -webkit-box-orient: vertical;
}

.label{
  height:80px;
}

.concentrate{
  border:1px solid #99ccff;
}
</style>

