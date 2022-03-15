import { useState } from "react"
import ReactLoading from 'react-loading'
import Layout from "../../../components/Layout"
import { forgotPassword } from "../../../actions/auth"

const LoginComponent = () => {
    const [formValues, setFormValues] = useState({
        email: '',
        error: null,
        loading: false,
        message: ''
    })

    const { email, error, loading, message } = formValues

    const handleSubmit = (e) => {
        e.preventDefault();
        setFormValues({ ...formValues, loading: true })
        forgotPassword(email)
            .then((res) => {
                setFormValues({
                    ...formValues, 
                    message: res.data.message, 
                    loading: false
                })
            })
            .catch(err => {
                setFormValues({
                    ...formValues,
                    error: err.response.data.error,
                    loading: false
                })
            })
    }

    const handleChange = name => e => {
        e.preventDefault()
        setFormValues({
            ...formValues,
            [name]: e.target.value
        })
    }

    return (
        <Layout>
            <div>
                <div className="wrapper fadeInDown py-5">
                    <div id="formContent">
                        {message ? <p className = "m-5 alert alert-success">{ message }</p> : <form className='pt-5' onSubmit={handleSubmit}>
                            <input
                                value={email}
                                onChange={handleChange('email')}
                                type="text" className="fadeIn second"
                                placeholder="Email" />
                            <button
                                type="submit"
                                className="fadeIn fourth register-button"
                                disabled={loading}>{loading ? <ReactLoading type="spin" width={25} height={25} /> : "Reset Password"}</button>
                            {error ? <p className="ml-5 mr-5 alert alert-danger">{error}</p> : null}
                        </form>}
                        <div id="formFooter">
                            <a className="underlineHover" href="/login">Login</a>
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    )
}

export default LoginComponent