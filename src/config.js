import React from 'react';
import PageLoading from 'components/Loading/PageLoading';
import { antdNotice } from 'components/Notification';
import { store } from 'cmn-utils';
import {logout} from './service/login';

// 系统通知, 定义使用什么风格的通知，normal或antdNotice
const notice = antdNotice;

/**
 * 应用配置 如请求格式，反回格式，异常处理方式，分页格式等
 */
export default {
  /**
   * HTML的title模板
   */
  htmlTitle: 'Family - {title}',
  
  /**
   * 系统通知
   */
  notice,

  // 异步请求配置
  request: {
    prefix: '/api',

    // 每次请求头部都会带着这些参数
    withHeaders: () => ({
      "Authorization": "Bearer " + store.getStore("token"),
      "x-requested-with": "XMLHttpRequest"
    }),

    afterResponse: response => {
      const { code, status, message } = response;
      if (code == 200 || status) {
        return response;
      } else if(code == 401) {
        notice.error(message)
        logout()
      } else {
        notice.error(message)
        return response;
      }
    },
    errorHandle: err => {
        notice.error(err.text || err.message);
        return err;
    }
  },

  // 全局异常
  exception: {
    global: (err, dispatch) => {
      const errName = err.name;
      // RequestError为拦截请求异常
      if (errName === 'RequestError') {
        notice.error(err.message);
        console.error(err); 
      } else {
        console.error(err);
      }
    },
  },

  // 分页助手
  pageHelper: {
    // 格式化要发送到后端的数据
    requestFormat: pageInfo => {
      const { pageNum, pageSize, filters, sorts } = pageInfo;
      return {
        currentPage: pageNum,
        showCount: pageSize,
        sortMap: sorts,
        paramMap: filters
      };
    },

    // 格式化从后端反回的数据
    responseFormat: resp => {
      const {
        currentPage,
        showCount,
        totalResult,
        dataList,
        totalPage
      } = resp.data;
      return {
        pageNum: currentPage,
        pageSize: showCount,
        total: totalResult,
        totalPages: totalPage,
        list: dataList
      };
    }
  },

  // 路由加载效果
  router: {
    loading: <PageLoading loading />
  },

  mock: {
    toSuccess: response => ({
      status: true,
      data: response
    }),

    toError: message => ({
      status: false,
      message: message
    })
  }
};
