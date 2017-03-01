include make_env

.PHONY: build push shell run start restart stop rm release init

build:
	docker build --no-cache=true -t $(DOCKER_NAMESPACE)/$(DOCKER_REPOSITORY):$(DOCKER_IMAGE_VERSION) .

push:
	docker push $(DOCKER_NAMESPACE)/$(DOCKER_REPOSITORY):$(DOCKER_IMAGE_VERSION)

shell:
	docker run --rm --name $(DOCKER_CONTAINER_NAME)-$(DOCKER_INSTANCE) -i -t $(DOCKER_PORTS) $(DOCKER_MAPPED_VOLUMES) $(DOCKER_ENV) $(DOCKER_NAMESPACE)/$(DOCKER_REPOSITORY):$(DOCKER_IMAGE_VERSION) /bin/bash

run:
	docker run --rm --name $(DOCKER_CONTAINER_NAME)-$(DOCKER_INSTANCE) $(DOCKER_PORTS) $(DOCKER_MAPPED_VOLUMES) $(DOCKER_ENV) $(DOCKER_NAMESPACE)/$(DOCKER_REPOSITORY):$(DOCKER_IMAGE_VERSION)

start:
	docker run -d --name $(DOCKER_CONTAINER_NAME)-$(DOCKER_INSTANCE) $(DOCKER_PORTS) $(DOCKER_MAPPED_VOLUMES) $(DOCKER_ENV) $(DOCKER_NAMESPACE)/$(DOCKER_REPOSITORY):$(DOCKER_IMAGE_VERSION)

restart:
	docker start $(DOCKER_CONTAINER_NAME)-$(DOCKER_INSTANCE)

stop:
	docker stop $(DOCKER_CONTAINER_NAME)-$(DOCKER_INSTANCE)

rm:
	docker rm $(DOCKER_CONTAINER_NAME)-$(DOCKER_INSTANCE)

release: build
	make push -e VERSION=$(DOCKER_IMAGE_VERSION)

init:
	$(info ********** Configure the 'init' command by editing your Makefile. **********)

default: build