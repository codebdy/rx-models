export default {
  name: 'OneToManyTable',
  withNode: true,
  field: 'specs',
  props: {
    variant: 'outlined',
    title: '规格库存',
    collapsible: true,
    marginTop: 2,
    open: true,
    size: 'small',
  },
  children: [
    {
      name: 'TableColumn',
      props: {
        label: '图片',
      },
      children: [
        {
          name: 'MediaSelect',
          field: 'image',
          props: {
            width: '60px',
          },
        },
      ],
    },
    {
      name: 'TableColumn',
      props: {
        label: '名称',
        width: '200px',
      },
      children: [
        {
          name: 'TextBox',
          field: 'name',
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
        label: '颜色',
      },
      children: [
        {
          name: 'TextBox',
          field: 'color',
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
        label: '型号',
      },
      children: [
        {
          name: 'SingleSelectBox',
          field: 'category',
          props: {
            variant: 'outlined',
            size: 'small',
            itemKey: 'id',
            withoutEmpertyItem: false,
            items: [
              {
                id: '100',
                name: '100',
              },
              {
                id: '200',
                name: '200',
              },
              {
                id: '300',
                name: '300',
              },
            ],
          },
        },
      ],
    },
    {
      name: 'TableColumn',
      props: {
        label: '库存',
      },
      children: [
        {
          name: 'TextBox',
          field: 'stock',
          props: {
            variant: 'outlined',
            size: 'small',
          },
        },
      ],
    },
  ],
};
