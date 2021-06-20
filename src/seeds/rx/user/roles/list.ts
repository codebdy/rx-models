import {
  BATCH_REMOVE_LIST_VIEW_RECORDS,
  OPEN_PAGE_ACTION,
  REMOVE_LIST_VIEW_RECORD,
} from '../../ACTIONs';

export default {
  name: 'ListView',
  withNode: true,
  props: {
    variant: 'outlined',
    query: '',
  },
  children: [
    {
      name: 'ListViewToolbar',
      children: [
        {
          name: 'ListViewFilters',
          children: [
            {
              name: 'ListViewKeywordFilter',
              props: {
                size: 'small',
              },
            },
            {
              name: 'ListViewEnumFilter',
              props: {
                marginLeft: 2,
                size: 'small',
                label: '状态',
                width: '120px',
                field: 'status',
                metas: [
                  {
                    value: 'normal',
                    name: '正常',
                  },
                  {
                    value: 'forbid',
                    name: '禁用',
                  },
                ],
              },
            },
          ],
        },

        {
          name: 'ListViewBatchActions',
          children: [
            {
              name: 'Button',
              props: {
                rxText: '删除',
                //size:'small',
                variant: 'contained',
                startIcon: 'mdi-delete',
                color: 'secondary',
                onClick: {
                  name: BATCH_REMOVE_LIST_VIEW_RECORDS,
                  confirmMessage: '删除后将不可恢复，您确定要删除吗？',
                },
              },
            },
          ],
        },
      ],
    },
    {
      name: 'ListViewBody',
      withNode: true,
      children: [
        {
          name: 'TableColumn',
          props: {
            label: '名称',
            field: 'name',
            searchable: true,
            sortable: true,
          },

          children: [
            {
              name: 'TextView',
              field: 'name',
            },
          ],
        },
        {
          name: 'TableColumn',
          props: {
            label: '描述',
          },

          children: [
            {
              name: 'TextView',
              field: 'description',
            },
          ],
        },
        {
          name: 'TableColumn',
          props: {
            label: '状态',
          },
          children: [
            {
              name: 'EnumView',
              field: 'status',
              props: {
                metas: [
                  {
                    value: 'NORMAL',
                    color: 'default',
                    name: '正常',
                  },
                  {
                    value: 'FORBID',
                    color: 'secondary',
                    name: '禁用',
                  },
                ],
              },
            },
          ],
        },
        {
          name: 'TableColumn',
          props: {
            label: '',
            align: 'right',
          },
          children: [
            {
              name: 'IconButton',
              props: {
                icon: 'mdi-pencil',
                tooltip: '编辑',
                onClick: {
                  name: OPEN_PAGE_ACTION,
                  pageJumper: { openStyle: 'POPUP', pageId: 'guid-p-u-4' },
                },
              },
            },
            {
              name: 'IconButton',
              props: {
                icon: 'mdi-delete',
                tooltip: '删除',
                onClick: {
                  name: REMOVE_LIST_VIEW_RECORD,
                  confirmMessage: '删除后将不可恢复，确定要删除吗？',
                },
              },
            },
          ],
        },
      ],
    },
    {
      name: 'ListViewPagination',
      props: {
        rowsPerPageOptions: '5, 10, 25, 50, 100',
      },
    },
  ],
};
