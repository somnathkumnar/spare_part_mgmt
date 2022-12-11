import database from "./firebase";

export const getDropdownData = async () => {
    try {
        const data = (await database.ref().child('data/area').get()).val()
        return data
    }
    catch (err) {
        console.log(err);
    }
}

export const updateQty = async (area, equipment, mCode, qty, spare, nameOfPerson, comment) => {
    try {
        const ref = database.ref().child('data/area').child(area).child(equipment).child(mCode)
        console.log('updating qty');
        const retValue = { wQty: "", sQty: "" };
        // console.log((await ref.get()).val());
        await ref.transaction((obj) => {
            if (obj) {
                if (parseInt(obj.wQty) && parseInt(obj.wQty) >= qty) {
                    const wQty = parseInt(obj.wQty)
                    obj['wQty'] = (wQty - qty).toString()
                    retValue['wQty'] = (wQty - qty).toString()
                    retValue['sQty'] = obj['sQty']
                    return obj
                }
                if (parseInt(obj.sQty) && parseInt(obj.sQty) >= qty) {
                    const sQty = parseInt(obj.sQty)
                    const wQty = parseInt(obj.wQty) || 0
                    obj['sQty'] = (sQty + wQty - qty).toString()
                    obj['wQty'] = parseInt(obj.wQty) ? "0" : obj.wQty
                    retValue["wQty"] = parseInt(obj.wQty) ? "0" : obj.wQty
                    retValue['sQty'] = (sQty + wQty - qty).toString()
                    return obj
                }
            }
            return obj
        })
        database.ref().child('response').push({
            "name of person": nameOfPerson,
            "mCode": mCode,
            "date": new Date().toISOString().slice(0, 10),
            "qty": qty,
            "equipment": equipment,
            "spare": spare,
            "comment": comment
        })
        return retValue
    }
    catch (err) {
        console.log(err);
        return false
    }
}

