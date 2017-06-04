
import requests
from bs4 import BeautifulSoup

EDHREC_BASE_URL = 'https://edhrec.com/commanders/%s/'
COMMANDER_PAGE_SLUGS = frozenset([
    'w',
    'u',
    'b',
    'r',
    'g',
    'colorless',
    'wu',
    'ub',
    'br',
    'rg',
    'gw',
    'wb',
    'ur',
    'bg',
    'rw',
    'gu',
    'wub',
    'ubr',
    'brg',
    'rgw',
    'gwu',
    'wbg',
    'urw',
    'bgu',
    'rwb',
    'gur',
    'wubr',
    'ubrg',
    'brgw',
    'rgwu',
    'gwub',
    'wubrg',
])


def crawl_commanders_page(page_slug):
    url = EDHREC_BASE_URL % page_slug
    req = requests.get(url)
    print(req.status_code, url)
    if(req.status_code != 200):
        return

    soup = BeautifulSoup(req.text, 'html.parser')

    counts = []
    card_containers = soup.find_all(class_='nw')
    for container in card_containers:
        card_name = container.find(class_='nwname').get_text().strip()
        card_desc = container.find(class_='nwdesc').get_text().strip()
        if 'of' not in card_desc:
            card_count = card_desc.split(' ')[0]
            counts.append([card_name, card_count])
    return counts


def crawl_edhrec():
    counts = []
    for slug in COMMANDER_PAGE_SLUGS:
        counts.extend(crawl_commanders_page(slug))
    for card in counts:
        print(card)
    return counts
