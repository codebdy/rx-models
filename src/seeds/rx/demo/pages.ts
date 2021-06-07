import drawerList from './drawerStyleModule/drawerList';
import jumpEdit from './jumpStyleModule/jumpEdit';
import jumpList from './jumpStyleModule/jumpList';
import { OneToManyPortletView } from './oneToManyPortlet/view';
import { OneToManyTableView } from './oneToManyTable/view';
import popEdit from './popStyleModule/popEdit';
import popList from './popStyleModule/popList';
import { splitSubmitSchema } from './splitSubmit/splitSubmitSchema';

const demoPages = [
  {
    name: '独立提交',
    schema: splitSubmitSchema,
  },
  {
    name: '1对多面板',
    schema: OneToManyPortletView,
  },
  {
    name: '1对多表格',
    schema: OneToManyTableView,
  },
  {
    name: '文章列表',
    schema: jumpList,
  },
  {
    name: '文章编辑',
    query: 'post',
    schema: jumpEdit,
  },
  {
    name: '用户列表',
    schema: popList,
  },
  {
    name: '用户编辑',
    maxWidth: 'sm',
    schema: popEdit,
  },

  {
    name: '侧滑式列表',
    schema: drawerList,
  },
  {
    name: '用户编辑',
    width: '400',
    schema: popEdit,
  },
];

export default demoPages;
