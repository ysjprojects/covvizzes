import React from "react";
import { Container, Row, Card, CardBody, CardText, Button } from "reactstrap";



const apiList = [
    {
        id: 0,
        desc: "daily report on cases",
        endpoint: "/daily/cases",
        params: ["country_region=<optional | required if province_state>",
            "province_state=<optional>"]
    },
    {
        id: 1,
        desc: "daily report on vaccines",
        endpoint: "/daily/vaccines",
        params: ["country_region=<optional | required if province_state>",
            "province_state=<optional>"]
    },
    {
        id: 2,
        desc: "time series covid-19 confirmed cases",
        endpoint: "/ts/cases/confirmed",
        params: ["country_region=<optional | required if province_state>",
            "province_state=<optional | required if county>",
            "county=<optional>"]
    },
    {
        id: 3,
        desc: "time series covid-19 deaths",
        endpoint: "/ts/cases/deaths",
        params: ["country_region=<optional | required if province_state>",
            "province_state=<optional | required if county>",
            "county=<optional>"]
    },
    {
        id: 4,
        desc: "time series covid-19 doses administered",
        endpoint: "/ts/cases/doses-administered",
        params: ["country_region=<optional | required if province_state>",
            "province_state=<optional>"]
    },
    {
        id: 5,
        desc: "time series covid-19 people partially vaccinated",
        endpoint: "/ts/cases/people-partially-vaccinated",
        params: ["country_region=<optional | required if province_state>",
            "province_state=<optional>"]
    },
    {
        id: 6,
        desc: "time series covid-19 people fully vaccinated",
        endpoint: "/ts/cases/people-fully-vaccinated",
        params: ["country_region=<optional | required if province_state>",
            "province_state=<optional>"]
    }

]
const RenderApiCard = ({ desc, endpoint, params }: { desc: string, endpoint: string, params: string[] }) => {
    return (
        <Row className="mb-5 text-start">

            <div>
                <p className="api-endpoint-description">Get {desc}</p>
            </div>
            <hr />
            <Card className="ps-0">
                <CardBody>
                    <Button style={{ width: "75px" }} color="success"><a className="text-light text-decoration-none" href={"/api" + endpoint} target="_blank"><b>GET</b></a></Button>

                    <span className="api-url"><b>&nbsp;&nbsp;&nbsp;{endpoint}</b> <i><b>?{params.join('&')}</b></i></span>
                </CardBody>
            </Card>

        </Row>
    )
}

const ApiInfo = () => {
    return (
        <Container className="pt-5 pb-5" >
            <Row>
                <h1 className="text-center"><b>Covvizzes REST API</b></h1>
            </Row>
            <Row className="text-start">
                <h5>Base URL: <a href="https://covvizzes.sjyu.xyz/api" target="_blank">https://covvizzes.sjyu.xyz/api</a></h5>

            </Row>

            <Row className="text-start">
                <h5>Data Source: <a href="https://github.com/ysjprojects/covid19-json-data" target="_blank">https://github.com/ysjprojects/covid19-json-data</a></h5>

            </Row>
            <Row className="text-start">
                <h5>Rate Limit: 20 requests every 60 seconds</h5>

            </Row>

            {apiList.map((item) => {
                return (<RenderApiCard desc={item.desc} endpoint={item.endpoint} params={item.params} />)
            })}




        </Container>
    )
}

export default ApiInfo;