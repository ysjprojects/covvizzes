import React, { Component, useEffect, useState, useRef } from "react";
import { VaccinesData, CasesData } from "../../utils/types";
import { Card } from 'reactstrap';
import { toISO2 } from "../../utils/helpers";

import * as am5 from '@amcharts/amcharts5';
import * as am5map from '@amcharts/amcharts5/map'
import am5geodata_worldLow from '@amcharts/amcharts5-geodata/worldLow';
import am5themes_Animated from '@amcharts/amcharts5/themes/Animated';


const initChart = (option: number, casesData: CasesData[], vaccinesData: VaccinesData[]) => {
    let d: CasesData[] | VaccinesData[];
    let field: string;
    if ([1, 2, 3].includes(option)) {
        d = casesData

    } else if ([4, 5, 6].includes(option)) {
        d = vaccinesData
    } else {
        throw new Error('Invalid option')
    }

    switch (option) {
        case 1:
            field = 'Confirmed'
            break;
        case 2:
            field = 'Deaths'
            break;
        case 3:
            field = 'Case Fatality Ratio'
            break;
        case 4:
            field = 'Doses Administered'
            break;
        case 5:
            field = 'People Partially Vaccinated'
            break;
        case 6:
            field = 'People Fully_Vaccinated'
            break;
        default:
            throw new Error('Invalid option')
    }

    /* Chart code */
    // Create root element
    // https://www.amcharts.com/docs/v5/getting-started/#Root_element
    console.log("creating root")
    const root = am5.Root.new("chartdiv");

    // Set themes
    // https://www.amcharts.com/docs/v5/concepts/themes/
    root.setThemes([
        am5themes_Animated.new(root)
    ]);

    // Create the map chart
    // https://www.amcharts.com/docs/v5/charts/map-chart/
    let chart = root.container.children.push(
        am5map.MapChart.new(root, {
            panX: "translateX",
            panY: "translateY",
            projection: am5map.geoEquirectangular()
        })
    );

    // Create series for background fill
    // https://www.amcharts.com/docs/v5/charts/map-chart/map-polygon-series/#Background_polygon
    let backgroundSeries = chart.series.push(am5map.MapPolygonSeries.new(root, {}));
    backgroundSeries.mapPolygons.template.setAll({
        fill: root.interfaceColors.get("alternativeBackground"),
        fillOpacity: 0,
        strokeOpacity: 0
    });
    // Add background polygo
    // https://www.amcharts.com/docs/v5/charts/map-chart/map-polygon-series/#Background_polygon
    backgroundSeries.data.push({
        geometry: am5map.getGeoRectangle(90, 180, -90, -180)
    });

    // Create main polygon series for countries
    // https://www.amcharts.com/docs/v5/charts/map-chart/map-polygon-series/
    let polygonSeries = chart.series.push(
        am5map.MapPolygonSeries.new(root, {
            geoJSON: am5geodata_worldLow
        })
    );

    polygonSeries.mapPolygons.template.setAll({
        fill: root.interfaceColors.get("alternativeBackground"),
        fillOpacity: 0.15,
        strokeWidth: 0.5,
        stroke: root.interfaceColors.get("background")
    });

    // Create polygon series for circles
    // https://www.amcharts.com/docs/v5/charts/map-chart/map-polygon-series/
    let circleTemplate: am5.Template<am5.Circle> = am5.Template.new({
        tooltipText: "{name}: {value}"
    });

    let bubbleSeries = chart.series.push(
        am5map.MapPointSeries.new(root, {
            calculateAggregates: true,
            valueField: "value",
            polygonIdField: "id"
        })
    );

    bubbleSeries.bullets.push(function () {
        return am5.Bullet.new(root, {
            sprite: am5.Circle.new(root, {
                radius: 10,
                templateField: "circleTemplate"
            }, circleTemplate)
        });
    });

    bubbleSeries.set("heatRules", [{
        target: circleTemplate,
        min: 3,
        max: 30,
        key: "radius",
        dataField: "value"
    }]);

    let colors = am5.ColorSet.new(root, {});
    if ([1, 2, 3].includes(option)) {
        bubbleSeries.data.setAll((d as CasesData[]).filter((c) => c['Country/Region'] in toISO2 && c['Province/State'] === 'Total' && c['County'] === 'Total').map((c) => {
            const f = field as 'Confirmed' | 'Deaths' | 'Case Fatality Ratio'
            return (
                {
                    id: toISO2[c['Country/Region']],
                    name: c['Country/Region'],
                    value: c[f],
                    circleTemplate: {
                        fill: colors.getIndex(option * 3 + 1)
                    }
                }
            )
        }).filter((r) => r.value !== null))
    } else if ([4, 5, 6].includes(option)) {
        bubbleSeries.data.setAll((d as VaccinesData[]).filter((c) => c['Country/Region'] in toISO2 && c['Province/State'] === 'Total').map((c) => {
            const f = field as 'Doses Administered' | 'People Partially Vaccinated' | 'People Fully_Vaccinated'
            return (
                {
                    id: toISO2[c['Country/Region']],
                    name: c['Country/Region'],
                    value: c[f],
                    circleTemplate: {
                        fill: colors.getIndex(option * 3 + 1)
                    }
                }
            )
        }).filter((r) => r.value !== null))
    }




    // Add globe/map switch
    let cont = chart.children.push(am5.Container.new(root, {
        layout: root.horizontalLayout,
        x: 20,
        y: 40
    }));

    cont.children.push(am5.Label.new(root, {
        centerY: am5.p50,
        text: "Map"
    }));

    let switchButton = cont.children.push(
        am5.Button.new(root, {
            themeTags: ["switch"],
            centerY: am5.p50,
            icon: am5.Circle.new(root, {
                themeTags: ["icon"]
            })
        })
    );

    switchButton.on("active", function () {
        if (!switchButton.get("active")) {
            chart.set("projection", am5map.geoMercator());
            backgroundSeries.mapPolygons.template.set("fillOpacity", 0);
        } else {
            chart.set("projection", am5map.geoOrthographic());
            backgroundSeries.mapPolygons.template.set("fillOpacity", 0.1);
        }
    });

    cont.children.push(
        am5.Label.new(root, {
            centerY: am5.p50,
            text: "Globe"
        })
    );


    // Add zoom control
    // https://www.amcharts.com/docs/v5/charts/map-chart/map-pan-zoom/#Zoom_control
    let zoomControl = chart.set("zoomControl", am5map.ZoomControl.new(root, {}));
    let homeButton = zoomControl.children.moveValue(am5.Button.new(root, {
        paddingTop: 10,
        paddingBottom: 10,
        icon:
            am5.Graphics.new(root, {
                svgPath: "M16,8 L14,8 L14,16 L10,16 L10,10 L6,10 L6,16 L2,16 L2,8 L0,8 L8,0 L16,8 Z M16,8",
                fill: am5.color(0xffffff)
            })
    }), 0)

    homeButton.events.on("click", function () {
        chart.goHome();
    })



    // Make stuff animate on load
    chart.appear(1000, 100);
    return root

}


