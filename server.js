

const express = require("express");
const path = require("path");
const fs = require("fs");

// Setting up the Express App
const app = express();
const PORT = process.env.PORT || 3600

// Express App handling data parsing

app.use(express.urlencoded({ extended: true}));
app.use(express.json());
app.use(express.static('public'));


//  Route to take the user to the Home Page

app.get("/", function(req, res){
    res.sendFile(path.join(__dirname, "/public/index.html"));
});

// Route to take the user to the view notes page

app.get("/notes", function(req,res){
    res.sendFile(path.join(__dirname, "/public/notes.html"));
});

// API route that reads the json file with notes

app.get("/api/notes", function(req, res){
    res.sendFile(path.join(__dirname, "/db/db.json"));
        // console.log(data)
        return res.json(data);
    });


// API route that allows user to add new note and post it

app.post("/api/notes", function(req, res){
    let newNote = req.body;
    fs.readFile(path.join(__dirname, "/db/db.json"), "utf-8", function(err, data){
        if (err) throw err;
        let db = JSON.parse(data);
        db.push(newNote);
        var idNum = 0
        //key
        for(i = 0; i < db.length; i++){
            db[i].id = idNum ++;
        }
        fs.writeFile(path.join(__dirname, "/db/db.json"), JSON.stringify(db), function(err){
            if (err) throw err;
            console.log("note added");
        });
    })
});

//API route that allows user to delete a note 
app.delete("/api/notes/:id", function(req,res){
    fs.readFile(path.join(__dirname, "/db/db.json"), "utf-8", function(err){
        if (err) throw err;
        
        let db = JSON.parse(data);
        var noteID = parseInt(req.params.id);
        console.log(db);
        console.log(noteID);
        //return new arr with items that were selected
        var newDB = db.filter(num => num.id != noteID);
                 
        fs.writeFile(path.join(__dirname, "/db/db.json"), JSON.stringify(newDB), function(err){
            if (err) throw err;
            console.log("note deleted");
            
        })
    })
});
//start server
app.listen(PORT, function(){
    console.log("listening on port:" + PORT)
})