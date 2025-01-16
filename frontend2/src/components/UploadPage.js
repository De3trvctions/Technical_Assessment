import React, { useState } from 'react'
import Papa from 'papaparse'
import '../styles.css'

const UploadPage = () => {
	const [file, setFile] = useState(null)
	const [error, setError] = useState(null)
	const [uploadProgress, setUploadProgress] = useState(null)

	const handleFileChange = (event) => {
		if (event.target.files && event.target.files[0]) {
			setFile(event.target.files[0])
			setError(null)
		}
	}

	// const handleUpload = async () => {
	// 	if (!file) {
	// 		setError('Please select a file to upload.')
	// 		return
	// 	}

	// 	Papa.parse(file, {
	// 		header: true,
	// 		complete: async (result) => {
	// 			const parsedData = result.data
	// 			const isValid = parsedData.every((item) => item.postId && item.id && item.name && item.email && item.body)

	// 			if (!isValid) {
	// 				setError('CSV file is missing required fields.')
	// 				return
	// 			}

	// 			try {
	// 				setUploadProgress(0)
	// 				await fetch('/api/upload', {
	// 					method: 'POST',
	// 					headers: { 'Content-Type': 'application/json' },
	// 					body: JSON.stringify({ data: parsedData }),
	// 				})
	// 				setUploadProgress(100)
	// 				alert('Upload successful!')
	// 			} catch (err) {
	// 				setError('Failed to upload data.')
	// 			}
	// 		},
	// 		error: (err) => {
	// 			setError('Failed to parse CSV file.')
	// 		},
	// 	})
	// }

	const handleUpload = async () => {
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
					await fetch('/data', {
						method: 'POST',
						headers: { 'Content-Type': 'application/json' },
						body: JSON.stringify({ data: filteredData }), // Send the filtered data
					})
					setUploadProgress(100)
					alert('Upload successful!')
				} catch (err) {
					setError('Failed to upload data.')
				}
			},
			error: (err) => {
				setError('Failed to parse CSV file.')
			},
		})
	}

	return (
		<div className='content'>
			<h1>Upload CSV</h1>
			<input type='file' accept='.csv' onChange={handleFileChange} />
			<button onClick={handleUpload}>Upload</button>
			{error && <p className='error'>{error}</p>}
			{uploadProgress !== null && <p>Upload Progress: {uploadProgress}%</p>}
		</div>
	)
}

export default UploadPage
