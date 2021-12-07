# 项目架构核心说明

## 一、应用入口
框架通过调用 runApp 创建渲染整个应用，在创建应用时可以传入应用的全局配置，通过 src/app.ts 对应用进行全局配置，设置路由、运行环境、请求、日志等

```js
import { runApp } from 'ice';

const appConfig = {
  app: {
    // 可选，默认 ice-container，根节点 id
    rootId: 'ice-container',

    // 可选，根节点 DOM 元素，更灵活的 rootId
    mountNode: document.getElementById('ice-container'),

    // 可选，默认 true，是否解析路由组件的查询参数
    parseSearchParams: true,

    // 可选，默认 false，是否开启 React.StrictMode，icejs 2.0 开始支持
    strict: false,

    // 可选，自定义添加 Provider
    addProvider: ({ children }) => {
      return <ConfigProvider>{children}</ConfigProvider>;
    },

    // 可选，常用于 SSR 场景或者初始化异步获取数据的场景
    // 如果返回字段中包含 initialStates 字段将会作为状态管理 store 的初始值
    // 如果返回字段中包含 auth 字段将会作为权限管理 auth 的初始值
    getInitialData: async() => {
      const result = await request();
      return result;
    },

    // 可选，自定义错误边界的 fallback UI
    ErrorBoundaryFallback: <div>渲染错误</div>,

    // 可选，自定义错误的处理事件
    onErrorBoundaryHandler: (error, componentStack) => {
      // Do something with the error
    },

    // 可选，SPA 场景下渲染一个简单组件，不再引入 react-router 的路由系统
    // 需要配合设置 build.json 的 router 项为 false
    renderComponent: SimpleComponent,
  },
};

runApp(appConfig);
```

## 二、工程配置

### 命令行介绍

start/build 两个核心命令

start

```bash
$ icejs start --help

Usage: icejs start [options]

Options:
  -p, --port <port>      服务端口号
  -h, --host <host>      服务主机名
  --config <config>      指定配置文件
  --https                支持开启 https
  --analyzer             支持开启构建分析
  --analyzer-port <port> 支持定制构建分析端口
  --disable-reload       禁用热更新模块
  --disable-mock         禁用 mock 服务
  --disable-open         禁止浏览器默认打开行为
  --disable-assets       禁止 Webpack assets 的输出
```

build

```bash
$ icejs build --help

Usage: icejs build [options]

Options:
  --analyzer             同 start
  --analyzer-port <port> 同 start
  --config <config>      同 start
```

### 工程构建配置

工程构建相关的配置默认都收敛在项目根目录的 build.json  文件中，配置方式：

```json
{
  "alias": {},
  "publicPath": ""
}
```

### 进阶配置

根据环境区分工程配置（下详细介绍）

## 三、路由配置

icejs 推荐使用 ```配置式路由``` 进行应用的路由管理，如果希望使用文件约定路由可参考 [文档](https://ice.work/docs/guide/advanced/convention-routing/)

### 配置路由信息

应用的路由信息统一在 src/routes.ts 中配置，配置协议支持多级嵌套，具体如下：

```js
import UserLayout from '@/Layouts/UserLayout';
import UserLogin from '@/pages/UserLogin';
import NotFound from '@/components/NotFound';
import wrapperPage from '@/components/WrapperPage';

const routerConfig = [
  // 分组路由，children 里的路由会将父节点的 component 作为布局组件
  {
    path: '/user',
    component: UserLayout,
    children: [
      {
        // 路由路径
        path: '/login',
        // 精确匹配
        exact: true,
        // 路由组件
        component: UserLogin,
        // 配置路由的高阶组件
        wrappers: [wrapperPage],
        // 扩展配置：icejs 1.x 仅支持将 pageConfig 配置在对应的页面组件上，具体请参考「页面组件」章节
        pageConfig: {
          title: '登录页面',
          scrollToTop: true,
          // ...
        },
      },
      {
        path: '/',
        // 重定向
        redirect: '/user/login',
      },
      {
        // 404 没有匹配到的路由
        component: NotFound,
      },
    ],
  },
  // 非分组路由
  {
    path: '/about',
    component: About,
  },
];

export default routerConfig;
```

### 运行时配置

在 ```src/app.ts``` 中，我们可以配置路由的类型和基础路径等信息，具体配置如下：

```js
import { runApp } from 'ice';

const appConfig = {
  router: {
    type: 'browser',                    // type: 路由类型，默认值 hash，可选值 browser|hash|static
    basename: '/seller',                // basename: 路由基准地址
    fallback: <div>loading...</div>     // fallback: 开启按需加载时配置 fallback UI
    modifyRoutes: (routes) => {         // modifyRoutes: 动态修改路由
      return routes;
    }
  }
};

runApp(appConfig);
```

### 路由组件参数

对于路由组件（即页面级组件），可通过组件 ```props``` 获取到如下属性：

```location```：当前路由的 ```location``` 对象，包含 ```pathname```、```search```、```hash```、```state``` 属性
```history```：详见 [history api](https://ice.work/docs/api/about#history)
```searchParams```：当前 ```URL``` 的查询参数对象（需要开启 [parseSearchParams](https://ice.work/docs/guide/basic/app#%E5%90%AF%E5%8A%A8%E9%A1%B9%E9%85%8D%E7%BD%AE)）
```match```：当前路由和 ```URL match``` 后的对象，包含 ```path```、```url```、```params```、```isExact``` 属性
对于非路由组件，组件内如想获取上述属性需要借助 ```useHistory```, ```useLocation```, ```useParams```, ```withRouter``` 等 [API](https://ice.work/docs/api/about/)。

### 路由跳转
通常使用 ```Link``` 组件或者 ```history API``` 进行路由的跳转：

```js
import { Link, useHistory } from 'ice';

function Home() {
  const history = useHistory();
  return (
    <>
      <Link to="/about">去 about 页面</Link>
      <span
        onClick={() => {
          history.push('/about');
        }}
      >
        去 about 页面
      </span>
    </>
  );
}
```
路由跳转传递参数，除了通过 ```url params``` 如 ```/projects/:id``` 以及 ```url query``` 如 ```/project?id=1``` 以外，也可通过 ```state``` 参数：

注意：```state``` 传递参数仅支持 ```BrowserHistory``` 不支持 ```HashHistory```，通过 ```src/app.ts``` 里的 ```router.type``` 字段可配置。

## 三、页面路由组件

## 四、样式方案

## 五、数据请求

## 六、状态管理

## 七、日志打印

## 八、环境配置