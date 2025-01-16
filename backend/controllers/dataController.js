import DataServices from '../services/dataServices.js'

class DataController {
	async addData(req, res) {
		try {
			const data = req.body.data

			// Validate input
			if (!Array.isArray(data)) {
				return res.status(400).json({ message: 'Data must be an array.' })
			}

			const errors = []

			// Loop through the data to check for missing fields
			data.forEach((item, index) => {
				if (!item.postId) {
					errors.push(`Missing 'postId' at index ${index}`)
				}
				if (!item.id) {
					errors.push(`Missing 'id' at index ${index}`)
				}
				if (!item.name) {
					errors.push(`Missing 'name' at index ${index}`)
				}
				if (!item.email) {
					errors.push(`Missing 'email' at index ${index}`)
				}
				if (!item.body) {
					errors.push(`Missing 'body' at index ${index}`)
				}
			})

			if (errors.length > 0) {
				return res.status(400).json({ message: 'Invalid input data format.', errors })
			}

			// Call service to save data
			await DataServices.addData(data)

			res.status(200).json({ message: 'Data saved successfully!' })
		} catch (error) {
			console.error('Error in saveData:', error)
			res.status(500).json({ message: 'An error occurred while saving data.' })
		}
	}

	// Method to list data with pagination and search filters
	async listData(req, res) {
		try {
			const { page = 1, pageSize = 10, name = '', email = '', body = '' } = req.query // Default to page 1, pageSize 10

			// Validate pagination parameters
			const pageNumber = parseInt(page)
			const pageSizeNumber = parseInt(pageSize)

			if (isNaN(pageNumber) || isNaN(pageSizeNumber) || pageNumber < 1 || pageSizeNumber < 1) {
				return res.status(400).json({ message: 'Invalid pagination parameters.' })
			}

			const offset = (pageNumber - 1) * pageSizeNumber

			// Fetch paginated data with search filters from the service
			const data = await DataServices.listData(offset, pageSizeNumber, name, email, body)

			// Count the total number of records for pagination
			const totalRecords = await DataServices.countData(name, email, body)

			// Send response with paginated data and metadata
			res.status(200).json({
				data,
				pagination: {
					page: pageNumber,
					pageSize: pageSizeNumber,
					total: totalRecords,
				},
			})
		} catch (error) {
			console.error('Error in listData:', error)
			res.status(500).json({ message: 'An error occurred while fetching data.' })
		}
	}
}

export default new DataController()
