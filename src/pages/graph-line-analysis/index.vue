<template>
  <d2-container>
    <!--    <template slot="header">Page 1 header</template>-->
    <!--    Hello Worlds-->
    <template>
      <div class="header-box">
        篮子图线分析
      </div>
      <template>
        <div>
          <ve-line :data="chartData"
                   :settings="chartSettings"
                   :extend="extend"
                   width="99%"
                   height="80vh"
          />
        </div>
      </template>
      <template slot="footer">
        <div class="select_date_group_box">
          <div class="block">
            <span class="demonstration">推荐选股起始日期</span>
            <el-date-picker
              v-model="start_date"
              type="date"
              format="yyyy-MM-dd"
              placeholder="选择日期">
            </el-date-picker>
          </div>
          <div class="block">
            <span class="demonstration">推荐选股结束日期</span>
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
    </template>
  </d2-container>
</template>

<script>
export default {
  name: 'graph-analysis',
  data () {
    return {
      start_date: '2023-11-30',
      end_date: '2024-01-04',
      base_date: '2024-01-05',
      loading: false,
      chartData: {
        columns: [],
        rows: []

      },
      legend: {
        data: ['涨跌幅']
      },
      chartSettings: {
        showDataZoom: true,
        digit: 8,
        // axisSite: {
        //   right: ['涨跌幅']
        // },
        // yAxisType: ['KMB', 'percent'],
        scale: [true, false],
        yAxisName:
          ['价格'],
        series: [
          {
            name: '涨跌幅',
            type: 'bar',
            data: [10, -5, 8, -3, 12],
            itemStyle: {
              color: params => (params.value >= 0 ? 'green' : 'red')
            },
            label: {
              show: true,
              position: 'top',
              formatter: params => {
                console.log(params)
                // const value = params.value
                // const percentage = this.calculatePercentageChange(value)
                // return `${value} (${percentage}%)`
              }
            }
          }
        ]
      },
      extend: {
        'xAxis.0.axisLabel.rotate':
          45,
        // series (e) {
        //   console.log(e)
        //   e.smooth = false
        //   e.type = 'line'
        //   e.forEach((i) => {
        //     console.log(i)
        //     if (i.name === 'Volume') {
        //       i.itemStyle.color = '#7a3e43'
        //       console.log(i.itemStyle)
        //     }
        //   })
        //   return e
        // }
        series:
          {
            type: 'line',
            smooth:
              false
            // 其他系列相关设置
          }

      }
    }
  },
  methods: {
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
      console.log(this.newDate(this.start_date))
      console.log(this.newDate(this.end_date))
      console.log(this.newDate(this.base_date))
      console.log(this.end_date)
      console.log(this.base_date)
      this.$store.dispatch('graph/graph_line/getSyntheticSiegeIndex', {
        start_date: this.newDate(this.start_date),
        end_date: this.newDate(this.end_date),
        base_date: this.newDate(this.base_date)
      })
        .then(response => {
          // 在这里处理异步操作成功后的响应
          // console.log('Response data:', response.data)
          if (response.code === 200) {
            console.log(response.data)
            this.chartData.columns = response.data[0]
            this.chartData.rows = response.data[1]
          }
          this.fullScreenLoading(false)
        })
        .catch(error => {
          // 在这里处理异步操作失败时的错误
          console.error('Error:', error)
        })
    }

  },
  created () {
    // this.initCharts()
  }
}
</script>
<style scoped>
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
