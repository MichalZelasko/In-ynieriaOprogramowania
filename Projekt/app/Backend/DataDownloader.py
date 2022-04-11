import requests
import json
import csv
import Projekt.Informations
import os

def getDataFromRes(res, dataDestination):
    dataName = "data"
    curr = res[dataName]
    for dest in dataDestination:
        curr = curr[dest]
    return curr
def getTimeStamp(res):
    timeStampName = "timestamp"
    return res[timeStampName]

def main(url, dataDestination, dateToStart, confPath):
    response = requests.get(url, timeout=30)
    response.raise_for_status()
    j = json.loads(response.content)
    print(j)
    js = json.dumps(j, indent = 2)
    # print(js)
    valueTab = []
    dateTab = []
    resultsName = "results"
    for res in j[resultsName]:
        value = getDataFromRes(res, dataDestination)
        timeStamp = getTimeStamp(res)
        if(timeStamp >= dateToStart):
            valueTab.append(value)
            dateTab.append(timeStamp)
        else:
            break

    json_file =  open(confPath)
    json_data = json.load(json_file)

    info = {}
    is_chart = "True"

    chart_data = json_data["screen_info"]["screen1"]["charts"]["chart1"]
    print(chart_data)
    # chart_data.pop("url_list")

    info["is_chart"] = is_chart
    info["vertical"] = chart_data["vertical"]
    info["horizontal"] = chart_data["horizontal"]
    info["color_list"] = chart_data["color_list"]
    info["name"] = chart_data["name"]
    info["type"] = chart_data["type"]


    print(info)


    # f = open('output.csv', 'w')
    # writer = csv.writer(f)
    # writer.writerow(timesTab)
    # writer.writerow(valueTab)

    dateValue = {"info":[info], "data":[{"date": dateTab[i], "value": valueTab[i]} for i in range(len(valueTab)) ] }
    with open("newData.json", "w") as write_file:
        json.dump(dateValue, write_file, indent=4)



if __name__ == "__main__":
    url = "https://datahub.ki.agh.edu.pl/api/endpoints/70/data/"
    dataDestination = ["heater", "tempSet"]
    dateToStart = "2022-04-05T13:02:37+02:00"
    confPath = os.path.realpath(os.path.join(os.path.dirname(__file__), '..', '..', 'Informations', 'example.json'))
    main(url, dataDestination, dateToStart, confPath)





    json_file =  open(confPath)
    json_data = json.load(json_file)
    # print(json_data)

