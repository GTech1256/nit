/* eslint-disable import/prefer-default-export */
import { apiRequest } from '../axios/axiosController';

export function getNews(page = 1) {
  return apiRequest({
    method: 'get',
    url: '/public/news',
    params: { page },
  });
}


/**
   * ADD new article of news
   * @body { ?FormData:image, String:title, String:text, ?Date:date }
   *
   * @return
   *    200 - <news>
   *    xxx -
   */
export function uploadArticle(data, image) {
  return apiRequest({
    method: 'post',
    url: '/private/news/upload/text',
    data
  }).then(({ data }) => updateArticleImage(data, image))
}

export function updateArticle(data, image) {
  return apiRequest({
    method: 'put',
    url: '/private/news/upload/text',
    data, 
    params: {
      _id
    }
  }).then(({ data }) => updateArticleImage(data, image))
}

export function updateArticleImage({ _id }, image) {
  const fs = new FormData();
  fs.append('image', image);

  return apiRequest({
    method: 'put',
    url: '/private/news/upload/image',
    params: {
      _id
    },
    data: fs
  })
}

/**
 * 
 * @param {Object} params - { _id } 
 */
export function deleteArticle(params) {
  return apiRequest({
    method: 'delete',
    url: '/private/news',
    params
  })
}