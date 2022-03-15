const RegisteredCompetitionsTable = ({ registeredCompetitions }) => {
    // const nextButtonDisabled = () => {
    //     let maxPages = Math.ceil(workoutHistoryLength / 10)
    //     return page === maxPages ? true : false
    // }
    // nextButtonDisabled()
    return (
        <table className="table table-striped">
            <thead>
                <tr>
                    <th scope="col">Start Date</th>
                    <th scope="col">End Date</th>
                    <th scope="col">Reward</th>
                </tr>
            </thead>
            <tbody>
                {registeredCompetitions.map(competition => {
                    return (<tr key={competition._id}>
                        <th scope="row">{new Date(competition.startDate).toLocaleDateString()}</th>
                        <td>{new Date(competition.endDate).toLocaleDateString()}</td>
                        <td>${competition.reward}</td>
                    </tr>)
                })}
            </tbody>
            {/* <ul class="pagination">
                <li class={page === 1 ? "page-item disabled" : "page-item"}><a class="page-link" href="#" onClick={handlePageChange('prev')}>Previous</a></li>
                <li class={nextButtonDisabled() ? "page-item disabled" : "page-item"}><a class="page-link" href="#" onClick={handlePageChange('next')}>Next</a></li>
            </ul> */}
        </table>
    )
}

export default RegisteredCompetitionsTable