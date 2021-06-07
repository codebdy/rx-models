import { OPEN_PAGE_ACTION } from '../../ACTIONs';
import listView from './list';
export const postAttributeListSchema = [
  {
    name: 'GridRow',
    props: {
      justify: 'space-between',
      alignItems: 'center',
      spacing: 1,
      marginTop: 2,
    },
    children: [
      {
        name: 'GridColumn',
        props: {
          xs: 8,
          container: true,
          justify: 'space-between',
          alignItems: 'center',
        },
        children: [
          {
            name: 'GridColumn',
            children: [
              {
                name: 'h2',
                props: {
                  rxText: '附加属性列表',
                },
              },
            ],
          },
          {
            name: 'GridColumn',
            children: [
              {
                name: 'Button',
                props: {
                  variant: 'contained',
                  color: 'primary',
                  rxText: '新建',
                  //size: "large",
                  onClick: {
                    name: OPEN_PAGE_ACTION,
                    pageJumper: {
                      pageId: 'guid-p-cms-11',
                    },
                  },
                },
              },
            ],
          },
        ],
      },

      {
        name: 'GridColumn',
        props: {
          xs: 8,
        },
        children: [listView],
      },
    ],
  },
];
