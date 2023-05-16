# webhooktesters

Bare-bones node application to test webhooks.

## About

A very simple REST and UDP servers to test webhook requests.

## Setup

install dependences
`npm install`

create an .env

```
ADDRESS=127.0.0.1
REST_PORT=4566
UDP_PORT=7654
```

## How do I run this?

```
node rest-server.js
node udp-server.js
```
