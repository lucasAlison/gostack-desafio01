const express = require('express');

const server = express();

server.use(express.json());

const projects = [];
let countRequests = 0;

function projectExists(req, res, next){
    if (projects.findIndex((project) => project.id == req.params.id) < 0){
        return res.status(400).json({ error: "Project not exists"})
    }

    return next();
}

function printCountRequest(req, res, next){
    console.log(`Request: ${++countRequests}`);
    return next();
}

server.get('/projects', printCountRequest, (req, res) => {
    return res.json(projects);
})

server.post('/projects', printCountRequest, (req, res) => {
    const { id, title } = req.body;

    projects.push({id, title, tasks:[]});

    return res.json(projects);
})

server.put('/projects/:id', printCountRequest, projectExists, (req, res) => {
    const { id } = req.params;
    const { title } = req.body;
    projects[projects.findIndex((project) => project.id == id)].title = title;
    return res.json(projects);
})

server.delete('/projects/:id', printCountRequest, projectExists, (req, res) => {
    const { id } = req.params;
    projects.splice(projects.findIndex((project) => project.id == id),1);
    return res.json(projects);
})

server.post('/projects/:id/tasks', printCountRequest, projectExists, (req, res) => {
    const { id } = req.params;
    const { title } = req.body;
    projects[projects.findIndex((project) => project.id == id)].tasks.push(title);
    return res.json(projects);
})

server.listen(3000);