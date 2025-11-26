import express from "express"
import { SearchQuery } from "../controller/SearchQuery.js"
const router = express.Router()

router.post("/", SearchQuery)

export default router