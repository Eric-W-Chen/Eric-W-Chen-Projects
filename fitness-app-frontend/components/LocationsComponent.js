import { useEffect, useState } from "react"
import { fetchLocations } from "../actions/locations"
import { isAuth } from '../actions/auth'
import Modal from 'react-modal';
import ReactLoading from 'react-loading'

// Modal.setAppElement('#main')

const LocationsComponent = () => {
    const [locations, setLocations] = useState([])
    const [loading, setLoading] = useState(false)
    const [modalIsOpen, setIsOpen] = useState(false);
    const [modalInfo, setModalInfo] = useState({
        name: '',
        city: ''
    })

    const { name, city } = modalInfo

    useEffect(() => {
        setLoading(true)
        fetchLocations()
            .then(res => {
                setLocations(res.data)
                setLoading(false)
            })
    }, [])

    const handleLocationRequest = (e) => {
        e.preventDefault();
    }

    const handleModalChange = (name) => (e) => {
        e.preventDefault();
        console.log(e.target.value);
        setModalInfo({
            ...modalInfo,
            [name]: e.target.value
        })
    }
    console.log(modalInfo);
    
    // MODAL
    function openModal() {
        setIsOpen(true);
    }


    function closeModal() {
        setIsOpen(false);
    }

    const customStyles = {
        overlay: {
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)'
        },
        content: {
            top: '50%',
            left: '50%',
            right: 'auto',
            bottom: 'auto',
            transform: 'translate(-50%, -50%)',
        },
    };

    return (
        <div id='main' className="container p-3" style={{ background: 'white', boxShadow: '0 0 20px 8px #d0d0d0'}}>
            <h1 className="text-center mt-5">Locations</h1>
            <div className="text-center">
                {isAuth() && <p>Don't see your gym/fitness center on this list? Request to add your gym <a href='#' onClick={openModal}>here</a></p>}
                <p></p>
            </div>
            <hr className="divider" />
            {loading ? <div className="d-flex justify-content-center mt-5"><ReactLoading color="black" type="spokes" /></div> : <table className="table table-striped">
                <thead>
                    <tr>
                        <th scope="col">Location Name</th>
                        <th scope="col">Address</th>
                    </tr>
                </thead>
                <tbody>
                    {locations.map(location => {
                        const { address, name, coordinates } = location
                        return (<tr key={location._id}>
                            <th scope="row" style={{textTransform: 'capitalize'}}>{name}</th>
                            <td style={{ textTransform: 'capitalize' }}><a target="_blank" href={`https://www.google.com/maps/place/${address}/@${coordinates.latitude}, ${coordinates.longitude}`}>{address}</a></td>
                        </tr>)
                    })}
                </tbody>
            </table>}



            <Modal
                isOpen={modalIsOpen}
                onRequestClose={closeModal}
                style={customStyles}
                ariaHideApp={false}
            >
                <form onSubmit={handleLocationRequest}>
                    <input
                        required
                        className='form-control w-100'
                        type='text'
                        value={name}
                        onChange={handleModalChange('name')}
                        placeholder="Gym/Fitness Center Name" />
                    <input
                        required
                        className='form-control w-100'
                        type='text'
                        value={city}
                        onChange={handleModalChange('city')}
                        placeholder="Location/City" />
                    <br />
                    <button type='submit' className="btn btn-primary w-100">Send Request</button>
                </form>
            </Modal>
        </div>
    )
    
}

export default LocationsComponent