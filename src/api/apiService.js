// import axios from 'axios';

// const API_BASE_URL = 'http://10.199.194.196:5000';
// const API_BASE_URL = 'http://10.1.66.219:5000';
// const API_BASE_URL = 'http://127.0.0.1:5000';

// // 通用方法 
// export function fetchList(params, apiEndpoint) {
//   return axios.get(`${API_BASE_URL}${apiEndpoint}`, { params });
// }
// export function fetchFollowedList(searchParams, apiEndpoint) {
//   return axios.get(`${API_BASE_URL}${apiEndpoint}?${searchParams.toString()}`);
// }
// export function date(apiEndpoint) {
//   return axios.get(`${API_BASE_URL}${apiEndpoint}`);
// }




// export function fetchList(params, apiEndpoint) {
//   console.log('📡 模拟API调用 - fetchList:', apiEndpoint, params);
  
//   return new Promise((resolve) => {
//     setTimeout(() => {
//       // 返回空数据，避免报错
//       resolve({
//         data: {
//           data: [],
//           totalItemNum: 0
//         }
//       });
//     }, 300);
//   });
// }

// 生成图表数据 - 只生成5天数据
function generateChartData(type, count = 5) {
  return Array.from({ length: count }, (_, index) => {
    const date = new Date();
    date.setDate(date.getDate() - (count - 1 - index));
    const dateStr = date.toISOString().split('T')[0];
    
    switch(type) {
      case 'daily_data':
      case 'weekly_data': {
        const basePrice = Math.random() * 100 + 50;
        return {
          日期: dateStr,
          开盘: (basePrice * 0.98).toFixed(2),
          收盘: (basePrice * 1.02).toFixed(2),
          最高: (basePrice * 1.05).toFixed(2),
          最低: (basePrice * 0.95).toFixed(2)
        };
      }
        
      case 'flow_data': {
        return {
          时间: dateStr,
          '流入资金净额': Math.floor(Math.random() * 10000000 - 5000000)
        };
      }
        
      case 'flow_main_data': {
        return {
          时间: dateStr,
          '主力净流入-净占比': (Math.random() * 20 - 10).toFixed(2)
        };
      }
        
      case 'flow_retail_data': {
        return {
          时间: dateStr,
          '小单净流入-净占比': (Math.random() * 20 - 10).toFixed(2)
        };
      }
        
      case 'amount_data': {
        return {
          时间: dateStr,
          '成交量': Math.floor(Math.random() * 10000000)
        };
      }
        
      case 'vol_data': {
        return {
          时间: dateStr,
          '成交额': Math.floor(Math.random() * 100000000)
        };
      }
        
      case 'change_range_data': {
        return {
          时间: dateStr,
          '涨跌幅': (Math.random() * 10 - 5).toFixed(2)
        };
      }
        
      case 'change_amount_data': {
        return {
          时间: dateStr,
          '涨跌额': (Math.random() * 5 - 2.5).toFixed(2)
        };
      }
        
      case 'amplitude_data': {
        return {
          时间: dateStr,
          '振幅': (Math.random() * 8).toFixed(2)
        };
      }
        
      case 'change_proportion_data': {
        return {
          时间: dateStr,
          '涨跌比例': (Math.random() * 2 - 1).toFixed(2)
        };
      }
        
      case 'change_number_data': {
        return {
          时间: dateStr,
          '涨跌停数量': Math.floor(Math.random() * 50)
        };
      }
        
      case 'continuous_change_number_data': {
        return {
          时间: dateStr,
          '连续涨跌停数量': Math.floor(Math.random() * 10)
        };
      }
        
      case 'continuous_big_change_number_data': {
        return {
          时间: dateStr,
          '连续大幅涨跌停数量': Math.floor(Math.random() * 5)
        };
      }
        
      default: {
        return { 时间: dateStr, 数值: Math.random() * 100 };
      }
    }
  });
}

// 生成详情页面的K线数据
function generateDetailKlineData(period, count = 30) {
  return Array.from({ length: count }, (_, index) => {
    const date = new Date();
    date.setDate(date.getDate() - (count - 1 - index));
    
    const basePrice = Math.random() * 100 + 50;
    const change = (Math.random() - 0.5) * 10;
    
    return {
      时间: date.toISOString().split('T')[0],
      开盘: (basePrice * 0.98).toFixed(2),
      收盘: (basePrice * 1.02 + change).toFixed(2),
      最高: (basePrice * 1.05).toFixed(2),
      最低: (basePrice * 0.95).toFixed(2)
    };
  });
}

