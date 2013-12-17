import urllib2
import urlparse
import lxml.html
import lxml.cssselect

# open url that contains links
url = 'http://www.reddit.com/r/Meditation/search?q=mindfulness+self%3Ano&restrict_sr=on&sort=relevance&t=all'
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

print links

# for each link in the array, ping the caracol route created for the purpose