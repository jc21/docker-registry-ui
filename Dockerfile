FROM jc21/node:latest

MAINTAINER Jamie Curnow <jc@jc21.com>
LABEL maintainer="Jamie Curnow <jc@jc21.com>"

RUN apt-get update \
    && apt-get install -y curl \
    && apt-get clean

ENV NODE_ENV=production

ADD dist                /app/dist
ADD node_modules        /app/node_modules
ADD LICENCE             /app/LICENCE
ADD package.json        /app/package.json
ADD src/backend         /app/src/backend

WORKDIR /app

CMD node --max_old_space_size=250 --abort_on_uncaught_exception src/backend/index.js

HEALTHCHECK --interval=15s --timeout=3s CMD curl -f http://localhost/ || exit 1

