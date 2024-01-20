<template>
  <d2-container>
    <div id="container">
      <!--图表容器-->
      <div id="newCharts" :options="options"></div>
    </div>
    <template slot="footer">
      <div>注意：基准日期需小于等于交易结束日期，且需为交易日</div>
      <div class="select_date_group_box">
        <div class="block">
          <span class="demonstration">交易日起始日</span>
          <el-date-picker
            v-model="start_date"
            type="date"
            format="yyyy-MM-dd"
            placeholder="选择日期">
          </el-date-picker>
        </div>
        <div class="block">
          <span class="demonstration">交易日结束日</span>
          <el-date-picker
            v-model="end_date"
            type="date"
            format="yyyy-MM-dd"
            placeholder="选择日期">
          </el-date-picker>
        </div>
        <div class="block">
          <span class="demonstration">基准日期</span>
          <el-date-picker
            v-model="base_date"
            format="yyyy-MM-dd"
            type="date"
            placeholder="选择日期">
          </el-date-picker>
        </div>
        <el-button style="margin-left: 25px" type="primary" @click="initCharts">渲染</el-button>
      </div>
    </template>
  </d2-container>
</template>
<script>
export default {
  name: 'example',
  data () {
    return {
      formatter: '{value}',
      start_date: '2023-11-01',
      end_date: '2024-01-17',
      base_date: '2024-01-08',
      cols: [],
      rows: [],
      groupedList: [],
      default_show: {},
      selectedTab: {}
    }
  },
  // mounted () {
  //   // 初始化 legend 数据和 selected
  // },
  created () {
    this.initCharts()
  },
  computed: {
    options () {
      // 假设这里有多个折线的数据，percentChanges 是每个折线的涨跌幅数组
      const seriesData = this.rows
      const contrastColors = [
        '#FF0000', '#00FF00', '#0000FF', '#ffb700', '#FF00FF', '#00FFFF', '#FFA500', '#800080', '#008000', '#000080',
        '#FF4500', '#32CD32', '#0000CD', '#4800ff', '#800000', '#00CED1', '#BA55D3', '#808000', '#708090', '#8A2BE2',
        '#FF6347', '#40E0D0', '#EE82EE', '#F08080', '#6A5ACD', '#2E8B57', '#8B0000', '#9932CC', '#8B4513', '#20B2AA',
        '#FF8C00', '#9400D3', '#8B008B', '#008B8B', '#B8860B', '#556B2F', '#FF4500', '#ADFF2F', '#4B0082', '#FF00FF',
        '#7CFC00', '#8B008B', '#2E8B57', '#8A2BE2', '#FF6347', '#32CD32', '#8B4513', '#008080', '#48D1CC', '#CD5C5C',
        '#4169E1', '#32CD32', '#FFD700', '#9932CC', '#DC143C', '#556B2F', '#8B4513', '#4682B4', '#6A5ACD', '#FFA07A',
        '#00FA9A', '#9370DB', '#00FF00', '#8A2BE2', '#7FFF00', '#FA8072', '#008080', '#48D1CC', '#00008B', '#808000',
        '#B0E0E6', '#2F4F4F', '#FF4500', '#00FFFF', '#D8BFD8', '#9400D3', '#00CED1', '#8B0000', '#1E90FF', '#8FBC8F',
        '#800080', '#008B8B', '#FF6347', '#3CB371', '#7B68EE', '#FF1493', '#696969', '#8B008B', '#CD5C5C', '#4169E1',
        '#32CD32', '#FFD700', '#9932CC', '#DC143C', '#556B2F', '#8B4513', '#4682B4', '#6A5ACD', '#FFA07A', '#00FA9A',
        '#9370DB', '#00FF00', '#8A2BE2', '#7FFF00', '#FA8072', '#008080', '#48D1CC', '#00008B', '#808000', '#B0E0E6',
        '#2F4F4F', '#FF4500', '#00FFFF', '#D8BFD8', '#9400D3', '#00CED1', '#8B0000', '#1E90FF', '#8FBC8F', '#800080',
        '#008B8B', '#FF6347', '#3CB371', '#7B68EE', '#FF1493', '#696969', '#8B008B', '#CD5C5C', '#4169E1', '#32CD32',
        '#FFD700', '#9932CC', '#DC143C', '#556B2F', '#8B4513', '#4682B4', '#6A5ACD', '#FFA07A', '#00FA9A', '#9370DB',
        '#00FF00', '#8A2BE2', '#7FFF00', '#FA8072', '#008080', '#48D1CC', '#00008B', '#808000', '#B0E0E6', '#2F4F4F',
        '#FF4500', '#00FFFF', '#D8BFD8', '#9400D3', '#00CED1', '#8B0000', '#1E90FF', '#8FBC8F', '#800080', '#008B8B',
        '#FF6347', '#3CB371', '#7B68EE', '#FF1493', '#696969', '#8B008B', '#CD5C5C', '#4169E1', '#32CD32', '#FFD700',
        '#9932CC', '#DC143C', '#556B2F', '#8B4513', '#4682B4', '#6A5ACD', '#FFA07A', '#00FA9A', '#9370DB', '#00FF00',
        '#8A2BE2', '#7FFF00', '#FA8072', '#008080', '#48D1CC', '#00008B', '#808000', '#B0E0E6', '#2F4F4F', '#FF4500',
        '#00FFFF', '#D8BFD8', '#9400D3', '#00CED1', '#8B0000', '#1E90FF', '#8FBC8F', '#800080', '#008B8B', '#FF6347',
        '#3CB371', '#7B68EE', '#FF1493', '#696969', '#8B008B', '#CD5C5C', '#4169E1', '#32CD32', '#FFD700', '#9932CC',
        '#DC143C', '#556B2F', '#8B4513', '#4682B4', '#6A5ACD', '#FFA07A', '#00FA9A', '#9370DB', '#00FF00', '#8A2BE2',
        '#7FFF00', '#FA8072', '#008080', '#48D1CC', '#00008B', '#808000', '#B0E0E6', '#2F4F4F', '#FF4500', '#00FFFF',
        '#D8BFD8', '#9400D3', '#00CED1', '#8B0000', '#1E90FF', '#8FBC8F', '#800080', '#008B8B', '#FF6347', '#3CB371',
        '#7B68EE', '#FF1493', '#696969', '#8B008B', '#CD5C5C', '#4169E1', '#32CD32', '#FFD700', '#9932CC', '#DC143C',
        '#556B2F', '#8B4513', '#4682B4', '#6A5ACD', '#FFA07A', '#00FA9A', '#9370DB', '#00FF00', '#8A2BE2', '#7FFF00',
        '#FA8072', '#008080', '#48D1CC', '#00008B', '#808000', '#B0E0E6', '#2F4F4F', '#FF4500', '#00FFFF', '#D8BFD8',
        '#9400D3', '#00CED1', '#8B0000', '#1E90FF', '#8FBC8F', '#800080', '#008B8B', '#FF6347', '#3CB371', '#7B68EE',
        '#FF1493', '#696969', '#8B008B', '#CD5C5C', '#4169E1', '#32CD32', '#FFD700', '#9932CC', '#DC143C', '#556B2F',
        '#8B4513', '#4682B4', '#6A5ACD', '#FFA07A', '#00FA9A', '#9370DB', '#00FF00', '#8A2BE2', '#7FFF00', '#FA8072',
        '#008080', '#48D1CC', '#00008B', '#808000', '#B0E0E6', '#2F4F4F', '#FF4500', '#00FFFF', '#D8BFD8', '#9400D3',
        '#00CED1', '#8B0000', '#1E90FF', '#8FBC8F', '#800080', '#008B8B', '#FF6347', '#3CB371', '#7B68EE', '#FF1493',
        '#696969', '#8B008B', '#CD5C5C', '#4169E1', '#32CD32', '#FFD700', '#9932CC', '#DC143C', '#556B2F', '#8B4513',
        '#4682B4', '#6A5ACD', '#FFA07A', '#00FA9A', '#9370DB', '#00FF00', '#8A2BE2', '#7FFF00', '#FA8072', '#008080',
        '#48D1CC', '#00008B', '#808000', '#B0E0E6', '#2F4F4F', '#FF4500', '#00FFFF', '#D8BFD8', '#9400D3', '#00CED1',
        '#8B0000', '#1E90FF', '#8FBC8F', '#800080', '#008B8B', '#FF6347', '#3CB371', '#7B68EE', '#FF1493', '#696969',
        '#8B008B', '#CD5C5C', '#4169E1', '#32CD32', '#FFD700', '#9932CC', '#DC143C', '#556B2F', '#8B4513', '#4682B4',
        '#6A5ACD', '#FFA07A', '#00FA9A', '#9370DB', '#00FF00', '#8A2BE2', '#7FFF00', '#FA8072', '#008080', '#48D1CC',
        '#00008B', '#808000', '#B0E0E6', '#2F4F4F', '#FF4500', '#00FFFF', '#D8BFD8']
      let colors = []
      if (seriesData.length < contrastColors.length) {
        colors = contrastColors // 动态生成颜色
      } else {
        colors = this.generateRandomColors(seriesData.length)
      }
      return {
        title: { text: '篮子图形分析' }, // 图标的标题
        legend: {
          orient: 'vertical',
          x: 'left',
          y: 'top',
          top: 60,
          // left: 50,
          data: this.groupedList,
          selected: this.groupedList.reduce((acc, item) => {
            if (
              item === '000300.SH-沪深300' ||
              item === '000050.SH-50等权' ||
              item === '000905.SH-中证500' ||
              item === '000906.SH-中证800' ||
              item === '399303.SZ-国证2000' ||
              item === '399006.SZ-创业板指' ||
              item === '000688.SH-科创50'
            ) {
              acc[item] = false
            } else {
              acc[item] = true
            }
            return acc
          }, {})
        },
        dataZoom: [
          {
            show: true,
            type: 'slider',
            start: 0,
            end: 100,
            bottom: 10,
            height: 50
          }
        ],
        toolbox: {
          feature: {
            saveAsImage: {}
          }
        },
        tooltip: {
          trigger: 'axis',
          formatter: (params) => {
            // params 包含了鼠标悬停时的信息
            const dataIndex = params[0].dataIndex
            const todayDate = params[0].name
            let tooltipContent = `<div>日期：${todayDate}<hr size=1 style="margin: 3px 0"> </div>`
            // const legendSelected = this.options.legend.selected
            // console.log(this.selectedTab)
            // 遍历每个折线，显示涨跌幅
            seriesData.forEach((line, index) => {
              // console.log(line)
              // console.log(dataIndex)
              const todayPrice = line.day_index[dataIndex]
              // const yesterdayPrice = dataIndex > 0 ? line.data[dataIndex - 1] : todayPrice
              const priceChangePercentage = line.day_ratio[dataIndex]
              const qjPriceChangePercentage = ((todayPrice - 1000) / 1000 * 100).toFixed(2)
              const dotStyle = `style="display:inline-block;width:10px;height:10px;border-radius:50%;background-color:${colors[index]};margin-right:5px;"`
              // if (todayPrice != null && legendSelected[line.name] !== false) {
              if (todayPrice != null) {
                tooltipContent += `<div><span ${dotStyle}></span> &nbsp;&nbsp;&nbsp;&nbsp;指数名称：${line.name}&nbsp;&nbsp;&nbsp;&nbsp;指数点：${todayPrice.toFixed(2)}&nbsp;&nbsp;&nbsp;&nbsp;涨跌幅：${priceChangePercentage.toFixed(2)}% \t区间涨跌幅：${qjPriceChangePercentage}%</div>`
              }
            })

            return tooltipContent
          }
        },
        //  X轴
        xAxis: {
          type: 'category', // 坐标轴类型,类目轴，适用于离散的类目数据。为该类型时类目数据可自动从 series.data 或 dataset.source 中取，或者可通过 xAxis.data 设置类目数据
          // 坐标轴刻度相关设置
          axisTick: {
            alignWithLabel: true // 为true时，可以让刻度跟底部的标签内容对齐
          },

          data: this.cols, // X轴的刻度数据
          name: '时间', // 坐标轴名称
          nameLocation: 'start', // 坐标轴名称显示位置
          // 坐标轴名称的文字样式
          nameTextStyle: {
            align: 'center', // 文字水平对齐方式，默认自动
            verticalAlign: 'top', // 文字垂直对齐方式，默认自动
            lineHeight: 28, // 行高
            fontSize: 10, // 字体大小
            color: 'rgba(0, 0, 0, 1)' // 字体颜色
          },
          // 坐标轴刻度标签的相关设置
          axisLabel: {
            interval: 'auto', // 坐标轴刻度标签的显示间隔，在类目轴中有效。可以设置成 0 强制显示所有标签,如果设置为 1，表示『隔一个标签显示一个标签』，如果值为 2，表示『隔两个标签显示一个标签』，以此类推。
            rotate: 45
          }
        },
        //  Y轴
        yAxis: {
          type: 'value', // 坐标轴类型,'value' 数值轴，适用于连续数据
          scale: true
          // 坐标轴刻度标签的相关设置
          // axisLabel: {
          //   formatter: this.formatter // 刻度标签的内容格式器，支持字符串模板和回调函数两种形式。简单讲就是可以自己格式化标签的内容。
          // }
        },
        // 直角坐标系内绘图网格,简单理解指的就是这个折线图。
        grid: {
          left: 250, // grid 组件离容器左侧的距离
          bottom: 130
        },
        //  数据
        series: seriesData.map((line, index) => ({
          name: line.name,
          type: 'line',
          data: line.day_index,
          itemStyle: {
            normal: {
              color: colors[index] // 折线颜色
            }
          }
          // 其他 series 配置项...
        }))
      }
    }
  },
  // computed: {
  //   computedTabsActive () {
  //     return {
  //       this.options.series = this.rows
  //     this.options.xAxis.data = this.cols
  //     }
  //   }
  // },
  methods: {
    generateRandomColors (count) {
      const colors = []
      for (let i = 0; i < count; i++) {
        // 生成随机颜色
        const randomColor = `rgb(${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)})`
        colors.push(randomColor)
      }
      return colors
    },
    fullScreenLoading (loadingBool) {
      const loading = this.$loading({
        lock: true,
        text: 'Loading',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      })
      if (!loadingBool) {
        loading.close()
      }
      // setTimeout(() => {
      //   loading.close()
      // }, 2000)
    },
    newDate (time) {
      var date = new Date(time)
      var y = date.getFullYear()
      var m = date.getMonth() + 1
      m = m < 10 ? '0' + m : m
      var d = date.getDate()
      d = d < 10 ? '0' + d : d
      return y + '-' + m + '-' + d
    },
    initCharts () {
      this.fullScreenLoading(true)
      this.$store.dispatch('graph/graph_line/getSyntheticSiegeIndexV2_v2', {
        start_date: this.newDate(this.start_date),
        end_date: this.newDate(this.end_date),
        base_date: this.newDate(this.base_date)
      })
        .then(response => {
          // 在这里处理异步操作成功后的响应
          // console.log('Response data:', response.data)
          if (response.code === 200) {
            console.log(response.data)
            this.cols = response.data[0]
            this.rows = response.data[1]
            this.groupedList = response.data[2]
          }
          this.fullScreenLoading(false)
          this.showCharts()
        })
        .catch(error => {
          // 在这里处理异步操作失败时的错误
          console.error('Error:', error)
        })
    },
    //  展示折线图
    showCharts () {
      //  基于准备好的dom，初始化echarts实例
      const myChart = this.$echarts.init(document.getElementById('newCharts')) // 也可以通过$refs.newCharts的方式去获取到dom实例。
      //  绘制图表
      // myChart.setOption()

      myChart.setOption(this.options, true)
      myChart.on('legendselectchanged', function (event) {
        // event.name 是被点击图例的名称
        // event.selected 是所有图例的选中状态
        console.log('Clicked legend: ' + event.name)
        console.log('Selected legends: ', event.selected)
        this.selectedTab = event.selected
      })
    }
  }
}
</script>
<style lang="scss" scoped>
//#container {
//  width: 100%;
//  height: 80vh;
//  padding-top: 100px;
//}
#newCharts {
  margin: 0 auto;
  width: 80vw;
  height: 80vh;
}

.header-box {
  font-family: 'Roboto', sans-serif;
  font-size: 1.625em;
  font-weight: normal;
  color: #333333; /* 主色调 */
  text-align: center;
  text-transform: uppercase;
  letter-spacing: 2px;
  margin-bottom: 20px;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.2);
  display: flex;
  justify-content: center;
  align-items: center;
}

.select_date_group_box {
  display: flex;
  justify-content: center;
  align-items: center;
}

.demonstration {
  margin-right: 5px;
  margin-left: 25px;
}
</style>
<style scoped>

</style>
