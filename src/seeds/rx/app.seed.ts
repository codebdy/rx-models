import { AUTH_APP } from './authSlugs';
import { cmsDrawerData } from './cms/drawerData';
import cmsPages from './cms/pages';
import { demoDrawerData } from './demo/drawerData';
import demoPages from './demo/pages';
import { erpDrawerData } from './erp/drawerData';
import erpPages from './erp/pages';
import { shopDrawerData } from './shop/drawerData';
import shopPages from './shop/pages';
import { userDrawerData } from './user/drawerData';
import userPages from './user/pages';

const rxAppSeed = [
  {
    name: '用户管理',
    icon: 'mdi-account-supervisor',
    color: '#a1887f',
    appType: '系统',
    isSystem: true,
    pages: userPages,
    navigationItems: userDrawerData,
    auths: [
      {
        rxSlug: AUTH_APP,
        name: 'App访问',
        predefined: true,
      },
    ],
  },
  {
    name: '功能演示',
    icon: 'mdi-leaf',
    color: '#8bc34a',
    appType: '免费',
    pages: demoPages,
    navigationItems: demoDrawerData,
    auths: [
      {
        rxSlug: AUTH_APP,
        name: 'App访问',
        predefined: true,
      },
      {
        rxSlug: 'compute',
        name: '计算',
      },
      {
        rxSlug: 'one-to-many',
        name: '1对多',
      },
      {
        rxSlug: 'auth1',
        name: '权限1',
      },
      {
        rxSlug: 'auth2',
        name: '权限2',
      },
      {
        rxSlug: 'auth3',
        name: '权限3',
      },
    ],
  },
  {
    name: '外贸网站CMS',
    icon: 'mdi-web',
    color: '#ff9100',
    appType: '免费',
    pages: cmsPages,
    navigationItems: cmsDrawerData,
    auths: [
      {
        rxSlug: AUTH_APP,
        name: 'App访问',
        predefined: true,
      },
    ],
  },
  {
    name: '外贸ERP',
    icon: 'mdi-card-account-mail',
    color: '#5d78ff',
    appType: '免费',
    pages: erpPages,
    navigationItems: erpDrawerData,
    auths: [
      {
        rxSlug: AUTH_APP,
        name: 'App访问',
        predefined: true,
      },
    ],
  },
  {
    name: '商城',
    icon: 'mdi-basket',
    color: '#ba68c8',
    appType: '商业',
    pages: shopPages,
    navigationItems: shopDrawerData,
    auths: [
      {
        rxSlug: AUTH_APP,
        name: 'App访问',
        predefined: true,
      },
    ],
  },
];

export default rxAppSeed;
