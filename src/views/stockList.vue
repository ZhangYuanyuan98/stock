<template>
  <div id="app">
    <TopNavbar />
    <el-container style="width: 100%; border: 1px solid #eee ;display: flex; justify-content: center;">
      <SideBar />
      <el-main>
        <div class="search-container">
          <el-input
            placeholder="请输入股票代码"
            prefix-icon="el-icon-search"
            v-model="input"
            @keyup.enter.native="onSearch">
          </el-input>
        </div>
        <!-- 表格 -->
        <div class="table-wrapper" ref="tableWrapper" @scroll="handleScroll">
          <el-table :data="tableData" border class="custom-table" @row-click="handleRowClick">
            <el-table-column type="index" label="序号" width="50"></el-table-column>
            <el-table-column prop="symbol" label="股票名称" width="80">
            </el-table-column>
            <el-table-column prop="stock_name" label="股票代码" width="80">
            </el-table-column>
            <el-table-column prop="daily_data" label="日k(元)">
            <template slot-scope="scope">
            <div :id="'candlestick-chart-' + scope.$index" class="chart-container"></div>
            </template>
            </el-table-column>
            <el-table-column prop="amount_data" label="成交量(手)">
            <template slot-scope="scope">
            <div :id="'amount-candlestick-chart-' + scope.$index" class="chart-container"></div>
            </template>
            </el-table-column>
            <el-table-column prop="vol_data" label="成交额(元)">
            <template slot-scope="scope">
            <div :id="'vol-candlestick-chart-' + scope.$index" class="chart-container"></div>
            </template>
            </el-table-column>
            <el-table-column prop="flow_data" label="流入流出资金(元)">
            <template slot-scope="scope">
            <div :id="'flow-candlestick-chart-' + scope.$index" class="chart-container"></div>
            </template>
            </el-table-column>
            <el-table-column prop="change_range_data" label="涨跌幅(%)">
            <template slot-scope="scope">
            <div :id="'changeRange-candlestick-chart-' + scope.$index" class="chart-container"></div>
            </template>
            </el-table-column>
            <el-table-column prop="change_amount_data" label="涨跌额(元)">
            <template slot-scope="scope">
            <div :id="'changeAmount-candlestick-chart-' + scope.$index" class="chart-container"></div>
            </template>
            </el-table-column>
            <el-table-column prop="amplitude_data" label="振幅(%)">
            <template slot-scope="scope">
            <div :id="'amplitude-candlestick-chart-' + scope.$index" class="chart-container"></div>
            </template>
            </el-table-column>
            <el-table-column prop="changeProportion" label="涨跌比例(%)">
              <template slot-scope="scope">
            <div :id="'changeProportion-candlestick-chart-' + scope.$index" class="chart-container"></div>
            </template>
            </el-table-column>
            <el-table-column prop="turnover" label="换手率(%)">
              <template slot-scope="scope">
              <div :id="'turnover-candlestick-chart-' + scope.$index" class="chart-container"></div>
              </template>
            </el-table-column>
            <el-table-column prop="flow_main_data" label="主力资金比例(%)">
            <template slot-scope="scope">
            <div :id="'flowMain-candlestick-chart-' + scope.$index" class="chart-container"></div>
            </template>
            </el-table-column>
            <el-table-column prop="flow_retail_data" label="散户资金比例(%)">
            <template slot-scope="scope">
            <div :id="'flowRetail-candlestick-chart-' + scope.$index" class="chart-container"></div>
            </template>
            </el-table-column>
            <el-table-column prop="weekly_data" label="周k(元)">
            <template slot-scope="scope">
            <div :id="'weekly-candlestick-chart-' + scope.$index" class="chart-container"></div>
            </template>
            </el-table-column>
          </el-table>
        </div>

        <el-backtop target=".table-wrapper" :bottom="100">
          <div class="el-backtop" style="right: 40px; bottom: 100px;">
          <div style="width: 100%; background-color: rgb(242, 245, 246); box-shadow: rgba(0, 0, 0, 0.12) 0px 0px 6px; text-align: center; line-height: 40px; color: rgb(25, 137, 250);">
            ↑</div>
          </div>
        </el-backtop>

      </el-main>          
    </el-container>
  </div>
</template>

<script>
import * as echarts from 'echarts';
import TopNavbar from '@/views/TopNavbar.vue';
import SideBar from '@/views/SideBar.vue';
import { fetchFollowedList } from '@/api/apiService'
import { fetchList } from '@/api/apiService'

