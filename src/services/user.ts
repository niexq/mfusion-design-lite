import { request } from 'ice';

// 简单场景
export async function getUserAPI() {
  return await request('/api/user');
}

/** 登录接口 POST /api/login/account */
export async function postLoginAPI(body: API.ILoginParams) {
  return await request<API.IResponse>({
    url: '/api/login',
    method: 'post',
    data: body,
  });
}

// 参数场景
export async function getRepoAPI(id) {
  return await request(`/api/repo/${id}`);
}

// 格式化返回值
export async function getDetail(params) {
  const data = await request({
    url: `/api/detail`,
    params
  });

  return data.map(item => {
    return {
      ...item,
      price: item.oldPrice,
      text: item.status === '1' ? '确定' : '取消'
    };
  });
}