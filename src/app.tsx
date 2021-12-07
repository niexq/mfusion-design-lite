import { runApp, IAppConfig } from 'ice';

const appConfig: IAppConfig = {
  app: {
    rootId: 'app-root-container',
  },
  router: {
    type: 'browser',
  }
};

runApp(appConfig);