const Map = ({ casesData, vaccinesData }: { casesData: CasesData[], vaccinesData: VaccinesData[] }) => {
    const chartRef: React.MutableRefObject<am5.Root | null> = useRef(null)
    const [option, setOption] = useState(1)


    useEffect(() => {
        if (!(casesData && vaccinesData)) return;
        console.log("triggered")
        if (chartRef.current) {
            (chartRef.current).dispose();
            console.log("root disposed!")
        }
        console.log("after dispose")

        chartRef.current = initChart(option, casesData, vaccinesData)
        console.log("root created")

    }, [option, casesData, vaccinesData])

    useEffect(() => {
        (document.getElementById(`toggle-btn-1`) as HTMLButtonElement).disabled = true;
    }, [])
    const toggleSelected = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        const N = 6
        const button: HTMLButtonElement = e.currentTarget;
        const value: number = parseInt(button.value)
        button.disabled = true;
        for (let i = 1; i <= N; i++) {
            if (i === value) continue;
            (document.getElementById(`toggle-btn-${i}`) as HTMLButtonElement).disabled = false;
        }
        setOption(value)
        console.log(value)
    }


    return (
        <div style={{ height: '100%' }}>
            <Card style={{ height: '100%' }}>
                <div id="chartdiv" style={{ width: "100%", height: "100%" }}></div>
                <div className="pt-2 pb-2">
                    <div className="card d-inline-block ms-2">
                        <div className="card-body pb-2 pt-2">
                            <button onClick={toggleSelected} id="toggle-btn-1" className="ms-2 btn-sm btn btn-secondary rounded-pill" value={1}>Confirmed</button>
                            <button onClick={toggleSelected} id="toggle-btn-2" className="ms-2 btn-sm btn btn-secondary rounded-pill" value={2}>Deaths</button>
                            <button onClick={toggleSelected} id="toggle-btn-3" className="ms-2 btn-sm btn btn-secondary rounded-pill" value={3}>Case Fatality Ratio</button>


                        </div>

                    </div>
                    <div className="card d-inline-block ms-2">
                        <div className="card-body pb-2 pt-2">
                            <button onClick={toggleSelected} id="toggle-btn-4" className=" btn-sm btn btn-secondary rounded-pill" value={4}>Doses Administered</button>
                            <button onClick={toggleSelected} id="toggle-btn-5" className="ms-2 btn-sm btn btn-secondary rounded-pill" value={5}>People Partially Vaccinated</button>
                            <button onClick={toggleSelected} id="toggle-btn-6" className="ms-2 btn-sm btn btn-secondary rounded-pill" value={6}>People Fully Vaccinated</button>

                        </div>

                    </div>



                </div>
            </Card>

        </div>
    )
}




export default Map;