#!/bin/bash

(cd api && docker build -t chores_api .)
(cd client && docker build -t chores_client .)
docker-compose up -d