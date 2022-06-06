import json
from dataclasses import dataclass

@dataclass(frozen=True)
class Keywords:
    GENERAL_INFO = "general_info"
    SCREEN_INFO = "screen_info"

def get_json_object_from_file(file_path: str) -> dict:
    with open(file_path, "r+") as file:
        json_file = json.loads(file.read())
    return json_file

def create_json_file(file_path: str, content: dict):
    with open(file_path, "w+") as file:
        json.dump(content, file)

def modifyPath(body) :
    i, path = 5, ""
    while i < len(body) :
        if body[i] == '%' : 
            path += "/"
            i += 3
        else :
            path += body[i]
            i += 1
    return path
