import React, { useEffect, useState } from "react";
import { Card, TabContent, TabPane, Nav, NavItem, NavLink } from 'reactstrap';
import * as am5 from '@amcharts/amcharts5';
import * as am5xy from "@amcharts/amcharts5/xy";
import am5themes_Animated from '@amcharts/amcharts5/themes/Animated';
import useSWR from "swr";
var classnames = require('classnames')
import axios from 'axios'
import { TVPair } from "../utils/types";

const splitDate = (date: string) => {
    let [month, day, year]: string[] = date.split("/")
    return [parseInt(month) - 1, parseInt(day), parseInt("20" + year)]
}


const initChart = (id: string, ts: TVPair) => {
    let root = am5.Root.new(id);
    // Set themes
    // https://www.amcharts.com/docs/v5/concepts/themes/
    root.setThemes([
        am5themes_Animated.new(root)
    ]);


    // Create chart
    // https://www.amcharts.com/docs/v5/charts/xy-chart/
    let chart = root.container.children.push(am5xy.XYChart.new(root, {
        panX: true,
        panY: true,
        wheelX: "panX",
        wheelY: "zoomX"
    }));

    // Add cursor
    // https://www.amcharts.com/docs/v5/charts/xy-chart/cursor/
    let cursor = chart.set("cursor", am5xy.XYCursor.new(root, {
        behavior: "none"
    }));
    cursor.lineY.set("visible", false);





    const generateDatas = (ts: TVPair) => {
        return Object.keys(ts).map(x => { return { date: (new Date(x)).getTime(), value: ts[x] } })
    }


    // Create axes
    // https://www.amcharts.com/docs/v5/charts/xy-chart/axes/
    let xAxis = chart.xAxes.push(am5xy.DateAxis.new(root, {
        maxDeviation: 0.5,
        baseInterval: {
            timeUnit: "day",
            count: 1
        },
        renderer: am5xy.AxisRendererX.new(root, {
            pan: "zoom"
        }),
        tooltip: am5.Tooltip.new(root, {})
    }));

    let yAxis = chart.yAxes.push(am5xy.ValueAxis.new(root, {
        maxDeviation: 1,
        renderer: am5xy.AxisRendererY.new(root, {
            pan: "zoom"
        })
    }));


    // Add series
    // https://www.amcharts.com/docs/v5/charts/xy-chart/series/
    let series = chart.series.push(am5xy.SmoothedXLineSeries.new(root, {
        name: "Series",
        xAxis: xAxis,
        yAxis: yAxis,
        valueYField: "value",
        valueXField: "date",
        tooltip: am5.Tooltip.new(root, {
            labelText: "{valueY}"
        })
    }));

    series.fills.template.setAll({
        visible: true,
        fillOpacity: 0.2
    });

    series.bullets.push(function () {
        return am5.Bullet.new(root, {
            locationY: 0,
            sprite: am5.Circle.new(root, {
                radius: 4,
                stroke: root.interfaceColors.get("background"),
                strokeWidth: 2,
                fill: series.get("fill")
            })
        });
    });


    // Add scrollbar
    // https://www.amcharts.com/docs/v5/charts/xy-chart/scrollbars/
    chart.set("scrollbarX", am5.Scrollbar.new(root, {
        orientation: "horizontal"
    }));


    let data = generateDatas(ts);
    series.data.setAll(data);


    // Make stuff animate on load
    // https://www.amcharts.com/docs/v5/concepts/animations/
    series.appear(1000);
    chart.appear(1000, 100);

    return root;

}



