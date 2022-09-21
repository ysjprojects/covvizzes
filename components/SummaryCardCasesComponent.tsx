import React from 'react'
import { Card, CardBody, Row, Col, CardFooter } from 'reactstrap';
import { CasesData } from '../utils/types';
import { numberToText } from '../utils/helpers';




const SummaryCardCases = ({ option, data, selected, lastUpdated }: { option: string, data: CasesData[], selected: string, lastUpdated: string }) => {

    const title = () => {

        switch (option) {
            case "confirmed":
                return "Confirmed"
            case "deaths":
                return "Deaths"
            case "case_fatality_ratio":
                return "Case Fatality Ratio"
            default:
                return "Error"
        }
    }

    const prefixsymbol = (n: number) => (n > 0) ? "+" : (n === 0) ? "" : "-"

    const stats = () => {
        const darray = data.filter(x => x['Country/Region'] === selected && x['Province/State'] === 'Total' && x['County'] === 'Total')
        if (darray.length === 0) {
            return ["Error", "Error"]
        }
        const d = darray[0]
        switch (option) {
            case "confirmed":
                return [d['Confirmed'], d['Confirmed Changes']]
            case "deaths":
                return [d['Deaths'], d['Deaths Changes']]
            case "case_fatality_ratio":
                return [d['Case Fatality Ratio'], null]
            default:
                return ["Error", "Error"]
        }
    }

    return (
        <Card className="text-center" style={{ height: '100%' }}>
            <CardBody className="py-3">
                <h3 className="text-muted">{title()}</h3>
                <h1 className="mb-0 mt-3">{numberToText(stats()[0])}</h1>
                {stats()[1] ? <p>{`${prefixsymbol(stats()[1] as number)}${stats()[1]}`}</p> : null}

            </CardBody>
            <CardFooter>
                <p className="mb-0 text-start text-muted"><em>Last updated: {lastUpdated}</em></p>
            </CardFooter>
        </Card>

    )
}

export default SummaryCardCases;