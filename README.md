<!-- Table of Contents -->
# :notebook_with_decorative_cover: Table of Contents

- [About](#about)
- [Installation and Configuration](#Installation-and-configuration)
- [Deploy To VPS](#deploy-to-vps)

# About
This is an ```Archived``` API for Interior Design Application.

# Installation and Configuration
## Node
- Run these commands to install latest LTS version of Node
```bash
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.38.0/install.sh | bash
source ~/.bashrc
nvm list-remote
nvm install lts/*
```

## Nginx
### Install
- Run these commands to install nginx web server.
```bash
sudo apt update
sudo apt install nginx -y
```

### Configure new Domain
- Change directory to /var/www
```bash
cd /var/www
````

- Create directory for new domain.
```bash
sudo mkdir api-dev.interumah
```

- (Optional) Check for recently created directory.
```bash
ls
```

- Next, assign ownership of the directory with the $USER environment variable:
```bash
sudo chown -R $USER:$USER /var/www/api-dev.interumah
```


To ensure that your permissions are correct and allow the owner to read, write, and execute the files while granting only read and execute permissions to groups and others, you can input the following command:
- Run `sudo chmod -R 755 /var/www/api-dev.interumah`

- Run `nano /var/www/api-dev.interumah/index.html`

In order for Nginx to serve this content, it’s necessary to create a server block with the correct directives. Instead of modifying the default configuration file directly, let’s make a new one at /etc/nginx/sites-available/your_domain:
- Run `sudo nano /etc/nginx/sites-available/api-dev.interumah`
- Run `sudo ln -s /etc/nginx/sites-available/api-dev.interumah /etc/nginx/sites-enabled/`

### Finalize
- Run `sudo nano /etc/nginx/nginx.conf`
- Restart nginx
```bash
sudo nginx -t
sudo systemctl restart nginx
```

## MySQL
### Install
- Run these commands to install mysql
```bash
sudo apt update
sudo apt install mysql-server
sudo systemctl start mysql.service
```

### Configure Database
- Connect to mysql
```bash
sudo mysql
```

- Create new Database
```bash
mysql > CREATE DATABASE interumah_dev;
```

- Add new users and grant user all the privileges to recently created database.
```bash
mysql > CREATE USER 'interumah_dev'@'%' IDENTIFIED BY 'dev';
mysql > GRANT ALL PRIVILEGES ON interumah_dev.* TO 'interumah_dev'@'%';
mysql > FLUSH PRIVILEGES;
```

### Finalize
`sudo systemctl start mysql.service`