<template>
  <div>
    <!-- 面包屑导航区 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>数据统计</el-breadcrumb-item>
      <el-breadcrumb-item>数据报表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图区 -->
    <el-card>
      <!-- 2: 步骤2 -->
       <div style="width:750px;height:500px" ref="chart"></div>
    </el-card>
  </div>
</template>

<script>

import { getEchrats } from '@/api/index';
import _ from 'lodash';               // 两个对象的合并 得到新的对象
export default {
  name: 'report',    // 报表结构
  data(){
    return{

      // 需要合并的数据
      options: {
        title: {
          text: '用户来源'
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross',
            label: {
              backgroundColor: '#E9EEF3'
            }
          }
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: [
          {
            boundaryGap: false
          }
        ],
        yAxis: [
          {
            type: 'value'
          }
        ]
      }
    }
  },
 mounted () {
　　this.initCharts();
　},
  methods: {  
　　async initCharts () {
　　  let myChart = this.$echarts.init(this.$refs.chart);

      let {data:res} = await getEchrats();
      console.log(res,'图表');
      if(res.meta.status !== 200){
        return this.$message.error('获取折线图数据失败!');
      }

      // 4: 准备数据配置项   用于合并两个对象
    let result =  _.merge(res.data , this.options) 

  　　// 绘制图表
  　　myChart.setOption( result );
  　　}
    },
  }
</script>

<style lang="scss" scoped>

</style>