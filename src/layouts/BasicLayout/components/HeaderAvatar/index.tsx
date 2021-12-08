import * as React from 'react';
import { getInitialData, useHistory, getSearchParams, useAuth } from 'ice';
import { Avatar, Overlay, Menu, Icon } from '@alifd/next';
import { stringify } from 'querystring';
// import store from '@/store';
import styles from './index.module.css';

const { Item } = Menu;
const { Popup } = Overlay;

export interface Props {
  name: string;
  avatar: string;
  mail: string;
}

const UserProfile = ({ name, avatar }) => {
  return (
    <div className={styles.profile}>
      <div className={styles.avatar}>
        <Avatar src={avatar} alt="用户头像" />
      </div>
      <div className={styles.content}>
        <h4>{name}</h4>
      </div>
    </div>
  );
};

const HeaderAvatar = (props: Props) => {
  // const [userState] = store.useModel('user'); // TODO暂时注释用户信息从store获取的方式
  const { auth } = getInitialData();
  const [_, setAuth] = useAuth();
  const history = useHistory();
  /**
   * 退出登录，并且将当前的 url 保存
   */
  const loginOut = async () => {
    // await outLogin();  // TODO: 后期改为后台登出接口
    const searchParams = getSearchParams?.()  as { redirect: string };
    // Note: There may be security issues, please note
    if (history.location.pathname !== '/user/login' && !searchParams?.redirect) {
      localStorage.setItem('TOKEN', '');
      history.replace({
        pathname: '/user/login',
        search: stringify({
          redirect: history.location.pathname,
        }),
      });
    }
  };
  const onItemClick = (key: String, item: Object, event: Object) => {
    if (key === 'exit') {
      setAuth({
        isLogin: false,
        currentUser: {},
      });
      loginOut();
      return;
    }
  }
  return (
    <Popup
      trigger={
        <div className={styles.headerAvatar}>
          <Avatar size="small" src={auth?.currentUser?.avatar} alt="用户头像" />
          <span style={{ marginLeft: 10 }}>{auth?.currentUser?.name}</span>
        </div>
      }
      triggerType="click"
    >
      <div className={styles.avatarPopup}>
        <UserProfile {...auth?.currentUser} />
        <Menu className={styles.menu} onItemClick={onItemClick}>
          {/* <Item><Icon size="small" type="account" />个人设置</Item>
          <Item><Icon size="small" type="set" />系统设置</Item> */}
          <Item key='exit'><Icon size="small" type="exit" />退出登录</Item>
        </Menu>
      </div>
    </Popup>
  );
};

HeaderAvatar.defaultProps = {
  name: 'MyName',
  mail: 'name@gmail.com',
  avatar: 'https://img.alicdn.com/tfs/TB1.ZBecq67gK0jSZFHXXa9jVXa-904-826.png',
};

export default HeaderAvatar;
