import zerorpc
import psycopg2 # the Python driver for Postgres
import nltk
import json
import os.path

# Open connection to the database
credentials = json.load(open(os.path.abspath(os.path.join(os.path.dirname(__file__),"../database/dbconfig.json"))))

class RPC(object):
    def remove_html_and_tokenize_clipping_content(clipping_id):
        # Open connection to the database
        conn = psycopg2.connect(host=credentials["host"],database=credentials["database"],user=credentials["user"],password=credentials["password"])
        cur = conn.cursor()
        # Remove html from the content
        cur.execute("SELECT * FROM clippings WHERE id = (%s)", (clipping_id))
        content = cur.fetchone()["content"]
        print content
        content_sans_html = nltk.clean_html(content)
        cur.execute("UPDATE clippings SET content_sans_html = (%s) WHERE id = (%s)", (content_sans_html, clipping_id))
        cur.execute("UPDATE clippings SET content_sans_html_tokenized = (%s) WHERE id = (%s)", (nltk.word_tokenize(content_sans_html), clipping_id))
        return "Cleaned the content of HTML and tokenized"
        # Close database connection
        cur.close()
        conn.close()

s = zerorpc.Server(RPC())
s.bind("tcp://0.0.0.0:4242")
s.run()