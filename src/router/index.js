import Vue from 'vue'
import VueRouter from 'vue-router'
// import HomeView from '../views/HomeView.vue' // 同步导入

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    redirect: '/api/concept',
  },
  // {
  //   path: '/api/board_concept_list',
  //   name: 'board_concept_list',
  //   route:'/api/board_concept_list',
  //   component: () => import('@/views/boardConcept.vue')  // 异步导入
  // },
  // {
  //   path: '/api/board_industry_list',
  //   name: 'board_industry_list',
  //   route:'/api/board_industry_list',
  //   component: () => import('@/views/boardIndustry.vue')
  // },
  // {
  //   path: '/api/board_concept_detail',
  //   name: 'board_concept_detail',
  //   route:'/api/board_concept_detail',
  //   component: () => import('@/views/boardConceptDetail.vue')
  // },
  // {
  //   path: '/api/board_industry_detail',
  //   name: 'board_industry_detail',
  //   route:'/api/board_industry_detail',
  //   component: () => import('@/views/boardIndustryDetail.vue')
  // },
  {
    path: '/api/board_cons_detail',
    name: 'board_cons_detail',
    route:'/api/board_cons_detail',
    component: () => import('@/views/stockDetail.vue')
  },
  {
    path: '/api/stock/:type',
    name: 'stock_list',
    // route:'/api/stock_list',
    component: () => import('@/views/stockList.vue'),
    props: true, 
  },
  // {
  //   path: '/api/stock_followed',
  //   name: 'stock_followed',
  //   route:'/api/stock_followed',
  //   component: () => import('@/views/stockFollowed.vue')
  // },

  // {
  //   path: '/api/board_concept_followed',
  //   name: 'board_concept_followed',
  //   route:'/api/board_concept_followed',
  //   component: () => import('@/views/boardConceptFollowed.vue')
  // },
  // {
  //   path: '/api/board_industry_followed',
  //   name: 'board_industry_followed',
  //   route:'/api/board_industry_followed',
  //   component: () => import('@/views/boardIndustryFollowed.vue')
  // },
  {
    path: '/api/:sectorType',
    name: 'Sector',
    component: () => import('@/views/SectorList.vue'), // 异步导入
    props: true, 
  },
  {
    path: '/api/cons/:sectorType',
    component: () => import('@/views/SectorCons.vue'),
    props: true, 
  },
  {
    path: '/api/sector_detail/:sectorType',
    component: () => import('@/views/SectorDetail.vue'),
    props: true, 
  },
]

// const router = new VueRouter({
//   // history: createWebHistory(),
//   history: createWebHashHistory(),
//   routes,

// })
const router = new VueRouter({
  mode: 'hash', // 或者 'history'
  base: process.env.BASE_URL,
  routes
})
// 
// new Vue({
//   router, // 注入到Vue实例中
//   render: h => h(App)
// }).$mount('#app')
// 

export default router
