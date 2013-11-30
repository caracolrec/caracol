import zerorpc
import psycopg # the Python driver for Postgres

class HelloRPC(object):
    def hello(self, name):
        return "Hello, %s from Python!" % name

s = zerorpc.Server(HelloRPC())
s.bind("tcp://0.0.0.0:4242")
s.run()