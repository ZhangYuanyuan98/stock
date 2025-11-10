<template>
    <div id="app">
        <TopNavbar />
        <el-container style="width: 100%; border: 1px solid #eee ;display: flex; justify-content: center;">
            <SideBar />
            <el-main >
              <div class="header-container">
              <el-page-header @back="goBack" content="详情页面"></el-page-header>

              <h1 class="custom-text-center">{{ stock_name }}</h1>
              
              <div>
                <button @click="toggleFollow(symbol)">
                  <span>{{ followStatusText }}</span>
                </button>

                <button @click="toggleBlack(symbol)">
                  <span>{{ blackStatusText }}</span>
                </button>

              </div>
            </div>
              
                <el-table :data="realTimeData" border :show-header="false">
                <!-- 数据行 -->
                <el-table-column>
                  <template slot-scope="scope">
                    <span>最新价：{{ scope.row['最新价'] }}</span>
                  </template>
                </el-table-column>
                <el-table-column>
                  <template slot-scope="scope">
                    <span>涨跌幅：{{ scope.row['涨跌幅'] }}</span>
                  </template>
                </el-table-column>
                <el-table-column>
                  <template slot-scope="scope">
                    <span>今开：{{ scope.row['今开'] }}</span>
                  </template>
                </el-table-column>
                <el-table-column>
                  <template slot-scope="scope">
                    <span>昨收：{{ scope.row['昨收'] }}</span>
                  </template>
                </el-table-column>
                <el-table-column>
                  <template slot-scope="scope">
                    <span>最高：{{ scope.row['最高'] }}</span>
                  </template>
                </el-table-column>
                <el-table-column>
                  <template slot-scope="scope">
                    <span>最低：{{ scope.row['最低'] }}</span>
                  </template>
                </el-table-column>
                <el-table-column>
                  <template slot-scope="scope">
                    <span>成交量：{{ scope.row['成交量'] }}</span>
                  </template>
                </el-table-column>
                <el-table-column>
                  <template slot-scope="scope">
                    <span>成交额：{{ scope.row['成交额'] }}</span>
                  </template>
                </el-table-column>
                
                <!-- 其他列依此类推 -->
              </el-table>


              <div ref="chartWrapper">
                <div ref="dailyChartContainer" class="chart-container"></div>


                <div ref="chartContainer" class="chart-container"></div>
              </div>

              <el-row type="flex" justify="center">
                <div class="grid-content">
                <el-button plain @click="showChart('weekly')">周k</el-button>
                <el-button plain @click="showChart('flow')">流入流出资金</el-button>
                <el-button plain @click="showChart('flowMain')">主力资金比例</el-button>
                <el-button plain @click="showChart('flowRetail')">散户资金比例</el-button>
                <el-button plain @click="showChart('amount')">成交量</el-button>
                <el-button plain @click="showChart('vol')">成交额</el-button>
                <el-button plain @click="showChart('changeRange')">涨跌幅</el-button>
                <el-button plain @click="showChart('changeAmount')">涨跌额</el-button>
                <el-button plain @click="showChart('amplitude')">振幅</el-button>
                <el-button plain @click="showChart('changeProportion')">涨跌比例</el-button>
                <el-button plain @click="showChart('turnover')">换手率</el-button>                
                </div>
              </el-row>

            </el-main>
          
            </el-container>
    </div>
</template>

<script>
import * as echarts from 'echarts';
import TopNavbar from '@/views/TopNavbar.vue';
import SideBar from '@/views/SideBar.vue';
import { fetchList } from '@/api/apiService'
import { debounce } from 'lodash';


