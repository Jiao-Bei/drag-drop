<template>
  <div class="line-block">
    <span>1111</span>
    <div class="one">
      <div class="block-one" id="block-one">1</div>
      <div class="block-two" id="block-two">2</div>
    </div>
    <div class="two">
      <div class="block-three" id="block-three">3</div>
      <div class="block-four" id="block-four">4</div>
    </div>
  </div>
</template>
<script>
import LeaderLine from 'leader-line-new'
export default {
  components: {},
  data() {
    return {
      lineContainer: null,
      lineContainer2: null,
      lineContainer3: null,
      lineContainer4: null
    }
  },
  // 注册监听
  mounted() {
    this.getLine()
    window.addEventListener('resize', this.getScroll)
  },
  // 销毁监听，防止内存泄露
  destroyed() {
    window.removeEventListener('resize', this.getScroll)
  },
  methods: {
    getLine() {
      let dom1 = document.getElementById('block-one')
      let dom2 = document.getElementById('block-two')
      let dom3 = document.getElementById('block-three')
      let dom4 = document.getElementById('block-four')
      let styleOption = {
        color: 'blue', // 指引线颜色
        endPlug: '', // 指引线结束点的样式 hand,disc
        size: 2, // 线条尺寸
        startSocket: 'bottom', //在指引线开始的地方从元素左侧开始
        endSocket: 'top', //在指引线开始的地方从元素右侧结束
        // hide: true, // 绘制时隐藏，默认为false，在初始化时可能会出现闪烁的线条
        startPlugColor: '#ff3792', // 渐变色开始色
        endPlugColor: '#fff386', // 渐变色结束色
        gradient: true, // 使用渐变色
        outLineColor: 'blue',
        path: 'straight', // straight,arc,fluid,magnet,grid
        dash: {
          // 虚线样式
          animation: true // 让线条滚动起来
        },
        hide: true
      }
      this.lineContainer = new LeaderLine(
        LeaderLine.mouseHoverAnchor(dom1),
        dom3,
        styleOption
      )
      this.lineContainer2 = new LeaderLine(
        LeaderLine.mouseHoverAnchor(dom1),
        dom4,
        styleOption
      )
      this.lineContainer3 = new LeaderLine(dom2, dom4, styleOption)
      this.lineContainer4 = new LeaderLine(dom2, dom3, styleOption)
      /** 显示效果
       *  draw 绘制线条
       *  fade 淡入
       *  none 无效果，即直接显示
       */
      let showEffectName = 'draw'
      // 动画参数
      let animOptions = {
        duration: 1000, //持续时长
        timing: 'ease-in' // 动画函数
      }
      this.lineContainer.show(showEffectName, animOptions)
      this.lineContainer2.show(showEffectName, animOptions)
      this.lineContainer3.show(showEffectName, animOptions)
      this.lineContainer4.show(showEffectName, animOptions)
      this.lineContainer.position()
      this.lineContainer2.position()
      this.lineContainer3.position()
      this.lineContainer4.position()
    }
  }
}
</script>

<style lang="scss" scoped>
.line-block {
  height: 90vh;
  .one {
    display: flex;
    justify-content: space-around;
    // height: 100px;
  }
  .two {
    margin-top: 100px;
    display: flex;
    justify-content: space-around;
  }
  .iframe-block {
    margin-top: 50px;
  }
  .target {
    display: inline-block;
    background-color: #9ee7ea;
    padding: 12px;
  }

  .block-one {
    border: 1px solid blue;
    padding: 10px;
  }

  .block-two {
    border: 1px solid blue;
    padding: 10px;
  }
  .block-three {
    border: 1px solid blue;
    padding: 10px;
  }
  .block-four {
    border: 1px solid blue;
    padding: 10px;
  }
}
</style>
