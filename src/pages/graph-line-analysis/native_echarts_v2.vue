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
            placeholder="选择日期"
            @change='handleChange'
            :picker-options="selectStartDate">
            >
          </el-date-picker>
        </div>
        <div class="block">
          <span class="demonstration">交易日结束日</span>
          <el-date-picker
            v-model="end_date"
            type="date"
            format="yyyy-MM-dd"
            placeholder="选择日期"
            :picker-options="selectEndDate">
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
        <!--        <el-button style="margin-left: 25px" type="primary" @click="allSelect">展示全部图例</el-button>-->
        <!--        <el-button style="margin-left: 25px" type="primary" @click="clearSelect">清空所有选中</el-button>-->
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
      start_date: '2024-01-02',
      end_date: '2024-01-18',
      base_date: '2024-01-02',
      cols: [],
      rows: [],
      groupedList: [],
      default_show: {},
      selectedTab: [],
      selectStartDate: {
        disabledDate (time) {
          // 禁用 2023-01-01 之前的日期，包括当天
          const startDate = new Date('2023-01-02')
          return time.getTime() < startDate.getTime()
        }
      },
      selectEndDate: {
        disabledDate (time) {
          return time.getTime() > Date.now()
        }
      } // 设置结束日期为今天
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
      const groupedList = this.groupedList
      const contrastColors = [
        '#ffae4b', '#ff6050', '#f14d91', '#400a4f', '#ab83f0', '#6889f5', '#57a4ff', '#45c8ff', '#4bdfcb', '#62f7aa',
        '#97f570', '#d2ec55', '#ffe845', '#ffb52b', '#ff7a4b', '#ff546a', '#f159b4', '#d05ef6', '#b18df4', '#748ef5',
        '#699cfb', '#5ca7ff', '#58b5ff', '#51c6d5', '#4ad9b4', '#3cf48b', '#7cff56', '#b6f63b', '#f5e441', '#ffd73b',
        '#ff9f54', '#ff6f70', '#f166bb', '#d86bf8', '#bb9cf7', '#7a8df7', '#799afb', '#6eb5ff', '#6ac1ff', '#65d2e4',
        '#5de3c3', '#52f89d', '#94f863', '#c7f442', '#fbe848', '#ffd33e', '#ffac5c', '#ff7e77', '#f173c1', '#db78fb',
        '#c5a0fa', '#978ef9', '#8aa0fc', '#87adf9', '#84bafc', '#7fcbe4', '#79dcd3', '#6ef593', '#adff63', '#e2ff4b'
      ]
      let colors = []
      if (groupedList.length < contrastColors.length) {
        colors = contrastColors // 使用颜色列表
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
              // if(line.name == )
              const todayPrice = line.day_index[dataIndex]

              // 正则匹配
              const pattern = /^(000|399)/
              let priceChangePercentage
              let qjPriceChangePercentage
              let dotStyle
              const isCommonIndex = pattern.test(line.name) // false
              if (isCommonIndex) {
                // 悬停日实际价格
                const todayRealPrice = line.day_real_price[dataIndex]
                // console.log(todayRealPrice)
                // 指数当日收盘价
                const basePriceIndex = line.base_price_index
                // 当日涨幅
                priceChangePercentage = line.day_ratio[dataIndex]
                // 根据悬停现价计算昨收价
                // 计算区间涨跌幅
                // 基准日期在悬停之后
                // 如果基准日期在悬停日期后，则 基准日 - 悬停日前一日价格
                if (basePriceIndex > dataIndex) {
                  // 基准日价格
                  // console.log('basePriceIndex:' + basePriceIndex)
                  const basePrice = line.day_real_price[basePriceIndex]
                  // 悬停日前日价格
                  // const prevPrice = todayRealPrice / (1 + (priceChangePercentage / 100))
                  const prevPrice = line.day_real_price[dataIndex - 1]
                  // if (line.name === '000852.SH-中证1000') {
                  //   console.log('=========准日期在悬停日期后======= ')
                  //   console.log('basePrice:' + basePrice)
                  //   console.log('prevPrice:' + prevPrice)
                  // }
                  qjPriceChangePercentage = (basePrice - prevPrice) / prevPrice * 100
                } else if (basePriceIndex < dataIndex) {
                  // 如果基准日期在悬停日期前，则 悬停实际价格 - 基准价格前一天价格
                  // 基准日价格
                  // 悬停日前日价格
                  const basePrice = line.day_real_price[basePriceIndex - 1]
                  // if (line.name === '000852.SH-中证1000') {
                  //   console.log('=========如果基准日期在悬停日期前======= ')
                  //   console.log('todayRealPrice:' + todayRealPrice)
                  //   console.log('basePrice:' + basePrice)
                  // }
                  qjPriceChangePercentage = (todayRealPrice - basePrice) / basePrice * 100
                } else {
                  qjPriceChangePercentage = line.day_ratio[dataIndex]
                }
                // console.log(qjPriceChangePercentage)
                dotStyle = `style="display:inline-block;width:10px;height:10px;border-radius:10%;background-color:${colors[index]};margin-right:5px;"`
              } else {
                priceChangePercentage = line.day_ratio[dataIndex]
                qjPriceChangePercentage = ((todayPrice - 1000) / 1000 * 100)
                dotStyle = `style="display:inline-block;width:10px;height:10px;border-radius:50%;background-color:${colors[index]};margin-right:5px;"`
              }
              // const yesterdayPrice = dataIndex > 0 ? line.data[dataIndex - 1] : todayPrice

              // if (todayPrice != null && legendSelected[line.name] !== false) {
              if (todayPrice != null && priceChangePercentage != null && qjPriceChangePercentage != null) {
                tooltipContent += `<div><span ${dotStyle}></span> &nbsp;&nbsp;&nbsp;&nbsp;指数名称：${line.name}&nbsp;&nbsp;&nbsp;&nbsp;指数点：${todayPrice.toFixed(2)}&nbsp;&nbsp;&nbsp;&nbsp;涨跌幅：${priceChangePercentage.toFixed(2)}% \t区间涨跌幅：${qjPriceChangePercentage.toFixed(2)}%</div>`
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
    handleChange () {
      this.base_date = this.start_date
    },
    allSelect () {
      // console.log(this.selectedTab)
      this.selectedTab = this.groupedList.reduce((acc, item) => {
        acc[item] = true
        return acc
      }, {})
      // console.log(this.selectedTab)
      // this.options.legend.selected = this.selectedTab
      this.$set(this.options.legend, 'selected', this.selectedTab)
    },
    clearSelect () {
      // console.log(this.selectedTab)
      this.selectedTab = this.groupedList.reduce((acc, item) => {
        acc[item] = false
        return acc
      }, {})
      // console.log(this.selectedTab)
      this.options.legend = Object.assign({}, this.options.legend, { selected: this.selectedTab })
    },
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
        text: '趁着加载，不妨眺望一下窗外~',
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
            // console.log(response.data)
            this.cols = response.data[0]
            this.rows = response.data[1]

            const groupedList = response.data[2]
            this.groupedList = groupedList.sort((a, b) => {
              const dateA = a.split('-')[1]
              const dateB = b.split('-')[1]

              if (dateA !== dateB) {
                return dateA.localeCompare(dateB)
              }

              const numA = parseInt(a.split('-')[2])
              const numB = parseInt(b.split('-')[2])

              return numA - numB
            })
            this.selectedTab = this.groupedList
          }
          this.fullScreenLoading(false)
          this.showCharts()
        })
        .catch(error => {
          // 在这里处理异步操作失败时的错误
          this.fullScreenLoading(false)
          console.error('Error:', error)
          this.$alert('当前请求异常，请上报异常！ (' + error + ')', '请知晓', {
            confirmButtonText: '我已知晓',
            callback: action => {
              this.$message({
                type: 'error',
                message: `错误消息: ${error}`
              })
            }
          })
        })
    },
    //  展示折线图
    showCharts () {
      //  基于准备好的dom，初始化echarts实例
      const myChart = this.$echarts.init(document.getElementById('newCharts')) // 也可以通过$refs.newCharts的方式去获取到dom实例。
      //  绘制图表
      // myChart.setOption()

      myChart.setOption(this.options, true)
      window.addEventListener('resize', function () {
        myChart.resize()
      })
      myChart.on('legendselectchanged', function (event) {
        // event.name 是被点击图例的名称
        // event.selected 是所有图例的选中状态
        // console.log('Clicked legend: ' + event.name)
        // console.log('Selected legends: ', event.selected)
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
