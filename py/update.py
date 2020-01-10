
from datetime import datetime
import json

from scrapeJson import scrape_edhrec_json
from s3 import upload_s3


def generate_card_list():
    counts = scrape_edhrec_json()

    data_path = 'temp/edh_deck_counts.json'

    with open("local/cred.json") as jsonFile:
        keys = json.load(jsonFile)
    json_out = {
        'bitly': keys['bitly_access_token'],
        'counts': counts,
        'updated': datetime.utcnow().isoformat(),
    }

    with open(data_path, 'wb') as temp_file:
        json.dump(
            json_out,
            temp_file,
            # indent=4,
            # sort_keys=True,
            separators=(',', ':')
        )
    upload_s3(data_path)


if __name__ == "__main__":
    generate_card_list()
