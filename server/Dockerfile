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

# sudo docker build . -t sooe2min/lireddit:1
# sudo docker push sooe2min/lireddit:1     
# https://hub.docker.com/

# https://dokku.com/docs/deployment/application-deployment/ 
# https://dokku.com/docs/deployment/methods/images/
# ssh root@178.128.158.215  
# docker pull sooe2min/lireddit:1
# docker tag sooe2min/lireddit:1 dokku/api:1
# dokku tags:deploy api 1

# https://dokku.com/docs/configuration/domains/
# https://www.noip.com/
# okku domains:report
# dokku domains:remove
# dokku domains:add

# https://dokku.com/docs/networking/proxy-management/
# dokku proxy:ports-add api http:80:8080
# dokku proxy:ports api

# https://github.com/dokku/dokku-letsencrypt
# dokku config:set --no-restart api DOKKU_LETSENCRYPT_EMAIL=jsmsumin2@naver.com
# dokku letsencrypt:enable api