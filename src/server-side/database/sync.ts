import 'dotenv/config'
import { handleExit, prepareDataSource } from '~/server-side/database'

prepareDataSource(true).then(() => {
  handleExit(0, 'SIGINT')
})
