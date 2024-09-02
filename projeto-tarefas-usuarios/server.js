const express = require('express'); 

const User = require('./classes/user');
const Task = require('./classes/task'); 

const port = 3000; 
const app = express(); 

app.use(express.json());

let users = []; 
let tasks = []; 

//Rota para adicionar um novo usuário:
app.post('/users' , (req,res)=>{
    const {name} = req.body; 
    /* Criamos um novo usuário com um ID gerado automaticamente e o nome fornecido
    O ID é calculado com base no comprimento atual do array 'users', adicionando 1
    Isso garante que o ID seja único e sequencial para novos usuários */
    const newUser = new User(users.length+1, name);
    users.push(newUser); 
    res.status(201).json(newUser); 
});

//Rota para adicionar uma nova tarefa para um usuário específico:
app.post('/users/:userId/tasks', (req,res) =>{
    const {userId} = req.params; 
    const {description} = req.body; 
    const user = users.find(user => user.id === parseInt(userId)); 
    if(!user) return res.status(404).json({error:'Usuário não encontrado.'});
    const newTask = new Task(tasks.length+1, description, user.id);
    tasks.push(newTask);
    user.tasks.push(newTask);
    res.status(201).json(tasks);
});

//Rota para listar todas as tarefas de um usuário:
app.get('/users/:userId/tasks', (req,res)=>{
    const {userId} = req.params;
    const user = users.find(user => user.id === parseInt(userId));
    if(!user) return res.status(404).json({error:'Usuário não encontrado.'}); 
    res.json(user.tasks);
});

//Rota para marcar uma tarefa como concluída:
app.put('/users/:userId/tasks/:taskId', (req,res) => {
    const {userId, taskId} = req.params;
    const user = users.find(user => user.id === parseInt(userId)); 
    if(!user) return res.status(404).json({error:'Usuário não encontrado'}); 
    const task = user.tasks.find(task => task.id === parseInt(taskId));
    if(!task) return res.error(404).json({error:'Tarefa não encontrada'}); 
    task.completed = true; 
    res.json(task); 
});

//Rota para excluir uma tarefa de um usuário:
app.delete('/users/:userId/tasks/:taskId', (req,res)=>{
    const {userId, taskId} = req.params; 
    const user = users.find(user => user.id === parseInt(userId));
    if(!user) return res.status(404).json({error:'Usuário não encontrado'});
    const taskIndex = user.tasks.findIndex(task => task.id === parseInt(taskId));
    if(taskIndex === -1) return res.status(404).json({error:'Tarefa não encontrada'});
    user.tasks.splice(taskIndex,1);
    tasks = tasks.filter(task => task.id !== parseInt(taskId));
    res.json({message:'Tarefa excluída com sucesso.'});

});

app.listen(port, ()=>{
    console.log('O servidor está rodando...'); 
});