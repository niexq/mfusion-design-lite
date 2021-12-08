declare module '*.module.scss' {
  const classes: { [key: string]: string };
  export default classes;
}

declare module '*.module.less' {
  const classes: { [key: string]: string };
  export default classes;
}

declare module '*.module.css' {
  const classes: { [key: string]: string };
  export default classes;
}

declare namespace API {
  type IResponse = {
    code?: string | number;
    message?: string;
    data?: string;
  };
  type ILoginParams = {
    username?: string;
    password?: string;
    autoLogin?: boolean;
    type?: string;
    phone?: string;
    code?: string;
  };

  type ILoginResult = {
    status?: string;
    type?: string;
    currentAuthority?: string;
  };

  type IUserResult = {
    accountName?: string;
    userId?: string;
    avatar?: string;
  };
}

declare namespace AUTH {
  type ICurrentUser = {
    name?: string,
    department?: string,
    avatar?: string,
    userId?: string,
  };
  type IAuthData = {
    isLogin?: boolean;
    currentUser?: ICurrentUser;
  };
  type IInitialData = {
    auto: IAuthData;
  };
}
