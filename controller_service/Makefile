include make_env

NS = sinocalliopteryx
VERSION ?= latest
REPO = vigilant-carnival
NAME = vigilant-carnival
INSTANCE = raspi-node

.PHONY: build push shell run start stop rm release

build:
	docker build --no-cache=true -t $(NS)/$(REPO):$(VERSION) .

push:
	docker push $(NS)/$(REPO):$(VERSION)

shell:
	docker run --cap-add SYS_RAWIO --device /dev/mem --privileged --rm --name $(NAME)-$(INSTANCE) -i -t $(PORTS) $(VOLUMES) $(ENV) $(NS)/$(REPO):$(VERSION) /bin/bash

run:
	docker run --cap-add SYS_RAWIO --device /dev/mem --privileged --rm --name $(NAME)-$(INSTANCE) $(PORTS) $(VOLUMES) $(ENV) $(NS)/$(REPO):$(VERSION)

start:
	docker run --cap-add SYS_RAWIO --device /dev/mem --privileged -d --name $(NAME)-$(INSTANCE) $(PORTS) $(VOLUMES) $(ENV) $(NS)/$(REPO):$(VERSION)

stop:
	docker stop $(NAME)-$(INSTANCE)

rm:
	docker rm $(NAME)-$(INSTANCE)

release: build
	make push -e VERSION=$(VERSION)

default: build