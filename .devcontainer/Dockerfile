FROM node:18

USER root

RUN apt update && apt upgrade -y

RUN mkdir -p /workspaces/astrocouch
WORKDIR /workspaces/astrocouch
COPY . .
