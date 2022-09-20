

export type VaccinesData = {
    "Province/State": string,
    "Country/Region": string,
    "Doses Administered": number,
    "People Partially Vaccinated": number,
    "People Fully Vaccinated": number
}

export type CasesData = {
    "County": string,
    "Province/State": string,
    "Country/Region": string,
    "Confirmed": number,
    "Deaths": number,
    "Previous Confirmed": number,
    "Previous Deaths": number,
    "Confirmed Changes": number,
    "Deaths Changes": number,
    "Case Fatality Ratio": number,
    "Previous Case Fatality Ratio": number
}

export type TVPair = {
    [key: string]: number
}

export type TableData = {
    "Country/Region": string,
    "Confirmed": number,
    "Deaths": number,
    "Case Fatality Ratio": number
}