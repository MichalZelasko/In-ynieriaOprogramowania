from fastapi import FastAPI, HTTPException
from fastapi.responses import HTMLResponse, JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from utils import get_json_object_from_file

RESOURCES_PATH = "../resources/"

app = FastAPI()

origins = [
    "http://localhost:4200",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/", response_class=HTMLResponse)
def get_main_page():
    page_content = """
        <h1>IO DataHub</h1>
    """
    return HTMLResponse(content=page_content, status_code=200)

@app.get("/api/general_info", response_class=JSONResponse)
def get_general_info():
    try:
        general_info = get_json_object_from_file(RESOURCES_PATH + "general_info.json")
    except FileNotFoundError as err:
        raise HTTPException(status_code=404, detail=err.strerror)
    return JSONResponse(content=general_info, status_code=200)

@app.get("/api/screen/{screen_id}", response_class=JSONResponse)
def get_screen_info(screen_id: int):
    file_name = "screen" + str(screen_id) + ".json"
    try:
        screen_info = get_json_object_from_file(RESOURCES_PATH + file_name)
    except FileNotFoundError as err:
        raise HTTPException(status_code=404, detail=err.strerror)
    return JSONResponse(content=screen_info, status_code=200)

@app.get("/api/chart/{chart_id}/data/{data_id}", response_class=JSONResponse)
def get_data(chart_id: int, data_id: int):
    file_name = "chart_" + str(chart_id) + "_data_" + str(data_id) + ".json"
    try:
        js = get_json_object_from_file(RESOURCES_PATH + file_name)
    except FileNotFoundError as err:
        raise HTTPException(status_code=404, detail=err.strerror)
    return JSONResponse(content=js, status_code=200)