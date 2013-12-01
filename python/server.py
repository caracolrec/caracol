import zerorpc
import psycopg2 # the Python driver for Postgres
import nltk
import json
import os.path
from bs4 import BeautifulSoup
import logging
logging.basicConfig()

# Open connection to the database
credentials = json.load(open(os.path.abspath(os.path.join(os.path.dirname(__file__),"../database/dbconfig.json"))))

class RPC(object):
    def remove_html_and_tokenize_clipping_content(self, clipping_id):
        # Open connection to the database
        conn = psycopg2.connect(host=credentials["host"],database=credentials["database"],user=credentials["user"],password=credentials["password"])
        cur = conn.cursor()
        # Remove html from the content and tokenize
        cur.execute("SELECT content FROM clippings WHERE id = (%s)", ([clipping_id]))
        content = cur.fetchone()[0]
        content_sans_html = BeautifulSoup(content, "lxml").get_text()
        cur.execute("UPDATE clippings SET content_sans_html = (%s) WHERE id = (%s)", (content_sans_html, clipping_id))
        cur.execute("UPDATE clippings SET content_sans_html_tokenized = (%s) WHERE id = (%s)", (nltk.word_tokenize(content_sans_html), clipping_id))
        # Save the changes to the database
        conn.commit()
        # Close database connection
        cur.close()
        conn.close()
        return "Cleaned the content of HTML and tokenized"

s = zerorpc.Server(RPC())
s.bind("tcp://0.0.0.0:4242")
s.run()

