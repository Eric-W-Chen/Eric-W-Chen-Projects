import CountUp from 'react-countup';

const About = () => {
    return (
        <div className='container py-5' style={{ background: 'white', boxShadow: '0 0 20px 8px #d0d0d0' }}>
            <div>
                <h1 className='text-center my-5'>About</h1>
                <div className='about-info'>
                    <div className='about-info-item'>
                        <i className="fas fa-dumbbell my-3"></i>
                        <h5><CountUp end={300} duration={1} />+ Fitness Centers</h5>
                    </div>
                    <div className='about-info-item'>
                        <i className="fas fa-utensils my-3"></i>
                        <h5><CountUp end={500} duration={1} />+ Restaurants</h5>
                    </div>
                    <div className='about-info-item'>
                        <i className="fas fa-check-circle my-3"></i>
                        <h5><CountUp end={1000} duration={1} />+ Rewards</h5>
                    </div>
                </div>
                <hr className='divider' />

                <div>
                    <h3 className='my-3'>Who we are</h3>
                    <p>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.</p>
                </div>
                <hr className='divider' />
                <div>
                    <h3 className='my-3'>Our Team</h3>
                    <div className='team-info'>
                        <div className='team-info-item'>
                            <img src='/static/images/jimmy.jpg' />
                            <h3>Jimmy Pham</h3>
                            <h5>CEO & Founder</h5>
                            {/* <p>Jimbowayyyyy Cherry's boyfriend. He is an amazing sexy man where girls flock to his profile every time someone posts him on their story.</p> */}
                        </div>
                        <div className='team-info-item'>
                            <img src='/static/images/alex.jpg' />
                            <h3>Alex De Guzman</h3>
                            <h5>CTO & Co-Founder</h5>
                            {/* <p>An adrenaline junkie, gym rat, and coding god.</p> */}
                        </div>
                        <div className='team-info-item'>
                            <img src='/static/images/cherry.jpg' />
                            <h3>Cherry Huang</h3>
                            <h5>Marketing Director & Co-Founder</h5>
                            {/* <p>Cherry Huang is an IG hoe with 100k male followers. She is so lucky to be Jimmy's girlfriend.</p> */}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default About