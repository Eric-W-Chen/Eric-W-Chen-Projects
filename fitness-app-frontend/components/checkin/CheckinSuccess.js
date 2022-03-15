import CountUp from 'react-countup';
import Confetti from 'react-confetti'

const CheckinSuccess =  ({points, username}) => {

    return (
        <div className='pt-5'>
            <div className="d-flex flex-column justify-content-center align-items-center text-center">
                <h1>Thank you for checking in!</h1>
                <h3>You now have</h3>
                <h1 style={{ color: 'red' }}><CountUp end={points} duration={1} /></h1>
                <h3>points</h3>
                <Confetti tweenDuration={1} numberOfPieces={75} />
            </div>
        </div>
    )
}

export default CheckinSuccess;