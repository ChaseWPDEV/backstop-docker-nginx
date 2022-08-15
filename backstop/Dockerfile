FROM ubuntu:latest
WORKDIR /usr/src/app
RUN apt-get update && apt-get install -y  && \
    apt-get install -y npm nodejs && npm install -g backstopjs \
    backstop init && \
    backstop test
# make an edits using $ sed
CMD ["/bin/bash"]