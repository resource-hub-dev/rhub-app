# https://catalog.redhat.com/software/containers/ubi8/nodejs-18/6278e5c078709f5277f26998
FROM node:18  as build
WORKDIR /opt/app-root/src
COPY . .
RUN npm install
RUN npm run build

# https://catalog.redhat.com/software/containers/ubi8/nginx-118/5f521a6f9dd2d5ca7158e5dc
FROM registry.access.redhat.com/ubi8/nginx-118
COPY --from=build /opt/app-root/src/dist .
COPY ./containers/nginx.conf /opt/app-root/etc/nginx.default.d/nginx.conf
COPY ./containers/nginx-entrypoint /opt/app-root/entrypoint

# https://docs.openshift.com/container-platform/4.11/openshift_images/create-images.html#images-create-guide-openshift_create-images
USER 0
RUN touch /opt/app-root/src/index.html \
    && chown 1001:0 /opt/app-root/src/index.html \
    && chmod g=u /opt/app-root/src/index.html
USER 1001

ENTRYPOINT ["/opt/app-root/entrypoint"]
CMD ["nginx", "-g", "daemon off;"]
