import React from "react";
import { Container, Row, Col } from "reactstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGlobe } from "@fortawesome/free-solid-svg-icons";
import { faLinkedinIn, faGithub } from "@fortawesome/free-brands-svg-icons";
import Image from "next/image";

const Info = () => {
    return (
        <Container className="pt-5 pb-5 text-center">
            <Row>
                <h1 className="text-muted">About Us</h1>
                <div style={{
                    width: '150px',
                    height: '150px',
                    margin: '0 auto',
                    marginBottom: '25px'
                }} >
                    <Image width="100%" height="100%" src="/assets/covvizzes.png" alt="covvizzes logo" />
                </div>
                <h5 className="text-muted"><b>Covvizzes</b> is built with NextJS, Bootstrap and Amcharts.</h5>
                <h5 className="text-muted"><b>Covvizzes</b> fetches data from John Hopkin's University and transforms it into an interactive covid-19 dashboard.</h5>
                <h5 className="text-muted"><b>Covvizzes</b> provides a free, rate-limited <a href="/services/api" target="_blank">REST API service</a>!</h5>
            </Row>
            <Row className="mt-5 text-start">
                <Col md={6}>
                    <h3 className="text-muted">
                        This project is built with:
                    </h3>
                    <h5 className="text-muted">React</h5>
                    <h5 className="text-muted">NextJS</h5>
                    <h5 className="text-muted">TypeScript</h5>
                    <h5 className="text-muted">Bootstrap</h5>
                    <h5 className="text-muted">Amcharts</h5>
                    <h5 className="text-muted">MUI-Datatable</h5>
                </Col>
                <Col md={6}>

                    <h3 className="text-muted">
                        Connect with me:
                    </h3>
                    <h5 className="">
                        <button className=" mt-2 me-3 btn btn-lg rounded btn-info">
                            <FontAwesomeIcon icon={faGlobe} />
                        </button> <a className="mt-2" href="http://www.sjyu.xyz/" target="_blank"> Website</a>
                    </h5>
                    <h5 className="">
                        <button className=" mt-2 me-3 btn btn-lg rounded btn-primary">
                            <FontAwesomeIcon icon={faLinkedinIn} />
                        </button>                 <a className="mt-2" href="https://www.linkedin.com/in/yu-shi-jie-b8a36b129/" target="_blank"> LinkedIn</a>
                    </h5>
                    <h5 className="">
                        <button className=" mt-2 me-3 btn btn-lg rounded btn-primary">
                            <FontAwesomeIcon icon={faGithub} />
                        </button>                 <a className="mt-2" href="https://github.com/ysjprojects/" target="_blank"> Github</a>
                    </h5>

                </Col>
            </Row>

        </Container>

    )
}

export default Info