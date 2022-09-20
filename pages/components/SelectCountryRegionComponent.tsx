import React, { useState } from "react";

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
        <select onChange={change} value={selected} className="form-select" name="select" id="countryregionselection">
            <option value="World">World</option>
            {countries.filter((x) => x !== 'World').map((c) => {
                return (
                    <option value={c}>{c}</option>
                )
            })}
        </select>
    )
}

export default SelectCountryRegion;