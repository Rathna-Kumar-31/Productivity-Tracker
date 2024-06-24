const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const path = require('path');
const dotenv = require('dotenv')

dotenv.config({})

const app = express();


mongoose.connect("mongodb://127.0.0.1:27017/productivity-tracker").then(() => {
  console.log('connected to MongoDB');
  app.listen(3000, () => {
      console.log(`Listening to the port ${3000}`);
  });
});

/** 
mongoose.connect('mongodb://localhost:27017/productivity_tracker', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

*/

const taskSchema = new mongoose.Schema({
    taskName: String,
    timeSpent: Number,
    date: { type: Date, default: Date.now },
});

const Task = mongoose.model('Task', taskSchema);

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'src')));


app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'src', 'index.html'));
});






app.post('/task', async(req, res) => {
    const newTask = {
        taskName: req.body.taskName,
        timeSpent: req.body.timeSpent,
        date: req.body.date ,
    };

    const dataStorage = await saveLogs(newTask,res);

    
});



const saveLogs = async(taskDetails,response)=>{

  try{

    const dataStore = await Task.create(taskDetails);

    response.redirect('/');

  }catch(err){

    console.log(err);
  }
  

};



app.get('/summary', async(req, res) => {

  try{

    const logSummary = await Task.find({});
    console.log(logSummary)
    res.render('partials/layout', { title: 'Productivity Summary',
     body: '<table><thead><tr><th>Task Name</th><th>Time Spent (minutes)</th><th>Date</th></tr></thead><tbody>' + 
     logSummary.map(task => `<tr><td>${task.taskName}</td><td>${task.timeSpent}</td><td>${new Date(task.date).toLocaleDateString()}</td></tr>`).join('') +
      '</tbody></table><a href="/">Add Another Task</a>' });


  }catch(err){

    console.log(err);
  }
  });


