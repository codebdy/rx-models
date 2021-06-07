export default {
  name: 'OneToManyPortlet',
  field: 'factoryOrders',
  props: {
    title: '工厂合同',
    elevation: 6,
    marginTop: 2,
    collapsible: true,
    open: true,
  },
  children: [
    {
      name: 'FormGridContainer',
      props: {
        spacing: 2,
      },
      children: [
        {
          name: 'FormGridItem',
          props: {
            md: 4,
          },
          children: [
            {
              name: 'SingleSelectBox',
              field: 'factory',
              props: {
                label: '工厂',
                variant: 'outlined',
                fullWidth: true,
                size: 'small',
                rule: {
                  valueType: 'string',
                  required: true,
                },
                query: 'allSuppliers',
              },
            },
          ],
        },

        {
          name: 'FormGridItem',
          props: {
            xs: 4,
          },
          children: [
            {
              name: 'TextBox',
              field: 'contract_date',
              props: {
                label: '合同日期',
                variant: 'outlined',
                fullWidth: true,
                size: 'small',
                type: 'date',
                shrinkLabel: true,
              },
            },
          ],
        },

        {
          name: 'FormGridItem',
          props: {
            md: 4,
          },
          children: [
            {
              name: 'TextBox',
              field: 'contract_no',
              props: {
                label: '合同号',
                variant: 'outlined',
                fullWidth: true,
                size: 'small',
                rule: {
                  valueType: 'string',
                  required: true,
                },
              },
            },
          ],
        },

        {
          name: 'FormGridItem',
          props: {
            md: 4,
          },
          children: [
            {
              name: 'SingleSelectBox',
              field: 'payment_term',
              props: {
                label: '付款方式',
                variant: 'outlined',
                fullWidth: true,
                size: 'small',
                withoutEmpertyItem: true,
                items: [
                  {
                    id: '100-0',
                    name: 'T/T 100%/0%',
                  },
                  {
                    id: '50-50',
                    name: 'T/T 50%/50%',
                  },
                  {
                    id: '30-70',
                    name: 'T/T 30%/70%',
                  },

                  {
                    slug: '20-80',
                    label: 'T/T 20%/80%',
                  },
                ],
              },
            },
          ],
        },

        {
          name: 'FormGridItem',
          props: {
            md: 4,
          },
          children: [
            {
              name: 'SingleSelectBox',
              field: 'currency',
              props: {
                label: '币种',
                variant: 'outlined',
                fullWidth: true,
                size: 'small',
                withoutEmpertyItem: true,
                items: [
                  {
                    id: 'dollor',
                    name: '美元',
                  },
                  {
                    id: 'euro',
                    name: '欧元',
                  },
                  {
                    id: 'rmb',
                    name: '人民币',
                  },
                ],
              },
            },
          ],
        },
        {
          name: 'FormGridItem',
          props: {
            md: 4,
          },
          children: [
            {
              name: 'TextBox',
              field: 'amount',
              props: {
                label: '合同金额',
                variant: 'outlined',
                type: 'number',
                fullWidth: true,
                size: 'small',
              },
            },
          ],
        },

        {
          name: 'FormGridItem',
          props: {
            md: 12,
          },
          children: [
            {
              name: 'TextBox',
              field: 'cargo_description',
              props: {
                label: '货物描述',
                variant: 'outlined',
                fullWidth: true,
                multiline: true,
                size: 'small',
                rows: 5,
              },
            },
          ],
        },

        {
          name: 'FormGridItem',
          props: {
            xs: 6,
          },
          children: [
            {
              name: 'TextBox',
              field: 'date1',
              props: {
                label: '预计发货日期',
                variant: 'outlined',
                fullWidth: true,
                size: 'small',
                type: 'date',
                shrinkLabel: true,
              },
            },
          ],
        },
        {
          name: 'FormGridItem',
          props: {
            xs: 6,
          },
          children: [
            {
              name: 'TextBox',
              field: 'date2',
              props: {
                label: '实际发货日期',
                variant: 'outlined',
                fullWidth: true,
                size: 'small',
                type: 'date',
                shrinkLabel: true,
              },
            },
          ],
        },
        {
          name: 'FormGridItem',
          props: {
            xs: 4,
          },
          children: [
            {
              name: 'TextBox',
              field: 'pay_date1',
              props: {
                label: '第一次付款日期',
                variant: 'outlined',
                fullWidth: true,
                size: 'small',
                type: 'date',
                shrinkLabel: true,
              },
            },
          ],
        },
        {
          name: 'FormGridItem',
          props: {
            md: 4,
          },
          children: [
            {
              name: 'TextBox',
              field: 'payment1',
              props: {
                label: '第一次付款金额',
                variant: 'outlined',
                type: 'number',
                fullWidth: true,
                size: 'small',
              },
            },
          ],
        },
        {
          name: 'FormGridItem',
          props: {
            md: 4,
          },
          children: [
            {
              name: 'TextBox',
              field: 'exchange1',
              props: {
                label: '汇率',
                variant: 'outlined',
                type: 'number',
                fullWidth: true,
                size: 'small',
              },
            },
          ],
        },

        {
          name: 'FormGridItem',
          props: {
            xs: 4,
          },
          children: [
            {
              name: 'TextBox',
              field: 'pay_date2',
              props: {
                label: '第二次付款日期',
                variant: 'outlined',
                fullWidth: true,
                size: 'small',
                type: 'date',
                shrinkLabel: true,
              },
            },
          ],
        },
        {
          name: 'FormGridItem',
          props: {
            md: 4,
          },
          children: [
            {
              name: 'TextBox',
              field: 'payment2',
              props: {
                label: '第二次付款金额',
                variant: 'outlined',
                type: 'number',
                fullWidth: true,
                size: 'small',
              },
            },
          ],
        },
        {
          name: 'FormGridItem',
          props: {
            md: 4,
          },
          children: [
            {
              name: 'TextBox',
              field: 'exchange2',
              props: {
                label: '汇率',
                variant: 'outlined',
                type: 'number',
                fullWidth: true,
                size: 'small',
              },
            },
          ],
        },

        {
          name: 'FormGridItem',
          props: {
            xs: 12,
          },
          children: [
            {
              name: 'TextBox',
              props: {
                fullWidth: true,
                label: '备注',
                variant: 'outlined',
                //size:"small",
                multiline: true,
                rows: 3,
              },
            },
          ],
        },
      ],
    },
  ],
};
