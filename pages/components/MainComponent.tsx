import React, { Component, useState } from "react";
import { Container, Row, Col } from "reactstrap";

import SelectCountryRegion from "./SelectCountryRegionComponent";

import axios from "axios"
import useSWR from "swr"

import { CasesData } from "../../utils/types";
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

            <Row className="mt-3">
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


{/*
class Main extends Component<{}, mainState>{
    constructor() {
        super({});
        this.state = {
            vaccinesData: [],
            casesData: [],
            confirmed: -1,
            deaths: -1,
            recovered: -1,
            tsConfirmed: [],
            tsDeaths: [],
            scLastUpdated: "",
            isLoaded: false,
            selected: ""
        }

        this.changeHandler = this.changeHandler.bind(this);
    }

    componentDidMount() {
        let today = new Date();
        let lastupdated = localStorage.getItem("lastupdated")
        let datacache = localStorage.getItem("datacache")
        let shouldUpdate = (lastupdated === null || today.getTime() - parseInt(lastupdated) > (60 * 60 * 1000) || datacache === null)
        if (shouldUpdate) {
            Promise.all([axios.get<summaryRes>(endpoint + "worldometer/all"),
            axios.get(endpoint + "jhu/vaccines/global"),
            axios.get(endpoint + "jhu/daily/global?agg=true"),
            axios.get(endpoint + "jhu/ts/cases/global/confirmed?agg=true"),
            axios.get(endpoint + "jhu/ts/cases/global/deaths?agg=true")])
                .then(
                    axios.spread((res1, res2, res3, res4, res5) => {

                        let res2_filtered: vaccinesDataRes[] = res2.data.result.filter((item: any) => (item['Province_State'] === null))
                        let res2_modified: vaccinesDataObj[] = res2_filtered.map((obj) => {
                            return {
                                "country": obj["Country_Region"],
                                "dosesAdmin": obj["Doses_admin"],
                                "partiallyVaxxed": obj["People_partially_vaccinated"],
                                "fullyVaxxed": obj["People_fully_vaccinated"]
                            }
                        })


                        let res3_filtered: casesDataRes[] = res3.data.result
                        let res3_modified: casesDataObj[] = res3_filtered.map((obj) => {
                            return {
                                "country": obj["Country_Region"],
                                "confirmed": obj["Confirmed"],
                                "deaths": obj["Deaths"],
                                "incidentRate": obj["Incident_Rate"],
                                "caseFatalityRatio": obj["Case_Fatality_Ratio"]
                            }
                        })

                        this.setState({
                            confirmed: res1.data["result"]["Confirmed"],
                            deaths: res1.data["result"]["Deaths"],
                            recovered: res1.data["result"]["Recovered"],
                            scLastUpdated: res1.data["result"]["Last_Updated"],
                            vaccinesData: res2_modified,
                            casesData: res3_modified,
                            tsConfirmed: res4.data.result,
                            tsDeaths: res5.data.result

                        })

                        this.setState({
                            isLoaded: true,
                        })

                        let datacache = {
                            confirmed: res1.data["result"]["Confirmed"],
                            deaths: res1.data["result"]["Deaths"],
                            recovered: res1.data["result"]["Recovered"],
                            scLastUpdated: res1.data["result"]["Last_Updated"],
                            vaccinesData: res2_modified,
                            casesData: res3_modified,
                            tsConfirmed: res4.data.result,
                            tsDeaths: res5.data.result
                        }

                        localStorage.setItem("datacache", JSON.stringify(datacache))

                    })
                ).catch(err => console.log(err));
        }

        else {
            let datacache = JSON.parse(localStorage.getItem("datacache")!)
            this.setState(datacache)
            this.setState({
                isLoaded: true,
            })
        }


    }

    componentDidUpdate(prevProps: {}, prevState: mainState) {
        if (this.state.selected !== prevState.selected) {
            console.log(this.state.selected)
            console.log(prevState.selected)
            if (this.state.selected === "") {
                axios.get<summaryRes>(endpoint + "worldometer/all")
                    .then((res) => {
                        this.setState({
                            confirmed: res.data["result"]["Confirmed"],
                            deaths: res.data["result"]["Deaths"],
                            recovered: res.data["result"]["Recovered"],
                            scLastUpdated: res.data["result"]["Last_Updated"],
                        })
                    })
            }

            else {
                axios.get<summaryRes>(endpoint + `worldometer/country/${this.state.selected}`)
                    .then((res) => {
                        this.setState({
                            confirmed: res.data["result"]["Confirmed"],
                            deaths: res.data["result"]["Deaths"],
                            recovered: res.data["result"]["Recovered"],
                            scLastUpdated: res.data["result"]["Last_Updated"],
                        })
                    })
            }
        }
    }

    changeHandler(c: string) {
        this.setState({ selected: c });
    }

    render(): React.ReactNode {
        return (
            <Container fluid className="">
                <Row className="mt-2">
                    <Col md={4} lg={3}>
                        <SelectCountry changeHandler={this.changeHandler} />

                        <SummaryCard selected={this.state.selected} vaccinesData={this.state.vaccinesData} confirmed={this.state.confirmed} deaths={this.state.deaths} recovered={this.state.recovered} lastUpdated={this.state.scLastUpdated} />
                    </Col>
                    <Col md={8} lg={9} className="ps-0">
                        <Row className="h-100" >
                            <Map vaccinesData={this.state.vaccinesData} casesData={this.state.casesData} />
                        </Row>



                    </Col>
                </Row>
                <Row className="mt-2 mb-2">
                    <Col lg={4}>
                        <TS country={this.state.selected} tsConfirmed={this.state.tsConfirmed} tsDeaths={this.state.tsDeaths} />
                    </Col>
                    <Col lg={8} className="ps-0">

                        <Table casesData={this.state.casesData} vaccinesData={this.state.vaccinesData} />

                    </Col>



                </Row>
                <Row className="mt-2 mb-2">
                    <Col>

                        <Info />


                    </Col>


                </Row>
                <Api />
                <Footer />

            </Container>
        )

    }
}*/}

export default Main;