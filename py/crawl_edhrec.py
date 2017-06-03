

COMMANDER_PAGE_SLUGS = frozenset([
    'w',
    'u',
    'b',
    'r',
    'g',
    'colorless',
    'gwub'
])


def crawl_commanders_page(page_slug):
    # return tuples of name, count
    pass


def crawl_edhrec():
    counts = []
    for slug in COMMANDER_PAGE_SLUGS:
        counts.extend(crawl_commanders_page(slug))
    return counts
