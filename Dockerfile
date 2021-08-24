FROM node:16-alpine
LABEL org.opencontainers.image.source="https://github.com/pkoeppen/starchan-client"

WORKDIR /app

COPY package.json /app/
RUN npm install --silent

COPY nuxt.config.js tailwind.config.js /app/
COPY assets/ /app/assets/
COPY components/ /app/components/
COPY layouts/ /app/layouts/
COPY middleware/ /app/middleware/
COPY pages/ /app/pages/
COPY plugins/ /app/plugins/
COPY static/ /app/static/
COPY store/ /app/store/
RUN npm run build

EXPOSE 3000

CMD [ "npm", "start" ]
