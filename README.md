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
    3. Install node.js dependencies using `npm` (which will install front-end dependencies using `bower`). From the root caracol directory:

            npm install

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
* Topcoat
* Stylus
* Jade

Back-end utilities:
* ZeroRPC
* Bookshelf.js
* Grunt
* Bower

Testing:
* Mocha

##<a name="challenges"></a>Challenges

In using Python for the machine learning side of caracol, we face the question of how to communicate between our node server and Python. If Python were running on the same machine as our node server, we could invoke the Python functionality as a child process of node. But that probably wouldn't be a scalable solution, because latent semantic analysis in Python can use up a lot of CPU and memory resources, which could limit the ability of the node server to respond to requests quickly. So we've implemented a solution that allows the machine learning to be done on a remote machine, which communicates with our node server. That solution is essentially TCP sockets, but rather than work with sockets directly and have to deal with messy problems like what to do if a connection is dropped, we're using the ZeroMQ messaging framework. More specifically, we're using ZeroRPC, a library for Python and node.js built on top of ZeroMQ which enables remote procedure calls. Setup was simple and it has worked beautifully. More on our experience using ZeroRPC [here](http://ianhinsdale.com/code/2013/12/08/communicating-between-nodejs-and-python/). 

##<a name="team"></a>Team

* Adam Witzel
    * Personal site: <http://adamwitzel.com>
    * Email: <adam.witzel@gmail.com>
    * Github: <https://github.com/adwitz>
* Rick Cerf <email@email.com>
    * Personal site: <http://www.rcerf.com>
    * Email: <rickcerf@gmail.com>
    * Github: <https://github.com/rcerf>
* Michael Munson
    * Email: <michaelmunson1@gmail.com>
    * Github: <https://github.com/michaelmunson1>
* Ian Hinsdale
    * Personal site: <http://ianhinsdale.com>
    * Email: <ihinsdale@gmail.com>
    * Github: <https://github.com/ihinsdale>

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

