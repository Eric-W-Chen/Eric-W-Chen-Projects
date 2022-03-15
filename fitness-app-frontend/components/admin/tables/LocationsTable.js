import { deleteLocation } from "../../../actions/admin"

const LocationsTable = ({ locations, setAdminState, adminState, token }) => {
    const handleDelete = id => {
        deleteLocation(id, token)
            .then(() => {
                setAdminState({
                    ...adminState,
                    locations: adminState.locations.filter(el => el._id !== id)
                })
            })
    }
    return (
        <table className="table table-striped">
            <thead>
                <tr>
                    <th scope="col">Location Name</th>
                    <th scope="col">Address</th>
                    <th scope="col">Coordinates</th>
                    <th scope="col">Actions</th>
                </tr>
            </thead>
            <tbody>
                {locations.map(location => {
                    const { address, name, coordinates } = location
                    return (<tr key={location._id}>
                        <th scope="row" style={{ textTransform: 'capitalize' }}>{name}</th>
                        <td style={{ textTransform: 'capitalize' }}>{address}</td>
                        <td><a href={`https://www.google.com/search?q=${coordinates.latitude}%2C+${coordinates.longitude}`} target="_blank">{coordinates.latitude}, {coordinates.longitude}</a></td>
                        <td><i className="fas fa-trash" style={{ cursor: 'pointer' }} onClick={() => handleDelete(location._id)}></i></td>
                    </tr>)
                })}
            </tbody>
        </table>
    )
}

export default LocationsTable