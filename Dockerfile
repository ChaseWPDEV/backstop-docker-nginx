FROM backstopjs/backstopjs

COPY ./package.json /src/package.json

RUN cd /src && \
    npm install && \
    backstop init

COPY ./app.js /src/app.js

USER node

ENTRYPOINT bash