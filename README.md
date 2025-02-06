# API Server with PM2

This project is an web-supported Docker API server that is managed using PM2, a production process manager for Node.js applications. PM2 helps manage application processes, monitor performance, and ensure high availability.

# Prerequisites
Before running this project, make sure you have Docker installed on your machine. You can download Docker [here](https://www.docker.com/products/docker-desktop).

# Running the Project

1. Clone the repository to your local machine.
2. Create a folder called `programs` in the root directory of the project. You may put your scripts here.
3. (Optional) Create a docker network called `dockernet` by running the following command:
```bash
docker network create --subnet=192.168.0.0/24 dockernet
```
4. Run docker-compose.yml
