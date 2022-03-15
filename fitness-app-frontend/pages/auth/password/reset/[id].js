import { useRouter } from "next/router"
import { useState, useEffect } from "react"
import ReactLoading from 'react-loading'
import { resetPassword } from "../../../../actions/auth"

const ResetPassword = () => {
    const [password, setPassword] = useState('')
    const [password2, setPassword2] = useState('')
    const [loading, setLoading] = useState(false)
    const [message, setMessage] = useState(null)
    const [error, setError] = useState(null)
    const router = useRouter()
    
    const handleSubmit = (e) => {
        e.preventDefault();
        if (password !== password2) {
            setError('Passwords do not match')
            return
        }
        // setLoading(true)
        const token = router.query.id
        resetPassword(token, password)
            .then(res => {
                setLoading(false)
                setMessage(res.data.message)
            })
            .catch(err => {
                setLoading(false)
                setError(err.response.data.error)
            })
    }

    return (
        <div>
            <div className="wrapper fadeInDown py-5">
                <div id="formContent">
                    {message ? 
                    <div>
                        <p className="m-5 alert alert-success">{message}</p>
                        <div id="formFooter">
                            <a className="underlineHover" href="/login">Login</a>
                        </div>
                    </div> : 

                    <form className='pt-5' onSubmit={handleSubmit}>
                        <input
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            type="text" className="fadeIn third"
                            placeholder="New password" />
                        <input
                            value={password2}
                            onChange={(e) => setPassword2(e.target.value)}
                            type="text" className="fadeIn third"
                            placeholder="Confirm new password" />
                        <button
                            type="submit"
                            className="fadeIn fourth register-button"
                            disabled={loading}>{loading ? <ReactLoading type="spin" width={25} height={25} /> : "Reset Password"}</button>
                        {error ? <p className="ml-5 mr-5 alert alert-danger">{error}</p> : null}
                    </form>}
                </div>
            </div>
        </div>
    )
}

export default ResetPassword