import articleChannelSchema from './channel/articleChannelSchema';
import { dashboardSchema } from './dashboard/pageSchema';
import { enquiryListSchema } from './enquires/enquiryListSchema';
import { viewEnquirySchema } from './enquires/viewEnquirySchema';
import { mediasPageSchema } from './medias/mediasPageSchema';
import { postEditSchema } from './post/views/editPage';
import { postListSchema } from './post/views/listPage';
import { postAttributeEditSchema } from './postAttribute/postAttributeEditSchema';
import { postAttributeListSchema } from './postAttribute/postAttributeListSchema';
import { postTagEditSchema } from './postTag/postTagEditSchema';
import { postTagListSchema } from './postTag/postTagListSchema';
import { productEditSchema } from './product/views/editPage';
import { productListSchema } from './product/views/listPage';

const cmsPages = [
  {
    name: '分析看板',
    schema: dashboardSchema as any,
  },
  {
    name: '询盘列表',
    schema: enquiryListSchema as any,
  },
  {
    name: '询盘查看',
    maxWidth: 'sm',
    query: 'readEnquiry',
    //excute_query_by_mutation: true,
    schema: viewEnquirySchema as any,
  },
  {
    name: '媒体库',
    schema: mediasPageSchema as any,
  },
  {
    name: '文章列表',
    schema: postListSchema,
  },
  {
    name: '文章编辑',
    query: 'post',
    schema: postEditSchema,
  },

  {
    name: '文章频道',
    //query:'post',
    schema: articleChannelSchema,
  },

  {
    name: '文章标签列表',
    schema: postTagListSchema,
  },
  {
    name: '文章标签编辑',
    maxWidth: 'xs',
    query: 'postTag',
    schema: postTagEditSchema,
  },
  {
    name: '文章属性列表',
    schema: postAttributeListSchema,
  },
  {
    name: '文章属性编辑',
    maxWidth: 'xs',
    query: 'postAttribute',
    schema: postAttributeEditSchema,
  },

  {
    name: '产品列表',
    schema: productListSchema,
  },
  {
    name: '产品编辑',
    query: 'product',
    schema: productEditSchema,
  },
];

export default cmsPages;
