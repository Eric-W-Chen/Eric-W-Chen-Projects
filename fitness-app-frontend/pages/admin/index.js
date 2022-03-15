import AdminDashboard from "../../components/admin/AdminDashboard";
import Admin from "../../components/auth/Admin";
import Layout from "../../components/Layout";

const AdminIndex = () => {
    return (
        <Layout>
            <Admin>
                <AdminDashboard />
            </Admin>
        </Layout>
    )
}

export default AdminIndex