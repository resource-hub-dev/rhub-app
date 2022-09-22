# https://catalog.redhat.com/software/containers/ubi8/nodejs-14/5ed7887dd70cc50e69c2fabb
FROM node:16.14.2 as build
WORKDIR /opt/app-root/src
COPY . .
RUN npm install
RUN npm run build
RUN chmod g+w ./dist/index.html

# https://catalog.redhat.com/software/containers/ubi8/nginx-118/5f521a6f9dd2d5ca7158e5dc
FROM registry.access.redhat.com/ubi8/nginx-118
COPY --from=build /opt/app-root/src/dist .
COPY ./containers/nginx.conf /opt/app-root/etc/nginx.default.d/nginx.conf
COPY ./containers/nginx-entrypoint /opt/app-root/entrypoint
RUN /opt/app-root/entrypoint
ENTRYPOINT ["/opt/app-root/entrypoint"]
CMD ["nginx", "-g", "daemon off;"]
