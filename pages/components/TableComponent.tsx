import React, { useEffect, useRef, useState } from "react";
import { CasesData, TableData, VaccinesData } from "../../utils/types";
import MUIDataTable from 'mui-datatables';






const MUITable = ({ data }: { data: TableData[] }) => {
    const columns = [
        { label: 'Country/Region', name: 'Country/Region' },
        { label: 'Confirmed', name: 'Confirmed', options: { sort: true } },
        { label: 'Deaths', name: 'Deaths' },
        { label: 'Case Fatality Ratio', name: 'Case Fatality Ratio' }
    ];
    const [divHeight, setDivHeight] = useState(0)
    const divRef: React.MutableRefObject<HTMLDivElement | null> = useRef(null);

    useEffect(() => {
        setDivHeight(divRef.current!.clientHeight)
    })

    console.log(divHeight)

    return (
        <div ref={divRef} style={{ maxWidth: '100%', height: '100%' }}>
            <MUIDataTable
                columns={columns}
                data={data}
                title=''
                options={{
                    selectableRows: undefined,
                    pagination: false,
                    tableBodyHeight: divHeight + "px"

                }}

            />
        </div>
    );
};

const Table = ({ casesData, vaccinesData }: { casesData: CasesData[], vaccinesData: VaccinesData[] }) => {
    return (
        <MUITable data={casesData.filter(x => x['Province/State'] === 'Total' && x['County'] === 'Total').map(y => ({ 'Country/Region': y['Country/Region'], 'Confirmed': y['Confirmed'], 'Deaths': y['Deaths'], 'Case Fatality Ratio': y['Case Fatality Ratio'] }))} />
    )
}


export default Table;