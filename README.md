# NIT

## Project setup

* vue-cli
* koa
* mongoDB

## Deploy project

1. ```console yarn install```
1. ```console yarn build```
1. change `app.use((0, _koaStatic.default)(_path.default.resolve('dist/front')));` to `app.use((0, _koaStatic.default)(_path.default.resolve('front')));`

### Develop server+front (hot reload)

```console
yarn serve
```

### Customize configuration for front

See [Configuration Reference](https://cli.vuejs.org/config/).
