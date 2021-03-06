import requests
import json
from datetime import *
import threading
from dataConverter import convert
from utils import get_json_object_from_file

class MyDate :

    def __init__(self, dateTime) :
        if type(dateTime) == str :
            year, month, day = int(dateTime[0:4]), int(dateTime[5:7]), int(dateTime[8:10])
            hour, minute, seconds = int(dateTime[11:13]), int(dateTime[14:16]), int(dateTime[17:19])
            self.set(year, month, day, hour, minute, seconds)
        else :
            year, month, day = dateTime.year, dateTime.month, dateTime.day
            hour, minute, seconds = dateTime.hour, dateTime.minute, dateTime.second
            self.set(year, month, day, hour, minute, seconds)

    def set(self, year, month, day, hour, minute, seconds) :
        self.year, self.month, self.day = year, month, day
        self.hour, self.minute, self.seconds = hour, minute, seconds

    def diff(self, other, unit, number = 1) :
        if unit == "hour" :
            return self.year < self.year or self.month < other.month or self.day < other.day or self.hour < other.hour - number or (self.hour < other.hour - number + 1 and self.minute < other.minute)
        if unit == "day" :
            return self.year < self.year or self.month < other.month or self.day < other.day - number or (self.day < other.day - number + 1 and self.hour < other.hour)
        if unit == "month" :
            return self.year < self.year or self.month < other.month - number or (self.month < other.month and self.day - number + 1 < other.day)
        if unit == "year" :
            return self.year < other.year - number or (self.year < other.year - number + 1 and self.month < other.month)
        return True

    def __str__(self) :
        return f"{self.year}-{self.month}-{self.day} {self.hour}:{self.minute}:{self.seconds}"

    def comp(self, other) :
        if self.year > other.year : return True
        if self.year < other.year : return False
        if self.month > other.month : return True
        if self.month < other.month : return False
        if self.day > other.day : return True
        if self.day < other.day : return False
        if self.hour > other.hour : return True
        if self.hour < other.hour : return False
        if self.seconds > other.seconds : return True
        if self.seconds < other.seconds : return False
        return False


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


def addSparse(sparse_data, res, now, previous, dateToStart) :
    for record in res :
        mydate = MyDate(record["name"])
        if dateToStart.comp(mydate) : break
        if mydate.diff(now, "year") :
            if mydate.diff(previous, "month") :
                sparse_data.append(record)
                previous = mydate
        elif mydate.diff(now, "month") :
            if mydate.diff(previous, "day", 7) :
                sparse_data.append(record)
                previous = mydate
        elif mydate.diff(now, "day") :
            if mydate.diff(previous, "hour", 3) :
                sparse_data.append(record)
                previous = mydate
        else :
            sparse_data.append(record)
            previous = mydate
    return sparse_data


def getOldData(res, dateToStart) :
    data = "data"
    previous, now = MyDate(datetime.now()), MyDate(datetime.now())
    sparse_data, dateToStart = [], MyDate(dateToStart)
    return addSparse(sparse_data, res[data], now, previous, dateToStart)


def getLastDate(res) :
    if(len(res) == 0) : return None
    index = 0
    name = "name"
    return res[index][name]


def getOldFile(filePath, dateToStart) :
    json_file =  open(filePath)
    json_data = json.load(json_file)
    # info = getInfo(json_data)
    oldData = getOldData(json_data, dateToStart)
    lastDate = getLastDate(oldData)
    if lastDate == None : lastDate = dateToStart
    return oldData, lastDate


def runThreads(threads) :
    for thread in threads : thread.start()
    for thread in threads : thread.join()

def getStartDate(times):
    weeks = times["weeks"]
    days = times["days"]
    hours = times["hours"]
    minutes = times["minutes"]
    # print(weeks, days, hours, minutes)
    dateToSub = timedelta(weeks= weeks, days= days, hours=hours, minutes=minutes)
    now = datetime.now()
    dateToStart = (now - dateToSub).strftime("%Y-%m-%dT%H:%M:%S")
    return dateToStart

