FROM node:16-alpine
LABEL org.opencontainers.image.source="https://github.com/pkoeppen/starchan-client"

ARG NODE_ENV
ENV NODE_ENV ${NODE_ENV}

WORKDIR /app

COPY package.json ./
RUN npm install --silent

COPY . ./

EXPOSE 3000

CMD [ "npm", "run", "dev" ]
