include make_env

.PHONY: build push shell run start stop rm release

build:
	docker build --no-cache=true -t $(DOCKER_NAMESPACE)/$(DOCKER_REPOSITORY):$(DOCKER_IMAGE_VERSION) .

push:
	docker push $(DOCKER_NAMESPACE)/$(DOCKER_REPOSITORY):$(DOCKER_IMAGE_VERSION)

shell:
	docker run --cap-add SYS_RAWIO --device /dev/mem --privileged --rm --name $(DOCKER_CONTAINER_NAME)-$(DOCKER_INSTANCE) -i -t $(DOCKER_PORTS) $(DOCKER_MAPPED_VOLUMES) $(DOCKER_ENV) $(DOCKER_NAMESPACE)/$(DOCKER_REPOSITORY):$(DOCKER_IMAGE_VERSION) /bin/bash

run:
	docker run --cap-add SYS_RAWIO --device /dev/mem --privileged --rm --name $(DOCKER_CONTAINER_NAME)-$(DOCKER_INSTANCE) $(DOCKER_PORTS) $(DOCKER_MAPPED_VOLUMES) $(DOCKER_ENV) $(DOCKER_NAMESPACE)/$(DOCKER_REPOSITORY):$(DOCKER_IMAGE_VERSION)

start:
	docker run --cap-add SYS_RAWIO --device /dev/mem --privileged -d --name $(DOCKER_CONTAINER_NAME)-$(DOCKER_INSTANCE) $(DOCKER_PORTS) $(DOCKER_MAPPED_VOLUMES) $(DOCKER_ENV) $(DOCKER_NAMESPACE)/$(DOCKER_REPOSITORY):$(DOCKER_IMAGE_VERSION)

stop:
	docker stop $(DOCKER_CONTAINER_NAME)-$(DOCKER_INSTANCE)

rm:
	docker rm $(DOCKER_CONTAINER_NAME)-$(DOCKER_INSTANCE)

release: build
	make push -e VERSION=$(DOCKER_IMAGE_VERSION)

default: build