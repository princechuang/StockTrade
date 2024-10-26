import wx from 'weixin-js-sdk';
import type { App } from 'vue';

const plugin = {
  install(app: App): void {
    app.config.globalProperties.$wechat = wx;
    app.config.globalProperties.wechat = wx;
  },
};

export default plugin;
export const install = plugin.install;
