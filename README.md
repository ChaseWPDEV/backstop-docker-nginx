# Deployment:
## Using: 
* Ansible
* Docker
* Docker-compose
* DockerHub

```shell
# Install Ansible Ubuntu
sudo apt-add-repository ppa:ansible/ansible
sudo apt update
sudo apt install ansible
```
Install dependencies 

```shell
ansible-galaxy collection install community.docker
```

```shell
# Launch
ansible-playbook deployment.yaml
```

Test before connection
```shell
ansible-playbook ping.yaml
```