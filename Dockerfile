FROM --platform=linux/amd64 node:16 AS development

WORKDIR /usr/src

COPY package.json .
COPY package-lock.json .
# ENV PATH=/usr/src/node_modules/.bin:$PATH

RUN npm install

WORKDIR /usr/src/app

COPY . .

RUN npx prisma generate

CMD [ "npm", "run", "start:dev" ]

FROM --platform=linux/amd64 node:16 AS production

WORKDIR /usr/src

COPY package.json .
COPY package-lock.json .

RUN npm install

WORKDIR /usr/src/app

COPY . .

RUN npx prisma generate

RUN npm run build

EXPOSE 8000

CMD [ "npm", "start:prod" ]