def downloadSingleChart(k, dataFilePathsList, chart, chartNum, unit, screenName, update = False) :
    filePaths, threads = [], []

    try :
        originalUnit = chart["original_unit"]
    except KeyError :
        originalUnit = "skip"

    for i in range(len(chart["url_list"])) :
        num = str(i + 1)
        urlKey, dataDestinationKey, dataTimeKey, dataMinMaxKey = "url" + num, "data_destination" + num, "data_time" + num, "data" + num
        dataTime = chart["period_of_time_to_download_data"][dataTimeKey]
        dateToStart = getStartDate(dataTime)
        url, dataDestinationList, dataDestination  = chart["url_list"][urlKey], chart["data_destination_list"][dataDestinationKey], []
        minValue, maxValue = chart["min_max_values"][dataMinMaxKey]["min"], chart["min_max_values"][dataMinMaxKey]["max"]
        for dest in dataDestinationList:
            dataDestination.append(dest["dest"])
        dataFilePath = "../resources/" + screenName + "_chart_" + chartNum +"_data_" + num + ".json"
        filePaths.append(dataFilePath)
        threads.append(threading.Thread(target = downloadData, args = (url, dataDestination, dateToStart, dataFilePath, True,  update, originalUnit, unit, minValue, maxValue)))
    
    runThreads(threads)
    print(dataFilePathsList)
    dataFilePathsList[k] = filePaths


def downlaodSingleDisplayLiveValue(value, dataFilePath) :
    url = value["url"]
    dataDestinationList = value["data_destination"]
    dataDestination = []

    for dest in dataDestinationList :
        dataDestination.append(dest["dest"])
    
    downloadData(url, dataDestination, None, dataFilePath, False)
    

def getCharts(screen, fileName, screenName, update = False) :
    try :
        screenInfoOld = get_json_object_from_file(fileName)
    except FileNotFoundError :
        screenInfoOld = None
    chartsInfo, chartNum, i = {}, 1, 0
    dataFilePathsList, threads, currentUnits = [None] * len(screen["charts"]), [], []
    print(len(screen["charts"]))
    for chartName in screen["charts"]:
        if screenInfoOld != None :
            unit = screenInfoOld["charts"][chartName]["unit"]
        else :
            unit = None
        chart = screen["charts"][chartName]
        currentUnits.append(unit)
        dataList = {}
        threads.append(threading.Thread(target = downloadSingleChart, args = (i, dataFilePathsList, chart, str(chartNum), unit, screenName, update)))
        chartNum += 1
        i += 1

    runThreads(threads)
    #print(currentUnits)
    print(dataFilePathsList)
    i, chartNum = 0, 1
    for chartName in screen["charts"]:
        chart = screen["charts"][chartName]
        dataList = {"color" : chart["color_list"]["color1"]}
        dataFilePaths = dataFilePathsList[i]
        i += 1
        #print(chart["url_list"], chartNum)
        for dataNum in range(len(chart["url_list"])) :
            strNum = str(dataNum + 1)
            dataName = "data" + strNum
            #print(chart["color_list"], chart["data_names"])
            print(dataFilePaths)
            print(dataNum, len(chart["url_list"]))
            dataInfo = {
                            "file_name" : dataFilePaths[dataNum],
                            "data_name" : chart["data_names"]["data_name" + strNum]
                       }
            dataList[dataName] = dataInfo
        
        thisChart = {
                        "name" : chart["name"],
                        "type" : chart["type"],
                        "is_chart" : True, 
                        "vertical" : chart["vertical"], 
                        "horizontal" : chart["horizontal"],
                        "x_name" : chart["x_name"],
                        "y_name" : chart["y_name"],
                        "unit": currentUnits[i - 1],
                        "original_unit" : chart["unit"],
                        "unit_conversion": chart["unit_conversion"],
                        "enabled_units": chart["enabled_units"],
                        "data_list" : dataList
                    }
        chartsInfo["chart" + str(chartNum)] = thisChart
        chartNum += 1

    return chartsInfo, chartNum


def getSingleValue(screen, chartsInfo, chartNum, screenName) :
    threads, singleValues, dataFilePaths = [], [], []
    for singleValueName in screen["displayed_live_values"] :
        singleValues.append(screen["displayed_live_values"][singleValueName])
        dataFilePaths.append("../resources/" + screenName + "_chart_" + str(chartNum) + "_data_1" + ".json")
        threads.append(threading.Thread(target = downlaodSingleDisplayLiveValue, args = (singleValues[-1], dataFilePaths[-1])))

    runThreads(threads)

    for i, singleValueName in enumerate(screen["displayed_live_values"]) :
        dataFilePath, singleValue = dataFilePaths[i], singleValues[i]
        thisChart = {
                        "vertical" : singleValue["vertical"],
                        "horizontal" : singleValue["horizontal"],
                        "is_chart" : False,
                        "unit": singleValue["unit"],
                        "unit_conversion": singleValue["unit_conversion"],
                        "enabled_units": singleValue["enabled_units"]
                    }
        dataList, dataName = {}, "data"
        dataInfo = {
                    "file_name" : dataFilePath,
                    "data_name" : singleValue["name"],
                    # "color" : singleValue["color"]
                   }
        dataList[dataName] = dataInfo
        thisChart["data_list"] = dataList
        chartsInfo["chart" + str(chartNum)] = thisChart
        chartNum += 1

    return chartsInfo, chartNum


