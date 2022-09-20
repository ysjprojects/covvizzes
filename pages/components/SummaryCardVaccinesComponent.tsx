import React from 'react'
import { Card, CardBody, Row, Col, CardFooter } from 'reactstrap';
import { VaccinesData } from '../../utils/types';
import { numberToText } from '../../utils/helpers';




const SummaryCardVaccines = ({ option, data, selected, lastUpdated }: { option: string, data: VaccinesData[], selected: string, lastUpdated: string }) => {

    const title = () => {

        switch (option) {
            case "doses_administered":
                return "Doses Administered"
            case "people_partially_vaccinated":
                return "People Partially Vaccinated"
            case "people_fully_vaccinated":
                return "People Fully Vaccinated"
            default:
                return "Error"
        }
    }

    const stats = () => {
        const darray = data.filter(x => x['Country/Region'] === selected && x['Province/State'] === 'Total')
        if (darray.length === 0) {
            return "Error"
        }
        const d = darray[0]
        switch (option) {
            case "doses_administered":
                return d['Doses Administered']
            case "people_partially_vaccinated":
                return d['People Partially Vaccinated']
            case "people_fully_vaccinated":
                return d['People Fully Vaccinated']
            default:
                return "Error"
        }
    }

    return (
        <Card className="text-center" style={{ height: '100%' }}>
            <CardBody className="p-3">
                <h3 className="text-muted">{title()}</h3>
                <h1 className="mb-0 mt-3">{numberToText(stats())}</h1>

            </CardBody>
            <CardFooter>
                <p className="mb-0 text-start text-muted"><em>Last updated: {lastUpdated}</em></p>
            </CardFooter>
        </Card>

    )
}

export default SummaryCardVaccines;