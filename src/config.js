/**
 * author: liu.yang
 * date: 2018-09-16 13:59:42
 * 放一些配置数据
 */

const config = {
  type: 'xxx',
  storagePrefix: '__mobiledemo__', // storage数据前缀
  errCode: 0, // 后端业务正常返回码
  errRedirectURL: '/view/login', // 约定当后端返回码为-1的时候跳转到此页面
};

export default config;
