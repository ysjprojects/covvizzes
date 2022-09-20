import { NextApiRequest, NextApiResponse } from "next";
import { applyRateLimit } from "../../../../../utils/middlewares";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    try {
        await applyRateLimit(req, res);
    } catch {
        res.status(429).send("too many requests");
    }
    const query = req.query;
    const { country_region, province_state, county } = query;

    const response = await fetch('https://raw.githubusercontent.com/ysjprojects/covid19-json-data/main/ts_deaths.json')
    let raw = await response.json()

    let data;
    if (!country_region && !province_state && !county) {
        //default: world time series
        data = raw.filter((x: any) => x['Country/Region'] === 'World');

    } else if (!county && !province_state) {
        data = raw.filter((x: any) => x['Country/Region'] === country_region);
    } else if (!county) {
        data = raw.filter((x: any) => x['Country/Region'] === country_region && x['Province/State'] === province_state);
    } else {
        data = raw.filter((x: any) => x["Country/Region"] === country_region && x["Province/State"] === province_state && x["County"] === county);

    }

    res.status(200).json({ data: data })



}