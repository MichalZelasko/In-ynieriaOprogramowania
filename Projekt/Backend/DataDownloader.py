import requests
import json
import csv

def getDataFromRes(res, dataDestination):
    dataName = "data"
    curr = res[dataName]
    for dest in dataDestination:
        curr = curr[dest]
    return curr
def getTimeStamp(res):
    timeStampName = "timestamp"
    return res[timeStampName]

def main(url, dataDestination):
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
        valueTab.append(getDataFromRes(res, dataDestination))
        timeStamp = getTimeStamp(res)
        dateTab.append(timeStamp)





    # f = open('output.csv', 'w')
    # writer = csv.writer(f)
    # writer.writerow(timesTab)
    # writer.writerow(valueTab)

    dateValue = {"info":[], "data":[{"date": dateTab[i], "value": valueTab[i]} for i in range(len(valueTab)) ] }
    with open("data.json", "w") as write_file:
        json.dump(dateValue, write_file, indent=4)



if __name__ == "__main__":
    url = "https://datahub.ki.agh.edu.pl/api/endpoints/70/data/"
    dataDestination = ["heater", "tempSet"]
    main(url, dataDestination)
    #
    # dataDict = ""
    # dataName = "tun0IP"
    # main(url, dataDict, dataName)
