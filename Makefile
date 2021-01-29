default:

build:
	docker build -t quay.io/resource-hub-dev/rhub-app --no-cache --force-rm .
	docker rm -f rhub-app || :
	docker run -d --name rhub-app quay.io/resource-hub-dev/rhub-app
	sleep 5
	docker logs rhub-app
	docker run --rm --network container:rhub-app curlimages/curl -sf http://localhost
	docker rm -f rhub-app

install:
	docker-compose run --rm app npm install

start:
	docker-compose up --force-recreate
