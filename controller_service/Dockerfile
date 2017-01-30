FROM hypriot/rpi-node:6.9.4

RUN apt-get update
RUN mkdir /src
COPY src/package.json /src/package.json
WORKDIR /src
RUN npm install

EXPOSE 3000
CMD ["npm", "run", "start:app"]