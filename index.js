const Joi = require('joi');
const express = require("express");
const app = express();

app.use(express.json());

//definice pole pro příklad
const courses = [
    {
        id: 1,
        name: "Javascript course"
    },
    {
        id: 2,
        name: "Python course"
    },
    {
        id: 3,
        name: "C# course"
    }
]

//když v adrese není /api/courses... tak je "hlavní stránka"
app.get('/', (req, res) => {
    res.send('Hello world');
});

//getnutí všech kurzů a vypsání do prohlížeče (pole objektů)
app.get('/api/courses', (req, res) => {
    //tady by jsme ideálně chtěli selectnout 'courses' z databáze
    //v tomto mini projektu, nepracuju s databází
    res.send(courses);
});

// /api/courses/1 - getnutí jednoho kurzu přes URL
app.get('/api/courses/:id', (req, res) => {
    const course = courses.find(c => c.id === parseInt(req.params.id));
    if(!course) { //404 - object not found
        res.status(404).send('The course with the given ID was not found.');
    } else {
        res.send(course);
    }
});

//insert nového kurzu
app.post('/api/courses', (req, res) => {
    //validovat
    //pokud je invalidní, return 400 - Bad request
    const result = validateCourse(req.body);

    if(result.error) {
        //400 bad request
        res.status(400).send(result.error.details[0].message);
        return;
    }

    const course = {
        id: courses.length + 1,
        name: req.body.name,
    };

    courses.push(course);
    res.send(course);
});

//update jména kurzu, podle Id v URL
app.put('/api/courses/:id', (req, res) => {
    //vyhledat kurz
    //když neexistuje, return 404
    const course = courses.find(c => c.id === parseInt(req.params.id));

    if(!course) { //404 - object not found
        res.status(404).send('The course with the given ID was not found.');
        return;
    }

    //validovat
    //pokud je invalidní, return 400 - Bad request
    const result = validateCourse(req.body);

    if(result.error) {
        //400 bad request
        res.status(400).send(result.error.details[0].message);
        return;
    }

    //Update course query
    course.name = req.body.name;
    //Returnnou updatovaný Kurz
    res.send(course);
});

app.delete('/api/courses/:id', (req, res) => {
    //Vyhledat kurz
    //Neexistuje? -> return error 404
    const course = courses.find(c => c.id === parseInt(req.params.id));
    if(!course) { //404 - object not found
        res.status(404).send('The course with the given ID was not found.');
        return;
    }

    //smazat kurz
    const index = courses.indexOf(course);
    courses.splice(index, 1);

    //returnnout smazaný kurz
    res.send(course);
});

//spuštění applikace - listen na přiděleném systémovém portu, pokud není přidělený použije se port 3000
const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});

function validateCourse(course) {
    const schema = {
        name: Joi.string().min(2).required()
    };
    return Joi.validate(course, schema);
}