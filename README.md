![Docker Registry UI](https://public.jc21.com/docker-registry-ui/github.png "Docker Registry UI")

# Docker Registry UI

![Version](https://img.shields.io/badge/version-1.0.0-green.svg)
![Stars](https://img.shields.io/docker/stars/jc21/registry-ui.svg)
![Pulls](https://img.shields.io/docker/pulls/jc21/registry-ui.svg)

![Build Status](http://bamboo.jc21.com/plugins/servlet/wittified/build-status/AB-DRUI)

Ever wanted a visual website to show you the contents of your Docker Registry? Look no further. Now you can list your Images, Tags and info in style.

This project comes as a [pre-built docker image](https://hub.docker.com/r/jc21/registry-ui/) capable of connecting to another registry.

Note: This project only works with Docker Registry v2.

## Getting started

### Using [Rancher](https://rancher.com)?

Easily start a Registry Stack by adding [my template catalog](https://github.com/jc21/rancher-templates).


### Creating a full Docker Registry Stack with this UI

By far the easiest way to get up and running. Refer to the example [docker-compose.yml](https://github.com/jc21/docker-registry-ui/blob/master/doc/full-stack/docker-compose.yml)
example file, put it on your Docker host and run:

```bash
docker-compose up -d
```

Then hit your server on http://127.0.0.1


### If you have your own Docker Registry to connect to

Here's a `docker-compose.yml` for you:

```bash
version: "2"
services:
  app:
    image: jc21/registry-ui
    ports:
      - 80:80
    environment:
      - REGISTRY_HOST=your-registry-server.com:5000
      - REGISTRY_SSL=true
      - REGISTRY_DOMAIN=your-registry-server.com:5000
      - REGISTRY_STORAGE_DELETE_ENABLED=
    restart: on-failure
```

## Environment Variables

- **`REGISTRY_HOST`** - *Required:* The registry hostname and optional port to connect to for API calls
- **`REGISTRY_SSL`** - *Optional:* Specify `true` for this if the registry is accessed via HTTPS
- **`REGISTRY_DOMAIN`** - *Optional:* This is the registry domain to display in the UI for example push/pull code
- **`REGISTRY_STORAGE_DELETE_ENABLED`** - *Optional:* Specify `true` to enable deletion features, but see below first!


## Deletion Support

Registry deletion support sux. It is disabled by default in this project on purpose
because you need to accomplish extra steps to get it up and running, sort of.

#### Permit deleting on the Registry

This step is pretty simple and involves adding an environment variable to your Docker Registry Container when you start it up:

```bash
docker run -d -p 5000:5000 -e REGISTRY_STORAGE_DELETE_ENABLED=true --name my-registry registry:2
```

#### Enabling Deletions in the UI

Same as the Registry, just add the **`REGISTRY_STORAGE_DELETE_ENABLED=true`** environment variable to the `registry-ui` container.


#### Cleaning up the Registry

When you delete an image from the registry this won't actually remove the blob layers as you might expect. For this reason you have to run this command on your docker registry host to perform garbage collection:

```bash
docker exec -it my-registry bin/registry garbage-collect /etc/docker/registry/config.yml
```

And if you wanted to make a cron job that runs every 30 mins:

```
0,30 * * * * /bin/docker exec -it my-registry bin/registry garbage-collect /etc/docker/registry/config.yml >> /dev/null 2>&1
```

## TODO

- Add pagination to Repositories, currently only 300 images will be fetched
- Add support for registry authentication mechanisms


