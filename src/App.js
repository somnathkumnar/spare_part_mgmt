import React, { Component } from 'react'
import { Button, Card, Form } from 'semantic-ui-react'
import DropdownExampleSearchSelection from './Dropdown'
import { getDropdownData, updateQty } from './service'
import emailjs from 'emailjs-com'

class App extends Component {

    state = {
        name: "",
        area: "",
        equipment: "",
        spareName: "",
        specs: "",
        wLoc: "",
        wQty: "",
        sLoc: "",
        sQty: "",
        qtyUsed: "",
        mCode: "",
        comment: "",
        areaOptions: [],
        equipmentOptions: [],
        spareOptions: [],
        spareList: {},
        mainData: {}
    }

    async componentDidMount() {
        const areaOptions = []
        const data = await getDropdownData()
        for (const key in data) {
            if (Object.hasOwnProperty.call(data, key)) {
                areaOptions.push({ key: key, value: key, text: key })
            }
        }
        this.setState({ mainData: data, areaOptions })
    }

    onInputChange = (e) => {
        this.setState({ [e.target.id]: e.target.value })
    }

    handleDropDownSelect = (event, data) => {
        this.setState({ [data.id]: data.value })
        const mainData = this.state.mainData
        const arr = []
        if (data.id === 'area') {
            for (const key in mainData[data.value]) {
                if (Object.hasOwnProperty.call(mainData[data.value], key)) {
                    arr.push({ key: key, value: key, text: key })
                }
            }
            this.setState({ equipmentOptions: arr, area: data.value })
        }
        else if (data.id === 'equipment') {
            for (const key in mainData[this.state.area][data.value]) {
                if (Object.hasOwnProperty.call(mainData[this.state.area][data.value], key)) {
                    const spare = mainData[this.state.area][data.value][key]
                    arr.push(`${spare.spareName}__${key}`)
                    arr.push({ key: `${spare.spareName}__${key}`, value: `${spare.spareName}__${key}`, text: `${spare.spareName}__${key}` })
                }
            }
            this.setState({ spareOptions: arr, equipment: data.value })
        }
        else if (data.id === 'spareName') {
            const spare = mainData[this.state.area][this.state.equipment][data.value.split('__')[1]]

            this.setState({
                spareName: spare.spareName,
                sQty: spare.sQty,
                wQty: spare.wQty,
                sLoc: spare.sLoc,
                wLoc: spare.wLoc,
                mCode: data.value.split('__')[1]
            })
        }
    }

    handleButtonClick = (event) => {
        if (parseInt(this.state.wQty) && parseInt(this.state.wQty) >= this.state.qtyUsed) {
            const { area, equipment, mCode, qtyUsed, spareName, name, comment } = this.state
            if (updateQty(area, equipment, mCode, qtyUsed, spareName, name, comment)) {
                const mainData = this.state.mainData
                mainData[this.state.area][this.state.equipment][this.state.mCode]['wQty'] = (parseInt(this.state.wQty) - this.state.qtyUsed).toString()
                this.sendResponseEmail()
                if (parseInt(this.state.wQty) - this.state.qtyUsed <= 2) {
                    this.sendAlertEmail(parseInt(this.state.wQty) - this.state.qtyUsed)
                }
                this.setState({
                    // spareName: "",
                    // specs: "",
                    // wLoc: "",
                    // wQty: "",
                    // sLoc: "",
                    // sQty: "",
                    qtyUsed: "",
                    mainData: mainData,
                    wQty: (parseInt(this.state.wQty) - this.state.qtyUsed).toString()
                    // mCode: "",
                })
            }

        }
    }

    sendResponseEmail = async () => {
        const { area, equipment, mCode, qtyUsed, spareName, name, comment } = this.state
        try {
            await emailjs.send('service_c2x9jm4', 'template_knire9y', { from_name: name, area, equipment, spareName, mCode, qtyUsed, comment }, 'L8LRimFmVcPcBLHEE')
            console.log('response email sent');
        }
        catch (e) {
            console.log("Error sending response email", e);
        }
    }

    sendAlertEmail = async (wQty) => {
        const { mCode, spareName } = this.state
        try {
            await emailjs.send('service_c2x9jm4', 'template_rl3gykp', { spareName, mCode, wQty }, 'L8LRimFmVcPcBLHEE')
            console.log('alert email sent');
        }
        catch (e) {
            console.log("Error sending response email", e);
        }
    }

    mainForm = () => {
        return (
            <>
                <Form>
                    <Form.Field>
                        <label>Name of Person Changing the Part</label>
                        <input placeholder='Person' id='name' onChange={this.onInputChange} />
                    </Form.Field>
                    <Form.Field>
                        <label>Area</label>
                        <DropdownExampleSearchSelection id='area' value={this.state.area} handleDropDownSelect={this.handleDropDownSelect} data={this.state.areaOptions} />
                    </Form.Field>
                    <Form.Field>
                        <label>Equipments</label>
                        <DropdownExampleSearchSelection id='equipment' value={this.state.equipment} handleDropDownSelect={this.handleDropDownSelect} data={this.state.equipmentOptions} />
                    </Form.Field>

                    <Form.Field>
                        <label>Spare Parts Used</label>
                        <DropdownExampleSearchSelection id='spareName' value={this.state.spareName} handleDropDownSelect={this.handleDropDownSelect} data={this.state.spareOptions} />
                    </Form.Field>
                    <Form.Field>
                        <label>Quantity to be used</label>
                        <input placeholder='0' id='qtyUsed' value={this.state.qtyUsed} onChange={this.onInputChange} type='number' />
                    </Form.Field>
                    <Form.Field>
                        <label>Comments</label>
                        <input placeholder='Commnet' id='comment' onChange={this.onInputChange} />
                    </Form.Field>
                </Form>
                <Card>
                    <Card.Content>
                        <Card.Header>{this.state.spareName}</Card.Header>
                        <Card.Meta>MCode - {this.state.mCode}</Card.Meta>
                        <Card.Description>
                            Specs: {this.state.specs} <br />
                            Workshop Location: {this.state.wLoc} <br />
                            Workshop Quantity: {this.state.wQty} <br />
                            Store Location: {this.state.sLoc} <br />
                            Store Quantity: {this.state.sQty} <br />
                            <b>Quantity to be used: {this.state.qtyUsed}</b>
                        </Card.Description>
                    </Card.Content>
                    <Card.Content extra>
                        <Button basic color='green' fluid onClick={this.handleButtonClick}>
                            Request
                        </Button>

                    </Card.Content>
                </Card>
            </>
        )
    }

    render() {
        return this.mainForm()
    }
}

export default App