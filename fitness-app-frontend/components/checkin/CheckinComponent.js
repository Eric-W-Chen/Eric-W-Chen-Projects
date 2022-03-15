import Router from 'next/router'
import React, { useState, useEffect } from 'react'
import ReactLoading from 'react-loading'
import { checkinUser } from '../../actions/workout'

const CheckinComponent = () => {
    const [location, setLocation] = useState(null)
    const [loading, setLoading] = useState(false)
    const [username, setUsername] = useState('')
    const [error, setError] = useState(null)

    useEffect(() => {
        setLoading(true)
        getCurrentPosition()
    }, [])

    const handleSubmit = (e) => {
        e.preventDefault();
        checkinUser(username, location)
            .then(res => Router.push({
                pathname: '/success',
                query: res.data
            }))
            .catch(err => setError(err.response.data.error))
    }

    const getCurrentPosition = () => {
        navigator.geolocation.getCurrentPosition(pos => {
            setLocation({
                latitude: pos.coords.latitude,
                longitude: pos.coords.longitude
            })
            setLoading(false)
        })
    }

    return (
        <div>
            <div className="wrapper fadeInDown py-5">
                {loading ?                     
                <div className='d-flex justify-content-center flex-column align-items-center text-center'>
                    <h3>Locating...</h3>
                    <ReactLoading color="black" type="spokes" />
                </div> :
                <form id="formContent" className='pt-5' onSubmit={handleSubmit}>
                    <input
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        type="text" className="fadeIn second"
                        placeholder="Username" />
                        {error ? <p style={{color: 'red'}}>{error}</p> : null}
                    <button
                        type="submit"
                        className="fadeIn fourth register-button"
                        disabled={loading}>{loading ? <ReactLoading type="spin" width={25} height={25} /> : "Checkin"}</button>
                </form>}
            </div>
        </div>
    )
}

export default CheckinComponent