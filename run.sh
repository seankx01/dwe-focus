#!/bin/bash

cd ./frontend
npm run build
cd ../app
sudo apt install dpkg
sudo apt install fakeroot
npm run make -- --platform linux
# run the app
./out/app-linux-x64/app