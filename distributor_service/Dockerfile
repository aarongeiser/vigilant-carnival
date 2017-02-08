FROM hypriot/rpi-node:6.9.4

RUN apt-get update
RUN mkdir /src
COPY src /src
WORKDIR /src
RUN npm install

EXPOSE 3001
CMD ["npm", "start"]
