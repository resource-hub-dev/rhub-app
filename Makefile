default:

build:
	docker build -t quay.io/resource-hub-dev/rhub-app:dev -f Dockerfile.dev --progress=plain .
	docker rm -f rhub-app || :
	docker run -d --name rhub-app \
		-e RHUB_API_URL=http://test \
		quay.io/resource-hub-dev/rhub-app:dev
	sleep 5
	docker logs rhub-app
	docker run --rm --network container:rhub-app curlimages/curl -sf http://localhost:3000
	docker run --rm --network container:rhub-app curlimages/curl -sf http://localhost:3000 \
		| grep "apiUrl: 'http://test'"
	docker rm -f rhub-app

build-prod:
	docker build -t quay.io/resource-hub-dev/rhub-app -f Dockerfile --progress=plain .

install:
	docker-compose run --rm app npm install

start:
	docker-compose up --force-recreate
