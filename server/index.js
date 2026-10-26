import express from "express"

const server = express()

const port = process.env.PORT || 4000

server.listen(port, () => {
    console.log("Server is running in port 4000.")
})

server.get("/", (req, res) => {
    return res.status(200).json({ message: "Hello there." })
})