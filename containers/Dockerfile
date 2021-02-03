# https://catalog.redhat.com/software/containers/ubi8/ubi/5c359854d70cc534b3a3784e
FROM registry.access.redhat.com/ubi8/ubi as base
RUN dnf module install -y nodejs:14
WORKDIR /opt/rhub-app

FROM base as build
COPY . /opt/rhub-app
RUN npm install && npm run build

# https://catalog.redhat.com/software/containers/ubi8/ubi/5c359854d70cc534b3a3784e
FROM registry.access.redhat.com/ubi8/ubi
RUN dnf module install -y nginx:1.18
COPY --from=build /opt/rhub-app/dist /usr/share/nginx/html
COPY ./containers/nginx.conf /etc/nginx/default.d/rhub-app.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
