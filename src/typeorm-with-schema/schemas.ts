export const schemas = [
  {
    name: 'RxTest',
    columns: {
      id: {
        type: Number,
        primary: true,
        generated: true,
      },
      name: {
        type: String,
      },
    },
  },
];
