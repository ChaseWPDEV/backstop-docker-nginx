
# Running tests
### Run Backstop tests
`$ docker exec pixel-sentry npm test`
If issues encountered verify pixel sentry container is running with `$ docker ps`

### Approve Backstop tests
`$ docker exec pixel-sentry npm run approve`


# Standard use with docker-compose
Use `$ docker compose up -d --build` to ensure fresh containers are built as part of the docker-compose process

# Manual use with Docker
### Manually Build Backstop container
From repo root directory:
`$ docker build -t datbackstop .`

### Run Backstop container
From repo root directory:
`$ docker run -idv $(pwd)/config:/src/config --name=pixel-sentry datbackstop`

### Build the nginx server
From the nginx directory:
`$ docker build -t pixel-nginx .`

### Spin up nginx server
Should be running regularly but may need an occasions restart, from in the system directory:L
`$ docker run --name pixel-nginx -d -v $(pwd)/config/html:/usr/share/nginx/html:ro -p 80:80 pixel-nginx`

### Kill all the things!
Sometime you need to rinse an repeat:
```
$ docker kill $(docker container ls -q)
$ docker system prune
```

# Deployment:
## Using: 
* Ansible
* Docker
* Docker-compose
* DockerHub  

Commands below run on master host  

```shell
# Install Ansible Ubuntu (on the master host)
$ sudo apt-add-repository ppa:ansible/ansible
$ sudo apt update
$ sudo apt install ansible
```
Install dependencies 

```shell
# Run on the master host
$ ansible-galaxy collection install community.docker
```

```shell
# Launch
$ ansible-playbook deployment.yaml
```

Test before connection
```shell
$ ansible-playbook ping.yaml
```

## Updating code

```shell
$ ansible-playbook update.yaml 
```