export default {
  
  computed: {
    currentBoardCode() {
      return this.$route.query.symbol;
    },
    followStatusText() {
      return this.isStockFollowed(this.symbol) ? '已关注' : '未关注';
    },
    blackStatusText() {
      return this.isStockBlack(this.symbol) ? '已拉黑' : '未拉黑';
    },
  },
  components: {
    TopNavbar,
    SideBar,
  },

  data() {
    return {
      realTimeData: [],
      dailyData: [],
      weeklyData: [],
      symbol:"",
      stock_name: "",
      currentChart: 'weekly',
      followedStocks: JSON.parse(localStorage.getItem('followedStocks') || '[]'),
      blackStocks: JSON.parse(localStorage.getItem('blackStocks') || '[]'),
      sharedDataZoom: [
        {
          type: 'inside',
          start: 50,
          end: 100,
          xAxisIndex: [0],
          filterMode: 'empty',
        },
      ],
    };
  },

  mounted() {
      
      this.symbol = this.$route.query.symbol;
      // this.stock_name = this.$route.query.stock_name;
      this.fetchData().then(() => {
      // 确保在数据加载完毕后再初始化图表
      this.$nextTick(() => {
        this.initDailyCharts();
        this.initWeeklyChart();
        this.fetchAdditionalData().then(() => {
          this.$nextTick(() => {
            this.showChart(this.currentChart);

          })})      
      });
    });
    this.observeChartWrapperResize();
  },
  beforeDestroy() {
    this.resizeObserver && this.resizeObserver.disconnect();
  },

  methods:{

    toggleFollow(symbol) {
      this.toggleStockStatus('followedStocks', symbol);
    },
    toggleBlack(symbol) {
      this.toggleStockStatus('blackStocks', symbol);
    },

    toggleStockStatus(listKey, symbol) {
      console.log(`尝试切换状态，当前股票symbol: ${symbol}, 列表: ${listKey}`);
      
      // 获取当前的股票列表
      const currentStocks = this[listKey];
      const isCurrentlyIncluded = currentStocks.includes(symbol);
      
      // 更新股票列表
      const updatedStocks = isCurrentlyIncluded
        ? currentStocks.filter(id => id !== symbol)
        : [...currentStocks, symbol];
      
      console.log(`更新后的${listKey}:`, updatedStocks);
      this[listKey] = updatedStocks;
      localStorage.setItem(listKey, JSON.stringify(updatedStocks));
      console.log(`已将更新后的${listKey}保存至localStorage`);
    },
    

    isStockFollowed(symbol) {
      return this.followedStocks.includes(symbol);
    },
    isStockBlack(symbol) {
      return this.blackStocks.includes(symbol);
    },
  
    observeChartWrapperResize() {
      const chartWrapperElement = this.$refs.chartWrapper;
      if (chartWrapperElement && 'ResizeObserver' in window) {
        this.resizeObserver = new ResizeObserver((entries) => {
          entries.forEach(() => {
            this.resizeChartDebounced(); // 当尺寸变化时调用图表重置尺寸的方法
          });
        });
        
        this.resizeObserver.observe(chartWrapperElement);
      } else {
        console.warn('ResizeObserver is not supported in this browser.');
      }
    },
    resizeChartDebounced: debounce(function() {
      if (this.dailyChartInstance) {
        this.dailyChartInstance.resize();
      }
      if (this.chartInstance) {
        this.chartInstance.resize();
      }
    }, 100), // 100毫秒内连续调用将被合并为一次调用
    goBack() {
        this.$router.go(-1);
      },
      async fetchData() {
        const params = {symbol: this.symbol,};

        const realResult = await fetchList(params, '/api/stock_real_time');
        const stock_name = realResult.data.stock_name;
        this.stock_name = stock_name;  
        this.realTimeData = realResult.data.real_data;


        const dailyResult = await fetchList(params, '/api/stock_daily_klines');  
        this.dailyData = dailyResult.data.data[0].daily_data;

        const weeklyResult = await fetchList(params, '/api/stock_weekly_klines');  
        this.weeklyData = weeklyResult.data.data[0].weekly_data;
        return Promise.resolve();
      },
      async fetchAdditionalData(){
        const params = {symbol: this.symbol,};
        const Result = await fetchList(params, '/api/stock_message');  
        this.flowData = Result.data.data[0].flow_data;

        this.flowMainData = Result.data.data[0].flow_main_data;

        this.flowRetailData = Result.data.data[0].flow_retail_data;

        this.amountData = Result.data.data[0].amount_data;

        this.volData = Result.data.data[0].vol_data;

        this.changeRangeData = Result.data.data[0].change_range_data;

        this.changeAmountData = Result.data.data[0].change_amount_data;

        this.amplitudeData = Result.data.data[0].amplitude_data;
 
        this.changeProportionData = Result.data.data[0].change_proportion_data;

        this.turnoverData = Result.data.data[0].turnover_data;
        
        return Promise.resolve();
      },

      initDailyCharts() {
        this.dailyChartInstance = echarts.init(this.$refs.dailyChartContainer);

        // 过滤掉无效数据（全为0的日数据）
        const validDailyData = this.dailyData.filter(item => 
            item.开盘 !== 0 || item.收盘 !== 0 || item.最高 !== 0 || item.最低 !== 0
        );

        // 提取有效数据中的所有价格
        const allPrices = validDailyData.flatMap(item => [
            item.开盘,
            item.收盘,
            item.最高,
            item.最低,
        ]);

        // 计算非0值的最小和最大价格
        const minPrice = allPrices.length > 0 ? Math.min(...allPrices) * 0.95 : 0;
        const maxPrice = allPrices.length > 0 ? Math.max(...allPrices) * 1.05 : 0;

        // 根据 validDailyData 创建 ECharts 的 option 数据结构
        this.dailyOption = {
            grid: {
                left: '3%',
                right: '1%',
                top: '10%',
                bottom: '10%',
            },
            xAxis: {
                type: 'category',
                data: validDailyData.map(data => {
                    const dateStr = data['时间'];
                    return dateStr.slice(5, 7) + dateStr.slice(8, 10);
                }),
                axisLabel: {
                      showMinLabel: true,
                      showMaxLabel: true,
                  },
            },
            yAxis: {
                min: minPrice,
                max: maxPrice,
                axisLabel: {
                    showMinLabel: false,
                    showMaxLabel: false,
                    formatter: '{value}',
                    show: true,
                },
                axisTick: {
                    alignWithLabel: true,
                    length: 0,
                },
                type: 'value',
                name: '价格（元）',
            },
            tooltip: {
                trigger: 'axis',
                formatter: (params) => {
                    const currentData = validDailyData[params[0].dataIndex];
                    let tooltipContent = `时间: ${currentData['时间']}<br/>
                                          开盘: ${currentData['开盘']}<br/>
                                          收盘: ${currentData['收盘']}<br/>
                                          最高: ${currentData['最高']}<br/>
                                          最低: ${currentData['最低']}<br/>`;

                    if (currentData['看涨指标'] || currentData['看跌指标']) {
                        tooltipContent += currentData['看涨指标'] ? `看涨指标: ${currentData['看涨指标']}<br/>` : '';
                        tooltipContent += currentData['看跌指标'] ? `看跌指标: ${currentData['看跌指标']}<br/>` : '';
                    }
                    
                    return tooltipContent;
                },
            },
            series: [{
                type: 'candlestick',
                data: validDailyData.map(item => [
                    item.开盘,
                    item.收盘,
                    item.最高,
                    item.最低,
                ]),
            }],
        };

        this.dailyOption.dataZoom = this.sharedDataZoom;

        // 设置图表配置项和数据
        this.dailyChartInstance.setOption(this.dailyOption);
    },


      // 周k
      initWeeklyChart() {
   
      this.chartInstance = echarts.getInstanceByDom(this.$refs.chartContainer) || echarts.init(this.$refs.chartContainer);
      this.weeklyOption = {
        grid: {
                left: '3%', // 也可以是相对单位，比如百分比，这样会根据容器大小自动缩放
                right: '1%',
                top: '10%',
                bottom: '10%',
              },
        
        xAxis: {
          type: 'category',
          data: this.weeklyData.map(data => {
              // 提取时间字符串，并重新格式化
              const dateStr = data['时间'];
              const slicedTime = dateStr.slice(5, 7) + dateStr.slice(8,10);
              return slicedTime;
            }),
            axisLabel: {
                      showMinLabel: true,
                      showMaxLabel: true,
                  },
        },
        yAxis: {

          min: function (valueAxis) {
            // 获取数据系列中的最小值
            var minValue = valueAxis.min;
            // 减去最小值的10%
            return minValue * (1 - 0.05); 
          },
          max: function (valueAxis) {
            var maxValue = valueAxis.max;
            return maxValue * (1 + 0.05);},
          axisLabel: {
            showMinLabel: false, // 隐藏最小值标签
            showMaxLabel: false, // 隐藏最大值标签
            formatter: '{value}', // 使用默认的自动格式化方式显示标签数值
            show: true,            
          },
          axisTick: {
            alignWithLabel: true, // 使刻度线对齐标签，防止遮挡
            length: 0, // 或者设置刻度线长度为0，使其不显示
          },
          type: 'value',
          name: '价格（元）'
        },
        series: [{
          type: 'candlestick',
          data: this.weeklyData.map(item => [
            item.开盘,
            item.收盘,
            item.最高,
            item.最低
          ]),
        }],
      };

      this.chartInstance.setOption(this.weeklyOption);
    },

    // 流入流出资金
    initFlowChart() {
      if (this.chartInstance) {
          this.chartInstance.clear();} else {this.chartInstance = echarts.init(this.$refs.chartContainer);}
          const maxDataValue = Math.max(...this.flowData.map(data => data['流入资金净额']));
          const exponent = Math.floor(Math.log10(maxDataValue));
          this.flowOption = {
        grid: {
                left: '3%', // 也可以是相对单位，比如百分比，这样会根据容器大小自动缩放
                right: '1%',
                top: '10%',
                bottom: '10%',
              },
        xAxis: {
          type: 'category',
          data: this.flowData.map(data => {
              // 提取时间字符串，并重新格式化
              const dateStr = data['时间'];
              const slicedTime = dateStr.slice(5, 7) + dateStr.slice(8,10);
              return slicedTime;
            }),
            axisLabel: {
                      showMinLabel: true,
                      showMaxLabel: true,
                  },
        },
        yAxis: {
          type: 'value',
          name: `*10^${exponent}价格（元）`,
          axisLabel: {
            formatter: function (value) {
              const reducedValue = value / Math.pow(10, exponent);
              return reducedValue.toFixed(2); // 保留两位小数
            }
          }
        },
        series: [{
          type: 'bar',
          barWidth: '20%',
          barGap: '20%',
          barCategoryGap: '40%',
          data: this.flowData.map(item => item['流入资金净额']),
          itemStyle: {
            color: function(params) {
              // 判断当前数据值是否大于0
              var value = params.data;
              return value > 0 ? '#FF0000' : '#00FF00'; // 大于0为红色，小于等于0为绿色
            }},
        }],
      };

      this.chartInstance.setOption(this.flowOption);
    },
    // 主力资金比例
    initFlowMainChart() {
      if (this.chartInstance) {
          this.chartInstance.clear();} else {this.chartInstance = echarts.init(this.$refs.chartContainer);}
      this.flowMainOption = {
        grid: {
                left: '3%', // 也可以是相对单位，比如百分比，这样会根据容器大小自动缩放
                right: '1%',
                top: '10%',
                bottom: '10%',
              },
        xAxis: {
          type: 'category',
          data: this.flowMainData.map(data => {
              // 提取时间字符串，并重新格式化
              const dateStr = data['时间'];
              const slicedTime = dateStr.slice(5, 7) + dateStr.slice(8,10);
              return slicedTime;
            }),
            axisLabel: {
                      showMinLabel: true,
                      showMaxLabel: true,
                  },
        },
        yAxis: {
          type: 'value',
          name: '%'
        },
        series: [{
          type: 'bar',
          barWidth: '20%',
          barGap: '20%',
          barCategoryGap: '40%',
          itemStyle: {
          color: function(params) {
            // 判断当前数据值是否大于0
            var value = params.data;
            return value > 0 ? '#FF0000' : '#40bb40'; // 大于0为红色，小于等于0为绿色
          }},
          data: this.flowMainData.map(item => item['主力净流入-净占比']),
        }],
      };

      this.chartInstance.setOption(this.flowMainOption);
    },

    // 散户资金比例
    initFlowRetailChart() {
      if (this.chartInstance) {
          this.chartInstance.clear();} else {this.chartInstance = echarts.init(this.$refs.chartContainer);}
      this.flowRetailOption = {
        grid: {
                left: '3%', // 也可以是相对单位，比如百分比，这样会根据容器大小自动缩放
                right: '1%',
                top: '10%',
                bottom: '10%',
              },
        xAxis: {
          type: 'category',
          data: this.flowRetailData.map(data =>{
              // 提取时间字符串，并重新格式化
              const dateStr = data['时间'];
              const slicedTime = dateStr.slice(5, 7) + dateStr.slice(8,10);
              return slicedTime;
            }),
            axisLabel: {
                      showMinLabel: true,
                      showMaxLabel: true,
                  },
        },
        yAxis: {
          type: 'value',
          name: '%'
        },
        series: [{
          type: 'bar',
          barWidth: '20%',
          barGap: '20%',
          barCategoryGap: '40%',
          itemStyle: {
          color: function(params) {
            // 判断当前数据值是否大于0
            var value = params.data;
            return value > 0 ? '#FF0000' : '#40bb40'; // 大于0为红色，小于等于0为绿色
          }},
          data: this.flowRetailData.map(item => item['小单净流入-净占比']),
        }],
      };

      this.chartInstance.setOption(this.flowRetailOption);
    },

    // 成交量
    initAmountChart() {
      if (this.chartInstance) {
          this.chartInstance.clear();} else {this.chartInstance = echarts.init(this.$refs.chartContainer);}
          const maxDataValue = Math.max(...this.amountData.map(data => data['成交量']));
          const exponent = Math.floor(Math.log10(maxDataValue));
          this.amountOption = {
        grid: {
                left: '3%', // 也可以是相对单位，比如百分比，这样会根据容器大小自动缩放
                right: '1%',
                top: '10%',
                bottom: '10%',
              },
        xAxis: {
          type: 'category',
          data: this.amountData.map(data => {
              // 提取时间字符串，并重新格式化
              const dateStr = data['时间'];
              const slicedTime = dateStr.slice(5, 7) + dateStr.slice(8,10);
              return slicedTime;
            }),
            axisLabel: {
                      showMinLabel: true,
                      showMaxLabel: true,
                  },
        },
        yAxis: {
          type: 'value',
          name: `*10^${exponent}手`,
          axisLabel: {
            formatter: function (value) {
              const reducedValue = value / Math.pow(10, exponent);
              return reducedValue.toFixed(2); // 保留两位小数
            }
          }
        },
        series: [{
          type: 'bar',
          barWidth: '20%',
          barGap: '20%',
          barCategoryGap: '40%',
          // itemStyle: {
          // color: function(params) {
          //   // 判断当前数据值是否大于0
          //   var value = params.data;
          //   return value > 0 ? '#FF0000' : '#00FF00'; // 大于0为红色，小于等于0为绿色
          // }},
          data: this.amountData.map(item => item['成交量']),
        }],
      };
      this.amountOption.dataZoom = this.sharedDataZoom;
      
      this.chartInstance.setOption(this.amountOption);
    },

    // 成交额
    initVolChart() {
      if (this.chartInstance) {
          this.chartInstance.clear();} else {this.chartInstance = echarts.init(this.$refs.chartContainer);}
          const maxDataValue = Math.max(...this.volData.map(data => data['成交额']));
          const exponent = Math.floor(Math.log10(maxDataValue));
          this.volOption = {
        grid: {
                left: '3%', // 也可以是相对单位，比如百分比，这样会根据容器大小自动缩放
                right: '1%',
                top: '10%',
                bottom: '10%',
              },
        xAxis: {
          type: 'category',
          data: this.volData.map(data => {
              // 提取时间字符串，并重新格式化
              const dateStr = data['时间'];
              const slicedTime = dateStr.slice(5, 7) + dateStr.slice(8,10);
              return slicedTime;
            }),
            axisLabel: {
                      showMinLabel: true,
                      showMaxLabel: true,
                  },
        },
        yAxis: {
          type: 'value',
          name: `*10^${exponent}价格`,
          axisLabel: {
            formatter: function (value) {
              const reducedValue = value / Math.pow(10, exponent);
              return reducedValue.toFixed(2); // 保留两位小数
            }
          }
        },
        series: [{
          type: 'bar',
          barWidth: '20%',
          barGap: '20%',
          barCategoryGap: '40%',
          // itemStyle: {
          // color: function(params) {
          //   // 判断当前数据值是否大于0
          //   var value = params.data;
          //   return value > 0 ? '#FF0000' : '#00FF00'; // 大于0为红色，小于等于0为绿色
          // }},
          data: this.volData.map(data => data['成交额']),
        }],
      };

      this.chartInstance.setOption(this.volOption);
    },

    // 涨跌幅
    initChangeRangeChart() {
      if (this.chartInstance) {
          this.chartInstance.clear();} else {this.chartInstance = echarts.init(this.$refs.chartContainer);}
      this.changeRangeOption = {
        grid: {
                left: '3%', // 也可以是相对单位，比如百分比，这样会根据容器大小自动缩放
                right: '1%',
                top: '10%',
                bottom: '10%',
              },
        xAxis: {
          type: 'category',
          data: this.changeRangeData.map(data => {
              // 提取时间字符串，并重新格式化
              const dateStr = data['时间'];
              const slicedTime = dateStr.slice(5, 7) + dateStr.slice(8,10);
              return slicedTime;
            }),
            axisLabel: {
                      showMinLabel: true,
                      showMaxLabel: true,
                  },
        },
        yAxis: {
          type: 'value',
          name: '%'
        },
        series: [{
          type: 'bar',
          barWidth: '20%',
          barGap: '20%',
          barCategoryGap: '40%',
          data: this.changeRangeData.map(item => item.涨跌幅),
          itemStyle: {
          color: function(params) {
            // 判断当前数据值是否大于0
            var value = params.data;
            return value > 0 ? '#FF0000' : '#40bb40'; // 大于0为红色，小于等于0为绿色
          }}
        }],
      };

      this.chartInstance.setOption(this.changeRangeOption);
    },

    // 涨跌额
    initChangeAmountChart() {
      if (this.chartInstance) {
          this.chartInstance.clear();} else {this.chartInstance = echarts.init(this.$refs.chartContainer);}
      this.changeAmountOption = {
        grid: {
                left: '3%', // 也可以是相对单位，比如百分比，这样会根据容器大小自动缩放
                right: '1%',
                top: '10%',
                bottom: '10%',
              },
        xAxis: {
          type: 'category',
          data: this.changeAmountData.map(data => {
              // 提取时间字符串，并重新格式化
              const dateStr = data['时间'];
              const slicedTime = dateStr.slice(5, 7) + dateStr.slice(8,10);
              return slicedTime;
            }),
            axisLabel: {
                      showMinLabel: true,
                      showMaxLabel: true,
                  },
        },
        yAxis: {
          type: 'value',
          name: '价格（元）'
        },
        series: [{
          type: 'bar',
          barWidth: '20%',
          barGap: '20%',
          barCategoryGap: '40%',
          data: this.changeAmountData.map(item => item.涨跌额),
          itemStyle: {
          color: function(params) {
            // 判断当前数据值是否大于0
            var value = params.data;
            return value > 0 ? '#FF0000' : '#40bb40'; // 大于0为红色，小于等于0为绿色
          }}
        }],
      };

      this.chartInstance.setOption(this.changeAmountOption);
    },

    // 振幅
    initAmplitudeChart() {
      if (this.chartInstance) {
          this.chartInstance.clear();} else {this.chartInstance = echarts.init(this.$refs.chartContainer);}
      this.amplitudeOption = {
        grid: {
                left: '3%', // 也可以是相对单位，比如百分比，这样会根据容器大小自动缩放
                right: '1%',
                top: '10%',
                bottom: '10%',
              },
        xAxis: {
          type: 'category',
          data: this.amplitudeData.map(data => {
              // 提取时间字符串，并重新格式化
              const dateStr = data['时间'];
              const slicedTime = dateStr.slice(5, 7) + dateStr.slice(8,10);
              return slicedTime;
            }),
            axisLabel: {
                      showMinLabel: true,
                      showMaxLabel: true,
                  },
        },
        yAxis: {
          type: 'value',
          name: '%'
        },
        series: [{
          type: 'bar',
          barWidth: '20%',
          barGap: '20%',
          barCategoryGap: '40%',
          data: this.amplitudeData.map(item => item.振幅),
        }],
      };

      this.chartInstance.setOption(this.amplitudeOption);
    },
      // 涨跌比例
      initChangeProportionChart() {
      if (this.chartInstance) {
          this.chartInstance.clear();} else {this.chartInstance = echarts.init(this.$refs.chartContainer);}
      this.changeProportionOption = {
        grid: {
                left: '3%', // 也可以是相对单位，比如百分比，这样会根据容器大小自动缩放
                right: '1%',
                top: '10%',
                bottom: '10%',
              },
        
        xAxis: {
          type: 'category',
          data: this.changeProportionData.map(data => {
              // 提取时间字符串，并重新格式化
              const dateStr = data['时间'];
              const slicedTime = dateStr.slice(5, 7) + dateStr.slice(8,10);
              return slicedTime;
            }),
            axisLabel: {
                      showMinLabel: true,
                      showMaxLabel: true,
                  },
        },
        yAxis: {
          type: 'value',
          name: '%'
        },
        series: [{
          type: 'bar',
          barWidth: '20%',
          barGap: '20%',
          barCategoryGap: '40%',
          data: this.changeProportionData.map(item => item.涨跌比例),
          itemStyle: {
          color: function(params) {
            // 判断当前数据值是否大于0
            var value = params.data;
            return value > 0 ? '#FF0000' : '#40bb40'; // 大于0为红色，小于等于0为绿色
          }}
        }],

      };

      this.chartInstance.setOption(this.changeProportionOption);
    },
    // 换手率
      initTurnoverChart() {
      if (this.chartInstance) {
          this.chartInstance.clear();} else {this.chartInstance = echarts.init(this.$refs.chartContainer);}
      this.turnoverOption = {
        grid: {
                left: '3%', // 也可以是相对单位，比如百分比，这样会根据容器大小自动缩放
                right: '1%',
                top: '10%',
                bottom: '10%',
              },
        
        xAxis: {
          type: 'category',
          data: this.turnoverData.map(data => {
              // 提取时间字符串，并重新格式化
              const dateStr = data['时间'];
              const slicedTime = dateStr.slice(5, 7) + dateStr.slice(8,10);
              return slicedTime;
            }),
            axisLabel: {
                      showMinLabel: true,
                      showMaxLabel: true,
                  },
        },
        yAxis: {
          type: 'value',
          name: '%'
        },
        series: [{
          type: 'bar',
          barWidth: '20%',
          barGap: '20%',
          barCategoryGap: '40%',
          data: this.turnoverData.map(item => item.换手率),

        }],
      };

      this.chartInstance.setOption(this.turnoverOption);
    },
      
      
    // 根据按钮点击切换图表
     showChart(type) {
      this.currentChart = type;
      if (type === 'weekly') {
        this.initWeeklyChart();
      } else if (type === 'flow') {
        this.initFlowChart();
      } else if (type === 'flowMain') {
        this.initFlowMainChart();
      } else if (type === 'flowRetail') {
        this.initFlowRetailChart();
      } else if (type === 'amount') {
        this.initAmountChart();
      } else if (type === 'vol') {
        this.initVolChart();
      } else if (type === 'changeRange') {
        this.initChangeRangeChart();
      } else if (type === 'changeAmount') {
        this.initChangeAmountChart();
      } else if (type === 'amplitude') {
        this.initAmplitudeChart();
      } else if (type === 'changeProportion') {
        this.initChangeProportionChart();
      } else if (type === 'turnover') {
        this.initTurnoverChart();
      } 
      // ... 对于其他图表，继续添加处理逻辑
    },
  },
}
</script>
<style>

.el-container {
  height:100vh;
  /* overflow-y: auto; */
  overflow: hidden;
}
.header-container {
  display: flex; /* 使用 Flexbox 布局 */
  align-items: center; /* 垂直居中对齐 */
  justify-content: space-between; /* 在主轴上均匀分布元素 */

}
/* 使表格高度充满剩余空间 */
.el-main {
  height:100%;
  /* overflow-y: auto; */
  overflow: hidden;
}

.custom-text-center {
  text-align: center;
}
.chart-container {
  margin-top: 10px;
  width: 100%;
  height: 315px;

}; 
.el-row {
  margin-bottom: 10px;
  &:last-child {
    margin-bottom: 0;
  }
};
.grid-content {
  display: flex;
  justify-content: center; /* 水平居中 */
  border-radius: 4px;
  min-height: 30px;
};

  
</style>