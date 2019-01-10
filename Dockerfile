FROM node:11-alpine

ENV CHROME_BIN="/usr/bin/chromium-browser" \
    NODE_ENV="production"
RUN set -x \
    && apk update \
    && apk upgrade \
    && apk add --no-cache \
    dumb-init \
    udev \
    ttf-freefont \
    chromium \
    grep \
      # Do some cleanup
      && apk del --no-cache make gcc g++ python binutils-gold gnupg libstdc++ \
      && rm -rf /usr/include \
      && echo

RUN mkdir -p /usr/src/garie-lighthouse
WORKDIR /usr/src/garie-lighthouse
COPY package.json .
RUN npm install
COPY . .
EXPOSE 3000
ENTRYPOINT ["/usr/bin/dumb-init"]
CMD ["npm", "start"]
