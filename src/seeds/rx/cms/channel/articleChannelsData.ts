export default [
  {
    id: '1',
    name: '时事新闻',
  },
  {
    id: '2',
    name: '食品',
    children: [
      {
        id: '21',
        name: '食品安全',
        children: [
          {
            id: '212',
            name: '合成食品',
          },
          {
            id: '213',
            name: '有机食品',
          },
        ],
      },
      {
        id: '22',
        name: '食品添加剂',
      },
    ],
  },
  {
    id: '3',
    name: '财经金融',
    children: [
      {
        id: '31',
        name: '股票',
      },
      {
        id: '32',
        name: '房产',
      },
    ],
  },
];
