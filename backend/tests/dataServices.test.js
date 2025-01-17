import { expect } from 'chai'
import sinon from 'sinon'
import { db } from '../config/db.js'
import DataServices from '../services/DataServices.js'
import fs from 'fs'
import path from 'path'
import csv from 'csv-parser'
import { fileURLToPath } from 'url'

// Manually define __dirname for ES Modules
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

describe('DataServices', () => {
	let csvData = []

	before((done) => {
		const filePath = path.join(__dirname, '../../data.csv')
		fs.createReadStream(filePath)
			.pipe(csv())
			.on('data', (row) => csvData.push(row))
			.on('end', done)
	})

	afterEach(() => {
		sinon.restore()
	})

	it('should insert data into the database', async () => {
		const queryStub = sinon.stub(db, 'query').resolves()

		await DataServices.addData(csvData)

		expect(queryStub.calledOnce).to.be.true
		expect(
			queryStub.calledWith('INSERT INTO datalist (postId, id, name, email, body) VALUES ?', [
				csvData.map((item) => [item.postId, item.id, item.name, item.email, item.body]),
			])
		).to.be.true
	})

	it('should list data with pagination and search filters', async () => {
		const mockRows = [{ postId: 1, id: 1, name: 'John Doe', email: 'john@example.com', body: 'This is a test body' }]
		const queryStub = sinon.stub(db, 'query').resolves([mockRows])

		const result = await DataServices.listData(0, 10, 'John', 'john@example.com', 'test body')

		expect(queryStub.calledOnce).to.be.true
		expect(result).to.deep.equal(mockRows)
	})
})
