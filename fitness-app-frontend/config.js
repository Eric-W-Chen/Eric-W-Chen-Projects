import getConfig from "next/config";

const { publicRuntimeConfig } = getConfig()

export const API = publicRuntimeConfig.PRODUCTION ? 'https://fit-rewards-proto-backend.herokuapp.com' : 'http://localhost:8000'
export const APP_NAME = publicRuntimeConfig.APP_NAME
// export const API = 'https://fit-rewards-proto-backend.herokuapp.com' 
// export const APP_NAME = 'FIT ROYALE'

