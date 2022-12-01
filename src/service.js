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
        // console.log((await ref.get()).val());
        ref.transaction((obj) => {
            if (obj) {
                if (!parseInt(obj.wQty)) return obj
                const wQty = parseInt(obj.wQty)
                obj['wQty'] = (wQty - qty).toString()
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
        return true
    }
    catch (err) {
        console.log(err);
        return false
    }
}

