import requests
import json

url = 'http://127.0.0.1:8000/api/configuration'
body = {"name": "example2.json"}
resp = requests.post(url=url, data=body, files=None) 
print(resp)