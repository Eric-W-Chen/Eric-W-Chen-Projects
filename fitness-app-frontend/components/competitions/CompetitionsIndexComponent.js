import { useEffect, useState } from "react"
import { fetchCompetitions } from "../../actions/competitions"
import GeneralCompetitionsTable from "../admin/tables/GeneralCompetitionsTable"
import { isAuth } from "../../actions/auth"

const CompetitionsIndexComponent = () => {
    const [competitions, setCompetitions] = useState([])
    const [registered, setRegistered] = useState({})
    const [error, setError] = useState(null)
    const [loading, setLoading] = useState(false)
    useEffect(() => {
        setLoading(true)
        fetchCompetitions()
            .then(res => {
                let comps = res.data
                let something = {}
                comps.forEach(comp => {
                    something[comp._id] = { registered: false, loading: false }
                    let participantIds = comp.participants.map(el => el.user)
                    if (participantIds.includes(isAuth()._id)) {
                        something[comp._id].registered = true
                    }
                })
                setRegistered(something)
                setCompetitions(res.data)
                setLoading(false)
            })
    }, [])

    return (
        <div className="container p-3" style={{ background: 'white', boxShadow: '0 0 20px 8px #d0d0d0' }}>
            {error ? <p className="ml-5 mr-5 alert alert-danger">{error}</p> : null}
            <GeneralCompetitionsTable 
                competitions={competitions} 
                setError={setError} 
                setCompetitions={setCompetitions} 
                loading={loading}
                registered={registered}
                setRegistered={setRegistered} /> 
        </div>
    )
}

export default CompetitionsIndexComponent