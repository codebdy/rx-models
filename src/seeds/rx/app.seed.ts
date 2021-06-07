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

const RxAppSeed = [
  {
    id: 'guid-1',
    name: '用户管理',
    icon: 'mdi-account-supervisor',
    color: '#a1887f',
    app_type: '系统',
    is_system: true,
    pages: userPages as any,
    navigation_items: userDrawerData as any,
    entry_page_id: 'guid-p-u-1',
    auths: [
      {
        id: 'guid-11',
        rx_slug: AUTH_APP,
        name: 'App访问',
        predefined: true,
      },
    ],
  },
  {
    id: 'guid-2',
    name: '功能演示',
    icon: 'mdi-leaf',
    color: '#8bc34a',
    app_type: '免费',
    pages: demoPages as any,
    navigation_items: demoDrawerData as any,
    entry_page_id: 'guid-p-1',
    auths: [
      {
        id: 'guid-21',
        rx_slug: AUTH_APP,
        name: 'App访问',
        predefined: true,
      },
      {
        id: 'guid-22',
        rx_slug: 'compute',
        name: '计算',
      },
      {
        id: 'guid-23',
        rx_slug: 'one-to-many',
        name: '1对多',
      },
      {
        id: 'guid-24',
        rx_slug: 'auth1',
        name: '权限1',
      },
      {
        id: 'guid-25',
        rx_slug: 'auth2',
        name: '权限2',
      },
      {
        id: 'guid-26',
        rx_slug: 'auth3',
        name: '权限3',
      },
    ],
    notifications: 8,
  },
  {
    id: 'guid-3',
    name: '外贸网站CMS',
    icon: 'mdi-web',
    color: '#ff9100',
    app_type: '免费',
    pages: cmsPages as any,
    navigation_items: cmsDrawerData as any,
    entry_page_id: 'guid-p-cms-1',
    auths: [
      {
        id: 'guid-31',
        rx_slug: AUTH_APP,
        name: 'App访问',
        predefined: true,
      },
    ],
  },
  {
    id: 'guid-4',
    name: '外贸ERP',
    icon: 'mdi-card-account-mail',
    color: '#5d78ff',
    app_type: '免费',
    pages: erpPages as any,
    navigation_items: erpDrawerData as any,
    auths: [
      {
        id: 'guid-41',
        rx_slug: AUTH_APP,
        name: 'App访问',
        predefined: true,
      },
    ],
    notifications: 7,
  },
  {
    id: 'guid-5',
    name: '商城',
    icon: 'mdi-basket',
    color: '#ba68c8',
    app_type: '商业',
    pages: shopPages as any,
    navigation_items: shopDrawerData as any,
    auths: [
      {
        id: 'guid-51',
        rx_slug: AUTH_APP,
        name: 'App访问',
        predefined: true,
      },
    ],
  },
];

export default RxAppSeed;
