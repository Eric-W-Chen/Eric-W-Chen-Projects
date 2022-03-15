import { joinCompetition } from "../../../actions/competitions"
import { getCookie } from "../../../actions/auth"
import ReactLoading from 'react-loading'

const GeneralCompetitionsTable = ({ competitions, setError, setCompetitions, loading, registered, setRegistered }) => {
    const joinComp = (id) => {
        setRegistered({ ...registered, [id]: { loading: true } })
        joinCompetition(getCookie('token'), id)
            .then(res => {
                let newCompetitions = competitions.filter(el => el._id !== res.data._id)
                setCompetitions([...newCompetitions, res.data])
                setRegistered({...registered, [id]: { loading: false, registered: true} })
            })
            .catch(err => {
                setError(err.response.data.error)
                setRegistered({ ...registered, [id]: { loading: false, registered: false } })
            })
    }

    return (
        <div className="table-responsive">
        <table className="table table-striped">
            <thead>
                <tr>
                    <th scope="col">Start Date</th>
                    <th scope="col">End Date</th>
                    <th scope="col">Participants</th>
                    <th scope="col">Reward</th>
                    <th scope="col">Registration</th>
                </tr>
            </thead>


            <tbody>
                {competitions.map(competition => {
                    let compStart = new Date(competition.startDate)
                    let now = new Date(Date.now())
                    now = new Date(now.setDate(now.getDate() + 1))
                    compStart = new Date(compStart.setDate(compStart.getDate() + 1))
                    let compStarted = compStart <= now
                    const { startDate, endDate, participants, reward } = competition
                    if (loading) {
                        return (<tr key={competition._id}>
                            <td><ReactLoading type='spokes' color="black"/></td>
                        </tr>)
                    }
                    return (<tr key={competition._id}>
                        <th scope="row">{compStart.toLocaleDateString()}</th>
                        <td>{new Date(endDate).toLocaleDateString()}</td>
                        <td>{participants?.length}</td>
                        <td>${reward}</td>
                        {/* <td>{compStarted ? <p>Closed</p> : registered[competition._id].loading ? <ReactLoading type="spokes" color="black" style={{ width: '3rem' }} /> :  registered[competition._id].registered ? <p>Registered!</p> :<button onClick={() => joinComp(competition._id)}>Register</button>}</td> */}
                        <td>{competition.participants.length === competition.participantLimit ? <p>Full</p> : registered[competition._id].loading ? <ReactLoading type="spokes" color="black" style={{ width: '1rem' }} /> : registered[competition._id].registered ? <p>Registered!</p> : <button onClick={() => joinComp(competition._id)}>Register</button>}</td>
                        {/* <td>{isRegistered ? <p>Registered!</p> : <button onClick={() => joinComp(competition._id)}>Register</button>}</td> */}
                    </tr>)
                })}
            </tbody>
        </table>
        </div>
    )
}

export default GeneralCompetitionsTable