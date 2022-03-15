import { useRouter } from 'next/router'
import Router from 'next/router'
import Layout from '../components/Layout'
import CheckinSuccess from "../components/checkin/CheckinSuccess"
import { useEffect } from 'react'

const CheckinSucces = () => {
    const router = useRouter()
    const { username, points } = router.query;

    useEffect(() => {
        if (!username) {
            Router.push('/checkin')
        }
    }, [])
    if (!username || !points) return null 
    return (
        <Layout>
            <CheckinSuccess points={points} username={username}/>
        </Layout>
    )
}

export default CheckinSucces