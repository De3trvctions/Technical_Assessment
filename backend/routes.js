import { Router } from 'express'
import DataController from './controllers/dataController.js'

const router = Router()

router.post('/data', DataController.addData)
router.get('/data', DataController.listData)

export default router
