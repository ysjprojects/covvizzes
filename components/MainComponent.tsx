import React, { Component, useState } from "react";
import { Container, Row, Col } from "reactstrap";

import SelectCountryRegion from "./SelectCountryRegionComponent";

import axios from "axios"
import useSWR from "swr"

import { CasesData } from "../utils/types";
import SummaryCardCases from "./SummaryCardCasesComponent";
import SummaryCardVaccines from "./SummaryCardVaccinesComponent";
import TimeSeries from "./TimeSeriesComponent";
import Map from "./MapComponent"
import Table from "./TableComponent";


const Main = () => {
    const [countryRegionSelected, setCountryRegionSelected] = useState("World");

    const fetcher = async (url: string) => await axios.get(url).then((res) => res.data);
    const { data: casesData, error: casesError } = useSWR("/api/daily/cases", fetcher);
    const { data: vaccinesData, error: vaccinesError } = useSWR("/api/daily/vaccines", fetcher);


    if (casesError || vaccinesError) return (<p>Loading failed...</p>);
    if (!(casesData && vaccinesData)) return (<h1>Loading...</h1>);


    return (
        <Container fluid className="">

            <Row className="bg-info">
                <SelectCountryRegion countries={[... new Set<string>((casesData['data'] as CasesData[]).map(x => x['Country/Region']))]} setCountryRegionSelected={setCountryRegionSelected} />
            </Row>
            <Row >
                <Col className="mt-3" sm={6} md={4} lg={6} xl={2}>
                    <SummaryCardCases option={"confirmed"} data={casesData['data']} selected={countryRegionSelected} lastUpdated={casesData['metadata']['updated at']} />
                </Col>
                <Col className="mt-3" sm={6} md={4} lg={6} xl={2}>
                    <SummaryCardCases option={"deaths"} data={casesData['data']} selected={countryRegionSelected} lastUpdated={casesData['metadata']['updated at']} />
                </Col>
                <Col className="mt-3" sm={6} md={4} lg={3} xl={2}>
                    <SummaryCardCases option={"case_fatality_ratio"} data={casesData['data']} selected={countryRegionSelected} lastUpdated={casesData['metadata']['updated at']} />
                </Col>
                <Col className="mt-3" sm={6} md={4} lg={3} xl={2}>
                    <SummaryCardVaccines option={"doses_administered"} data={vaccinesData['data']} selected={countryRegionSelected} lastUpdated={vaccinesData['metadata']['updated at']} />
                </Col>
                <Col className="mt-3" sm={6} md={4} lg={3} xl={2}>
                    <SummaryCardVaccines option={"people_fully_vaccinated"} data={vaccinesData['data']} selected={countryRegionSelected} lastUpdated={vaccinesData['metadata']['updated at']} />
                </Col>
                <Col className="mt-3" sm={6} md={4} lg={3} xl={2}>
                    <SummaryCardVaccines option={"people_partially_vaccinated"} data={vaccinesData['data']} selected={countryRegionSelected} lastUpdated={vaccinesData['metadata']['updated at']} />
                </Col>


            </Row>
            <Row >
                <Col className="mt-3" lg={12} xl={8} style={{ minHeight: '50vh' }}>
                    <Map casesData={casesData['data']} vaccinesData={vaccinesData['data']} />
                </Col>
                <Col className="mt-3" lg={12} xl={4}>
                    <Table casesData={casesData['data']} vaccinesData={vaccinesData['data']} />
                </Col>
            </Row>
            <Row className="mt-3">
                <Col>
                    <TimeSeries selected={countryRegionSelected} />
                </Col>
            </Row>


        </Container>
    )
}



export default Main;