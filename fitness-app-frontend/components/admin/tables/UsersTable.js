const UsersTable = ({users}) => {
    return (
        <table className="table table-striped">
            <thead>
                <tr>
                    <th scope="col">Username</th>
                    <th scope="col">Email</th>
                    <th scope="col">Points</th>
                    {/* <th scope="col">Profile</th> */}
                </tr>
            </thead>
            <tbody>
                {users.map(user => {
                    const { username, email, points, profile } = user
                    return (<tr key={user._id}>
                        <th scope="row">{username}</th>
                        <td>{email}</td>
                        <td>{points}</td>
                        {/* <td><a href="/">{profile}</a></td> */}
                    </tr>)
                })}
            </tbody>
        </table>
    )
}

export default UsersTable