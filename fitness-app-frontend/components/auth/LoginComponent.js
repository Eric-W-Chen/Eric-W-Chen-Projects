import { useState, useEffect } from "react"
import { authenticate, loginUser, isAuth } from "../../actions/auth"
import ReactLoading from 'react-loading'
import Router from "next/router"

const LoginComponent = () => {
    const [formValues, setFormValues] = useState({
        username: '',
        password: '',
        error: null,
        loading: false,
        message: ''
    })

    const { username, password, error, loading } = formValues

    useEffect(() => {
        if (isAuth()) Router.push('/')
    }, [])

    const handleSubmit = (e) => {
        e.preventDefault();
        setFormValues({...formValues, loading: true})
        const user = { username, password }
        loginUser(user)
            .then((res) => {
                authenticate(res.data, () => {
                    // Router.push('/')
                    if (isAuth() && isAuth().role === 1) {
                        Router.push('/admin')
                    } else {
                        Router.push('/user')
                    }
                })
            })
            .catch(err => setFormValues({
                ...formValues, 
                error: err.response.data.error,
                loading: false
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
                            value={password} 
                            onChange={handleChange('password')} 
                            type="text" className="fadeIn third" 
                            placeholder="Password" />
                        <button 
                            type="submit" 
                            className="fadeIn fourth register-button" 
                            disabled={loading}>{loading ? <ReactLoading type="spin" width={25} height={25}/> : "Login"}</button>
                        {error ? <p className="ml-5 mr-5 alert alert-danger">{error}</p> : null}
                    </form>

                    <div id="formFooter">
                        <a className="underlineHover" href="/auth/password/forgot">Forgot Password?</a>
                        <br />
                        <a className="underlineHover" href="/register">Don't have an account?</a>
                    </div>

                </div>
            </div>
        </div>
    )
}

export default LoginComponent