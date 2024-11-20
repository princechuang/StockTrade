import {
  createRouter,
  createWebHistory,
  createWebHashHistory,
  RouteLocationNormalized,
  RouteRecordRaw,
} from "vue-router";
import { showToast } from "vant";
import { getUserInfoByToken } from "@/api/myApi";
import { isPro, portalHost, appId, agentId,apiHost } from "@/utils/configs";
import 'vant/es/toast/style';
import { json } from "stream/consumers";

const App = () => import("@/App.vue");

const routes: Array<RouteRecordRaw> = [
  {
    path: "/",
    redirect: "/index",
  },
  {
    path: "/index",
    name: "Index",
    meta: { title: "首页" },
    component: () => import("@/views/index.vue"),
  },
  {
    path: "/pool-list",
    name: "poolList",
    meta: { title: "所有锦囊" },
    component: () => import("@/views/stock-pool-list.vue"),
    // component: () =>jinNangList,
  },
  {
    path:'/open',
    name:"openJinNang",
    meta:{title:"锦囊详情"},
    component:()=>import("@/views/stock-pool-detail.vue")
  },
  {
    path:'/my-follow',
    name:"myFollow",
    meta:{title:"我的关注"},
    component:()=>import("@/views/my-follow-list.vue")
  },
  {
    path:'/login',
    name:"login",
    meta:{title:"登录"},
    component:()=>import("@/views/login.vue")
  },
  {
    path:'/trade',
    name:"trde",
    meta:{title:"交易记录"},
    component:()=>import("@/views/stock-trade.vue")
  }
];
const router = createRouter({
  history: createWebHistory(),
  routes,
});

const setTitle = function (to: RouteLocationNormalized) {
  window.document.title = to.meta.title as string;
};

router.beforeEach((to, from, next) => {
  setTitle(to);
  if (isPro) {
    const hostName = portalHost;
    const fullPath = to.fullPath;
    const userId = sessionStorage.getItem("userId");
    if (userId && userId !== "" || to.path=="/login") {
      next();
      return;
    }
    if (to.query.token && to.query.token !== "") {
     const token=to.query.token;
     sessionStorage.setItem("token", token as string);
      //通过code获取登录用户的UserId
      
      getUserInfoByToken(token as string).then((res:any) => {
        console.log(res);
        //缓存用户信息
        sessionStorage.setItem("userId",res.data.detail.userId);
        sessionStorage.setItem("userInfo",JSON.stringify(res.data.detail));

        next();
      });
    } else {
      //跳转到未授权页面
      next({path:"/login"});
      return;
    }
  } else {
    next();
  }
});

export default router;
