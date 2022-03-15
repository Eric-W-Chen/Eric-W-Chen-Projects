import { useState, useEffect } from "react"
import { addValidLocation, fetchAllData, createCompetition, deleteAllCompetitions } from "../../actions/admin"
import { getCookie } from "../../actions/auth"
import UsersTable from "./tables/UsersTable"
import Modal from 'react-modal';
import LocationsTable from "./tables/LocationsTable";
import ReactLoading from 'react-loading';
import { fetchLocationRequests } from "../../actions/locations";
import MyChart from "./Chart";
import AdminCompetitionsTable from "./tables/AdminCompetitionsTable";
import LocationRequestsTable from "./tables/LocationRequestsTable";

const AdminDashboard = () => {

    const [token, setToken] = useState(null)
    const [adminState, setAdminState] = useState({
        users: [],
        locations: [],
        locationRequests: [],
        competitions: [],
        success: false,
        registrations: 0,
        message: ''
    })
    const [modalInfo, setModalInfo] = useState({
        name: '',
        address: '',
        city: '',
        state: '',
        zipCode: ''
    })
    const [competitionStartDate, setCompetitionStartDate] = useState(null)
    const [competitionEndDate, setCompetitionEndDate] = useState(null)
    const [reward, setReward] = useState(0)
    const [participantLimit, setParticipantLimit] = useState(0)

    const { address, city, state, zipCode, name } = modalInfo
    const { users, locations, competitions, registrations } = adminState
    const [modalIsOpen, setIsOpen] = useState(false);
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        setLoading(true)
        let token = getCookie('token')
        setToken(token)
        fetchAllData(token)
            .then(res => {
                let totalParticipants = 0
                res.data.competitions.forEach(comp => totalParticipants += comp.participants.length)
                setAdminState({
                    ...adminState, 
                    users: res.data.users, 
                    locations: res.data.locations, 
                    competitions: res.data.competitions,
                    registrations: totalParticipants,
                    locationRequests: res.data.locationRequests
                })
                setLoading(false)
            })
            .catch(err => console.log(err))
    }, [])
    console.log(adminState);
    const addLocation = (e) => {
        e.preventDefault()
        closeModal()
        setLoading(true)
        addValidLocation(`${address}, ${city} ${state} ${zipCode}`, name, token)
            .then((res) => {
                setLoading(false)
                setAdminState({
                    ...adminState,
                    locations: [...locations, res.data],
                    success: true
                })
            })
            .catch(err => console.log(err))
    }

    const createComp = (e) => {
        e.preventDefault()
        const data = {
            startDate: competitionStartDate,
            endDate: competitionEndDate,
            reward,
            participantLimit
        }
        createCompetition(data)
            .then(res => {
                // console.log(res.data)
                setAdminState({...adminState, competitions: [...competitions, res.data], message: 'Competition created successfully!'})
            })
            .catch(err => console.log(err))
    }

    const handleDeleteAllCompetitions = () => {
        deleteAllCompetitions()
            .then(() => {
                setAdminState({
                    ...adminState,
                    competitions: []
                })
            })
    }

    // MODAL CODE
    const handleModalChange = (name) => (e) => {
        e.preventDefault();
        setModalInfo({
            ...modalInfo,
            [name]: e.target.value
        })
    }

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
    // Modal.setAppElement('#admin-container');
    // MODAL CODE END

    return loading ? <div className="d-flex justify-content-center"><ReactLoading type="spokes" color="black" style={{ width: '3rem' }} /></div> : (
        <div>
            {adminState.message ? <p className="w-100 text-center p-3 alert alert-success">{adminState.message}</p> : null}
            {adminState.success ? <p className="w-100 text-center p-3 alert alert-success">Successfully added new location</p> : null}
            {/* <MyChart users={adminState.users}/> */}
            <div className="container">
                <div className="d-flex justify-content-between mt-5 admin-stats-container">
                    <div className="p-1 pl-5 pr-5 text-center" style={{ background: 'white', boxShadow: '0 0 20px 8px #d0d0d0' }}>
                        <p>Total Users</p>
                        <h1>{users.length}</h1>
                    </div>
                    <div className="p-1 pl-5 pr-5 text-center" style={{ background: 'white', boxShadow: '0 0 20px 8px #d0d0d0' }}>
                        <p>Total Locations</p>
                        <h1>{locations.length}</h1>
                        <button className="btn btn-primary" onClick={openModal}>Add Location</button>
                    </div>
                    <div className="p-1 pl-5 pr-5 text-center" style={{ background: 'white', boxShadow: '0 0 20px 8px #d0d0d0' }}>
                        <p>Registrations</p>
                        <h1>{registrations}</h1>
                    </div>
                    <div className="p-1 pl-5 pr-5 text-center" style={{ background: 'white', boxShadow: '0 0 20px 8px #d0d0d0' }}>
                        <p>Revenue</p>
                        <h1>${registrations * 5}</h1>
                        {/* <button className="btn btn-primary" onClick={openModal}>Add Location</button> */}
                    </div>
                </div>

                {/* <div className="d-flex justify-content-between mt-5 admin-stats-container"> */}
                <form onSubmit={createComp} className="pl-5 pr-5 pb-3 pt-3 text-center" style={{ background: 'white', boxShadow: '0 0 20px 8px #d0d0d0', margin: '10px' }}>
                    <p>Create Competition</p>
                    Start: 
                    <input required className="m-3" type='date' onChange={(e) => setCompetitionStartDate(e.target.value)}/>
                    End: 
                    <input required className="m-3" type='date' onChange={(e) => setCompetitionEndDate(e.target.value)}/>
                    <input className="form-control" required type='number' placeholder="$$ Reward" onChange={(e) => setReward(e.target.value)}/>
                    <input className="form-control" required type='number' placeholder="Max participants" onChange={(e) => setParticipantLimit(e.target.value)} />
                    <button className="btn btn-primary w-100" type='submit'>Create Competition</button><br/>
                    <button className="btn btn-danger w-100" onClick={handleDeleteAllCompetitions}>Delete all competitions</button>
                </form>
                    {/* <button className="btn btn-primary" onClick={openModal}>Add Location</button> */}
                {/* </div> */}

                <hr className='divider' />
                <div className="table-responsive p-3" style={{ background: 'white', boxShadow: '0 0 20px 8px #d0d0d0' }}>
                    <h1>Competitions</h1>
                    <AdminCompetitionsTable competitions={competitions} />
                    <h1>Users</h1>
                    <UsersTable users={users} />
                
                <h1>Locations</h1>
                <LocationsTable locations={locations} setAdminState={setAdminState} adminState={adminState} token={token}/>
                <hr className="divider" />
                </div>
                <hr className='divider' />

                <div className="table-responsive p-3" style={{ background: 'white', boxShadow: '0 0 20px 8px #d0d0d0' }}>
            <h1>Location Requests</h1>
            <LocationRequestsTable setAdminState={setAdminState} adminState={adminState} token={token} locationRequests={adminState.locationRequests} />
                <hr className='divider' />
            </div>

            </div>

            <hr className='divider' />
            

            <Modal
                isOpen={modalIsOpen}
                onRequestClose={closeModal}
                style={customStyles}
                ariaHideApp={false}
            >
                <form onSubmit={addLocation}>
                    <input
                        className='form-control w-100'
                        type='text'
                        value={name}
                        onChange={handleModalChange('name')}
                        placeholder="Location Name" />
                    <input 
                        className='form-control w-100' 
                        type='text' 
                        value={address}
                        onChange={handleModalChange('address')}
                        placeholder="Address" />
                    <input 
                        className='form-control w-100' 
                        type='text' 
                        value={city}
                        onChange={handleModalChange('city')}
                        placeholder="City" />
                    <input 
                        className='form-control w-100' 
                        type='text' 
                        value={state}
                        onChange={handleModalChange('state')}
                        placeholder="State" />
                    <input 
                        className='form-control w-100' 
                        type='text' 
                        value={zipCode}
                        onChange={handleModalChange('zipCode')}
                        placeholder="Zip Code" />
                    <br />
                    <button type='submit' className="btn btn-primary w-100">Add Location</button>
                </form>
            </Modal>
        </div>
    )
}

export default AdminDashboard