slack-hue
=========
Run using the /lights command in slack

## Local Dev Environment:

```
heroku config -s  >> .env
npm run dev
```

## Debug:

```
 curl -X POST -H "Content-Type: application/json" -d '{"text": "normal blue"}' "http://localhost:5000/"
 ```
