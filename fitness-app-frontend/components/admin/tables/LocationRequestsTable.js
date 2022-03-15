import { deleteLocationRequest } from "../../../actions/admin"

const LocationRequestsTable = ({ locationRequests, setAdminState, adminState, token }) => {
    const handleDelete = id => {
        deleteLocationRequest(id, token)
            .then(() => {
                setAdminState({
                    ...adminState,
                    locationRequests: locationRequests.filter(el => el._id !== id)
                })
            })
}
    return (
        <table className="table table-striped">
            <thead>
                <tr>
                    <th scope="col">Location</th>
                    <th scope="col">Fitness Center</th>
                </tr>
            </thead>
            <tbody>
                {locationRequests.map(requests => {
                    const { location, fitnessCenter } = requests
                    return (<tr key={requests._id}>
                        <th scope="row" style={{ textTransform: 'capitalize' }}>{fitnessCenter}</th>
                        <td style={{ textTransform: 'capitalize' }}>{fitnessCenter}</td>
                        <td><i className="fas fa-trash" style={{ cursor: 'pointer' }} onClick={() => handleDelete(requests._id)}></i></td>
                    </tr>)
                })}
            </tbody>
        </table>
    )
}

export default LocationRequestsTable