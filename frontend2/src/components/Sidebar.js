import React from 'react'
import { NavLink } from 'react-router-dom'
import { Nav } from 'react-bootstrap'

const Sidebar = () => {
	return (
		<Nav
			className='flex-column bg-dark text-white p-3'
			style={{
				height: '100vh', // Full height
				width: '250px', // Fixed width
				position: 'fixed', // Make it fixed on the left
				top: '0', // Align to the top
				left: '0', // Align to the left
				zIndex: '1000', // Keep it above other elements
			}}
		>
			<h2 className='text-white'>CSV Manager</h2>
			<Nav.Link as={NavLink} to='/upload' className='text-white'>
				Upload CSV
			</Nav.Link>
			<Nav.Link as={NavLink} to='/list' className='text-white'>
				List Data
			</Nav.Link>
		</Nav>
	)
}

export default Sidebar
