import { runApp, IAppConfig, config as iceConfig } from 'ice';
import { Message } from '@alifd/next';
import { getUserAPI } from '@/services/user';

const appConfig: IAppConfig = {
  app: {
    rootId: 'app-root-container',
    getInitialData: async () => {
      // 模拟服务端返回的数据
      // const data = await request('/api/auth');
      // const { role, starPermission, followPermission } = data;

      // 约定权限必须返回一个 auth 对象
      // 返回的每个值对应一条权限
      const isLogin = localStorage.getItem('TOKEN');
      let currentUser = {};
      if (isLogin) {
        const res = await getUserAPI();
        if (res.code === 0) {
          currentUser = {
            name: res.data?.accountName ?? '-',
            department: '',
            avatar: 'https://gw.alipayobjects.com/zos/antfincdn/XAosXuNZyF/BiazfanxmamNRoxxVxka.png',
            userId: res.data?.userId ?? '-',
          };
        }
      }
      return {
        auth: {
          isLogin,
          currentUser,
        },
      };
    },

  },
  router: {
    type: 'browser',
  },
  request: {
    // 可选的，全局设置 request 是否返回 response 对象，默认为 false
    withFullResponse: false,

    baseURL: iceConfig.baseURL,
    headers: {
      'Content-Type': 'application/json',
      
    },
    // ...RequestConfig 其他参数

    // 拦截器
    interceptors: {
      request: {
        onConfig: (config) => {
          // 发送请求前：可以对 RequestConfig 做一些统一处理
          config.headers = {
            loginType: iceConfig.appId,
            Authorization: localStorage.getItem('TOKEN') ?? '',
          };
          return config;
        },
        onError: (error) => {
          return Promise.reject(error);
        },
      },
      response: {
        onConfig: (response) => {
          // 请求成功：可以做全局的 toast 展示，或者对 response 做一些格式化
          if (response?.data?.code !== 0) {
            Message.error(`${response?.data?.message} #${response?.data?.code}`);
          }
          return response;
        },
        onError: (error) => {
          return Promise.reject(error);
        },
      },
    },
  },
};

runApp(appConfig);
