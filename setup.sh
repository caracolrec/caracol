#!/bin/bash
# Simple setup.sh for configuring Ubuntu 12.04 LTS Azure instance

sudo apt-get update
sudo apt-get install build-essential
sudo apt-get install screen

# Install PostgreSQL
sudo apt-get install postgresql postgresql-contrib

# Install Python dependencies
sudo apt-get install python-setuptools
sudo apt-get install python-pip
sudo apt-get install python-dev

sudo apt-get install python-psycopg2
sudo pip install beautifulsoup4
sudo apt-get install libxml2-dev libxslt-dev
sudo pip install lxml

sudo pip install -U numpy
sudo pip install -U pyyaml nltk

sudo apt-get install libzmq-dev
sudo pip install pyzmq
sudo apt-get install libevent-dev
sudo pip install zerorpc

# Install nvm: node-version manager
# https://github.com/creationix/nvm
sudo apt-get install -y git
sudo apt-get install -y curl
curl https://raw.github.com/creationix/nvm/master/install.sh | sh

# Load nvm and install latest production node
source $HOME/.nvm/nvm.sh
# If the shell script quits with an error after trying to execute line 18,
# just reenter the line yourself, and then the following line:
nvm install v0.10.22
nvm use v0.10.22