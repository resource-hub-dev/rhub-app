# https://catalog.redhat.com/software/containers/ubi8/nodejs-14/5ed7887dd70cc50e69c2fabb
FROM registry.access.redhat.com/ubi8/nodejs-16 as build
COPY . .
RUN npm install && npm run build

# https://catalog.redhat.com/software/containers/ubi8/nginx-118/5f521a6f9dd2d5ca7158e5dc
FROM registry.access.redhat.com/ubi8/nginx-118
COPY --from=build /opt/app-root/src/dist .
COPY ./containers/nginx.conf /opt/app-root/etc/nginx.default.d/nginx.conf
COPY ./containers/nginx-entrypoint /opt/app-root/entrypoint
RUN /opt/app-root/entrypoint && chmod g+w ./index.html
ENTRYPOINT ["/opt/app-root/entrypoint"]
CMD ["nginx", "-g", "daemon off;"]
