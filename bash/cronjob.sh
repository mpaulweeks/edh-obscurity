#!/bin/sh
git checkout master
git pull
source venv/bin/activate
python py/update.py
rm temp/*.json
