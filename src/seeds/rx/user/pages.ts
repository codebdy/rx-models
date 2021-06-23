import autList from './auths/autList';
import roleEdit from './roles/roleEdit';
import roleList from './roles/roleList';
import userEdit from './users/userEdit';
import userList from './users/userList';

const userPages = [
  {
    name: '用户列表',
    schema: userList,
  },
  {
    name: '用户编辑',
    maxWidth: 'sm',
    query: '{"model @getOne":"RxUser", "roles":{}, "avatar":{}}',
    schema: userEdit,
  },
  {
    name: '角色列表',
    schema: roleList,
  },
  {
    name: '角色编辑',
    query: 'rxRole',
    maxWidth: 'sm',
    schema: roleEdit,
  },
  {
    name: '系统权限列表',
    schema: autList,
  },
];

export default userPages;
