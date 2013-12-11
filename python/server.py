import zerorpc
import psycopg2 # the Python driver for Postgres
from nltk import word_tokenize, sent_tokenize
import json
import os.path
import string
from bs4 import BeautifulSoup
import logging
from scipy import sparse
from gensim import corpora, models, similarities
import logging





#logging.basicConfig(format='%(asctime)s : %(levelname)s : %(message)s', level=logging.INFO)

AllUsersCorpusFile     = './tmp/initCorp.mm'
AllUsersDictionaryFile = './tmp/init.dict'
AllUsersSimilarityFile = './tmp/similarities.index'
#AllUsersModelFile

UserCorpora      = './tmp/UserCorpora/'
UserDictionaries = './tmp/UserDictionaries/'
UserSimIndices   = './tmp/UserSimIndices/'


TokensOnceFile = './tmp/tokens_once.dict'
# TODO - read file into dictionary


#tokens_once_dict   = read_file_into_dictionary(TokensOnceFile)


# NOTE: CAN USE DictinoaryHash FOR FASTER LOOKUP - NO LONGER GUARANTEED ID MAPPING IS A BIJECTION (COLLISIONS POSSIBLE)

all_users_tokens_once_dict   = corpora.Dictionary([[]])
all_users_tokens_once_dict.load_from_text(TokensOnceFile)
all_users_tokens_once_dict.add_documents([['word1', 'word2']])
all_users_tokens_once_dict.save_as_text(TokensOnceFile)

all_users_tokens_once_object = {}

with open(TokensOnceFile) as f:
    for line in f.readlines():
        all_users_tokens_once_object[line.split()[1]] = line.split()[0]

print '\n\nt_o_o:\n\n'
print all_users_tokens_once_object

# for word in tokens_once_dict:
#     tokens_once_object[word] = 1

all_users_dictionary_object = {}

all_users_dict   =  corpora.Dictionary([['blocker', 'vaccinated', 'werent', 'liked']])
all_users_dict.load_from_text(AllUsersDictionaryFile)

with open(AllUsersDictionaryFile) as f:
    for line in f.readlines():
        all_users_dictionary_object[line.split()[1]] = line.split()[0]
print '\n\na_u_d_o:\n\n'
print all_users_dictionary_object

# for word in all_users_dict:
#     all_users_dictionary_object[word] = 1



# Needed? How well can we access the dictionary file using gensim directly?
# vs. implementing the below  (VERDICT: SEEMS TO BE UNNECESSARY)
# all_users_dictionary = read_file_into_dictionary(AllUsersDictionaryFile)
# def read_file_into_dictionary(file):
#     dictionary = {}
#     return dictionary



# Open connection to the database
credentials = json.load(open(os.path.abspath(os.path.join(os.path.dirname(__file__),"../config/dbconfig.json"))))

# Import config for Python server
pyserver = json.load(open(os.path.abspath(os.path.join(os.path.dirname(__file__),"../config/python.json"))))
print pyserver




