FROM node:12.18.1

RUN curl -o- -L https://yarnpkg.com/install.sh | bash

WORKDIR /usr/app
COPY package*.json yarn.lock ./

RUN yarn
COPY . .

EXPOSE 4000

CMD ["yarn", "dev:server"]