import * as morgan from 'morgan';
import { default as log } from './logger';
import * as winston from 'winston';

import express from 'express';

import configJson = require('../settings/config.json'); // tslint:disable-line

const { lengthLimit } = configJson;

let reqExpBodyForSkipRoutes = 'api';
// adding routes for skip from config
configJson.disabledRoutesForLoggingHTTP.forEach(function(router: any) {
  reqExpBodyForSkipRoutes += `|${router}`;
});

function subParam(paramName: any, value: any) {
  const maxLengthOfValue = (lengthLimit as any)[paramName] as number;

  // hide password in body
  if (paramName === 'body') {
    const wordForSearch = 'password';
    const bodyKeys = Object.keys(value);

    bodyKeys.findIndex(function(item: string, i: number, arr: string[]): boolean {
      if (item.match(new RegExp(wordForSearch, 'ig'))) {
        value[item] = '***';
        return true;
      }
      return false;
    });
  }

  if (maxLengthOfValue === -1) {
    return;
  }

  if (maxLengthOfValue === 0) {
    return value;
  }

  return JSON.stringify(value).substr(0, maxLengthOfValue);
}

const messageConstructor = function(tokens: morgan.TokenIndexer, req: express.Request, res: express.Response) {
  JSON.stringify({
    method: tokens.method(req, res),
    url: tokens.url(req, res),
    status: tokens.status(req, res),
    'response-time': `${tokens['response-time'](req, res)}ms`,
    body: subParam('body', req.body),
    query: subParam('query', req.query),
    params: subParam('params', req.params),
    cookies: subParam('cookies', req.cookies),
    headers: subParam('headers', req.headers),
  });
} as morgan.FormatFn;

function skip(req: express.Request, res: express.Response): boolean {
  const fullUrl = `${req.protocol}://${req.get('host')}${req.originalUrl}`;

  return !Boolean(fullUrl.match(new RegExp(reqExpBodyForSkipRoutes, 'ig')));
}

export default morgan(messageConstructor, {
  skip,
  stream: log as winston.Logger,
} as morgan.Options);
