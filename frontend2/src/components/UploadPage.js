import React, { useState } from 'react'
import Papa from 'papaparse'
import { Form, Button, Alert, Container, ProgressBar } from 'react-bootstrap'
import { API_URL } from '../config.js'

const UploadPage = () => {
	const [file, setFile] = useState(null)
	const [error, setError] = useState(null)
	const [successMessage, setSuccessMessage] = useState(null)
	const [uploadProgress, setUploadProgress] = useState(null) // Initialize with 0%

	const handleFileChange = (event) => {
		if (event.target.files && event.target.files[0]) {
			setFile(event.target.files[0])
			setError(null)
			setSuccessMessage(null) // Clear success message when new file is selected
		}
	}

	const handleUpload = async () => {
		setUploadProgress(0) // Reset to 0% before starting upload
		setError(null)
		setSuccessMessage(null) // Clear previous success message

		if (!file) {
			setError('Please select a file to upload.')
			return
		}

		Papa.parse(file, {
			header: true,
			complete: async (result) => {
				const parsedData = result.data

				// Create a function to check for missing fields in a row
				const getMissingFields = (item) => {
					const missingFields = []
					if (!item.postId) missingFields.push('postId')
					if (!item.id) missingFields.push('id')
					if (!item.name) missingFields.push('name')
					if (!item.email) missingFields.push('email')
					if (!item.body) missingFields.push('body')
					return missingFields
				}

				// Filter out rows with empty data (where all required fields are missing)
				const filteredData = parsedData.filter((item) => {
					// Check if any required field is filled (not empty)
					return item.postId || item.id || item.name || item.email || item.body
				})

				// Iterate through the filtered data and check for missing fields
				const missingFieldsInData = filteredData.reduce((acc, item, index) => {
					const missingFields = getMissingFields(item)
					if (missingFields.length > 0) {
						acc.push({ row: index + 1, missingFields }) // Row is 1-indexed
					}
					return acc
				}, [])

				if (missingFieldsInData.length > 0) {
					// Prepare error message with the missing fields for each row
					const errorMessages = missingFieldsInData.map(
						(rowInfo) => `Row ${rowInfo.row} is missing fields: ${rowInfo.missingFields.join(', ')}`
					)
					setError(errorMessages.join('\n'))
					return // Stop execution if there's missing data
				}

				try {
					setUploadProgress(0)
					const response = await fetch(`${API_URL}/data`, {
						method: 'POST',
						headers: { 'Content-Type': 'application/json' },
						body: JSON.stringify({ data: filteredData }), // Send the filtered data
					})

					if (response.ok) {
						setUploadProgress(100)
						setSuccessMessage('Upload successful!') // Set success message
					} else {
						// Handle non-200 status codes
						const errorData = await response.json()
						// Assuming the backend returns an error message in the response body
						setError(errorData.message || 'Upload failed, unknown error')
					}
				} catch (err) {
					// Handle network or unexpected errors
					setError('Failed to upload data due to a network error.')
				}
			},
			error: (err) => {
				setError('Failed to parse CSV file.')
			},
		})
	}

	return (
		<Container className='my-4'>
			<h1>Upload CSV</h1>
			<span>Select a CSV file</span>
			<div className='d-flex align-items-center'>
				{/* Form group for file input */}
				<Form.Group controlId='fileUpload' className='mb-0 me-3 d-flex align-items-center'>
					<Form.Control
						type='file'
						accept='.csv'
						onChange={handleFileChange}
						style={{ flex: 1 }} // Ensures the input takes up remaining space
					/>
				</Form.Group>

				{/* Upload button */}
				<Button variant='primary' onClick={handleUpload}>
					Upload
				</Button>
			</div>

			{/* Show error alert if there's any error */}
			{error && (
				<Alert variant='danger' className='mt-3'>
					{error}
				</Alert>
			)}

			{/* Show success alert if upload is successful */}
			{successMessage && (
				<Alert variant='success' className='mt-3'>
					{successMessage}
				</Alert>
			)}

			{/* Show upload progress */}
			{uploadProgress !== null && (
				<ProgressBar now={uploadProgress} label={`${uploadProgress}%`} min={0} max={100} className='mt-3' />
			)}
		</Container>
	)
}

export default UploadPage
