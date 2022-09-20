import { NextApiRequest, NextApiResponse } from "next";
import { applyRateLimit } from "../../../../utils/middlewares";
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    try {
        await applyRateLimit(req, res);
    } catch {
        return res.status(429).send("too many requests");
    }


    const query = req.query;
    const { country_region, province_state } = query;

    const response1 = await fetch('https://raw.githubusercontent.com/ysjprojects/covid19-json-data/main/daily_vaccines.json')
    let raw = await response1.json()

    let data;
    if (!country_region && !province_state) {
        data = raw

    } else if (!province_state) {
        data = raw.filter((x: any) => x['Country/Region'] === country_region)
    } else {
        data = raw.filter((x: any) => x['Country/Region'] === country_region && x['Province/State'] === province_state)

    }

    const response2 = await fetch("https://raw.githubusercontent.com/ysjprojects/covid19-json-data/main/daily_vaccines_updated_at.json")
    const metadata = await response2.json()

    res.status(200).json({ data: data, metadata: metadata })
}
