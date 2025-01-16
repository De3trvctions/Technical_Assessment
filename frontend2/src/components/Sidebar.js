import React from 'react'
import { NavLink } from 'react-router-dom'
import '../styles.css'

const Sidebar = () => {
	return (
		<div className='sidebar'>
			<h2>CSV Manager</h2>
			<NavLink to='/upload' className='active-link'>
				Upload CSV
			</NavLink>
			<NavLink to='/list' className='active-link'>
				List Data
			</NavLink>
		</div>
	)
}

export default Sidebar
