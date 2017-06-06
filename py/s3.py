
import json
import boto3


def _connect_to_bucket():
    with open("local/cred.json") as jsonFile:
        keys = json.load(jsonFile)
    session = boto3.Session(
        aws_access_key_id=keys['aws_access_key_id'],
        aws_secret_access_key=keys['aws_secret_access_key'],
        region_name=keys['s3_region_name'],
    )
    s3 = session.resource('s3')
    return s3.Bucket(keys['s3_bucket_name'])


def upload_s3(file_path):
    destination = 'edh_deck_counts.json'
    print ("uploading %s to %s" % (file_path, destination))
    with open(file_path, 'rb') as data:
        _connect_to_bucket().put_object(Key=destination, Body=data)


def download_s3(local_path):
    s3_path = 'edh_deck_counts.json'
    print ("downloading %s to %s" % (s3_path, local_path))
    _connect_to_bucket().download_file(Key=s3_path, Filename=local_path)
