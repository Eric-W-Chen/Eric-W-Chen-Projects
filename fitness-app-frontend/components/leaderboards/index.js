import { useEffect, useState } from "react"
import { getCurrentCompetitionLeaderboards } from "../../actions/leaderboards"

const LeaderboardsComponent = () => {

    const [currentCompetition, setCurrentCompetition] = useState({ startDate: null, endDate: null})
    const [participants, setParticipants] = useState([])

    useEffect(() => {
        getCurrentCompetitionLeaderboards()
            .then(res => {
                if (res.data) {
                    let participants = res.data.participants.sort((a, b) => b.points - a.points).slice(0, 10)
                    setParticipants(participants)
                    setCurrentCompetition(res.data)
                }
            })
    }, [])

    const { startDate, endDate } = currentCompetition
    let start = startDate ? new Date(startDate).toLocaleDateString() : null
    let end = endDate ? new Date(endDate).toLocaleDateString() : null

    return (
        <div className="table-responsive container" style={{ background: 'white', boxShadow: '0 0 20px 8px #d0d0d0' }}>
            <h3 className="text-center mt-5">Top 10</h3>
            <h4 className="text-center">{start}-{end}</h4>
            {currentCompetition.startDate && currentCompetition.endDate ? <table className="table table-striped">
                <thead>
                    <tr>
                        <th scope="col">Position</th>
                        <th scope="col">Username</th>
                        <th scope="col">Points</th>
                    </tr>
                </thead>

                <tbody>
                    {participants.map((user, pos) => (
                        <tr key={user.user._id}>
                            <th scope="row">{pos + 1}</th>
                            <td>{user.user.username}</td>
                            <td>{user.points}</td>
                            <td></td>
                            <td></td>
                        </tr>
                    ))}
                </tbody>
            </table> : <p className="text-center">No competitions started yet</p>}
        </div>
    )
}

export default LeaderboardsComponent