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
    return res[data]

def getLastDate(res) :
    index = 0
    name = "name"
    return res[index][name]

def getOldFile(filePath) :
    json_file =  open(filePath)
    json_data = json.load(json_file)
    # info = getInfo(json_data)
    oldData = getOldData(json_data)
    lastDate = getLastDate(oldData)
    return oldData, lastDate

def downloadSingleChart(chart, chartNum, confPath, dateToStart):
    filePaths = []
    for i in range(len(chart["url_list"])):
        num = str(i + 1)
        urlKey = "url" + num
        dataDestinationKey = "data_destination" + num
        dataNameKey = "data_name" + num
        colorKey = "color" + num
        url = chart["url_list"][urlKey]
        dataDestinationList = chart["data_destination_list"][dataDestinationKey]
        dataDestination = []
        for dest in dataDestinationList:
            dataDestination.append(dest["dest"])
        dataName = chart["data_names"][dataNameKey]
        # print(url)
        # print(dataDestination)
        # print(dataName)
        dataFilePath = "../resources/chart_" + chartNum +"_data_" + num + ".json"
        filePaths.append(dataFilePath)
        downloadData(url, dataDestination, dateToStart, confPath, dataFilePath, True)
    return filePaths

def downlaodSingleDisplayLiveValue(value, chartNum, confPath, dateToStart):
    url = value["url"]
    dataDestinationList = value["data_destination"]
    dataDestination = []
    for dest in dataDestinationList:
        dataDestination.append(dest["dest"])
    dataFilePath = "../resources/chart_" + chartNum + "_data" + ".json"
    downloadData(url, dataDestination, dateToStart, confPath, dataFilePath, False)
    return dataFilePath

def getScreenInfo(screen, screenName):
    info = {}
    info["layout"] = screen["layout"]
    info["tile_size"] = screen["tile_size"]
    info["chart_on_screen_number"] = screen["chart_on_screen_number"]
    chartsInfo = {}
    chartNum = 1
    for chartName in screen["charts"]:
        chart = screen["charts"][chartName]
        dataFilePaths = downloadSingleChart(chart, str(chartNum), confPath, dateToStart)
        thisChart = {}
        thisChart["is_chart"] = True
        thisChart["vertical"] = chart["vertical"]
        thisChart["horizontal"] = chart["horizontal"]
        dataList = {}
        for dataNum in range(len(chart["url_list"])):
            strNum = str(dataNum+1)
            dataName = "data" + strNum
            dataInfo = {}
            dataInfo["color"] = chart["color_list"]["color" + strNum]
            dataInfo["file_name"] = dataFilePaths[dataNum]
            dataInfo["data_name"] = chart["data_names"]["data_name" + strNum]
            dataList[dataName] = dataInfo
        thisChart["data_list"] = dataList
        chartsInfo["chart" + str(chartNum)] = thisChart
        chartNum+=1
    for singleValueName in screen["displayed_live_values"]:
        singleValue = screen["displayed_live_values"][singleValueName]
        print(singleValue)
        dataFilePath = downlaodSingleDisplayLiveValue(singleValue, str(chartNum), confPath, dateToStart)
        thisChart = {}
        thisChart["is_chart"] = False
        # thisChart["vertical"] = singleValue["vertical"]
        # thisChart["horizontal"] = singleValue["horizontal"]
        dataList = {}
        dataName = "data"
        dataInfo = {}
        # dataInfo["color"] = singleValue["color"]
        dataInfo["file_name"] = dataFilePath
        dataInfo["data_name"] = singleValue["name"]
        dataList[dataName] = dataInfo
        thisChart["data_list"] = dataList
        chartsInfo["chart" + str(chartNum)] = thisChart
        chartNum += 1
    info["charts"] = chartsInfo
    fileName = "../resources/" + screenName + ".json"
    with open(fileName, "w") as write_file :
        json.dump(info, write_file, indent=4)

def downloadData(url, dataDestination, dateToStart, confPath, filePath, is_chart = True, update = False) :
    flag_continue = True
    newData = []
    # valueTab = []
    # dateTab = []
    # zastąpione przed newData
    if update :
        oldData, dateToStart = getOldFile(filePath)
    else :
        oldData = []
        # info = {}
        # json_file = open(confPath)
        # json_data = json.load(json_file)
        #
        # chart_data = json_data["screen_info"]["screen1"]["charts"]["chart1"]
        #
        # info["is_chart"] = is_chart
        # info["vertical"] = chart_data["vertical"]
        # info["horizontal"] = chart_data["horizontal"]
        # info["color_list"] = chart_data["color_list"]
        # info["name"] = chart_data["name"]
        # info["type"] = chart_data["type"]
        #
        # info = [info]

    # print(info)

    while flag_continue :
        response = requests.get(url, timeout=30)
        response.raise_for_status()
        j = json.loads(response.content)
        # print(j)
        # js = json.dumps(j, indent = 2)
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


    if update :
        dateValue = {"data" : data}
    else :
        dateValue = {"data" : data}
    # path_to_save = "../resources/data.json"
    # zastąpione prze filePath
    with open(filePath, "w") as write_file :
        json.dump(dateValue, write_file, indent=4)



if __name__ == "__main__" :

    url = "https://datahub.ki.agh.edu.pl/api/endpoints/70/data/"
    dataDestination = ["heater", "tempSet"]
    dateToStart = "2022-04-29T08:27:34+02:00"

    # odtąd nowy kod
    confPath = "../../Informations/example1.json"
    confJsonFile = open(confPath)
    confData = json.load(confJsonFile)
    screenAmount = confData["general_info"]["number_of_screens"]
    for num in range(screenAmount):
        screenNumber = num + 1
        screenName = "screen" + str(screenNumber)
        screen = confData["screen_info"][screenName]
        getScreenInfo(screen, screenName)
        # chartNum = 1
        # for chartName in screen["charts"]:
        #     chart = screen["charts"][chartName]
        #     # linijka do odkomentowania
        #     downloadSingleChart(chart, str(chartNum), confPath, dateToStart)
        #     chartNum += 1
        # liveValueNum = 1
        # for singleValueName in screen["displayed_live_values"]:
        #     singleValue = screen["displayed_live_values"][singleValueName]
        #     print(singleValue)
        #     downlaodSingleDisplayLiveValue(singleValue, str(liveValueNum), confPath, dateToStart)
        #     liveValueNum += 1


    # dotąd ===============================================================================================


    # downloadData(url, dataDestination, dateToStart, confPath, "../resources/data.json", True, True)





    # json_file =  open(confPath)
    # json_data = json.load(json_file)
    # print(json_data)

