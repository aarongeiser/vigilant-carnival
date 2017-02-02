# Distributor Service

## Building
To build the image, go to terminal and run `make build`. This command effectively builds a docker image (tagged, "distributor") based on the Dockerfile.

## Running
To run, go to terminal and run `make run`. This command will locate and run the 'distributor' image in a Docker container.

## View
Once the container is running you can navigate to `localhost:3001` in your browser.

## Stopping
To stop the running container, navigate to your terminal and enter the following commands

Get a list of running containers

```
docker ps -a
```

Now locate the <CONTAINER ID> for the running 'distributor' container and run:

```
docker rm <CONTAINER ID>
```
