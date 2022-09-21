FROM node:18

USER root

# Get some color on the root terminal!
RUN cp /home/node/.bashrc /root/.bashrc
RUN echo ". /usr/lib/git-core/git-sh-prompt" >> /root/.bashrc
RUN echo "PS1='\${debian_chroot:+(\$debian_chroot)}\[\033[01;32m\]\u@\[\033[00m\]\[\033[01;34m\]\w\033[01;33m\]\$(__git_ps1)\033[01;00m\]\n\$ '" >> /root/.bashrc

RUN apt update && apt upgrade -y

# Install PlayWright and Dependencies
RUN npx -q playwright install \
     && npx playwright install-deps

RUN apt install rsync

RUN mkdir -p /workspaces/astrocouch
WORKDIR /workspaces/astrocouch
COPY . .
