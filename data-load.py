import pandas as pd
import json

df = pd.read_excel('./data/database.xlsx', "Sheet1")

df.convert_dtypes(convert_string=True)

result = {
    "Cold End": {}
}

for index, row in df.iterrows():
    if (row['Equipments']) == 'Wood Cut M/C':
        continue
    if row["Equipments"] not in result["Cold End"]:
        result["Cold End"][row["Equipments"]] = {}
    if row["mCode"] not in result["Cold End"][row["Equipments"]]:
        result["Cold End"][row["Equipments"]][row["mCode"]] = {}

    result["Cold End"][row["Equipments"]][row["mCode"]
                                          ]["wLoc"] = row["Workshop Location"]
    result["Cold End"][row["Equipments"]
                       ][row["mCode"]]["sLoc"] = row["sLoc"]
    result["Cold End"][row["Equipments"]][row["mCode"]
                                          ]["spareName"] = row["Spare parts"]
    result["Cold End"][row["Equipments"]][row["mCode"]
                                          ]["wQty"] = row["Quantity"]
    result["Cold End"][row["Equipments"]][row["mCode"]
                                          ]["sQty"] = row["sQty"]
    result["Cold End"][row["Equipments"]][row["mCode"]
                                          ]["mCode"] = row["mCode"]


with open('./data/database.json', 'w') as f:
    json.dump(result, f)
