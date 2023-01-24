
FROM node:16.14-alpine

WORKDIR /app-backend

# ADD node_modules .

COPY package.json .
COPY package-lock.json .

RUN npm install

COPY . .

EXPOSE 3001

ENTRYPOINT [ "npm", "run" ]

CMD [ "start" ]
