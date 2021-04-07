# This stage installs our modules
FROM mhart/alpine-node:14

ARG QOVERY_ROUTER_MAIN_XUSER_API_APP_URL="http://localhost"
ENV BASE_URL=$QOVERY_ROUTER_MAIN_XUSER_API_APP_URL

ARG PORT=3002
ENV PORT=$PORT

ARG NODE_ENV=production
ENV NODE_ENV=$NODE_ENV

ARG API_PREFIX=''
ENV API_PREFIX=$API_PREFIX

WORKDIR /app
COPY . .
RUN yarn install --production=false
RUN yarn build

EXPOSE $PORT

ENTRYPOINT ["yarn", "start"]
