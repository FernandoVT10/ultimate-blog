## Ultimate Blog
This is the code for my blog [FVTBlog](https://fvtblog.com).

### Development
Before running these commands you need to configure the [environment variables](#environment-variables).

* Use `./docker-helper build --development` to build and download all the necessary images.
* Run `./docker-helper run --development` to start all the containers.
* You application must be running on [http://localhost:3000](http://localhost:3000).

Now every change that you do in either the `api` or `client` folder is going to be reflected on the application in real time.

### Deployment
Before running these commands you need to configure the [environment variables](#environment-variables).

There are 3 volumes that will to get mounted:

1. The `/var/www/acme-challenge` folder is where the [ACME](https://en.wikipedia.org/wiki/Automatic_Certificate_Management_Environment) challenge is going to be stored.
Inside of this folder you should have your `.well-known` folder such that your folder structure should resemble something like this: `/var/www/acme-challenge/.well-known/acme-challenge/<challenge_file_name>`.

2. The `/etc/nginx/ssl` folder will be used by the NGINX container to get all the certificates. You must configure the path to these certificates in the [NGINX configuration](#nginx-configuration).

2. The last one is `./nginx/prod.conf` the NGINX configuration file. You can read about how to configure the server in the [NGINX configuration](#nginx-configuration).

After the environment variables and all the mounted volumes are configured, you can just build and start the server with the following commands.

* Use `./docker-helper.sh build --production` to build the images.
* Run `./docker-helper.sh run --production` to start all the containers.
* If you are in a server with a domain you can go to your domain to see it running.

### Environment variables
There are 2 necessary `.env` files. One is stored in `client` and other in `server`.

Every folder that needs a `.env` file has a `.env.example` where the variables are explained in detail. Copy or rename every `.env.example` to `.env`.

### NGINX configuration
This configuration is only intended to be used in a production environment.

In the `nginx` folder you will have a file called `prod.conf.example` that you can either rename or copy into `prod.conf`. In order to make NGINX work you need to change 4 lines:
- There 2 `server_name` variables inside the file. You should replace `localhost` for your domain.
For example if you domain is `example.com` you should replace them for `www.example.com` and `example.com`,
so you will end up with something like this: `server_name www.example.com example.com`.

- The other 2 variables `ssl_certificate` and `ssl_certificate_key` refer to the certifcates path.
If you have your certificates inside `/etc/nginx/ssl` you can use the same path inside of the configuration file.
For example if you have your certificates inside `/etc/nginx/ssl/example.com/*` you can use this same path in the configuration.
