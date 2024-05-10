export const routerLinks = (name: string, type?: string) => {
  const array: {
    [selector: string]: string;
  } = {
    Login: '/auth/login',
    ForgetPassword: '/forgot-password',
    VerifyForotPassword: '/verify-forgot-password',
    SetPassword: '/set-password',
    MyProfile: '/my-profile',
    Dashboard: '/dashboard',
    User: '/user',
    Setting: '/setting',
    Data: '/setting/data',
    DataType: '/setting/data/type',
    Post: '/setting/post',
    PostType: '/setting/post/type',
    Code: '/setting/code',
    Parameter: '/setting/parameter',
  }; // 💬 generate link to here

  const apis: {
    [selector: string]: string;
  } = {
    Auth: '/auth',
    CodeType: '/codes/types',
    Code: '/codes',
    UserRole: '/users/roles',
    User: '/users',
    Data: '/data',
    DataType: '/data/type',
    Post: '/posts',
    Parameter: '/parameter',
    PostType: '/posts/types',
  }; // 💬 generate api to here

  switch (type) {
    case 'api':
      return apis[name];
    default:
      return array[name];
  }
};
