import boto3

s3_client = boto3.client(
    "s3",
    endpoint_url=f"http://localhost:4566",
    aws_access_key_id="test",
    aws_secret_access_key="test",
    region_name="eu-central-1"
)

s3_client.create_bucket(Bucket="a2j-data-storage", CreateBucketConfiguration={
    'LocationConstraint': 'eu-central-1'})
