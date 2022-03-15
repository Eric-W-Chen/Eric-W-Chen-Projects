const AdminCompetitionsTable = ({ competitions }) => {
    return (
        <table className="table table-striped">
            <thead>
                <tr>
                    <th scope="col">Start Date</th>
                    <th scope="col">End Date</th>
                    <th scope="col">Participants</th>
                    <th scope="col">Reward</th>
                    <th scope="col">Max Participants</th>
                </tr>
            </thead>
            <tbody>
                {competitions.map(competition => {
                    const { startDate, endDate, participants, reward, participantLimit } = competition
                    return (<tr key={competition._id}>
                        <th scope="row">{new Date(startDate).toLocaleDateString()}</th>
                        <td>{new Date(endDate).toLocaleDateString()}</td>
                        <td>{participants?.length}</td>
                        <td>${reward}</td>
                        <td>{participantLimit}</td>
                    </tr>)
                })}
            </tbody>
        </table>
    )
}

export default AdminCompetitionsTable