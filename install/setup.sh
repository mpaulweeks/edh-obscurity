#!/bin/sh
virtualenv venv
source venv/bin/activate
pip install --upgrade pip
pip install requests[security]
pip install bs4
pip install boto3
