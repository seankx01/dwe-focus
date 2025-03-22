#!/bin/bash

cd ./frontend
npm run build
cd ../app
apt install dpkg
apt install fakeroot
npm run make -- --platform linux
# run the app