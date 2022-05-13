from argparse import ArgumentError

def getPrefix(unit) :
    if unit[0:2] == "da" : return "da"
    if unit[0] in ["y", "z", "a", "f", "p", "n", "u", "m", "c", "d", "da", "", "h", "k", "M", "G", "T", "P", "E", "Z", "Y"] : return unit[0]
    return " "

def removePrefix(unit) :
    if unit[0:2] == "da" : return unit[2:]
    if unit != "Pa" and unit[0] in ["y", "z", "a", "f", "p", "n", "u", "m", "c", "d", "da", "", "h", "k", "M", "G", "T", "P", "E", "Z", "Y"] : return unit[1:]
    return unit

def prefixConvert(value, sourceUnit, destinationUnit) :
    prefixDict = {"y" : 10 ** (-24), "z" : 10 ** (-21), "a" : 10 ** (-18), "f" : 10 ** (-15), "p" : 10 ** (-12), "n" : 10 ** (-9), "u" : 10 ** (-6), "m" : 0.001, "c" : 0.01, "d" : 0.1, "da" : 10, " " : 1, "h" : 100, "k" : 1000, "M" : 10 ** 6, "G" : 10 ** 9, "T" : 10 ** 12, "P" : 10 ** 15, "E" : 10 ** 18, "Z" : 10 ** 21, "Y" : 10 ** 24}
    return value * prefixDict[sourceUnit] / prefixDict[destinationUnit]

def convertTemperature(value, sourceUnit, destinationUnit, validUnits) :
    if destinationUnit not in validUnits : raise Exception(f'Inconsistent units: {sourceUnit} and {destinationUnit}')
    
    if sourceUnit == "C" : value += 273.15
    elif sourceUnit == "F" : value = 5.0 * (value - 32.0) / 9.0 + 273.15

    if destinationUnit == "C" : value -= 273.15
    elif destinationUnit == "F" : value = 9.0 * (value - 273.15) / 5.0 + 32.0

    return value

def convertPressure(value, sourceUnit, destinationUnit, validUnits) :
    if destinationUnit not in validUnits : raise Exception(f'Inconsistent units: {sourceUnit} and {destinationUnit}')
    
    if sourceUnit == "atm" : value *= 101325.0
    elif sourceUnit == "bar" : value *= 100000.0
    elif sourceUnit == "mmHg" : value *= 133.0
    elif sourceUnit == "psi" : value *= 6894.8
    else : value = prefixConvert(value, getPrefix(sourceUnit), " ")
    
    if destinationUnit == "atm" : value /= 101325.0
    elif destinationUnit == "bar" : value /= 100000.0
    elif destinationUnit == "mmHg" : value /= 133.0
    elif destinationUnit == "psi" : value /= 6894.8
    else : value = prefixConvert(value, " ", getPrefix(destinationUnit))

    return value

def checkTones(unit) :
    if unit == "t" : return "Mg"
    else : return unit

def convert(value, sourceUnit, destinationUnit) :
    sourceUnit = checkTones(sourceUnit)
    destinationUnit = checkTones(destinationUnit)
    temperature = ["K", "F", "C"]
    pressure = ["hPa", "GPa", "MPa", "KPa", "Pa", "atm", "bar", "mmHg", "psi"]
    if sourceUnit in temperature : return convertTemperature(value, sourceUnit, destinationUnit, temperature)
    elif sourceUnit in pressure : return convertPressure(value, sourceUnit, destinationUnit, pressure)
    else : 
        if removePrefix(sourceUnit) != removePrefix(destinationUnit) : raise Exception(f'Inconsistent units: {sourceUnit} and {destinationUnit}')
        return prefixConvert(value, getPrefix(sourceUnit), getPrefix(destinationUnit))

if __name__ == "__main__" :

    print("Temperature test")
    value, sourceUnit, destinationUnit = 10, "C", "F"
    print(value, sourceUnit, "=", convert(value, sourceUnit, destinationUnit), destinationUnit)
    value, sourceUnit, destinationUnit = 10, "F", "K"
    print(value, sourceUnit, "=", convert(value, sourceUnit, destinationUnit), destinationUnit)
    value, sourceUnit, destinationUnit = 10, "K", "C"
    print(value, sourceUnit, "=", convert(value, sourceUnit, destinationUnit), destinationUnit)
    
    print("\n\nPressure test")
    value, sourceUnit, destinationUnit = 10, "hPa", "atm"
    print(value, sourceUnit, "=", convert(value, sourceUnit, destinationUnit), destinationUnit)
    value, sourceUnit, destinationUnit = 10, "bar", "Pa"
    print(value, sourceUnit, "=", convert(value, sourceUnit, destinationUnit), destinationUnit)
    value, sourceUnit, destinationUnit = 10, "GPa", "psi"
    print(value, sourceUnit, "=", convert(value, sourceUnit, destinationUnit), destinationUnit)

    print("\n\nPrefix test")
    value, sourceUnit, destinationUnit = 10, "kg", "g"
    print(value, sourceUnit, "=", convert(value, sourceUnit, destinationUnit), destinationUnit)
    value, sourceUnit, destinationUnit = 10, "mg", "cg"
    print(value, sourceUnit, "=", convert(value, sourceUnit, destinationUnit), destinationUnit)
    value, sourceUnit, destinationUnit = 10, "dag", "Gg"
    print(value, sourceUnit, "=", convert(value, sourceUnit, destinationUnit), destinationUnit)

    print("\n\nTones test")
    value, sourceUnit, destinationUnit = 10, "t", "mg"
    print(value, sourceUnit, "=", convert(value, sourceUnit, destinationUnit), destinationUnit)
    value, sourceUnit, destinationUnit = 10, "dag", "t"
    print(value, sourceUnit, "=", convert(value, sourceUnit, destinationUnit), destinationUnit)
