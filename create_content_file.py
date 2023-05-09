import os
import requests
import json

CMS_URL = os.getenv('STRAPI_HOST')
CMS_AUTH_TOKEN = os.getenv('STRAPI_ACCESS_KEY')
TARGET_FILE_PATH = os.getenv('CONTENT_FILE_PATH', "build/content.json")
PAGE_SIZE = 10


def get_all_collection_types():
    collection_types_response = requests.get(f"{CMS_URL}/api/content-type-builder/content-types", headers={
        "Authorization": f"Bearer {CMS_AUTH_TOKEN}",
    })
    assert collection_types_response.status_code == 200
    return json.loads(collection_types_response.text)


def map_collection_type_to_api_identifier(collection_type):
    if collection_type["schema"]["kind"] == "singleType":
        return collection_type["schema"]["singularName"]
    return collection_type["schema"]["pluralName"]


def get_relevant_api_ids(collection_types):
    relevant_collection_types = list(
        filter(lambda collection_type: "api::" in collection_type["uid"], collection_types["data"]))
    return list(map(map_collection_type_to_api_identifier, relevant_collection_types))


def is_last_page(response):
    meta_information = response["meta"]
    return "pagination" not in meta_information or meta_information["pagination"]["page"] >= \
            meta_information["pagination"]["pageCount"]


def collect_all_collection_data(collection_id):
    page = 1
    all_collection_data = []
    while True:
        res = requests.get(
            f"{CMS_URL}/api/{collection_id}?populate=deep&pagination[pageSize]={PAGE_SIZE}&pagination[page]={page}",
            headers={
                "Authorization": f"Bearer {CMS_AUTH_TOKEN}",
            })
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
    with open(TARGET_FILE_PATH, "w+") as f:
        f.write("{")
        for idx, collection_id in enumerate(api_ids):
            collection_data = collect_all_collection_data(collection_id)
            f.write('"' + collection_id + '": ' + json.dumps(collection_data))
            if not idx == len(api_ids) - 1:
                f.write(",")
        f.write("}")


collection_types = get_all_collection_types()
relevant_api_ids = get_relevant_api_ids(collection_types)
write_content_to_file(relevant_api_ids)
