#!/bin/bash
# Simple setup.sh for configuring Ubuntu 12.04 LTS Azure instance dedicated to
# machine learning with Python

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
sudo apt-get install gfortran libopenblas-dev liblapack-dev
sudo apt-get install python-scipy
sudo pip install --upgrade gensim

# from command line, type:
# python
# import nltk
# nltk.download()
# d
# punkt

sudo apt-get install libzmq-dev
sudo pip install pyzmq
sudo apt-get install libevent-dev
sudo pip install zerorpc

sudo apt-get install -y git
