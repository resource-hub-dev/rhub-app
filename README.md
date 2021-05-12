# Resource Hub App

Front end application to serve as an interface to the Resource Hub API.

## Contributing
If you want to contribute to our project, you are more then welcome - just check our [contributing guide](.github/CONTRIBUTING.md).

## Running it in a container:

To run the Web Interface in your favorite container environment, use the provided Dockerfile. We recommend `podman`.
Build the container image with:

```shell
$ podman build . -t rhub-app
```

After building is completed, you can run it, mapping port 80 to some local port:

```shell
$ podman run -d -p 8081:80 rhub-app
```

The Interface should now be available in the address `http://localhost:8081`
