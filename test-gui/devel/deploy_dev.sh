#!/bin/bash

set -ex

TARGET=gs://figurl/timeseries-views-1dev

yarn build
gsutil -m cp -R ./build/* $TARGET/