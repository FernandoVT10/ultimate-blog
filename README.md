## Ultimate Blog
This is the code for my blog **(url will be added when it goes live)**.

### Deploying
To deploy the application you need to have [docker](https://www.docker.com) installed.

Before running these commands you need to configure the [environment variables](#environment-variables).

* Use `docker compose -f docker-compose.yml -f docker-compose.prod.yml build` to build and download all the necessary images.
* Run `docker compose -f docker-compose.yml -f docker-compose.prod.yml up -d` to start all the containers.
* You application must be running on [http://localhost:3000](http://localhost:3000).

### Development
Before running these commands you need to configure the [environment variables](#environment-variables).

* Use `docker compose -f docker-compose.yml -f docker-compose.dev.yml build` build dev images.
* Run `docker compose -f docker-compose.yml -f docker-compose.dev.yml up` to start all the containers.
* The application must be running on [http://localhost:3000](http://localhost:3000).

Now every change that you do in either the `api` or `client` folder is going to be reflected on the application in real time.

### Environment variables
There are 2 necessary `.env` files. One is stored in `client` and other in `server`.

Every folder that needs a `.env` file has a `.env.example` where the variables are explained in detail. Copy or rename every `.env.example` to `.env`.
