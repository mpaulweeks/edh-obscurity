
import json

from crawler import crawl_edhrec
from s3 import upload_s3


def generate_card_list():
    data_path = 'temp/edh_deck_counts.json'

    out = crawl_edhrec()

    with open(data_path, 'wb') as f:
        json.dump(
            out,
            f,
            # indent=4,
            sort_keys=True,
            separators=(',', ':')
        )
    upload_s3(data_path)


generate_card_list()
