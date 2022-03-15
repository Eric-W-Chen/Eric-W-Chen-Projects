import { useEffect } from "react";
import Router from "next/router";
import { isAuth } from "../../actions/auth";

const Admin = ({ children }) => {
    useEffect(() => {
        if (isAuth() && isAuth().role === 1) {
            Router.push('/admin')
        } else if (isAuth() && isAuth().role === 0) {
            Router.push('/')
        } else {
            Router.push('/login')
        }
    }, [])

    return <>{children}</>
}

export default Admin