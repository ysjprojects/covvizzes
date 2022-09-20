import rateLimit from 'express-rate-limit'
import slowDown from 'express-slow-down'
import { NextApiRequest, NextApiResponse } from 'next'

const getIP = (request: any) =>
    request.ip ||
    request.headers['x-forwarded-for'] ||
    request.headers['x-real-ip'] ||
    request.connection.remoteAddress

const limit = 20
const windowMs = 60 * 1_000
const delayAfter = Math.round(limit / 3 * 2)
const delayMs = 500

const middlewares = [
    /*slowDown({ keyGenerator: getIP, windowMs, delayAfter, delayMs }),*/
    rateLimit({ keyGenerator: getIP, windowMs, max: limit }),
]

const applyMiddleware = (middleware: any) => (request: unknown, response: unknown) =>
    new Promise((resolve, reject) => {
        middleware(request, response, (result: unknown) =>
            result instanceof Error ? reject(result) : resolve(result)
        )
    })

async function applyRateLimit(request: NextApiRequest, response: NextApiResponse) {
    await Promise.all(
        middlewares
            .map(applyMiddleware)
            .map(middleware => middleware(request, response))
    )
}

export { applyRateLimit }