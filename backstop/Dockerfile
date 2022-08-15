FROM node:18.7.0
WORKDIR /usr/src/app

RUN apt-get update && apt-get install -y  && \
    npm install -g npm@8.17.0 && \
    npm install -g backstopjs \
    backstop init && \
    npm fund && \
    backstop test --docker
# make an edits using $ sed
CMD ["/bin/bash"]