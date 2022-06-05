import requests
import json

url = 'http://127.0.0.1:8000/api/configuration'
body = {"name": "example1.json"}
resp = requests.post(url=url, data=body, files=None) 
print(resp)