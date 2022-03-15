import { useState, useEffect } from "react"
import Layout from '../components/Layout'
import CheckinComponent from "../components/checkin/CheckinComponent"

const Checkin = () => {
    return (
        <Layout>
            <CheckinComponent />
        </Layout>
    )
}

export default Checkin