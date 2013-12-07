![logo](https://raw.github.com/michaelmunson1/caracol/master/public/images/caracol3.png)&nbsp;[caracol](http://caracol.cloudapp.net/) - a recommendation engine for longform articles
=================================================================================

## Table of Contents

* [Description](#description)
* [Deployment / Development](#deployment-development)
* [The Stack](#the-stack)
* [Challenges](#challenges)
* [Team](#team)
* [License](#license)

##<a name="description"></a>Description

Caracol is a tool for discovering articles from around the web that you'll like to read. Users use the caracol bookmarklet to clip notable articles they read and indicate whether they liked or disliked an article. Caracol processes the user's clippings and votes, and uses latent semantic analysis to recommend articles other users have clipped which the user might like.

##<a name="deployment-development"></a>Deployment / Development
[![Coverage Status](https://coveralls.io/repos/michaelmunson1/caracol/badge.png)](https://coveralls.io/r/michaelmunson1/caracol)

caracol is live at [http://caracol.cloudapp.net](http://caracol.cloudapp.net).

To get started working on caracol:

1. Clone the repository on your development machine.
2. Install dependencies:
    1. If you are running Ubuntu 12.04 LTS, run `setup.sh` from the root caracol directory:

            sh setup.sh

    2. If you are on Mac OS X, consult `setup.sh` for the system and Python dependencies:
        - node.js
        - PostgreSQL
        - ZeroMQ
        - libevent
        - Python 2.7
            - psycopg2
            - Beautiful Soup
            - lxml
            - numpy
            - pyyaml
            - nltk
            - pyzmq
            - ZeroRPC
    3. Install node.js dependencies using `npm`, and front-end dependencies using `bower`. From the root caracol directory:

            npm install
            bower install

3. Test launching locally:
    1. From the root caracol directory:

            python python/server.py

    2. In another Terminal window:

            node server.js

    3. If the previous two commands don't return any errors, you have successfully launched caracol! Hack away!

##<a name="the-stack"></a>The Stack

Core architecture:

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;![angular.js](https://raw.github.com/michaelmunson1/caracol/master/badges/AngularJS-small.png)

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;![expressjs](https://raw.github.com/michaelmunson1/caracol/master/badges/express.png)

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;![node.js](https://raw.github.com/michaelmunson1/caracol/master/badges/nodejs-light.png)

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;![Python](https://raw.github.com/michaelmunson1/caracol/master/badges/python-logo.jpg)

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;![PostgreSQL](https://raw.github.com/michaelmunson1/caracol/master/badges/postgresql_logo-100px.png)

Front-end snazz:
* Twitter Bootstrap
* Stylus
* Jade

Back-end utilities:
* ZeroRPC
* Bookshelf.js
* Grunt
* Bower

Testing:
* Mocha
* Karma
* Travis CI
* Coveralls

##<a name="challenges"></a>Challenges


##<a name="team"></a>Team

* Adam Witzel <email@email.com>
* Rick Cerf <email@email.com>
* Michael Munson <email@email.com>
* Ian Hinsdale <ian@ianhinsdale.com>

##<a name="license"></a>License
The MIT License (MIT)

Copyright (c) 2013 Adam Witzel, Rick Cerf, Michael Munson, Ian Hinsdale

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.

