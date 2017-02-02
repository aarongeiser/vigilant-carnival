include make_env

NS = sinocalliopteryx
VERSION ?= latest
REPO = vigilant-carnival
NAME = visualizer
INSTANCE = node

INSTANCE_NAME = $(NAME)-$(INSTANCE)
PARAMS = $(PORTS) $(VOLUMES) $(ENV)
TAG = $(NAME)/$(REPO):$(VERSION)

.PHONY: build push shell run start stop rm release

build:
	docker build --no-cache=true -t $(TAG) .

push:
	docker push $(TAG)

shell:
	docker run --rm --name $(INSTANCE_NAME) -i -t $(PARAMS) $(TAG) /bin/bash

run:
	docker run --rm --name $(INSTANCE_NAME) $(PARAMS) $(TAG)

start:
	docker run -d --name $(INSTANCE_NAME) $(PARAMS) $(TAG)

stop:
	docker stop $(INSTANCE_NAME)

rm:
	docker rm $(INSTANCE_NAME)

release: build
	make push -e VERSION=$(VERSION)

default: build
