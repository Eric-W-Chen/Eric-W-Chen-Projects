/* eslint-disable */

import { useState } from 'react'
import { isAuth, logoutUser } from '../actions/auth'
import {
    Navbar, 
    NavbarBrand,
    NavbarToggler,
    Collapse,
    Nav,
    NavItem,
    NavLink, 
    UncontrolledDropdown,
    DropdownToggle,
    DropdownMenu,
    DropdownItem,
    NavbarText
} from 'reactstrap'
import Link from 'next/link'
import Router from 'next/router'
import NProgress from 'nprogress'

import { APP_NAME } from '../config'

Router.onRouteChangeStart = url => NProgress.start()
Router.onRouteChangeComplete = url => NProgress.done()
Router.onRouteChangeError = url => NProgress.done()


const Header = () => {
    const [isOpen, setIsOpen] = useState(false)
    const toggle = () => {
        setIsOpen(!isOpen)
    }
    return (
        <div>
            <Navbar
                color="dark"
                expand="md"
                dark
            >
                <NavbarBrand href='/' className='font-weight-bold'>
                    {/* {APP_NAME} */}
                    <img src='/static/images/logo.png' style={{ height: '50px'}}/>
                </NavbarBrand>

                <NavbarToggler onClick={toggle} />
                <Collapse navbar isOpen={isOpen}>
                    <Nav
                        className="ml-auto"
                        navbar
                    >
                        <NavItem className='d-flex align-items-center'>
                            <Link href='/leaderboards'>
                                <NavLink>
                                    Leaderboards
                                </NavLink>
                            </Link>
                        </NavItem>
                        <NavItem className='d-flex align-items-center'>
                            <Link href='/locations'>
                                <NavLink>
                                    Eligible Locations
                                </NavLink>
                            </Link>
                        </NavItem>
                        {isAuth() && (
                            <NavItem className='d-flex align-items-center'>

                                <Link href="/competitions">
                                    <NavLink suppressHydrationWarning>
                                        Competitions
                                    </NavLink>
                                </Link>

                            </NavItem>
                        )}
                        {!isAuth() && (
                            <NavItem className='d-flex align-items-center'>
                                
                                    <Link href="/login">
                                        <NavLink>
                                            <button className='btn btn-secondary'>Login</button>
                                        </NavLink>
                                    </Link>
           
                            </NavItem>
                        )}

                        {!isAuth() && (
                                <NavItem className='d-flex align-items-center'>

                                    <Link href="/register">
                                        <NavLink>
                                            <button className='btn btn-secondary'>Register</button>
                                        </NavLink>
                                    </Link>
                                </NavItem>
                        )}

                        {isAuth() && isAuth().role === 1 && (
                            <NavItem className='d-flex align-items-center'>
                                <Link href='/admin'>
                                    <NavLink suppressHydrationWarning>
                                        Admin Dashboard
                                    </NavLink>
                                </Link>
                            </NavItem>
                        )}
                        {isAuth() && isAuth().role === 0 && (
                            <NavItem className='d-flex align-items-center'>
                                <Link href='/user'>
                                    <NavLink>
                                        {isAuth().username}'s Dashboard
                                    </NavLink>
                                </Link>
                            </NavItem>
                        )}
                        {isAuth() && isAuth().role === 1 && (
                            <NavItem className='d-flex align-items-center'>
                                <Link href='/user'>
                                    <NavLink>
                                        User Dashboard
                                    </NavLink>
                                </Link>
                            </NavItem>
                        )}

                        {isAuth() && (
                            <NavItem className='d-flex align-items-center'>
                                <Link href="/login">
                                    <NavLink suppressHydrationWarning onClick={() => logoutUser(() => Router.push('/login'))}>
                                        Logout
                                    </NavLink>
                                </Link>
                            </NavItem>
                        )}
                    </Nav>
                </Collapse>
            </Navbar>
        </div>
    )
}

export default Header