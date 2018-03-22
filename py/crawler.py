
import json

import requests

EDHREC_BASE_URL = 'https://edhrec.com/commanders/%s'
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

    text = req.text
    json_str = text.split('var json_dict = ')[1].split(';\n')[0]
    json_obj = json.loads(json_str)
    cards = json_obj['cardlists'][0]['cardviews']
    counts = []
    for card in cards:
        card_name = card['name']
        card_count = int(card['label'].split(' ')[0])
        counts.append([card_name, card_count])
    return counts


def crawl_edhrec():
    counts = []
    for slug in COMMANDER_PAGE_SLUGS:
        counts.extend(crawl_commanders_page(slug))
    for card in counts:
        print(card)
    return counts


if __name__ == "__main__":
    print(crawl_commanders_page('b'))