// 生成详情页面的消息数据
function generateMessageData(count = 30) {
  const data = {};
  const chartTypes = [
    'flow_data', 'flow_main_data', 'flow_retail_data', 
    'amount_data', 'vol_data', 'change_range_data', 
    'change_amount_data', 'amplitude_data', 'change_proportion_data',
    'change_number_data', 'continuous_change_number_data', 'continuous_big_change_number_data'
  ];
  
  chartTypes.forEach(chartType => {
    data[chartType] = Array.from({ length: count }, (_, index) => {
      const date = new Date();
      date.setDate(date.getDate() - (count - 1 - index));
      
      const baseValue = {
        'flow_data': () => ({ 时间: date.toISOString().split('T')[0], '流入资金净额': Math.floor(Math.random() * 10000000 - 5000000) }),
        'flow_main_data': () => ({ 时间: date.toISOString().split('T')[0], '主力净流入-净占比': (Math.random() * 20 - 10).toFixed(2) }),
        'flow_retail_data': () => ({ 时间: date.toISOString().split('T')[0], '小单净流入-净占比': (Math.random() * 20 - 10).toFixed(2) }),
        'amount_data': () => ({ 时间: date.toISOString().split('T')[0], '成交量': Math.floor(Math.random() * 10000000) }),
        'vol_data': () => ({ 时间: date.toISOString().split('T')[0], '成交额': Math.floor(Math.random() * 100000000) }),
        'change_range_data': () => ({ 时间: date.toISOString().split('T')[0], '涨跌幅': (Math.random() * 10 - 5).toFixed(2) }),
        'change_amount_data': () => ({ 时间: date.toISOString().split('T')[0], '涨跌额': (Math.random() * 5 - 2.5).toFixed(2) }),
        'amplitude_data': () => ({ 时间: date.toISOString().split('T')[0], '振幅': (Math.random() * 8).toFixed(2) }),
        'change_proportion_data': () => ({ 时间: date.toISOString().split('T')[0], '涨跌比例': (Math.random() * 2 - 1).toFixed(2) }),
        'change_number_data': () => ({ 时间: date.toISOString().split('T')[0], '涨跌停数量': Math.floor(Math.random() * 50) }),
        'continuous_change_number_data': () => ({ 时间: date.toISOString().split('T')[0], '连续涨跌停数量': Math.floor(Math.random() * 10) }),
        'continuous_big_change_number_data': () => ({ 时间: date.toISOString().split('T')[0], '连续大幅涨跌停数量': Math.floor(Math.random() * 5) })
      };
      
      return baseValue[chartType]();
    });
  });
  
  return data;
}

// 生成列表数据 - 确保包含板块名称和代码
function generateListData(config, params) {
  const pageSize = params.pageSize || 10;
  const page = params.currentPage || 1;
  
  const data = Array.from({ length: pageSize }, (_, index) => {
    const item = {};
    const globalIndex = (page - 1) * pageSize + index + 1;
    
    // 生成基本字段 - 确保包含板块名称和代码
    config.fields.forEach(field => {
      switch(field) {
        case '板块代码':
          item[field] = `BK${1000 + globalIndex}`;
          break;
        case '板块名称':
          item[field] = `板块${globalIndex}`;
          break;
        case '最新价':
          item[field] = (Math.random() * 100 + 10).toFixed(2);
          break;
        case '涨跌幅':
          item[field] = (Math.random() * 10 - 5).toFixed(2);
          break;
        case '涨跌额':
          item[field] = (Math.random() * 5 - 2.5).toFixed(2);
          break;
        case '总市值':
          item[field] = (Math.random() * 1000 + 100).toFixed(2) + '亿';
          break;
        case '换手率':
          item[field] = (Math.random() * 20).toFixed(2) + '%';
          break;
        case '上涨家数':
        case '下跌家数':
          item[field] = Math.floor(Math.random() * 50);
          break;
        case '领涨股票':
          item[field] = `股票${globalIndex}`;
          break;
        case '领涨股票-涨跌幅':
          item[field] = (Math.random() * 10).toFixed(2) + '%';
          break;
        default:
          item[field] = '--';
      }
    });
    
    // 添加额外的必需字段
    item['sector_id'] = item['板块代码'] || `BK${1000 + globalIndex}`;
    item['sector_name'] = item['板块名称'] || `${config.type.includes('concept') ? '概念' : '行业'}板块${globalIndex}`;
    
    // 生成图表数据字段 - 只生成5天数据
    if (config.chartFields) {
      config.chartFields.forEach(chartField => {
        item[chartField] = generateChartData(chartField, 5);
      });
    }
    
    return item;
  });
  
  return Array.isArray(data) ? data : [];
}

