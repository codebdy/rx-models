const erpPages = [
  {
    name: '订单列表',
    //schema:userList,
  },
  {
    name: '订单编辑',
    maxWidth: 'sm',
    query: 'rxUser',
    //schema:userEdit,
  },
  {
    name: '客户列表',
    //schema:roleList,
  },
  {
    name: '客户编辑',
    query: 'rxRole',
    maxWidth: 'sm',
    //schema:roleEdit,
  },
  {
    name: '邮件管理',
    //schema:autList,
  },
];

export default erpPages;
