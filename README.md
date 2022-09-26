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