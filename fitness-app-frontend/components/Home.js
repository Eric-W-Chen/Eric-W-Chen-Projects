import Router from "next/router"

const Home = () => {
    return (
        <div className="w-100 test">
            <div className='background pt-5'>
                <div className='d-flex flex-column justify-content-around align-items-center w-100 h-100'>
                    <div className='d-flex justify-content-center align-items-center flex-column'>
                        <h1 className='text-center' style={{letterSpacing: '3.2px'}}>GET FIT AND GET REWARDED.</h1>
                        <img src="/static/images/logo.png" style={{width: '40%'}}/>
                        {/* <h3>Come out on top and win cash</h3> */}
                        {/* <button className="mb-3" onClick={() => Router.push('/checkin')}>Check in</button> */}
                        <button onClick={() => document.getElementById("how-it-works-container").scrollIntoView()}>How it works</button>
                    </div>
                    <button>subscribe to prelaunch updates</button>
                </div>
            </div>
            <hr className='divider' />
            <div className='landing-one d-flex justify-content-around align-items-center text-center my-5'>
                <div>
                    <h1>💪</h1>
                    <h1>Workout at any eligible fitness centers and locations</h1>
                </div>
                <div>
                    <h1>😋</h1>
                    <h1>Redeem points for gift cards and food at restaurants</h1>
                </div>
            </div>
            <div className='d-flex justify-content-center'>
                <button onClick={() => Router.push('/locations')} className='locations-button'>View Locations</button>
            </div>
            <hr className='divider' />
            <div id='how-it-works-container' className='how-it-works-container'>
                <h1 className='text-center'>How It Works</h1>
                <div>
                    <div className='how-it-works'>
                        <div className='how-it-works-num'>
                            <i className="fas fa-map-marker-alt"></i>
                        </div>
                        <div>
                            <h5>The hardest part about going to the gym is getting there. Step one is going to any eligible fitness center and our software will track your time at the gym.</h5>
                        </div>
                    </div>

                    <div className='how-it-works'>
                        <div className='how-it-works-num'>
                            <i className="fas fa-donate"></i>
                        </div>
                        <div>
                            <h5>Workout and earn points! The longer you workout, the more points you earn. Easy peasy.</h5>
                        </div>
                    </div>

                    <div className='how-it-works'>
                        <div className='how-it-works-num'>
                            <i className="fas fa-credit-card"></i>
                        </div>
                        <div>
                            <h5>Redeem your points for gift cards or food at any eligible restaurants</h5>
                        </div>
                    </div>
                </div>
            </div>

            {/* <div style={{ height: "500px" }}>
                <Marquee velocity={10}>
                    {[<h1>hello</h1>, <h2>hello</h2>].map(image => (
                        <h1>{image}</h1>
                    ))}
                </Marquee>
            </div>; */}
        </div>
    )
}

export default Home