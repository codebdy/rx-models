import {
  BATCH_REMOVE_LIST_VIEW_RECORDS,
  BATCH_UPDATE_LIST_VIEW_RECORDS,
  OPEN_PAGE_ACTION,
  UPDATE_LIST_VIEW_RECORD,
  REMOVE_LIST_VIEW_RECORD,
} from 'src/seeds/rx/ACTIONs';

export default {
  name: 'ListView',
  withNode: true,
  props: {
    variant: 'outlined',
    query: 'posts',
    remove: 'removePosts',
    update: {
      name: 'updatePosts',
      variableType: 'PostInput',
      variableName: 'postFragment',
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
            {
              name: 'ListViewEnumFilter',
              props: {
                marginLeft: 2,
                size: 'small',
                //helperText:'提示消息',
                label: '状态',
                width: '120px',
                field: 'status',
                metas: [
                  {
                    value: 'DRAFT',
                    name: '草稿',
                  },
                  {
                    value: 'PUBLISHED',
                    name: '已发布',
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
            {
              name: 'Button',
              props: {
                rxText: '发布',
                marginLeft: 2,
                //size:'small',
                variant: 'contained',
                startIcon: 'mdi-publish',
                onClick: {
                  name: BATCH_UPDATE_LIST_VIEW_RECORDS,
                  field: 'status',
                  value: 'PUBLISHED',
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
            label: '图片',
          },
          children: [
            {
              name: 'MediaView',
              field: 'feathureImage',
              props: {
                width: '60px',
              },
            },
          ],
        },
        {
          name: 'TableColumn',
          props: {
            label: '标题',
            field: 'title',
            searchable: true,
            sortable: true,
            width: '200px',
          },

          children: [
            {
              name: 'TextView',
              field: 'title',
              props: {
                variant: 'outlined',
                size: 'small',
              },
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
                    value: 'PUBLISHED',
                    color: 'default',
                    name: '已发布',
                  },
                  {
                    value: 'DRAFT',
                    color: 'secondary',
                    name: '草稿',
                  },
                ],
              },
            },
          ],
        },
        {
          name: 'TableColumn',
          props: {
            label: '时间',
            field: 'created_at',
            searchable: true,
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
                  pageJumper: { openStyle: 'JUMP', pageId: 'guid-p-cms-6' },
                },
              },
            },
            {
              name: 'JsxTemplateParser',
              props: {
                actions: {
                  publish: {
                    name: UPDATE_LIST_VIEW_RECORD,
                    field: 'status',
                    value: 'PUBLISHED',
                  },
                },
                template: `{
                model.status === 'DRAFT' &&
                <IconButton icon='mdi-publish' tooltip='发布' onClick={publish} />
               }
                `,
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
        rowsPerPageOptions: '5, 10, 25',
      },
    },
  ],
};
