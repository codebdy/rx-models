import { GO_BACK_ACTION, SUBMIT_MUTATION } from '../../ACTIONs';

export const postAttributeEditSchema = [
  {
    name: 'FormGridContainer',
    props: {
      spacing: 2,
    },
    children: [
      {
        name: 'FormGridItem',
        props: {
          xs: 12,
        },
        children: [
          {
            name: 'TextBox',
            field: 'name',
            props: {
              label: '标签名称',
              variant: 'outlined',
              fullWidth: true,
            },
          },
        ],
      },
    ],
  },
  {
    name: 'PortletFooter',
    children: [
      {
        name: 'Button',
        props: {
          variant: 'outlined',
          rxText: '取消',
          size: 'large',
          onClick: {
            name: GO_BACK_ACTION,
            careDuty: true, //如果有修改，显示保存提示
          },
        },
      },
      {
        name: 'Button',
        props: {
          rxText: '保存',
          variant: 'contained',
          color: 'primary',
          size: 'large',
          marginLeft: 2,
          onClick: {
            name: SUBMIT_MUTATION,
            mutation: {
              name: 'savePostAttribute',
              variableName: 'postAttribute',
              variableType: 'PostAttributeInput',
              submitNode: '',
              refreshNode: '',
              goback: true,
            },
          },
        },
      },
    ],
  },
];
