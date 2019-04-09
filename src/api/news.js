/* eslint-disable import/prefer-default-export */
import { apiRequest } from '../axios/axiosController';

export function getNews(page = 1) {
  return apiRequest({
    method: 'get',
    url: '/public/news',
    params: { page },
  });
}
