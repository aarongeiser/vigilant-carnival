# Distributor Service

The distributor service is a simple Node.js webserver that serves a single view responsible for collecting audio data from a web browser. The collected audio data is then sent, via websockets, to the server and _distributed_ to listening clients. To get a better understanding about these _listening clients_, refer to the `visualization_service` documentation.

## Building
To build the image, go to terminal and run `make build`. This command effectively builds a docker image (tagged, "distributor") based on the Dockerfile.

## Running
To run, go to terminal and run `make run`. This command will locate and run the 'distributor' image in a Docker container.

## Viewing
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
