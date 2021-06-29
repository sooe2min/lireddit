FROM node:12

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY . .
COPY .env.production .env

RUN npm run build

ENV NODE_ENV production

EXPOSE 8080

CMD [ "node", "dist/index.js" ]
USER node

# https://dokku.com/docs~v0.21.4/deployment/application-deployment/
# ssh root@178.128.158.215  
# dokku apps:create <api>

# sudo dokku plugin:install https://github.com/dokku/dokku-postgres.git
# dokku postgres:create <psql>
# dokku postgres:link <psql> <api>

# dokku redis:create <redis>
# dokku redis:link <redis> <api>

# docker container list


# sudo docker build . -t sooe2min/lireddit:1
# sudo docker push sooe2min/lireddit:1     
# https://hub.docker.com/

# https://dokku.com/docs/deployment/methods/images/
# docker pull sooe2min/lireddit:1
# docker tag sooe2min/lireddit:1 dokku/api:latest
# dokku tags:deploy api latest

# https://dokku.com/docs/configuration/domains/
# https://www.noip.com/
# dokku domains:report
# dokku domains:remove
# dokku domains:add

# https://dokku.com/docs/networking/proxy-management/
# dokku proxy:ports-add api http:80:8080
# dokku proxy:ports api

# https://github.com/dokku/dokku-letsencrypt
# sudo dokku plugin:install https://github.com/dokku/dokku-letsencrypt.git
# dokku config:set --no-restart api DOKKU_LETSENCRYPT_EMAIL=jsmsumin2@naver.com
# dokku letsencrypt:enable api