def filter(clipping):
    print "\n\n\n\nbefore:\n\n"
    print clipping
    print ":\n\n"


    stopwords = "a,able,about,across,after,all,almost,also,am,among,an,and,any,are,as,at,be,because,been,but,by,can,cannot,could,dear,did,do,does,either,else,ever,every,for,from,get,got,had,has,have,he,her,hers,him,his,how,however,i,if,in,into,is,it,its,just,least,let,like,likely,may,me,might,most,must,my,neither,no,nor,not,of,off,often,on,only,or,other,our,own,rather,said,say,says,she,should,since,so,some,than,that,the,their,them,then,there,these,they,this,tis,to,too,twas,us,wants,was,we,were,what,when,where,which,while,who,whom,why,will,with,would,yet,you,your"
    stopwords = stopwords.split(",")
    filtered = [trim(token.lower()) for token in clipping if "\'" not in token and token not in string.punctuation]
    filtered = [trim(token) for token in filtered if len(token) > 0]
    filtered = [trim(token) for token in filtered if token not in stopwords]

    tokens_once = set(word for word in filtered if filtered.count(word) == 1)

    # These tokens occur once in clipping - we want to know if they occur once in the corpus of all users
    # If they're in the dictionary, we've already encountered at least 2 instances, so remove them from tokens_once 
    # If they're not in dictionary, check them against the global tokens_once_dict (t_o_d)
    #    if in t_o_d, remove from global tokens_once_dict, remove from this tokens_once set, and add to dictionary
    #       else, add to t_o_d, leave them in tokens_once to be removed in the next line

    words_to_add_to_tokens_once_dictionary = []
    words_to_add_to_all_users_dictionary = []

    print '\n\n Examining once-occurring words \n\n'

    for word in tokens_once:
        if word in all_users_dictionary_object:
            tokens_once = tokens_once - set(word)
            #print 'here 1'
            #print '\n'
        else:
            if word in all_users_tokens_once_object:
                del all_users_tokens_once_object[word]
                tokens_once = tokens_once - set(word)
                all_users_dictionary_object[word] = -1;   # don't yet know dictionary id
                words_to_add_to_all_users_dictionary.append(word)
                # print 'here 2'
                # print '\n'
            else:
                all_users_tokens_once_object[word] = -1;
                words_to_add_to_tokens_once_dictionary.append(word)
                # print 'here 3'
                # print '\n'

    # Need 2-D lists?
    all_users_dict.add_documents([words_to_add_to_all_users_dictionary])
    all_users_tokens_once_dict.add_documents([words_to_add_to_tokens_once_dictionary])

    # CHECK THIS <---------- <------- <--------

    #tokens_once_dict.add_documents(words_to_add_to_tokens_once_dictionary)


    # 'hypertensionstrokes', 'premiummaybe'  <------ note: EXAMINE OTHER WORD-FUSION MISTAKES LIKE THIS WITHIN T1


    print "\n\n T1: \n\n"
    print tokens_once
    print "\n\n T1 dict: \n\n"
    with open(TokensOnceFile) as f:
        for line in f.readlines():
            print line.split()[1]

    # Write to file
    all_users_tokens_once_dict.save_as_text(TokensOnceFile)   # TO DO: instead of creating a dict for this, write it line by line to simple .txt file

    # print "\n\n T1: \n\n"
    # print tokens_once

    filtered = [word for word in filtered if word not in tokens_once]

    print "\n\n\n\n\n\nafter:\n\n"
    print filtered
    print ":\n\n"

    return filtered

def trim(s):
    if s.endswith(".\""): s = s[:-2]
    if s.endswith("\"") or s.endswith("."): s = s[:-1]
    if s.startswith("\"") or s.startswith("."): s = s[1:]
    unicodeStart = string.find(s,'\xe2')
    if unicodeStart != -1: 
      unicodeEnd = unicodeStart + 3
      s = s[:unicodeStart] + s[unicodeEnd:]
    return s



class RPC(object):

    def process_new_article(self, clipping_id, user_id):
    #def remove_html_and_tokenize_clipping_content(self, clipping_id):
        # Open connection to the database
        conn = psycopg2.connect(host=credentials["host"],database=credentials["database"],user=credentials["user"],password=credentials["password"])
        cur = conn.cursor()
        # Remove html from the content and tokenize
        cur.execute("SELECT content FROM clippings WHERE id = (%s)", ([clipping_id]))
        content = cur.fetchone()[0]
        content_sans_html = BeautifulSoup(content, "lxml").get_text()
        cur.execute("UPDATE clippings SET content_sans_html = (%s) WHERE id = (%s)", (content_sans_html, clipping_id))
        cur.execute("UPDATE clippings SET content_sans_html_tokenized = (%s) WHERE id = (%s)", ([word for sent in sent_tokenize(content_sans_html) for word in word_tokenize(sent)], clipping_id))
        cur.execute("SELECT content_sans_html_tokenized FROM clippings")
        tokenized = cur.fetchone()[0]
        # Save the changes to the database

        filtered = filter(tokenized)

        recommendations = fold_in_new_user_clipping(self, cursor, clipping_id, user_id)

        conn.commit()
        # Close database connection
        cur.close()
        conn.close()

        return "Cleaned the content of HTML and tokenized"


    def fold_in_new_user_clipping(self, cursor, clipping_id, user_id):
        


        return recommendations



def fetchTokenizedClippings(tokenized_ids):
    clippings = [];
