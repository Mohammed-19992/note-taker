const express = require("express");
const fs = require("fs");
const { parse } = require("querystring");


// Setting up the Express App
const app = express();
const PORT = process.env.PORT || 3500;

// Setting up the Express app for the data parsing
app.use(express.static("public"))
// app.use(express.urlencoded({ extended: true }));
// app.use(express.json());

// HTML Routes (Sending the user to the main page)
app.get("/", function (request, response) {
    response.sendFile(path.join(__dirname, "public/index.html"));
});

// HTML Routes (Sending the user to the notes page)
app.get("/notes", (request, response, next) => {
    response.status(200).sendFile(__dirname + "/public/notes.html");
});
// app.get("/notes", function(request, response) {
// response.sendFile(path.join(__dirname, "public/notes.html"));
// });

// API Routes (reading json file of notes page)
app.get("/api/notes", (request, response, next) => {
    try {
        fs.readFile(__dirname + "/db/db.json", "utf-8", (err, data) => {
            if (err) {
                throw Error(err);
            }
            // Setting response status and JSON content
            const jsonFile = JSON.parse(data);
            response.status(200).send(jsonFile);
        })
    } catch (err) {
        console.log(err);

    }
});

// API Routes (This allows users to add new notes, which means updating json files)
app.post("/api/notes", (request, response, next) => {
    var body = "";
    request.on("data", data => {
        body += data.toString();
    }).on("end", () => {
        const note = parse(body);

        if (Object.keys(note).length !== 0) {
            fs.readFile(__dirname + "/db/db.json", "utf-8", (err, data) => {
                if (err) {
                    throw err;
                }

                data = JSON.parse(data);
                note.id = data.length;
                data.push(note);

                fs.writeFile(__dirname + "/db/db.json", JSON.stringify(data), err => {
                    if (err) throw err;
                    console.log("This was successful.")
                });
            });
            response.send(note);
        } else {
            throw new Error("We believe there is something wrong happened!");
        }
    });
})

// API Routes (This allows the users to delete notes, which means updating json files)
app.delete("/api/notes/:id", (request, response, next) => {
    const id = request.params.id;
    fs.readFile(__dirname + "/db/db.json", "utf-8", (err, notes) => {
        if (err) {
            throw err;
        }

        notes = JSON.parse(notes);
        for (let i = 0; i < notes.length; i++) {
            if (notes[i].id === parseInt(id)) {
                notes.splice(i, 1);
            }
        }
        fs.writeFile(__dirname + "/db/db.json", JSON.stringify(notes), err => {
            if (err) throw err;

            console.log("That was successful.")
        });
    });

    response.send("Note Deleted.");
})

// Beginning listening to the port
app.listen(PORT, function () {
    console.log("App listening on PORT " + PORT);
});