def getScreenInfo(screen, screenName, update = False) :
    fileName = "../resources/" + screenName + ".json"
    info =  {
            "name" : screen["name"],
            "layout" : screen["layout"],
            "chart_on_screen_number" : screen["chart_on_screen_number"]
            }
    chartsInfo, chartNum = getCharts(screen, fileName, screenName, update)
    chartsInfo, chartNum = getSingleValue(screen, chartsInfo, chartNum, screenName)
    
    info["charts"] = chartsInfo
    
    with open(fileName, "w") as write_file :
        json.dump(info, write_file, indent=4)


def downloadData(url, dataDestination, dateToStart, filePath, isChart, update = False, originalUnit = "skip", unit = "skip", minValue = None, maxValue = None) : # stare parametry, confPath i is_chart
    newData = []
    if update :
        oldData, dateToStart = getOldFile(filePath, dateToStart)
    else :
        oldData = []

    timeStamp = dateToStart
    while (not isChart or timeStamp >= dateToStart) and url != None:
        response = requests.get(url, timeout=30)
        response.raise_for_status()
        j = json.loads(response.content)
        url = getNext(j)
        if isChart:
            for res in j["results"] :
                value = getDataFromRes(res, dataDestination)
                timeStamp = getTimeStamp(res)
                convertedValue = convert(value, originalUnit, unit)
                if (timeStamp > dateToStart or not update and timeStamp >= dateToStart) and minValue <= convertedValue <= maxValue:
                    newData.append({"name" : timeStamp, "value" : convertedValue})
            previous, now = MyDate(datetime.now()), MyDate(datetime.now())
            sparse_data, dateStart = [], MyDate(dateToStart)
            newData = addSparse(sparse_data, newData, now, previous, dateStart)
        else:
            res = j["results"][0]
            value = getDataFromRes(res, dataDestination)
            timeStamp = getTimeStamp(res)
            newData.append({"name": timeStamp, "value": value})
            url = None

    if isChart:
        data = newData + oldData
    else:
        data = newData
    dateValue = {"data" : data}

    with open(filePath, "w") as write_file :
        json.dump(dateValue, write_file, indent = 4)

def start(path, update = False) :
    confPath = path
    confJsonFile = open(confPath)
    confData = json.load(confJsonFile)
    with open("../resources/configuration.json", "w") as write_file :
        json.dump(confData, write_file, indent=4)
    with open("../resources/general_info.json", "w") as write_file :
        json.dump(confData["general_info"], write_file, indent=4)
    screenAmount = confData["general_info"]["number_of_screens"]
    for num in range(screenAmount):
        screenNumber = num + 1
        screenName = "screen" + str(screenNumber)
        screen = confData["screen_info"][screenName]
        screenFileName = "screen_" + str(screenNumber)
        getScreenInfo(screen, screenFileName, update)
    return {"response" : "OK"}

def refresh_data() :
    start("../resources/configuration.json", update = False)


if __name__ == "__main__" :
    #start("../../Informations/example2.json")
    refresh_data()

    # url = "https://datahub.ki.agh.edu.pl/api/endpoints/70/data/"
    # # dateToStart = "2022-05-04T08:27:34+02:00"
    # dateToSub = timedelta(hours = 4)
    # now = datetime.now()
    # dateToStart = (now - dateToSub).strftime("%Y-%m-%dT%H:%M:%S")
    # # print(dateToStart)


    # confPath = "../../Informations/example1.json"
    # confJsonFile = open(confPath)
    # confData = json.load(confJsonFile)
    # screenAmount = confData["general_info"]["number_of_screens"]
    # for num in range(screenAmount):
    #     screenNumber = num + 1
    #     screenName = "screen" + str(screenNumber)
    #     screen = confData["screen_info"][screenName]
    #     getScreenInfo(screen, screenName, True)




