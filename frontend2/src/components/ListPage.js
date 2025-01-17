import React, { useState, useEffect } from 'react'
import { Table, Button, Form, Spinner, Pagination } from 'react-bootstrap'
import '../styles.css'
import { API_URL } from '../config.js'

const ListPage = () => {
	const [data, setData] = useState([])
	const [page, setPage] = useState(1)
	const [pageSize] = useState(10)
	const [searchEmail, setSearchEmail] = useState('')
	const [searchName, setSearchName] = useState('')
	const [searchBody, setSearchBody] = useState('')
	const [totalRecords, setTotalRecords] = useState(0)
	const [searchTriggered, setSearchTriggered] = useState(false)
	const [loading, setLoading] = useState(false)

	const fetchData = async () => {
		setLoading(true) // Set loading to true before starting fetch
		try {
			const response = await fetch(
				`${API_URL}/data?page=${page}&pageSize=${pageSize}&email=${searchEmail}&name=${searchName}&body=${searchBody}`
			)

			if (!response.ok) {
				throw new Error(`HTTP error! Status: ${response.status}`)
			}

			const result = await response.json()

			setData(result.data)
			setTotalRecords(result.pagination.total)
		} catch (error) {
			console.error('Error fetching data:', error)
		} finally {
			setLoading(false) // Set loading to false after fetching
		}
	}

	// Initial fetch with empty filters on component mount
	useEffect(() => {
		fetchData() // Initial fetch when the component mounts
	}, []) // This will run only once when the component mounts

	useEffect(() => {
		if (searchTriggered) {
			setSearchTriggered(false)
			fetchData()
		}
	}, [page, pageSize, searchEmail, searchName, searchBody, searchTriggered])

	const totalPages = totalRecords > 0 ? Math.ceil(totalRecords / pageSize) : 1

	const maxDisplayPages = 10
	let startPage = Math.max(1, page - Math.floor(maxDisplayPages / 2))
	let endPage = Math.min(totalPages, startPage + maxDisplayPages - 1)

	if (endPage - startPage + 1 < maxDisplayPages) {
		startPage = Math.max(1, endPage - maxDisplayPages + 1)
	}

	const handleSearch = () => {
		setPage(1)
		setSearchTriggered(true)
	}

	return (
		<div className='p-4'>
			{/* Full-page loading overlay */}
			{loading && (
				<div className='loading-overlay'>
					<Spinner animation='border' role='status'>
						<span className='sr-only'></span>
					</Spinner>
				</div>
			)}

			<h1>List Data</h1>

			{/* Search Filters */}
			<Form className='mb-4'>
				<Form.Group controlId='searchEmail' className='mb-2'>
					<Form.Control
						type='text'
						placeholder='Search by Email'
						value={searchEmail}
						onChange={(e) => setSearchEmail(e.target.value)}
					/>
				</Form.Group>
				<Form.Group controlId='searchName' className='mb-2'>
					<Form.Control
						type='text'
						placeholder='Search by Name'
						value={searchName}
						onChange={(e) => setSearchName(e.target.value)}
					/>
				</Form.Group>
				<Form.Group controlId='searchBody' className='mb-2'>
					<Form.Control
						type='text'
						placeholder='Search by Body'
						value={searchBody}
						onChange={(e) => setSearchBody(e.target.value)}
					/>
				</Form.Group>
				<Button onClick={handleSearch}>Search</Button>
			</Form>

			{/* Data Table */}
			<Table striped bordered hover style={{ width: '100%', tableLayout: 'fixed' }}>
				<thead>
					<tr>
						<th className='col-postId'>Post ID</th>
						<th className='col-id'>ID</th>
						<th className='col-name'>Name</th>
						<th className='col-email'>Email</th>
						<th className='col-body'>Body</th>
					</tr>
				</thead>
				<tbody>
					{data.length === 0 ? (
						<tr className='table-row'>
							<td colSpan='5' className='text-center'>
								No results found
							</td>
						</tr>
					) : (
						data.map((item) => (
							<tr key={item.id} className='table-row'>
								<td>{item.postId}</td>
								<td>{item.id}</td>
								<td>{item.name}</td>
								<td>{item.email}</td>
								<td>{item.body}</td>
							</tr>
						))
					)}
				</tbody>
			</Table>

			{/* Pagination */}
			<div className='d-flex justify-content-between align-items-center'>
				<div>
					Page {page} of {totalPages}
				</div>
				<Pagination>
					<Pagination.First
						disabled={page === 1}
						onClick={() => {
							setPage(1)
							setSearchTriggered(true)
						}}
					/>
					<Pagination.Prev
						disabled={page === 1}
						onClick={() => {
							setPage(page - 1)
							setSearchTriggered(true)
						}}
					/>
					{Array.from({ length: endPage - startPage + 1 }, (_, index) => {
						const pageNum = startPage + index
						return (
							<Pagination.Item
								key={pageNum}
								active={pageNum === page}
								onClick={() => {
									setPage(pageNum)
									setSearchTriggered(true)
								}}
							>
								{pageNum}
							</Pagination.Item>
						)
					})}

					<Pagination.Next
						disabled={page === totalPages}
						onClick={() => {
							setPage(page + 1)
							setSearchTriggered(true)
						}}
					/>
					<Pagination.Last
						disabled={page === totalPages}
						onClick={() => {
							setPage(totalPages)
							setSearchTriggered(true)
						}}
					/>
				</Pagination>
			</div>
		</div>
	)
}

export default ListPage
