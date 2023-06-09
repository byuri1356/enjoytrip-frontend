import Vue from 'vue'
import VueRouter from 'vue-router'
import HomeView from '../views/HomeView.vue'
import VueCarousel from 'vue-carousel';

import store from "@/store"

Vue.use(VueRouter)
Vue.use(VueCarousel)

const onlyAuthUser = async (to, from, next) => {
  let isLogin = store.getters["userStore/getLoginState"];
  
  if(isLogin){
    await store.dispatch("userStore/userAuthCheck");
    isLogin = store.getters["userStore/getLoginState"];
    if(isLogin){
      next();
    }
    else{
      if(router.currentRoute.fullPath != '/user/signin'){
        router.push({ name: "SignIn" });
      }
    }
  }
  else{
    if(router.currentRoute.fullPath != '/user/signin'){
      router.push({ name: "SignIn" });
    }
  }
};

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView
  },
  {
    path: '/user',
    name: 'user',
    component: () => import('@/views/AppUser'),
    children: [
      {
        path: 'signin',
        name: 'SignIn',
        component: () => import('@/components/user/SignIn')
      },
      {
        path: 'signup',
        name: 'SignUp',
        component: () => import('@/components/user/SignUp')
      },
      {
        path: 'findpwd',
        name: 'FindPwd',
        component: () => import('@/components/user/FindPwd')
      },
      {
        path: 'mypage',
        name: 'MyPage',
        component: () => import('@/components/user/MyPage')
      },
      {
        path: 'withdraw',
        name: 'SignWithdraw',
        component: () => import('@/components/user/SignWithdraw')
      },
    ]
  },
  {
    path: '/region',
    name: 'Region',
    component: () => import('@/views/AppRegion'),
    children: [
      {
        path: 'search',
        name: 'RegionSearch',
        // beforeEnter: onlyAuthUser,
        component: () => import('@/components/region/RegionSearch')
      },
      {
        path: 'hotplace',
        name: 'HotPlace',
        component: () => import('@/components/region/HotPlace')
      },
      {
        path: 'tripplan',
        name: 'TripPlan',
        beforeEnter: onlyAuthUser,
        component:() => import('@/components/region/TripPlan')
      },
      {
        path: 'result',
        name: 'SearchResult',
        component: () => import('@/components/region/SearchResult')
      }
      // { // 추후 삭제
      //   path: 'mapTest',
      //   name: 'MapTest',
      //   component: () => import('@/components/region/MapTest')
      // }
    ]
  },
  {
    path: '/board',
    name: 'Board',
    component: () => import('@/views/AppBoard'),
    redirect: '/board/list',
    children: [
      {
        path: 'list',
        name: 'BoardList',
        component: () => import('@/components/board/BoardList')
      },
      {
        path: 'write',
        name: 'BoardWrite',
        beforeEnter: onlyAuthUser,
        component: () => import('@/components/board/BoardWrite')
      },
      {
        path: 'view/:boardNo',
        name: 'BoardView',
        component: () => import('@/components/board/BoardView')
      },
      {
        path: 'modify',
        name: 'BoardModify',
        beforeEnter: onlyAuthUser,
        component: () => import('@/components/board/BoardModify')
      }
    ]
  },
  {
    path: '/plan',
    name: 'Plan',
    component: () => import('@/views/AppPlan'),
    redirect: '/plan/list',
    children:[
      {
        path: 'list',
        name: 'PlanList',
        beforeEnter: onlyAuthUser,
        component: () => import('@/components/plan/PlanList')
      }
    ]
  },
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
