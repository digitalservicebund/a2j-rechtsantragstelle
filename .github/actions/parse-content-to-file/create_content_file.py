#!/usr/bin/env python3

import os
import requests
import json

STRAPI_API = os.getenv('STRAPI_API')
STRAPI_ACCESS_KEY = os.getenv('STRAPI_ACCESS_KEY')
CONTENT_FILE_PATH = os.getenv('CONTENT_FILE_PATH')
PAGE_SIZE = 10

relevant_api_ids = ['amtsgericht-common', 'footer', 'page-header', 'cookie-banner', 'pages', 'result-pages', 'vorab-check-common', 'vorab-check-pages', 'form-flow-pages', 'global']

def is_last_page(response):
    meta_information = response["meta"]
    return "pagination" not in meta_information or meta_information["pagination"]["page"] >= \
            meta_information["pagination"]["pageCount"]


def collect_all_collection_data(collection_id):
    page = 1
    all_collection_data = []
    while True:
        res = requests.get(
            f"{STRAPI_API}{collection_id}?populate=deep&locale=all&pagination[pageSize]={PAGE_SIZE}&pagination[page]={page}",
            headers={
                "Authorization": f"Bearer {STRAPI_ACCESS_KEY}",
            })
        print(f"status code {res.status_code} for getting {collection_id} on page {page}")
        assert res.status_code == 200

        response_json = json.loads(res.text)
        if isinstance(response_json["data"], dict):
            return response_json["data"]
        else:
            all_collection_data += response_json["data"]

        if is_last_page(response_json):
            break
        else:
            page += 1
    return all_collection_data


def write_content_to_file(api_ids):
    with open(CONTENT_FILE_PATH, "w+") as f:
        f.write("{")
        for idx, collection_id in enumerate(api_ids):
            collection_data = collect_all_collection_data(collection_id)
            f.write('"' + collection_id + '": ' + json.dumps(collection_data))
            if not idx == len(api_ids) - 1:
                f.write(",")
        f.write("}")


write_content_to_file(relevant_api_ids)
