import Private from "../../components/auth/Private";
import Layout from "../../components/Layout";
import UserDashboard from "../../components/user/UserDashboard";

const UserIndex = () => {
    return (
        <Layout>
            <Private>
                <UserDashboard />
            </Private>
        </Layout>
    )
}

export default UserIndex