import React, { useState } from "react";
import { Row, Col } from 'reactstrap';

type scProps = {
    changeHandler: (s: string) => void
}
type scState = {
    selected: string
}

const SelectCountryRegion = ({ countries, setCountryRegionSelected }: { countries: string[], setCountryRegionSelected: React.Dispatch<React.SetStateAction<string>> }) => {
    const [selected, setSelected] = useState("World");

    function change(event: React.ChangeEvent<HTMLSelectElement>) {
        event.preventDefault();
        setSelected(event.target.value);
        setCountryRegionSelected(event.target.value);
    }
    return (
        <Row className="py-3">

            <Col className="form-group">
                <label className="text-light fw-bold" htmlFor="countryregionselection">Select Country/Region:</label>
                <br />
                <select onChange={change} value={selected} className="w-auto form-control form-select" name="select" id="countryregionselection">
                    <option value="World">World</option>
                    {countries.filter((x) => x !== 'World').map((c) => {
                        return (
                            <option key={c} value={c}>{c}</option>
                        )
                    })}
                </select>
            </Col>

        </Row>

    )
}

export default SelectCountryRegion;