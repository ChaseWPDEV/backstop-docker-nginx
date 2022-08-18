FROM nginx:stable
COPY default.conf /etc/nginx/default.conf

RUN apt update && apt install -y ssh && \
    sed -i 's/PermitRootLogin prohibit-password/PermitRootLogin yes/' /etc/ssh/sshd_config && \
    mkdir -p ~/.ssh && chmod 700 ~/.ssh

COPY id_rsa.pub /root/.ssh/authorized_keys

RUN ls /root/.ssh/ && chmod 600 /root/.ssh/authorized_keys && service ssh start