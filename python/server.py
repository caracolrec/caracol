import zerorpc
import psycopg2 # the Python driver for Postgres
import nltk
import json
import os.path

# Open connection to the database
credentials = json.load(open(os.path.abspath(os.path.join(os.path.dirname(__file__),"../database/dbconfig.json"))))
conn = psycopg2.connect(host=credentials["host"],database=credentials["database"],user=credentials["user"],password=credentials["password"])
cur = conn.cursor()

# Read a row from the clippings table
cur.execute("SELECT * FROM clippings;")
print cur.fetchone()

# Close the database connection
cur.close()
conn.close()



class HelloRPC(object):
    def hello(self, name):
        return "Hello, %s from Python!" % name

s = zerorpc.Server(HelloRPC())
s.bind("tcp://0.0.0.0:4242")
s.run()