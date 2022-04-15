import requests
import json
import csv
#import Projekt.Informations
import os

def getDataFromRes(res, dataDestination) :
    dataName = "data"
    curr = res[dataName]
    for dest in dataDestination:
        curr = curr[dest]
    return curr

def getTimeStamp(res) :
    timeStampName = "timestamp"
    return res[timeStampName]

def getNext(res) :
    next = "next"
    return res[next]

def getInfo(res) :
    info = "info"
    return res[info]

def getOldData(res) :
    data = "data"
    return res["data"]

def getLastDate(res) :
    index = 0
    name = "name"
    return res[index][name]

def getOldFile(filePath) :
    json_file =  open(filePath)
    json_data = json.load(json_file)
    info = getInfo(json_data)
    oldData = getOldData(json_data)
    lastDate = getLastDate(oldData)
    return info, oldData, lastDate

def main(url, dataDestination, dateToStart, confPath, filePath, is_chart = True, update = False) :
    flag_continue = True
    newData = []
    # valueTab = []
    # dateTab = []
    # zastąpione przed newData
    if update :
        info, oldData, dateToStart = getOldFile(filePath)
    else :
        oldData = []
        info = {}
        is_chart = "True"

        chart_data = json_data["screen_info"]["screen1"]["charts"]["chart1"]
        # print(chart_data)
        # chart_data.pop("url_list")

        info["is_chart"] = is_chart
        info["vertical"] = chart_data["vertical"]
        info["horizontal"] = chart_data["horizontal"]
        info["color_list"] = chart_data["color_list"]
        info["name"] = chart_data["name"]
        info["type"] = chart_data["type"]

    # print(info)

    while flag_continue :
        response = requests.get(url, timeout=30)
        response.raise_for_status()
        j = json.loads(response.content)
        # print(j)
        js = json.dumps(j, indent = 2)
        # print(js)
        resultsName = "results"
        url = getNext(j)
        if url == None :
            flag_continue = False
        for res in j[resultsName] :
            value = getDataFromRes(res, dataDestination)
            timeStamp = getTimeStamp(res)
            if timeStamp > dateToStart or not update and timeStamp >= dateToStart:
                newData.append({"name" : timeStamp, "value" : value})
            else :
                flag_continue = False
                break

    data = newData + oldData

    json_file =  open(confPath)
    json_data = json.load(json_file)

    dateValue = {"info" : [info], "data" : data}
    # path_to_save = "../resources/data.json"
    # zastąpione prze filePath
    with open(filePath, "w") as write_file :
        json.dump(dateValue, write_file, indent=4)



if __name__ == "__main__" :
    url = "https://datahub.ki.agh.edu.pl/api/endpoints/70/data/"
    dataDestination = ["heater", "tempSet"]
    dateToStart = "2022-04-15T08:27:34+02:00"
    confPath = os.path.realpath(os.path.join(os.path.dirname(__file__), '..', '..', 'Informations', 'example.json'))
    main(url, dataDestination, dateToStart, confPath, "../resources/data.json", True, True)





    # json_file =  open(confPath)
    # json_data = json.load(json_file)
    # print(json_data)

