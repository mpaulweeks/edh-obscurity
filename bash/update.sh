#!/bin/sh
source venv/bin/activate
python py/update.py
rm temp/*.json
