# edh-obscurity
Calculate your EDH Obscurity Index

Original idea from [r/EDH](https://www.reddit.com/r/EDH/comments/6e79ai/whats_your_obscurity_index/)

## resources/dependencies

- http://getbootstrap.com/css/
- https://github.com/JedWatson/react-select
- https://www.npmjs.com/package/react-clipboard.js

## install

Setup a venv for the cronjob
```
./install/setup.sh
```

See `install/crontab` for how to config.

## deploy

To update React app
```
./bash/deploy_react.sh
```

To update the cronjob, push to master and changes will be pulled before the next scrape.

## todo

- mobile experience
