import React from 'react'
import { BrowserRouter as Router } from 'react-router-dom'
import Sidebar from './components/Sidebar.js'
import AppRoutes from './routes.js'
import './styles.css'

function App() {
	return (
		<Router>
			<div className='app'>
				<Sidebar />
				<div className='content' style={{ marginLeft: '250px', padding: '20px' }}>
					<AppRoutes />
				</div>
			</div>
		</Router>
	)
}

export default App
