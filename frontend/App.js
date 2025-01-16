import React from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Sidebar from './components/Sidebar'
import UploadPage from './components/UploadPage'
import ListPage from './components/ListPage'
import './styles.css'

const App = () => {
	return (
		<Router>
			<div className='app'>
				<Sidebar />
				<div className='main-content'>
					<Switch>
						<Route path='/upload' component={UploadPage} />
						<Route path='/list' component={ListPage} />
					</Switch>
				</div>
			</div>
		</Router>
	)
}

export default App
