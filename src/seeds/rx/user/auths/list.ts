export default {
  name: 'ListView',
  withNode: true,
  props: {
    variant: 'outlined',
    query: 'systemRxAuths',
    selectable: false,
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
      ],
    },
    {
      name: 'ListViewBody',
      withNode: true,
      children: [
        {
          name: 'TableColumn',
          props: {
            label: 'ID',
          },

          children: [
            {
              name: 'TextView',
              field: 'id',
            },
          ],
        },
        {
          name: 'TableColumn',
          props: {
            label: 'RX Slug',
          },

          children: [
            {
              name: 'TextView',
              field: 'rx_slug',
            },
          ],
        },
        {
          name: 'TableColumn',
          props: {
            label: '名称',
          },

          children: [
            {
              name: 'TextView',
              field: 'name',
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
