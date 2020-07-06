/* eslint-disable no-underscore-dangle */
/* eslint-disable import/prefer-default-export */
import { apiRequest } from '../axios/axiosController';

/**
 * @typedef {Object} FileBucket - Bucket file
 * @property {String} Location - URL of the uploaded object.
 * @property {String} ETag - ETag of the uploaded object.
 * @property {Date} Bucket - Bucket to which the object was uploaded.
 * @property {Date} Key - Key to which the object was uploaded. (FOR DELETE)
 */

/**
 * @typedef {Object} ArticleWithBucketFile
 * @property {String} text
 * @property {String} title
 * @property {Date} date
 * @property {FileBucket} image
 */

/**
 * @typedef {Object} ArticleWithRawFile
 * @property {String} text
 * @property {String} title
 * @property {Date} date
 * @property {File} image
 */

export function getNews(page = 1) {
  return apiRequest({
    method: 'get',
    url: '/public/news',
    params: { page },
  });
}

/**
 * @export
 * @param {{ _id: String }} { _id } - id новости
 * @param {File} image - фаил фотографии
 * @return {ArticleWithBucketFile}
 */
export function updateArticleImage({ _id }, image) {
  const fs = new FormData();
  fs.append('image', image);

  return apiRequest({
    method: 'put',
    url: '/private/news/upload/image',
    params: {
      _id,
    },
    data: fs,
  });
}


/**
 * @export
 * @param {ArticleWithRawFile} payload
 * @param {*} image
 * @return {ArticleWithBucketFile}
 */
export function uploadArticle(payload) {
  const textData = { ...payload };

  delete textData.image;


  return apiRequest({
    method: 'post',
    url: '/private/news/upload/text',
    data: textData,
  });
  //  .then(({ data: createdArticle }) => updateArticleImage(createdArticle, payload.image));
}

/**
 * @export
 * @param {ArticleWithRawFile} payload
 * @param {*} image
 * @return {ArticleWithBucketFile}
 */
export function updateArticle(payload) {
  const textData = { ...payload };

  delete textData.image;

  return apiRequest({
    method: 'put',
    url: '/private/news/upload/text',
    data: textData,
    params: {
      _id: payload._id,
    },
  });
  // .then(({ data: createdArticle }) => updateArticleImage(createdArticle, payload.image));
}

/**
 * @param {{_id: String}} params - { _id }
 */
export function deleteArticle(params) {
  return apiRequest({
    method: 'delete',
    url: '/private/news',
    params,
  });
}
