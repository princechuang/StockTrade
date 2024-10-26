import {
  createRouter,
  createWebHistory,
  RouteLocationNormalized,
  RouteRecordRaw,
} from "vue-router";
import { showToast } from "vant";
import { getWxUserInfo } from "@/api/myApi";
import { isPro, portalHost, appId, agentId } from "@/utils/configs";

const App = () => import("@/App.vue");

const routes: Array<RouteRecordRaw> = [
  {
    path: "/",
    redirect: "/index",
  },
  {
    path: "/index",
    name: "index",
    meta: { title: "首页" },
    component: () => import("@/views/index.vue"),
  },
];
const router = createRouter({
  history: createWebHistory(),
  routes,
});

const setTitle = function (to: RouteLocationNormalized, title: string) {
  window.document.title = to.meta.title as string;
};

router.beforeEach((to, from, next) => {
  if (isPro) {
    const hostName = portalHost;
    const fullPath = to.fullPath;
    const userId = sessionStorage.getItem("userId");
    if (userId && userId !== "") {
      next();
      return;
    }
    if (to.query.code && to.query.code !== "") {
      const code = to.query.code.toString();
      //通过code获取登录用户的UserId
      getWxUserInfo(code).then((res) => {
        if (res.ID && res.UserToken) {
          sessionStorage.setItem("userId", res.ID);
          sessionStorage.setItem("token", res.UserToken);
          sessionStorage.setItem("userInfo", JSON.stringify(res));
          next();
        } else {
          showToast("微信授权登录失败！");
        }
      });
    } else {
      const redirectUrl = `https://open.weixin.qq.com/connect/oauth2/authorize?appid=${appId}&redirect_uri=${decodeURI(
        hostName + fullPath
      )}&response_type=code&scope=snsapi_base&state=&agentid=${agentId}#wechat_redirect`;
      window.location.href = redirectUrl;
    }
  } else {
    next();
  }
});

export default router;
