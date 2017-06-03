
import json

from s3 import upload_s3


SPECIAL_CASES = frozenset([
    'Nahiri, the Lithomancer',
    'Teferi, Temporal Archmage',
    'Ob Nixilis of the Black Oath',
    'Daretti, Scrap Savant',
    'Freyalise, Llanowar\'s Fury',
])


def generate_card_list():
    data_path = 'temp/edh_deck_counts.json'

    cards_by_name = {}
    with open("local/AllCards.json") as json_file:
        all_cards = json.load(json_file)
    for card in all_cards.values():
        card_name = card["name"]
        match = card_name in SPECIAL_CASES or (
            'Legendary' in (card.get('supertypes') or []) and
            'Creature' in (card.get('types') or [])
        )
        if match:
            cards_by_name[card_name] = {
                "name": card_name,
                "decks": None,
            }

    with open(data_path, 'wb') as f:
        json.dump(
            out.to_json(),
            f,
            indent=4,
            sort_keys=True,
            separators=(',', ': ')
        )
    upload_s3(data_path)
