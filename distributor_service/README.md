# Distributor Service

The distributor service is a simple Node.js webserver that serves a single view responsible for collecting audio data from a web browser. The collected audio data is then sent, via websockets, to the server and _distributed_ to listening clients. To get a better understanding about these _listening clients_, refer to the `visualization_service` documentation.
