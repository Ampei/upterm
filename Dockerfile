FROM node:24.22.2

RUN mkdir /upterm
WORKDIR /upterm

COPY package.json .
COPY .npmrc .

RUN npm install
COPY . /upterm
RUN npm run pack

VOLUME /dist
CMD cp /upterm/dist/*.AppImage /dist
