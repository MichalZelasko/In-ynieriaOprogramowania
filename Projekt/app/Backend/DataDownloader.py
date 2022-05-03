import requests
import json
# import Projekt.Informations
# import os


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


def downloadSingleChart(chart, chartNum, confPath, dateToStart) :
    filePaths = []

    for i in range(len(chart["url_list"])) :
        num = str(i + 1)
        urlKey, dataDestinationKey = "url" + num, "data_destination" + num
        url, dataDestinationList, dataDestination  = chart["url_list"][urlKey], chart["data_destination_list"][dataDestinationKey], []
        for dest in dataDestinationList:
            dataDestination.append(dest["dest"])
        dataFilePath = "../resources/chart_" + chartNum +"_data_" + num + ".json"
        filePaths.append(dataFilePath)
        downloadData(url, dataDestination, dateToStart, confPath, dataFilePath, True)

    return filePaths


def downlaodSingleDisplayLiveValue(value, chartNum, confPath, dateToStart) :
    url = value["url"]
    dataDestinationList = value["data_destination"]
    dataDestination = []

    for dest in dataDestinationList :
        dataDestination.append(dest["dest"])
    dataFilePath = "../resources/chart_" + chartNum + "_data" + ".json"
    downloadData(url, dataDestination, dateToStart, confPath, dataFilePath, False)
    
    return dataFilePath


def getScreenInfo(screen, screenName) :
    info =  {
            "layout" : screen["layout"], 
            "tile_size" : screen["tile_size"], 
            "chart_on_screen_number" : screen["chart_on_screen_number"]
            }
    chartsInfo, chartNum = {}, 1
    
    for chartName in screen["charts"]:
        chart = screen["charts"][chartName]
        dataFilePaths, dataList = downloadSingleChart(chart, str(chartNum), confPath, dateToStart), {}
        for dataNum in range(len(chart["url_list"])) :
            strNum = str(dataNum + 1)
            print(strNum)
            dataName = "data" + strNum
            dataInfo = {
                            "color" : chart["color_list"]["color" + strNum],
                            "file_name" : dataFilePaths[dataNum],
                            "data_name" : chart["data_names"]["data_name" + strNum]
                       }
            dataList[dataName] = dataInfo
        
        thisChart = {
                    "is_chart" : True, 
                    "vertical" : chart["vertical"], 
                    "horizontal" : chart["horizontal"],
                    "data_list" : dataList
                    }
        chartsInfo["chart" + str(chartNum)] = thisChart
        chartNum += 1
    
    for singleValueName in screen["displayed_live_values"] :
        singleValue = screen["displayed_live_values"][singleValueName]
        print(singleValue)
        dataFilePath = downlaodSingleDisplayLiveValue(singleValue, str(chartNum), confPath, dateToStart)
        thisChart = {
                        "is_chart" : False
                        # "vertical" : singleValue["vertical"]
                        # "horizontal" : singleValue["horizontal"]
                    }
        dataList, dataName = {}, "data"
        dataInfo = {
                    "file_name" : dataFilePath,
                    "data_name" : singleValue["name"]
                    # "color" : singleValue["color"]
                   }
        dataList[dataName] = dataInfo
        thisChart["data_list"] = dataList
        chartsInfo["chart" + str(chartNum)] = thisChart
        chartNum += 1

    info["charts"] = chartsInfo
    fileName = "../resources/" + screenName + ".json"
    with open(fileName, "w") as write_file :
        json.dump(info, write_file, indent=4)


def downloadData(url, dataDestination, dateToStart, filePath, update = False) : # stare parametry, confPath i is_chart
    newData = []
    if update :
        oldData, dateToStart = getOldFile(filePath)
    else :
        oldData = []

    timeStamp = dateToStart
    while timeStamp >= dateToStart and url != None:
        response = requests.get(url, timeout=30)
        response.raise_for_status()
        j = json.loads(response.content)
        url = getNext(j)

        for res in j["results"] :
            value = getDataFromRes(res, dataDestination)
            timeStamp = getTimeStamp(res)
            if timeStamp > dateToStart or not update and timeStamp >= dateToStart:
                newData.append({"name" : timeStamp, "value" : value})

    data = newData + oldData
    dateValue = {"data" : data}

    with open(filePath, "w") as write_file :
        json.dump(dateValue, write_file, indent = 4)



if __name__ == "__main__" :

    url = "https://datahub.ki.agh.edu.pl/api/endpoints/70/data/"
    dataDestination = ["heater", "tempSet"]
    dateToStart = "2022-04-29T08:27:34+02:00"

    # =============================================odtąd nowy kod============================================

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


    # ==============================================dotąd==============================================


    # downloadData(url, dataDestination, dateToStart, confPath, "../resources/data.json", True, True)





    # json_file =  open(confPath)
    # json_data = json.load(json_file)
    # print(json_data)

