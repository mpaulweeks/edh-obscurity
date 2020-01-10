
import json

import requests

EDHREC_BASE_URL = 'https://edhrec-json.s3.amazonaws.com/en/commanders/%s.json'

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


def scrape_commanders_json(color_slug):
    url = EDHREC_BASE_URL % color_slug
    req = requests.get(url)
    print(req.status_code, url)
    if(req.status_code != 200):
        return

    json_obj = req.json()['container']['json_dict']
    cards = json_obj['cardlists'][0]['cardviews']
    counts = []
    for card in cards:
        card_name = card['name']
        card_count = int(card['label'].split(' ')[0])
        counts.append([card_name, card_count])
    return counts


def scrape_edhrec_json():
    counts = []
    for slug in COMMANDER_PAGE_SLUGS:
        counts.extend(scrape_commanders_json(slug))
    for card in counts:
        print(card)
    return counts


if __name__ == "__main__":
    print(scrape_commanders_json('b'))
