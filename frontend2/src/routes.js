import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import UploadPage from './components/UploadPage.js'
import ListPage from './components/ListPage.js'

const AppRoutes = () => {
	return (
		<Routes>
			<Route path='/' element={<Navigate to='/upload' />} />
			<Route path='/upload' element={<UploadPage />} />
			<Route path='/list' element={<ListPage />} />
		</Routes>
	)
}

export default AppRoutes
