import React, { useState } from 'react';
import { Input, Message, Form, Divider, Checkbox, Icon } from '@alifd/next';
import { history, getSearchParams, useAuth } from 'ice';
import { postLoginAPI } from '@/services/user';
import store from '@/store';
import { getUserAPI } from '@/services/user';
import { useInterval } from './utils';
import styles from './index.module.scss';

const { Item } = Form;

export interface IDataSource {
  name: string;
  password: string;
  autoLogin: boolean;
  phone: string;
  code: string;
}

const DEFAULT_DATA: IDataSource = {
  name: '',
  // eslint-disable-next-line @iceworks/best-practices/no-secret-info
  password: '',
  autoLogin: true,
  phone: '',
  code: '',
};

interface LoginProps {
  dataSource?: IDataSource;
}

const LoginBlock: React.FunctionComponent<LoginProps> = (
  props = { dataSource: DEFAULT_DATA },
): JSX.Element => {
  const [auth, setAuth] = useAuth();
  const { dataSource = DEFAULT_DATA } = props;
  const [userState, userDispatchers] = store.useModel('user');
  const [postData, setValue] = useState(dataSource);

  const [isRunning, checkRunning] = useState(false);
  const [isPhone, checkPhone] = useState(false);
  const [second, setSecond] = useState(59);

  useInterval(
    () => {
      setSecond(second - 1);
      if (second <= 0) {
        checkRunning(false);
        setSecond(59);
      }
    },
    isRunning ? 1000 : null,
  );

  const formChange = (values: IDataSource) => {
    setValue(values);
  };

  const sendCode = (values: IDataSource, errors: []) => {
    if (errors) {
      return;
    }
    // get values.phone
    checkRunning(true);
  };

  const handleSubmit = (values: IDataSource, errors: []) => {
    if (errors) {
      console.log('errors', errors);
      return;
    }
    console.log('values:', values);
    const body: API.ILoginParams = {};
    if (isPhone) {
      // {autoLogin: false, phone: '18657110319', code: '12334556'}
      body.phone = values.phone;
      body.code = values.code;
    } else {
      // {autoLogin: false, name: 'asdf', password: '222'}
      body.account = values.name;
      body.password = values.password;
    }
    body.autoLogin = values.autoLogin;
    postLoginAPI(body).then((res: API.IResponse) => {
      if (res?.code === 0) {
        Message.success('登录成功');
        localStorage.setItem('TOKEN', res?.data ?? '');
        // userDispatchers.fetchUserProfile(); // TODO暂时注释用户信息存store的方式
        setAuth({ isLogin: true });
        getUserAPI().then((res: API.IResponse) => {
          if (res.code === 0) {
            const dataRes: API.IUserResult = res.data as API.IUserResult;
            setTimeout(() => {
              setAuth({
                isLogin: true,
                currentUser: {
                  name: dataRes?.accountName ?? '-',
                  department: '',
                  avatar: 'https://gw.alipayobjects.com/zos/antfincdn/XAosXuNZyF/BiazfanxmamNRoxxVxka.png',
                  userId: dataRes?.userId ?? '-',
                }
              });
            }, 300)
          }
        })
         /** 此方法会跳转到 redirect 参数所在的位置 */
         if (!history) return;
         const searchParams = getSearchParams?.()  as { redirect: string };
         history.push(searchParams?.redirect ?? '/');
        return;
      }
    })
  };

  const phoneForm = (
    <>
      <Item format="tel" required requiredMessage="必填" asterisk={false}>
        <Input
          name="phone"
          innerBefore={
            <span className={styles.innerBeforeInput}>
              +86
              <span className={styles.line} />
            </span>
          }
          maxLength={20}
          placeholder="手机号"
        />
      </Item>
      <Item required requiredMessage="必填" style={{ marginBottom: 0 }}>
        <Input
          name="code"
          innerAfter={
            <span className={styles.innerAfterInput}>
              <span className={styles.line} />
              <Form.Submit
                text
                type="primary"
                style={{ width: 64 }}
                disabled={!!isRunning}
                validate={['phone']}
                onClick={sendCode}
                className={styles.sendCode}
              >
                {isRunning ? `${second}秒后再试` : '获取验证码'}
              </Form.Submit>
            </span>
          }
          maxLength={20}
          placeholder="验证码"
        />
      </Item>
    </>
  );

  const accountForm = (
    <>
      <Item required requiredMessage="必填">
        <Input name="name" maxLength={20} placeholder="用户名" />
      </Item>
      <Item required requiredMessage="必填" style={{ marginBottom: 0 }}>
        <Input.Password name="password" htmlType="password" placeholder="密码" />
      </Item>
    </>
  );

  const byAccount = () => {
    checkPhone(false);
  };

  const byForm = () => {
    checkPhone(true);
  };

  return (
    <div className={styles.LoginBlock}>
      <div className={styles.innerBlock}>
        <a href="#">
          <img
            className={styles.logo}
            src="https://img.alicdn.com/tfs/TB1KtN6mKH2gK0jSZJnXXaT1FXa-1014-200.png"
            alt="logo"
          />
        </a>
        <div className={styles.desc}>
          <span onClick={byAccount} className={isPhone ? undefined : styles.active}>
            账户密码登录
          </span>
          <Divider direction="ver" />
          <span onClick={byForm} className={isPhone ? styles.active : undefined}>
            手机号登录
          </span>
        </div>

        <Form value={postData} onChange={formChange} size="large">
          {isPhone ? phoneForm : accountForm}

          <div className={styles.infoLine}>
            <Item style={{ marginBottom: 0 }}>
              <Checkbox name="autoLogin" className={styles.infoLeft}>
                自动登录
              </Checkbox>
            </Item>
            <div>
              <a href="/" className={styles.link}>
                忘记密码
              </a>
            </div>
          </div>

          <Item style={{ marginBottom: 10 }}>
            <Form.Submit
              type="primary"
              htmlType="submit"
              onClick={handleSubmit}
              className={styles.submitBtn}
              validate
            >
              登录
            </Form.Submit>
          </Item>
          <div className={styles.infoLine}>
            <div className={styles.infoLeft}>
              其他登录方式 <Icon type="atm" size="small" /> <Icon type="atm" size="small" />{' '}
              <Icon type="atm" size="small" />
            </div>
            <a href="/" className={styles.link}>
              注册账号
            </a>
          </div>
        </Form>
      </div>
    </div>
  );
};

export default LoginBlock;
