# money-up

## Установка зависимостей backend

\```
pip install pipenv
pipenv install
\```

## Установка зависимостей frontend

```
cd .\frontend\
npm install
```

## Запуск dev серверов
в корневой папке проекта

```
pipenv run dev
```

```
cd .\frontend\
quasar dev
```

## Запуск prod серверов
в корневой папке проекта

```
pipenv run prod
```

```
cd .\frontend\
quasar build
quasar serve ./dist/spa
```