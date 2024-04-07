// import some node modules for later
const fs = require("fs"); // biblio : qui gere lees fichier (crea, modif, suppr de fichier)
const fsPromises = require("fs").promises; // biblio en async
const path = require("path"); // pour gerer les noms de fichier sans les (..//) commun a express et node

// create express app

const express = require("express");

const app = express();

// use some application-level middlewares

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
const cors = require("cors");

app.use(
  cors({
    origin: process.env.FRONTEND_URL ?? "http://localhost:5173",
    optionsSuccessStatus: 200,
  })
);

// import and mount the API routes

const router = require("./router");

app.use(router);

// Directory creation if don't exist
// On verifie si le fichier que l'on passe en parametre existe ou non
// => si cela n'existe pas , il faut le creer (repertoire public)
// => la fonction join permet de concatener la chaine de repertoire
// => dirname : variable locale : repertoire courant du fichier (public)
const basePath = path.join(__dirname, "..");
if (!fs.existsSync(path.join(basePath, "public"))) {
  fsPromises.mkdir(path.join(basePath, "public"));
}
if (!fs.existsSync(path.join(basePath, "public", "uploads"))) {
  fsPromises.mkdir(path.join(basePath, "public", "uploads"));
}

if (!fs.existsSync(path.join(basePath, "public", "uploads", "profile"))) {
  fsPromises.mkdir(path.join(basePath, "public", "uploads", "profile"));
}
app.use(express.static(path.join(__dirname, "../public"))); // Quand on recois une demande sur /public/uploads/profil et de prendre directement le repertoire public et non un autre

// serve REACT APP

const reactIndexFile = path.join(
  __dirname,
  "..",
  "..",
  "frontend",
  "dist",
  "index.html"
);

if (fs.existsSync(reactIndexFile)) {
  // serve REACT resources

  app.use(express.static(path.join(__dirname, "..", "..", "frontend", "dist")));

  // redirect all requests to the REACT index file

  app.get("*", (req, res) => {
    res.sendFile(reactIndexFile);
  });
}

// ready to export

module.exports = app;
