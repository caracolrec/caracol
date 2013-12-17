# Simple scraper to generate a corpus of clippings for testing the recommendation algorithm

import urllib
import urllib2
import urlparse
import lxml.html
import lxml.cssselect

def process_reddit_page(url):
    # open url that contains links
    url = url
    headers = {'User-Agent' : 'Mozilla 5.10'}
    request = urllib2.Request(url, None, headers)
    response = urllib2.urlopen(request)

    tree = lxml.html.fromstring(response.read())

    # create array of links
    links = []
    entries = tree.find_class("entry")
    for entry in entries:
        url = entry.cssselect('p.title > a')[0].get('href')
        domain = urlparse.urlparse(url).netloc
        if domain != 'youtu.be' and domain != 'www.youtube.com':
            links.append(url)

    # for each link in the array, ping the caracol route created for the purpose
    for link in links:
        url = 'http://127.0.0.1:3000/testcorpus'
        headers = {'User-Agent' : 'Mozilla 5.10'}
        data = urllib.urlencode({ "uri" : link })
        request = urllib2.Request(url, data, headers)
        try:
            response = urllib2.urlopen(request)
            print response.getcode()
        except:
            print 'Failed to save the clipping:' + link

# Tuple of Reddit urls
reddit_urls = (
    'http://www.reddit.com/r/Meditation/search?q=mindfulness+self%3Ano&restrict_sr=on&sort=relevance&t=all',
    'http://www.reddit.com/r/Meditation/search?q=mindfulness+self%3Ano&restrict_sr=on&sort=relevance&t=all&count=25&after=t3_18b520',
    'http://www.reddit.com/r/Meditation/search?q=mindfulness+self%3Ano&restrict_sr=on&sort=relevance&t=all&count=50&after=t3_14rqlp',
    'http://www.reddit.com/r/Meditation/search?q=mindfulness+self%3Ano&restrict_sr=on&sort=relevance&t=all&count=75&after=t3_yypn3'
)

for url in reddit_urls:
  process_reddit_page(url)
