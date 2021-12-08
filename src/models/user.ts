import { IRootState, IRootDispatch } from '@/store';
import { getUserAPI } from '@/services/user';

interface IType {
  name: string;
  department: string;
  avatar: string;
  userid: number | null;
}

export default {
  state: {
    name: '',
    department: '',
    avatar: '',
    userId: '',
  },

  effects: (dispatch: IRootDispatch) => ({
    async fetchUserProfile() {
      const res = await getUserAPI();
      if (res.code === 0) {
        dispatch.user.update({
          name: res.data?.accountName ?? '-',
          department: '',
          avatar: 'https://gw.alipayobjects.com/zos/antfincdn/XAosXuNZyF/BiazfanxmamNRoxxVxka.png',
          userId: res.data?.userId ?? '-',
        });
      }
    },
    // 官方demo
    // async like(payload: object, rootState: IRootState) {
    //   dispatch.project.foo(payload); // 调用其他 model 的 effects/reducers
    //   rootState.project.title;       // 获取其他 model 的 state
    // },
  }),

  reducers: {
    update(prevState: IType, payload: IType) {
      return { ...prevState, ...payload };
    },
  },
};
