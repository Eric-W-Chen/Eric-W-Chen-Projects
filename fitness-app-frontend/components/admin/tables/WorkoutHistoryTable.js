const WorkoutHistoryTable = ({ workouts, handlePageChange, workoutHistoryLength, page }) => {
    const nextButtonDisabled = () => {
        let maxPages = Math.ceil(workoutHistoryLength / 10)
        return page === maxPages ? true : false
    }
    nextButtonDisabled()
    return (
        <table className="table table-striped">
            <thead>
                <tr>
                    <th scope="col">Date</th>
                    <th scope="col">Location</th>
                    <th scope="col">Checkin</th>
                    <th scope="col">Checkout</th>
                    <th scope="col">Duration</th>
                </tr>
            </thead>
            <tbody>
                {workouts.map(workout => {
                    return (<tr key={workout._id}>
                        <th scope="row">{new Date(workout.startTime).toLocaleDateString()}</th>
                        <td>{workout.location}</td>
                        <td>{new Date(workout.startTime).toLocaleTimeString()}</td>
                        <td>{new Date(workout.endTime) == 'Invalid Date' ? null : new Date(workout.endTime).toLocaleTimeString()}</td>
                        {workout.duration ? <td>{workout.duration.hours}h {workout.duration.minutes}m</td> : <td>{null}</td>}
                    </tr>)
                })}
            </tbody>
            <ul class="pagination">
                <li class={page === 1 ? "page-item disabled" : "page-item"}><a class="page-link" href="#" onClick={handlePageChange('prev')}>Previous</a></li>
                {/* <li class="page-item"><a class="page-link" href="#">1</a></li>
                <li class="page-item"><a class="page-link" href="#">2</a></li>
                <li class="page-item"><a class="page-link" href="#">3</a></li> */}
                <li class={nextButtonDisabled() ? "page-item disabled" : "page-item"}><a class="page-link" href="#" onClick={handlePageChange('next')}>Next</a></li>
            </ul>
        </table>
    )
}

export default WorkoutHistoryTable