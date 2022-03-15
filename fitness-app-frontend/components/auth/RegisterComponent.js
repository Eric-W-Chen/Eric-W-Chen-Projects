import { useState, useEffect } from "react"
import { registerUser, isAuth } from "../../actions/auth"
import ReactLoading from 'react-loading';
import Router from "next/router"

const RegisterComponent = () => {
    const [formValues, setFormValues] = useState({
        username: '',
        email: '',
        password: '',
        confirmPassword: '',
        error: null,
        loading: false,
        message: '', 
        submitted: false
    })

    const { username, email, password, confirmPassword, error, message, loading, submitted } = formValues

    useEffect(() => {
        if (isAuth()) Router.push('/')
    }, [])

    const handleSubmit = (e) => {
        e.preventDefault();
        setFormValues({...formValues, loading: true})
        const user = { username, email, password, confirmPassword }
        registerUser(user)
            .then(res => setFormValues({
                ...formValues, 
                message: res.data.message, 
                error: null,
                username: '',
                password: '',
                confirmPassword: '',
                email: '',
                loading: false,
                submitted: true
            }))
            .catch(err => setFormValues({
                ...formValues, error: err.response.data.error, message: ''
            })) 
            // .catch(err => console.log(err))
    }

    const handleChange = name => e => {
        e.preventDefault()
        setFormValues({
            ...formValues,
            [name]: e.target.value
        })
    }

    return (
        <div>
            <div className="wrapper fadeInDown py-5">
                <div id="formContent">
                    {/* <div className="fadeIn first">
                        <img src="http://danielzawadzki.com/codepen/01/icon.svg" id="icon" alt="User Icon" />
                    </div> */}

                    <form className='pt-5' onSubmit={handleSubmit}>
                        <input
                            value={username}
                            onChange={handleChange('username')}
                            type="text" className="fadeIn second"
                            placeholder="Username" />
                        <input
                            value={email}
                            onChange={handleChange('email')}
                            type="text" className="fadeIn second"
                            placeholder="Email" />
                        <input
                            value={password}
                            onChange={handleChange('password')}
                            type="text" className="fadeIn third"
                            placeholder="Password" />
                        <input
                            value={confirmPassword}
                            onChange={handleChange('confirmPassword')}
                            type="text" className="fadeIn third"
                            placeholder="Confirm password" />
                        <button
                            type="submit"
                            className="fadeIn fourth register-button"
                            value="Register" 
                            disabled={loading || submitted}>{loading ? <ReactLoading type="spin" /> : "Register"}</button>
                        {error ? <p className="ml-5 mr-5 alert alert-danger">{error}</p> : null}
                        {message ? <p className="ml-5 mr-5 alert alert-success">{message} <a href="/login">here</a></p> : null}
                    </form>
                    <div id="formFooter">
                        <a className="underlineHover" href="/login">Already have an account?</a>
                    </div>

                </div>
            </div>
        </div>
    )
}

export default RegisterComponent