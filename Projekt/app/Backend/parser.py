import sys
from utils import Keywords, get_json_object_from_file, create_json_file

def generate_general_info_file(content: dict):
    create_json_file("../resources/general_info.json", content)

def generate_screen_info_file(screen: dict, screen_no: int):
    result_dict = {}
    for key in screen:
        if key in ("layout", "tile_size", "chart_on_screen_number"):
            result_dict[key] = screen[key]
    create_json_file(f"../resources/screen{screen_no}.json", result_dict)

def parse_config_file(file_path: str):
    json = get_json_object_from_file(file_path)
    generate_general_info_file(json[Keywords.GENERAL_INFO])
    for i, screen in enumerate(json[Keywords.SCREEN_INFO]):
        generate_screen_info_file(json[Keywords.SCREEN_INFO][screen], i + 1)

parse_config_file(sys.argv[1])