import zerorpc
import psycopg2 # the Python driver for Postgres
import nltk
from nltk import word_tokenize, sent_tokenize
import json
import os.path
import string
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
        cur.execute("UPDATE clippings SET content_sans_html_tokenized = (%s) WHERE id = (%s)", [word for sent in sent_tokenize(content_sans_html) for word in word_tokenize(sent)], clipping_id)
        cur.execute("SELECT content_sans_html_tokenized FROM clippings")
        tokenized = cur.fetchone()[0]
        # Save the changes to the database
        conn.commit()
        # Close database connection
        cur.close()
        conn.close()

        return "Cleaned the content of HTML and tokenized"



def fetchTokenizedClippings(tokenized_ids):
    corpus = [];
#(first_tokenized, last_tokenized)
    conn = psycopg2.connect(host=credentials["host"],database=credentials["database"],user=credentials["user"],password=credentials["password"])
    cur = conn.cursor()
    # Remove html from the content and tokenize

    for cl_id in tokenized_ids:
    #range(first_tokenized, last_tokenized):
      cur.execute("SELECT content_sans_html_tokenized FROM clippings WHERE id=(%s)", ([cl_id]) )
      
      #word_tokenize("hello there world how ya doin!")  #(cur.fetchone()[0])
      tokenizedContent = cur.fetchone()[0]  #[word for sent in sent_tokenize(cur.fetchone()[0]) for word in word_tokenize(sent)]

      tokenizedContent = removePunctuation(tokenizedContent)

      #nltk.word_tokenize(nltk.sent_tokenize(cur.fetchone()[0]))
      corpus.append(tokenizedContent)
      #print "\n\n\n\n\n\n" + str(cl_id) + ":\n\n"
      #print tokenizedContent
    
    cur.close()
    conn.close()

    return corpus

def removePunctuation(strs):
    # print "\n\n\n\n\n\nbefore:\n\n"
    # for article in strs:
    #   print article
    # print ":\n\n"
    #2 deep?

    stopwords = "a,able,about,across,after,all,almost,also,am,among,an,and,any,are,as,at,be,because,been,but,by,can,cannot,could,dear,did,do,does,either,else,ever,every,for,from,get,got,had,has,have,he,her,hers,him,his,how,however,i,if,in,into,is,it,its,just,least,let,like,likely,may,me,might,most,must,my,neither,no,nor,not,of,off,often,on,only,or,other,our,own,rather,said,say,says,she,should,since,so,some,than,that,the,their,them,then,there,these,they,this,tis,to,too,twas,us,wants,was,we,were,what,when,where,which,while,who,whom,why,will,with,would,yet,you,your"
    stopwords = stopwords.split(",")
    stripped = [trim(token).lower() for token in strs if token not in string.punctuation and token not in stopwords]

    print "\n\n\n\n\n\nafter:\n\n"
    print stripped
    print ":\n\n"

def trim(s):
    if s.endswith(".\""): s = s[:-2]
    if s.endswith("\"") or s.endswith("."): s = s[:-1]
    if s.startswith("\"") or s.startswith("."): s = s[1:]
    unicodeStart = string.find(s,'\xe2')
    if unicodeStart != -1: 
      unicodeEnd = unicodeStart + 12
      s = s[:unicodeStart] + s[unicodeEnd:]
    return s



corpus = fetchTokenizedClippings([2])
# for clipping in corpus:
#   print "\n\n\n\n\n\n" + str(clipping) + ":\n\n"
#   print clipping


s = zerorpc.Server(RPC())
s.bind("tcp://0.0.0.0:4242")
s.run()