export default{
    components: {
    TopNavbar,
    SideBar
  },
  props: {
    type: {
      type: String,
      required: true,
    },
  },
  data(){
    return {
      input: '',
      tableData:[],
      followedStocks: [], 
      blackStocks: [],
      currentPage: 1, // 当前页码
      pageSize: 10, // 每页显示的记录数
      totalItemNum: 0, // 总记录数
      loading: false,
      hasMore: true,
      justLoadedMore: false,
    }
    
  },
  beforeCreate() {
  // 监听浏览器的历史记录变化事件
  window.addEventListener('popstate', () => {
    // 页面后退时刷新页面
    window.location.reload();
  });
},
  mounted() {
    setTimeout(() => {
      this.fetchData();

    }, 100); // 设置一个适当的延迟时间

  },

  methods:{
    async onSearch() {

      const params = {
        symbol :this.input,
        };
      const response = await fetchList(params, '/api/stock_real_time');
      console.log(response.data);
      if (response.status === 200 && response.data.stock_name !== null) {
          // 有数据时进行跳转
          this.$router.push({
              path: '/api/board_cons_detail',
              query: { symbol:this.input },
          });
      } else {
          // 其他错误状态码的处理
          this.$notify.error({
              title: '错误',
              message: '未找到股票信息'
          });
      }
      },

    handleRowClick(row) {
    // 获取点击行的股票代码
    const symbol = row.symbol;
    
    // 使用 router-link 或编程式导航跳转到新的页面，并传入板块代码
    this.$router.push({ path: '/api/board_cons_detail', query: { symbol} });
    },

    async fetchData() {
      if (!this.loading && this.hasMore && !this.justLoadedMore) {
      this.isLoadingMore = true;
      const params = {
        currentPage: this.currentPage,
        pageSize: this.pageSize,
      };
      let result;
      switch (this.type) {
        case 'stock_list':
          result = await fetchList(params, '/api/stock_list');
          break;
        case 'stock_followed':

          result = await fetchFollowedList(this.handleFollowedList('followedStocks').searchParams, '/api/stock_followed');
          console.log('Fetched stocks:', this.handleFollowedList('followedStocks').searchParams.toString());
          break;
        case 'stock_black':
        result = await fetchFollowedList(this.handleBlackList('blackStocks').searchParams, '/api/stock_black');
        console.log('Fetched blacklisted stocks:', this.handleBlackList('blackStocks').searchParams.toString());
        break;
          default:
          console.error('Invalid type:', this.type);
          this.loading = false;
          return;
      }
      // const result = await fetchList(params, '/api/stock_list');
      if (result && result.data) {
        // const parsedData = result.data.data.map(item => JSON.parse(item));
        const parsedData = result.data.data;
        this.tableData.push(...parsedData);
        this.totalItemNum = result.data.totalItemNum;
        this.hasMore = result.data.data.length === this.pageSize;
        this.justLoadedMore = true;
        if (this.currentPage * this.pageSize >= this.totalItemNum) {
          this.isLoadingMore = false;
        } else {
          this.currentPage++;
        }
        this.justLoadedMore = false;
        this.initCandlestickCharts();
        // 加载完数据后将滚动位置设置为上一次的位置
        this.$nextTick(() => {
          this.$refs.tableWrapper.scrollTop = this.lastScrollTop;
        });
      } else {
        this.isLoadingMore = false;
      }
    }
    
  },
  handleFollowedList() {
  const key = 'followedStocks'; // 指定用于关注股票的 localStorage 键
  const storedStocks = JSON.parse(localStorage.getItem(key) || '[]');
  const filteredStocks = storedStocks.filter(stock => stock && typeof stock === 'string' && stock.trim());
  const searchParams = new URLSearchParams();
  filteredStocks.forEach(stock => searchParams.append('followed', stock));
  return { followed: filteredStocks, searchParams };
},

  handleBlackList() {
    const key = 'blackStocks'; // 指定用于黑名单股票的 localStorage 键
    const storedStocks = JSON.parse(localStorage.getItem(key) || '[]');
    const filteredStocks = storedStocks.filter(stock => stock && typeof stock === 'string' && stock.trim());
    const searchParams = new URLSearchParams();
    filteredStocks.forEach(stock => searchParams.append('blacklisted', stock)); // 使用不同的参数名称
    return { blacklisted: filteredStocks, searchParams };
  },

  handleScroll() {
    const wrapper = this.$refs.tableWrapper;
    if (wrapper) {
      const scrollTop = wrapper.scrollTop;
      const clientHeight = wrapper.clientHeight;
      const scrollHeight = wrapper.scrollHeight;
      if (scrollTop + clientHeight >= scrollHeight) {
        // 存储当前滚动的位置
        this.lastScrollTop = scrollTop;
        this.fetchData();
      }
    }
  },
  handleChartInstance(dom, data, getOption) {
    let chartInstance = echarts.getInstanceByDom(dom);
    if (chartInstance) {
      chartInstance.dispose(); // 清除已存在的实例
    }
    
    chartInstance = echarts.init(dom);
    const option = getOption();
    chartInstance.setOption(option);
  },
    initCandlestickCharts() {
      this.$nextTick(() => {
        this.tableData.forEach((item, index) => {
        // 日K
        if (item.daily_data && Array.isArray(item.daily_data) && item.daily_data.length > 0 && item.daily_data[0] !== null) {
        const dailyChartDom  = document.querySelector(`#candlestick-chart-${index}`);
        this.handleChartInstance(dailyChartDom, item.daily_data, () => ({
          grid: {
                left: '20%', // 也可以是相对单位，比如百分比，这样会根据容器大小自动缩放
                right: '10%',
                top: '5%',
                bottom: '5%',
              },
              xAxis: {
                axisLabel: {
                  show: false,
                },
                type: 'category',
                axisTick: {
                  show: false,
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
                  // formatter: '{value}', // 使用默认的自动格式化方式显示标签数值
                  show: true,
                  fontSize: 8,
                  margin: 0, // 调整标签与轴线的距离
                                
                },
                type: 'value',

                splitLine: {
                    show: true, // 确保显示分割线
                    lineStyle: {
                        color: '#ddd', // 设置分割线颜色
                        type: 'solid', // 设置分割线样式
                        width: 1, // 设置分割线宽度
                    },
                },
                
              },
              series: [{
                type: 'candlestick',
                data: item.daily_data.map(item => [
                  item.开盘,
                  item.收盘,
                  item.最高,
                  item.最低
                ]),
              }],

            })
            );}
      // 周k
      if (item.weekly_data && Array.isArray(item.weekly_data) && item.weekly_data.length > 0 && item.weekly_data[0] !== null) {
      const weeklyChartDom = document.querySelector(`#weekly-candlestick-chart-${index}`);
      this.handleChartInstance(weeklyChartDom, item.weekly_data, () => ({

        grid: {
                left: '20%', // 也可以是相对单位，比如百分比，这样会根据容器大小自动缩放
                right: '10%',
                top: '5%',
                bottom: '5%',
              },
              xAxis: {
                axisLabel: {
                  show: false,
                },
                type: 'category',
                axisTick: {
                  show: false,
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
                  // formatter: '{value}', // 使用默认的自动格式化方式显示标签数值
                  show: true,
                  fontSize: 8,
                  margin: 0, // 调整标签与轴线的距离
                                
                },
                type: 'value',

                splitLine: {
                    show: true, // 确保显示分割线
                    lineStyle: {
                        color: '#ddd', // 设置分割线颜色
                        type: 'solid', // 设置分割线样式
                        width: 1, // 设置分割线宽度
                    },
                },
                
              },
              series: [{
                type: 'candlestick',
                data: item.weekly_data.map(item => [
                  item.开盘,
                  item.收盘,
                  item.最高,
                  item.最低
                ]),
              }],

            })
            );}
    // 流入流出资金
    if (item.flow_data && Array.isArray(item.flow_data) && item.flow_data.length > 0 && item.flow_data[0] !== null) {
    const flowChartDom = document.querySelector(`#flow-candlestick-chart-${index}`);
    const absMaxDataValue = Math.max(...item.flow_data.map(data => Math.abs(data['流入资金净额'])));
    const exponent = Math.floor(Math.log10(absMaxDataValue));

    this.handleChartInstance(flowChartDom, item.flow_data, () => ({
      grid: {
              left: '20%',
              right: '10%',
              top: '5%',
              bottom: '5%',
            },
      xAxis: {
        axisLabel: {
          show: false,
        },
        type: 'category',
        // data: item.flow_data.map(data => data['时间'].slice(0, 10)),
        axisTick: {
          show: false,
        },
      },
      yAxis: {
        axisLabel: {
          show: true,
          fontSize: 8,
          margin: 0, // 调整标签与轴线的距离
          // splitNumber: 4, // 设置y轴的刻度线个数为3个
          
          formatter: function (value) {
            const reducedValue = value / Math.pow(10, exponent);
            return reducedValue.toFixed(1); // 保留一位小数
          },
        },
        type: 'value',
        name: `*10^${exponent}`,
        nameLocation: 'end',
        nameTextStyle: {
          fontSize: 8,
          padding: [0, 0, 0, 30],
        },
        nameGap: -4,
      },
      series: [{
        type: 'bar',
        data: item.flow_data.map(item => item['流入资金净额']),
        itemStyle: {
          color: function(params) {
            // 判断当前数据值是否大于0
            var value = params.data;
            return value > 0 ? '#FF0000' : '#40bb40'; // 大于0为红色，小于等于0为绿色
          }
        }
      }],
    })
            );
}

    // 主力资金比例
    if (item.flow_main_data && Array.isArray(item.flow_main_data) && item.flow_main_data.length > 0 && item.flow_main_data[0] !== null) {
    const flowMainChartDom = document.querySelector(`#flowMain-candlestick-chart-${index}`);
    this.handleChartInstance(flowMainChartDom, item.flow_main_data, () => ({
      grid: {
              left: '20%',
              right: '10%',
              top: '5%',
              bottom: '5%',
            },
        xAxis: {
          axisLabel: {
            show: false,
          },
          type: 'category',
          axisTick: {
                  show: false,
                },
        },
        yAxis: {
          axisLabel: {
            show: true,
            fontSize: 8,
            margin: 2, // 调整标签与轴线的距离

          },
          splitNumber: 3, // 设置y轴的刻度线个数为3个
          type: 'value',
        },
        series: [{
          type: 'bar',
          data: item.flow_main_data.map(data => data['主力净流入-净占比']),
          itemStyle: {
          color: function(params) {
            // 判断当前数据值是否大于0
            var value = params.data;
            return value > 0 ? '#FF0000' : '#40bb40'; // 大于0为红色，小于等于0为绿色
          }}
        }],
      })
            );}

    // 散户资金比例
    if (item.flow_retail_data && Array.isArray(item.flow_retail_data) && item.flow_retail_data.length > 0 && item.flow_retail_data[0] !== null) {
    const flowRetailChartDom = document.querySelector(`#flowRetail-candlestick-chart-${index}`);
    this.handleChartInstance(flowRetailChartDom, item.flow_retail_data, () => ({
      grid: {
              left: '20%',
              right: '10%',
              top: '5%',
              bottom: '5%',
            },
        xAxis: {
          axisLabel: {
            show: false,
          },
          type: 'category',
          axisTick: {
                  show: false,
                },
        },
        yAxis: {
          axisLabel: {
            show: true,
            fontSize: 8,
            margin: 2, // 调整标签与轴线的距离

          },
          splitNumber: 3, // 设置y轴的刻度线个数为3个
          type: 'value',
        },
        series: [{
          type: 'bar',
          data: item.flow_retail_data.map(data => data['小单净流入-净占比']),
          itemStyle: {
          color: function(params) {
            // 判断当前数据值是否大于0
            var value = params.data;
            return value > 0 ? '#FF0000' : '#40bb40'; // 大于0为红色，小于等于0为绿色
          }}
        }],
      })
            );}


    // 成交量
    if (item.amount_data && Array.isArray(item.amount_data) && item.amount_data.length > 0 && item.amount_data[0] !== null) {
    const amountChartDom = document.querySelector(`#amount-candlestick-chart-${index}`);
    const maxDataValue = Math.max(...item.amount_data.map(data => data['成交量']));
    const exponent = Math.floor(Math.log10(maxDataValue));
    this.handleChartInstance(amountChartDom, item.amount_data, () => ({
      grid: {
              left: '20%',
              right: '10%',
              top: '5%',
              bottom: '5%',
            },
        xAxis: {
          axisLabel: {
            show: false,
          },
          type: 'category',
          axisTick: {
                  show: false,
                },
        },
        yAxis: {
          axisLabel: {
            show: true,
            fontSize: 8,
            margin: 0, // 调整标签与轴线的距离
            // splitNumber: 4, // 设置y轴的刻度线个数为3个
            
            formatter: function (value) {
              const reducedValue = value / Math.pow(10, exponent);
              return reducedValue.toFixed(1); // 保留两位小数
            },
          },
          splitNumber: 3, // 设置y轴的刻度线个数为3个
          type: 'value',
            name: `*10^${exponent}`,
            nameLocation: 'end',
            nameTextStyle: {
              fontSize: 8,
              padding: [0, 0, 0, 30],
            },
            nameGap: -4,
        },
        series: [{
          type: 'bar',
          data: item.amount_data.map(data => data['成交量']),
          // itemStyle: {
          // color: function(params) {
          //   // 判断当前数据值是否大于0
          //   var value = params.data;
          //   return value > 0 ? '#FF0000' : '#00FF00'; // 大于0为红色，小于等于0为绿色
          // }}
        }],
      })
            );}

    // 成交额
    if (item.vol_data && Array.isArray(item.vol_data) && item.vol_data.length > 0 && item.vol_data[0] !== null) {
    const volChartDom = document.querySelector(`#vol-candlestick-chart-${index}`);
    const maxDataValue = Math.max(...item.vol_data.map(data => data['成交额']));
    const exponent = Math.floor(Math.log10(maxDataValue));
    this.handleChartInstance(volChartDom, item.vol_data, () => ({
      grid: {
              left: '20%',
              right: '10%',
              top: '5%',
              bottom: '5%',
            },
        xAxis: {
          axisLabel: {
            show: false,
          },
          type: 'category',
          axisTick: {
                  show: false,
                },
        },
        yAxis: {
          axisLabel: {
            show: true,
            fontSize: 8,
            margin: 0, // 调整标签与轴线的距离
            // splitNumber: 4, // 设置y轴的刻度线个数为3个
            
            formatter: function (value) {
              const reducedValue = value / Math.pow(10, exponent);
              return reducedValue.toFixed(1); // 保留两位小数
            },
          },
          splitNumber: 3, // 设置y轴的刻度线个数为3个
          type: 'value',
          name: `*10^${exponent}`,
          nameLocation: 'end',
          nameTextStyle: {
            fontSize: 8,
            padding: [0, 0, 0, 30],
          },
          nameGap: -4,
        },
        series: [{
          type: 'bar',
          data: item.vol_data.map(data => data['成交额']),
          // itemStyle: {
          // color: function(params) {
          //   // 判断当前数据值是否大于0
          //   var value = params.data;
          //   return value > 0 ? '#FF0000' : '#00FF00'; // 大于0为红色，小于等于0为绿色
          // }}
        }],
      })
            );}

    // 涨跌幅
    if (item.change_range_data && Array.isArray(item.change_range_data) && item.change_range_data.length > 0 && item.change_range_data[0] !== null) {
    const changeRangeChartDom = document.querySelector(`#changeRange-candlestick-chart-${index}`);
    this.handleChartInstance(changeRangeChartDom, item.change_range_data, () => ({
      grid: {
              left: '20%',
              right: '10%',
              top: '5%',
              bottom: '5%',
            },
        xAxis: {
          axisLabel: {
            show: false,
          },
          type: 'category',
          axisTick: {
                  show: false,
                },
        },
        yAxis: {
          axisLabel: {
            show: true,
            fontSize: 8,
            margin: 2, // 调整标签与轴线的距离

          },
          splitNumber: 3, // 设置y轴的刻度线个数为3个
          type: 'value',
        },
        series: [{
          type: 'bar',
          data: item.change_range_data.map(data => data['涨跌幅']),
          itemStyle: {
          color: function(params) {
            // 判断当前数据值是否大于0
            var value = params.data;
            return value > 0 ? '#FF0000' : '#40bb40'; // 大于0为红色，小于等于0为绿色
          }}
        }],
      })
            );}

    // 涨跌额
    if (item.change_amount_data && Array.isArray(item.change_amount_data) && item.change_amount_data.length > 0 && item.change_amount_data[0] !== null) {
    const changeAmountChartDom = document.querySelector(`#changeAmount-candlestick-chart-${index}`);
    this.handleChartInstance(changeAmountChartDom, item.change_amount_data, () => ({
      grid: {
              left: '20%',
              right: '10%',
              top: '5%',
              bottom: '5%',
            },
        xAxis: {
          axisLabel: {
            show: false,
          },
          type: 'category',
          axisTick: {
                  show: false,
                },
        },
        yAxis: {
          axisLabel: {
            show: true,
            fontSize: 8,
            margin: 2, // 调整标签与轴线的距离

          },
          splitNumber: 3, // 设置y轴的刻度线个数为3个
          type: 'value',
        },
        series: [{
          type: 'bar',
          data: item.change_amount_data.map(data => data['涨跌额']),
          itemStyle: {
          color: function(params) {
            // 判断当前数据值是否大于0
            var value = params.data;
            return value > 0 ? '#FF0000' : '#40bb40'; // 大于0为红色，小于等于0为绿色
          }}
        }],
      })
            );}

    if (item.amplitude_data && Array.isArray(item.amplitude_data) && item.amplitude_data.length > 0 && item.amplitude_data[0] !== null) {
    const amplitudeChartDom = document.querySelector(`#amplitude-candlestick-chart-${index}`);
    this.handleChartInstance(amplitudeChartDom, item.amplitude_data, () => ({
      grid: {
              left: '20%',
              right: '10%',
              top: '5%',
              bottom: '5%',
            },
        xAxis: {
          axisLabel: {
            show: false,
          },
          type: 'category',
          axisTick: {
                  show: false,
                },
        },
        yAxis: {
          axisLabel: {
            show: true,
            fontSize: 8,
            margin: 2, // 调整标签与轴线的距离

          },
          splitNumber: 3, // 设置y轴的刻度线个数为3个
          type: 'value',
        },
        series: [{
          type: 'bar',
          data: item.amplitude_data.map(data => data['振幅']),
        }],
      })
            );}

      // 涨跌比例
      if (item.change_proportion_data && Array.isArray(item.change_proportion_data) && item.change_proportion_data.length > 0 && item.change_proportion_data[0] !== null) {
      const changeProportionChartDom = document.querySelector(`#changeProportion-candlestick-chart-${index}`);
      this.handleChartInstance(changeProportionChartDom, item.change_proportion_data, () => ({
        grid: {
              left: '20%',
              right: '10%',
              top: '5%',
              bottom: '5%',
            },
        xAxis: {
          axisLabel: {
            show: false,
          },
          type: 'category',
          axisTick: {
                  show: false,
                },
        },
        yAxis: {
          axisLabel: {
            show: true,
            fontSize: 8,
            margin: 2, // 调整标签与轴线的距离

          },
          splitNumber: 3, // 设置y轴的刻度线个数为3个
          type: 'value',
        },
        series: [{
          type: 'bar',
          data: item.change_proportion_data.map(data => data['涨跌比例']),
          itemStyle: {
          color: function(params) {
            // 判断当前数据值是否大于0
            var value = params.data;
            return value > 0 ? '#FF0000' : '#40bb40'; // 大于0为红色，小于等于0为绿色
          }}
        }],
      })
            );}
        // 换手率
        if (item.turnover_data && Array.isArray(item.turnover_data) && item.turnover_data.length > 0 && item.turnover_data[0] !== null) {
        const turnoverChartDom = document.querySelector(`#turnover-candlestick-chart-${index}`);
        this.handleChartInstance(turnoverChartDom, item.turnover_data, () => ({
          grid: {
              left: '20%',
              right: '10%',
              top: '5%',
              bottom: '5%',
            },
        xAxis: {
          axisLabel: {
            show: false,
          },
          type: 'category',
          axisTick: {
                  show: false,
                },
        },
        yAxis: {
          axisLabel: {
            show: true,
            fontSize: 8,
            margin: 2, // 调整标签与轴线的距离

          },
          splitNumber: 3, // 设置y轴的刻度线个数为3个
          type: 'value',
        },
        series: [{
          type: 'bar',
          data: item.turnover_data.map(data => data['换手率']),
        }],

})
);}

});
});

}
}
}


</script>
<style>


.el-container {
  height:100vh;
  /* overflow-y: auto; */
  overflow: hidden;
}
.el-main {
  height:100%;
  /* overflow-y: auto; */
  overflow: hidden;
}
.search-container {
  max-width: 300px;
  /* display: flex;

  width: 100%; */
  margin-bottom: 10px;  /* 给搜索框底部留出一些空间 */
}
.table-wrapper {
  overflow: auto;
  height: 760px;
  width: 100%;
}
.custom-table{
  width: 100%;
  text-align: center !important;

}
.custom-table th {
    text-align: center !important; /* 强制表头居中 */
    justify-content: center;      /* 水平居中 */
    align-items: center;          /* 垂直居中 */

}
.chart-container {
  width: 100%;
  height: 130px;
  /* margin: 0 auto; */
  /* line-height: 150px; */
  /* padding: 0px; */
  overflow: visible;
  z-index: 1;
}
</style>