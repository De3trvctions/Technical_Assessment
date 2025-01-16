import React, { useState, useEffect } from 'react'
import '../styles.css'

const ListPage = () => {
	const [data, setData] = useState([])
	const [page, setPage] = useState(1)
	const [pageSize] = useState(10)
	const [searchEmail, setSearchEmail] = useState('')
	const [searchName, setSearchName] = useState('')
	const [searchBody, setSearchBody] = useState('')
	const [totalRecords, setTotalRecords] = useState(0)
	const [searchTriggered, setSearchTriggered] = useState(false)
	const [loading, setLoading] = useState(false) // New loading state

	const fetchData = async () => {
		setLoading(true) // Set loading to true before starting fetch
		try {
			const response = await fetch(
				`/data?page=${page}&pageSize=${pageSize}&email=${searchEmail}&name=${searchName}&body=${searchBody}`
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

	// Generate page numbers for the pagination dropdown
	const pageNumbers = []
	for (let i = 1; i <= totalPages; i++) {
		pageNumbers.push(i)
	}

	return (
		<div className='content'>
			<h1>List Data</h1>

			{/* Search Filters */}
			<div className='search-filters'>
				<input
					type='text'
					placeholder='Search by Email'
					value={searchEmail}
					onChange={(e) => setSearchEmail(e.target.value)}
				/>
				<input
					type='text'
					placeholder='Search by Name'
					value={searchName}
					onChange={(e) => setSearchName(e.target.value)}
				/>
				<input
					type='text'
					placeholder='Search by Body'
					value={searchBody}
					onChange={(e) => setSearchBody(e.target.value)}
				/>
				<button
					onClick={() => {
						setPage(1) // Reset to page 1 when search is triggered
						setSearchTriggered(true) // Indicate search was triggered
						fetchData()
					}}
				>
					Search
				</button>
			</div>

			{/* Loading mask */}
			{loading && (
				<div className='loading-mask'>
					<div className='spinner'>Loading</div>
				</div>
			)}

			{/* Data Table */}
			<div className='table-container'>
				<table>
					<thead>
						<tr>
							<th>Post ID</th>
							<th>ID</th>
							<th>Name</th>
							<th>Email</th>
							<th>Body</th>
						</tr>
					</thead>
					<tbody>
						{data.length === 0 ? (
							<tr>
								<td colSpan='5' className='no-results'>
									No results found
								</td>
							</tr>
						) : (
							data.map((item) => (
								<tr key={item.id}>
									<td>{item.postId}</td>
									<td>{item.id}</td>
									<td>{item.name}</td>
									<td>{item.email}</td>
									<td>{item.body}</td>
								</tr>
							))
						)}
					</tbody>
				</table>
			</div>

			{/* Pagination */}
			<div className='pagination'>
				<div className='pagination-controls'>
					<button
						disabled={page === 1}
						onClick={() => {
							setPage(1)
							setSearchTriggered(true)
						}}
					>
						First
					</button>
					<button
						disabled={page === 1}
						onClick={() => {
							setPage(page - 1)
							setSearchTriggered(true)
						}}
					>
						Previous
					</button>

					{/* Page Number Selection */}
					<select
						value={page}
						onChange={(e) => {
							setPage(Number(e.target.value))
							setSearchTriggered(true)
						}}
					>
						{pageNumbers.map((pageNum) => (
							<option key={pageNum} value={pageNum}>
								Page {pageNum}
							</option>
						))}
					</select>

					<button
						disabled={page * pageSize >= totalRecords}
						onClick={() => {
							setPage(page + 1)
							setSearchTriggered(true)
						}}
					>
						Next
					</button>

					<button
						disabled={page === totalPages}
						onClick={() => {
							setPage(totalPages)
							setSearchTriggered(true)
						}}
					>
						Last
					</button>
				</div>

				{/* Page Indicator */}
				<div className='page-indicator'>
					<span>
						Page {page} of {totalPages}
					</span>
				</div>
			</div>
		</div>
	)
}

export default ListPage
