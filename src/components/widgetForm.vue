<template>
  <!-- 名字，结束时间，简述，优先级，人员选择（非必须）-->
  <el-form :model="task" label-width="120px" style="background-color:white">
    <el-row>
      <el-col :span="23">
        <el-form-item :rules="{required:true}" label="名称" >
          <el-input v-model="task.name" />
        </el-form-item>
      </el-col>
    </el-row>
    <el-row> 
      <el-col :span="11"> 
        <el-form-item label="任务优先级" :rules="{required:true}">
          <el-select v-model="task.level" placeholder="请选择他的优先级">
            <el-option label="1" value=1 />
            <el-option label="2" value=2 />
            <el-option label="3" value=3 />
            <el-option label="4" value=4 />
            <el-option label="5" value=5 />
            <el-option label="6" value=6 />
          </el-select>
        </el-form-item>
      </el-col>
      <el-form-item :rules="{required:true}" label="结束时间">
        <el-col>
          <el-date-picker
            v-model="task.endTime"
            type="datetime"
            style="width: 100%"
            placeholder="选择日期"
            value-format="YYYY-MM-DD"
          />
        </el-col>
      </el-form-item>
    </el-row>
    <!-- 人员选择 -->
    <el-form-item
      v-for="(operator,index) in task.operators"
      :key="operator.key"
      :label="'执行者' + (index + 1)"
      :prop="'operators.' + index + '.id'"
      :rules="{
        required: true,
        message: '选了执行者就不能是空啊',
        trigger: 'blur',
      }"
    >
    <el-select v-model="operator.id" placeholder="Select">
      <el-option-group
        v-for="group in groups"
        :key="group.id"
        :label="group.name"
      >
      <el-option
        v-for="user in group.users"
        :key="user.id"
        :label="user.name"
        :value="user.id"
      />
      </el-option-group>
    </el-select>
      <el-button class="mt-2" @click.prevent="removeOperator(operator)"
        >Delete</el-button
      >
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="onSubmit">提交</el-button>
      <el-button @click="addOperator">新增执行者</el-button>
      <el-button @click="onCancel">取消</el-button>
    </el-form-item>
  </el-form>
</template>

<script>

import { reactive, ref } from 'vue'

// do not use same name with ref

export default{

  // emit 一个不放出表单
  emits:['unDisplayForm','cancel','submit'],

  created(){
    // 这里上一个拿到group加user的组
    this.groups.push({
      groupId:0,
      name:"group1",
      users:[{
        id:0,
        name:"op1"
      },{
        id:1,
        name:"op2"
      }]
    })
    this.groups.push({
      groupId:1,
      name:"group2",
      users:[{
        id:0,
        name:"op1"
      },{
        id:1,
        name:"op2"
      }]
    })
  },
  data(){
    return{
      groups:[],
      task:{
        id: 0, // 幕后
        operatorCount : 1,
        name:"", // 名称 要看的
        description: "", // 要看的
        creater: "",  // 要看的
        operators: [], // 承包者，要看的
        level:null, // 优先级，要看的
        endTime:"", // 截止日期，要看的
        state:"未开始"// 任务状态，要看的 (未开始/进行中/暂停/完成/结束/关闭)
      }
    }
  },
  methods:{
    initForm(){
      this.task={
        id: 0, // 幕后
        name:"", // 名称
        description: "", // 要看的
        creater: "",  // 要看的
        operators: [], // 承包者，要看的
        level:null, // 优先级，要看的
        endTime:"", // 截止日期，要看的
        state:"未开始"// 任务状态，要看的 (未开始/进行中/暂停/完成/结束/关闭)
      }
    },
    async onSubmit(){
      // 无论是submit事件还是cancel事件，都要把表单放下。
      // 放下我们要向外抛出一个表单隐藏
      await this.changeView()
      await this.uploadTask(task)
      this.initForm()
      // submit 上传这个事件 要实现 上传 unDisplayForm 改变这个Task

      
    },
    onCancel(){

      // 这边要过一个同步事件
      // tasks里面要删除一个事件再过这个initform
      // 这个删除事件通过父组件实现
      console.log("戳了cancel啊")
      this.initForm()
      this.$emit("cancel")
      this.unDisplayForm()
    },
    removeOperator(operator){
      var index =  this.task.operators.indexOf(operator)
      if(index != -1){
        this.task.operators.splice(index,1)
      }
    },
    addOperator(){
      this.task.operators.push({
        key: Date.now()
      })
    },
    unDisplayForm(){
      this.$emit("unDisplayForm")
    },
    uploadTask(){ // 到时候直接用axios返回一个promise对象去满足await的要求
      return new Promise((resolve,reject)=>{
        // 过一遍axios取代这个Promise
        
      }).catch(res => {
        
      })
    },
    changeView(){
      return new Promise(()=>{
        this.$emit("submit")
        this.unDisplayForm()
      })
    }

  }
}

</script>

<style>

</style>