const TimeSeries = ({ selected }: { selected: string }) => {
    let root1: am5.Root;
    let root2: am5.Root;
    let root3: am5.Root;
    let root4: am5.Root;
    let root5: am5.Root;
    const [activeTab, setActiveTab] = useState(1)


    const fetcher = async (url: string) => await axios.get(url).then((res) => res.data);
    const { data: confirmedData, error: confirmedError } = useSWR(`/api/ts/cases/confirmed?country_region=${selected}&province_state=Total&County=Total`, fetcher)
    const { data: deathsData, error: deathsError } = useSWR(`/api/ts/cases/deaths?country_region=${selected}&province_state=Total&County=Total`, fetcher)
    const { data: daData, error: daError } = useSWR(`/api/ts/vaccines/doses-administered?country_region=${selected}&province_state=Total&County=Total`, fetcher)

    const { data: ppvData, error: ppvError } = useSWR(`/api/ts/vaccines/people-partially-vaccinated?country_region=${selected}&province_state=Total`, fetcher)

    const { data: pfvData, error: pfvError } = useSWR(`/api/ts/vaccines/people-fully-vaccinated?country_region=${selected}&province_state=Total`, fetcher)

    const isAllLoaded = confirmedData && deathsData && daData && pfvData && ppvData
    useEffect(() => {
        if (!isAllLoaded) return;
        console.log(root1)
        if (root1) root1.dispose()
        if (root2) root2.dispose()
        if (root3) root3.dispose()
        if (root4) root4.dispose()
        if (root4) root5.dispose()
        console.log(root1)
        root1 = initChart('chart-1', confirmedData['data'][0]['ts'])
        root2 = initChart('chart-2', deathsData['data'][0]['ts'])
        root3 = initChart('chart-3', daData['data'][0]['ts'])
        root4 = initChart('chart-4', ppvData['data'][0]['ts'])
        root5 = initChart('chart-5', pfvData['data'][0]['ts'])
    }, [isAllLoaded])

    if (confirmedError || deathsError || daError || ppvError || pfvError) return (<p>Loading failed...</p>);
    if (!isAllLoaded) return (<h1>Loading...</h1>);



    const toggleTab = (n: number) => {
        if (n === activeTab) return;
        setActiveTab(n);
        return;
    }






    return (

        <Card style={{ height: '450px' }}>
            <Nav tabs className="ms-2 me-2 mt-2">
                <NavItem>
                    <NavLink
                        className={classnames({ active: activeTab === 1 })}
                        onClick={() => toggleTab(1)}
                    >
                        Confirmed
                    </NavLink>
                </NavItem>
                <NavItem>
                    <NavLink
                        className={classnames({ active: activeTab === 2 })}
                        onClick={() => toggleTab(2)}
                    >
                        Deaths
                    </NavLink>
                </NavItem>
                <NavItem>
                    <NavLink
                        className={classnames({ active: activeTab === 3 })}
                        onClick={() => toggleTab(3)}
                    >
                        Doses Administered
                    </NavLink>
                </NavItem>
                <NavItem>
                    <NavLink
                        className={classnames({ active: activeTab === 4 })}
                        onClick={() => toggleTab(4)}
                    >
                        People Partially Vaccinated
                    </NavLink>
                </NavItem>
                <NavItem>
                    <NavLink
                        className={classnames({ active: activeTab === 5 })}
                        onClick={() => toggleTab(5)}
                    >
                        People Fully Vaccinated
                    </NavLink>
                </NavItem>

            </Nav>
            <TabContent style={{ height: '100%' }} activeTab={activeTab}>


                <TabPane className="h-100" tabId={1}>
                    <div id="chart-1" className="w-100 h-100" >
                    </div>

                </TabPane>
                <TabPane className="h-100" tabId={2}>
                    <div id="chart-2" className="w-100 h-100" >
                    </div>

                </TabPane>
                <TabPane className="h-100" tabId={3}>
                    <div id="chart-3" className="w-100 h-100" >
                    </div>

                </TabPane>
                <TabPane className="h-100" tabId={4}>
                    <div id="chart-4" className="w-100 h-100" >
                    </div>

                </TabPane>
                <TabPane className="h-100" tabId={5}>
                    <div id="chart-5" className="w-100 h-100" >
                    </div>

                </TabPane>
            </TabContent>



        </Card>
    )
}


export default TimeSeries;