#(first_tokenized, last_tokenized)
    conn = psycopg2.connect(host=credentials["host"],database=credentials["database"],user=credentials["user"],password=credentials["password"])
    cur = conn.cursor()
    # Remove html from the content and tokenize

    for cl_id in tokenized_ids:
      # print cl_id
      print "\n\n"
    #range(first_tokenized, last_tokenized):
      cur.execute("SELECT content_sans_html_tokenized FROM clippings WHERE id=(%s)", ([cl_id]) )
      #word_tokenize("hello there world how ya doin!")  #(cur.fetchone()[0])
      tokenizedClipping= cur.fetchone()[0]    #[word for sent in sent_tokenize(cur.fetchone()[0]) for word in word_tokenize(sent)]

      tokenizedClipping = filter(tokenizedClipping)

      #nltk.word_tokenize(nltk.sent_tokenize(cur.fetchone()[0]))
      clippings.append(tokenizedClipping)
      #print "\n\n\n\n\n\n" + str(cl_id) + ":\n\n"
      #print tokenizedContent

    cur.close()
    conn.close()

    return clippings



clippings = fetchTokenizedClippings([2,3, 290])

dictionary = corpora.Dictionary(clippings)




dictionary.save_as_text(AllUsersDictionaryFile)

corpus = [dictionary.doc2bow(clipping) for clipping in clippings]



corpora.MmCorpus.serialize(AllUsersCorpusFile, corpus) # store to disk, for later use

print "printing corpus: \n\n"
print corpus
print "\n\n printing dictionary\n\n"
print dictionary
print "\n\nprinting token-id mappings: \n\n"
print dictionary.token2id

tfidf = models.TfidfModel(corpus) # step 1 -- initialize a model
corpus_tfidf = tfidf[corpus]

print "\n\n printing clippings: \n\n"

for clipping in corpus_tfidf:
    print clipping
    print "\n\n\n"

lsi = models.LsiModel(corpus_tfidf, id2word=dictionary, num_topics=3)
corpus_lsi = lsi[corpus_tfidf]

print "\n\nprinting topics: \n\n"
lsi.print_topics(3)         # WHY NOT DISPLAYING?  <--- ASK LIST? 

print "printing docs: \n\n"
for doc in corpus_lsi:   # both bow->tfidf and tfidf->lsi transformations are actually executed here, on the fly
    print "\n\n\n"
    print doc

doc =     "Health care coverage"
vec_bow = dictionary.doc2bow(doc.lower().split())   # WILL BE REPLACED BY 
vec_lsi = lsi[vec_bow]                              # convert the query to LSI space

print "\n\n"
print doc
print "\n\n"
print vec_lsi

index = similarities.MatrixSimilarity(lsi[corpus])



index.save('./tmp/similarities.index')
# When loading: from  http://radimrehurek.com/gensim/tut3.html --- 
# When in doubt, use similarities.Similarity, as it is the most scalable version, 
# and it also supports adding more documents to the index later: 
#              index.add_documents()

sims = index[vec_lsi]
print "\n\n\nsimilarities by article: \n\n"
print list(enumerate(sims))
print "\n\n"


sims = sorted(enumerate(sims), key=lambda item: -item[1])
print "\n\n ranked articles: \n\n"
print sims
print "\n\n"


# WRITE:
# FLOW FOR RECEIVING NEW BMARK, PARSING & FILTERING w.r.t. TO ENTIRE CORPUS  <-- DONE
# LOAD USER CORPUS
# FETCH RECOMMENDATION FOR THIS ARTICLE
# FETCH RECOMMENDATION FOR ALL ARTICLES
# (COMPUTE & ) STORE RECOMMENDATION FOR THIS ARTICLE
# (RECOMPUTE & ) STORE RECOMMENDATIONS FOR ALL ARTICLES
#



#model.add_documents(another_tfidf_corpus) # now LSI has been trained on tfidf_corpus + another_tfidf_corpus
#   lsi_vec = model[tfidf_vec] # convert some new document into the LSI space, without affecting the model



#print texts

# for clipping in corpus:
#   print "\n\n\n\n\n\n" + str(clipping) + ":\n\n"
#   print clipping


s = zerorpc.Server(RPC())
s.bind("tcp://0.0.0.0:" + pyserver["port"])
s.run()