// 更新配置使用中文字段名
const mockDataConfig = {
  '/api/board_concept_list': {
    type: 'list',
    dataKey: 'data',
    fields: ['板块代码', '板块名称', '最新价', '涨跌幅', '总市值', '换手率', '上涨家数', '下跌家数', '领涨股票', '领涨股票-涨跌幅'],
    chartFields: ['daily_data', 'weekly_data', 'flow_data', 'flow_main_data', 'flow_retail_data', 'amount_data', 'vol_data', 'change_range_data', 'change_amount_data', 'amplitude_data', 'change_proportion_data', 'change_number_data', 'continuous_change_number_data', 'continuous_big_change_number_data']
  },
  '/api/board_industry_list': {
    type: 'list', 
    dataKey: 'data',
    fields: ['板块代码', '板块名称', '最新价', '涨跌幅', '总市值', '换手率', '上涨家数', '下跌家数', '领涨股票', '领涨股票-涨跌幅'],
    chartFields: ['daily_data', 'weekly_data', 'flow_data', 'flow_main_data', 'flow_retail_data', 'amount_data', 'vol_data', 'change_range_data', 'change_amount_data', 'amplitude_data', 'change_proportion_data', 'change_number_data', 'continuous_change_number_data', 'continuous_big_change_number_data']
  },
  
  // 板块实时数据
  '/api/board_concept': {
    type: 'realtime',
    dataType: 'board',
    fields: ['板块名称', '最新价', '涨跌额', '涨跌幅', '总市值', '换手率', '上涨家数', '下跌家数', '领涨股票', '领涨股票-涨跌幅']
  },
  '/api/board_industry': {
    type: 'realtime',
    dataType: 'board', 
    fields: ['板块名称', '最新价', '涨跌额', '涨跌幅', '总市值', '换手率', '上涨家数', '下跌家数', '领涨股票', '领涨股票-涨跌幅']
  },
  
  // 日K线数据
  '/api/board_concept_daily_klines': { 
    type: 'kline_detail', 
    period: 'daily',
    dataType: 'board'
  },
  '/api/board_industry_daily_klines': { 
    type: 'kline_detail', 
    period: 'daily',
    dataType: 'board'
  },
  
  // 周K线数据
  '/api/board_concept_weekly_klines': { 
    type: 'kline_detail', 
    period: 'weekly',
    dataType: 'board'
  },
  '/api/board_industry_weekly_klines': { 
    type: 'kline_detail', 
    period: 'weekly',
    dataType: 'board'
  },
  
  // 板块详细信息
  '/api/board_concept_message': { 
    type: 'message_detail', 
    dataType: 'board' 
  },
  '/api/board_industry_message': { 
    type: 'message_detail', 
    dataType: 'board' 
  }
};

// fetchList 方法
export function fetchList(params, apiEndpoint) {
  console.log('📡 模拟API调用 - fetchList:', apiEndpoint, params);
  
  return new Promise((resolve) => {
    setTimeout(() => {
      const config = mockDataConfig[apiEndpoint];
      if (!config) {
        resolve({ 
          data: { 
            data: [],
            totalItemNum: 0
          } 
        });
        return;
      }

      let responseData;
      
      switch(config.type) {
        case 'list':
        case 'followed': {
          const listData = generateListData(config, params);
          responseData = {
            data: listData,
            totalItemNum: 100,
            currentPage: params.currentPage || 1,
            totalPages: Math.ceil(100 / (params.pageSize || 10)),
            pageSize: params.pageSize || 10
          };
          break;
        }
          
        case 'realtime': {
  const realtimeData = generateListData(config, { ...params, pageSize: 1, currentPage: 1 }); // 强制只生成一条数据
  const safeRealtimeData = Array.isArray(realtimeData) ? realtimeData : [];
  if (config.dataType === 'board') {
    const sectorName = params.boardID ? `${params.boardID}板块` : '默认板块';
    responseData = {
      sector_id: params.boardID,
      sector_name: sectorName,
      real_data: safeRealtimeData
    };
  }
  break;
}
          
        case 'kline_detail': {
          const klineData = generateDetailKlineData(config.period, 30);
          responseData = {
            symbol: params.boardID,
            data: [{
              [`${config.period}_data`]: klineData
            }]
          };
          break;
        }
          
        case 'message_detail': {
          const messageData = generateMessageData(30);
          responseData = {
            symbol: params.boardID,
            data: [messageData]
          };
          break;
        }
          
        default: {
          responseData = { 
            data: [],
            totalItemNum: 0
          };
        }
      }

      resolve({ 
        data: responseData,
        status: 200 
      });
    }, 300);
  });
}

export function fetchFollowedList(searchParams, apiEndpoint) {
  console.log('📡 模拟API调用 - fetchFollowedList:', apiEndpoint, searchParams);
  
  // 将 URLSearchParams 转换为普通对象
  const params = {};
  for (const [key, value] of searchParams.entries()) {
    params[key] = value;
  }
  
  return fetchList(params, apiEndpoint);
}

export function date(apiEndpoint) {
  console.log('📡 模拟API调用 - date:', apiEndpoint);
  
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        data: {
          date: new Date().toLocaleDateString('zh-CN')
        }
      });
    }, 200);
  });
}