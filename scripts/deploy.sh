#!/usr/bin/env bash

# exit on error
set -e

DIR=src
BUCKET=s3://rjrbt.io
DIST_ID=$RJRBT_CDN_DIST_ID
CACHE_ID=$(date +%s)
FORMATTED_JSON='{"Paths": {"Quantity": 1,"Items": ["/*"]},"CallerReference":"'${CACHE_ID}'"}'

cd $DIR
aws s3 sync . $BUCKET --acl public-read
aws cloudfront create-invalidation --distribution-id "$DIST_ID" --invalidation-batch "$FORMATTED_JSON"