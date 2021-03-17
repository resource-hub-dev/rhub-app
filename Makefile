default:

build:
	docker build -t quay.io/resource-hub-dev/rhub-app --no-cache --force-rm .
	docker rm -f rhub-app || :
	docker run -d --name rhub-app \
		-e RHUB_API_URL=http://test \
		quay.io/resource-hub-dev/rhub-app
	sleep 5
	docker logs rhub-app
	docker run --rm --network container:rhub-app curlimages/curl -sf http://localhost:8080
	docker run --rm --network container:rhub-app curlimages/curl -sf http://localhost:8080 \
		| grep 'apiUrl:"http://test"'
	docker rm -f rhub-app

install:
	docker-compose run --rm app npm install

start:
	docker-compose up --force-recreate
