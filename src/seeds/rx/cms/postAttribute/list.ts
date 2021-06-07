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
    query: 'postAttributes',
    remove: 'removePostAttributes',
    update: {
      name: 'updatePostAttributes',
      variableType: 'PostAttributeInput',
      variableName: 'postAttribut',
    },
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
            label: '时间',
            field: 'created_at',
            sortable: true,
          },
          children: [
            {
              name: 'DayView',
              field: 'created_at',
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
                  pageJumper: { openStyle: 'POPUP', pageId: 'guid-p-cms-11' },
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
                  confirmMessage: '删除后将不可恢复，您确定要删除吗？',
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
