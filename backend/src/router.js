const express = require("express");

const router = express.Router();
const multer = require("multer");
const path = require("path");
const { hashPassword, verifyPassword, verifyToken } = require("./utils/auth");

// Configurer de multer pour indiquer le dossier de destination + nom du fichier
// => On configure multer pour stocker l'image telechargé dans le dossier public/uploads/profile
// => et on va generer un nom  de fichier de part l'id de l'utilisateur
const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, "public/uploads/profile"); // Specify the folder where you want to store the uploaded images
  },
  filename(req, file, cb) {
    // On determine le nom du fichier qui va être enregistré par concat userid
    const userId = req.payload.sub; // userid est stocké dans req.payload.sub : id de user est extrait de la propriete sub de payload dans req

    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`; // => Pour generer une chaine qui utilise a-date.now pour que chq fichier telechargé a un sufix unique
    const fileExtension = path.extname(file.originalname); // => l'extension du fichier d'origine
    const filename = `${userId}-${uniqueSuffix}${fileExtension}`;
    cb(null, filename); // => On appel cb, null en 1er argument pour indiquer le nom du fichier
  },
});

// => On creer une instance multer disk pour indiquer la direction et nom du ficher telechargés

// Create a Multer upload instance with the storage configuration
const upload = multer({ storage });

const userControllers = require("./controllers/userControllers");

// Route pour l'upload de l'image de profil
router.post(
  "/user/uploads",
  verifyToken,
  upload.single("profileImage"),
  userControllers.updateProfile
);

router.get("/user/company/:id", verifyToken, userControllers.browse);
router.get("/user/:id", verifyToken, userControllers.read);
router.put("/user/role/:id", verifyToken, userControllers.roleUpdate);
router.put("/user/:id", verifyToken, userControllers.edit);
router.post("/user", verifyToken, hashPassword, userControllers.add);
router.post("/login", userControllers.findByEmailToNext, verifyPassword);
router.delete("/user/:id", verifyToken, userControllers.destroy);

router.post("/resetPassword", userControllers.resetPassword);
router.post("/setNewPassword", hashPassword, userControllers.newPassword);

const categoryControllers = require("./controllers/categoryControllers");

router.get("/categorys/:id", verifyToken, categoryControllers.browse);
router.get("/category/:id", verifyToken, categoryControllers.read);
router.put("/category/:id", verifyToken, categoryControllers.edit);
router.post("/category", verifyToken, categoryControllers.add);
router.delete("/category/:id", verifyToken, categoryControllers.destroy);

const ideaControllers = require("./controllers/ideaControllers");
const commentControllers = require("./controllers/commentControllers");

router.get("/ideas/:id", verifyToken, ideaControllers.browse);
router.get("/useridea/:id", verifyToken, ideaControllers.getIdeaByUser);
router.get("/idea/:id", verifyToken, ideaControllers.read);
router.put("/idea/:id", verifyToken, ideaControllers.edit);
router.post("/idea", verifyToken, ideaControllers.add);
router.delete("/idea/:id", verifyToken, ideaControllers.destroy);

router.post("/idea/:id/like", verifyToken, ideaControllers.like);
router.get("/idea/:id/like", verifyToken, ideaControllers.likeStatus);
router.get("/idea/:id/like/count", verifyToken, ideaControllers.likeNumber);

router.get("/idea/:id/comment/", verifyToken, commentControllers.browse);
router.get("/comment/:id", verifyToken, commentControllers.read);
router.put("/comment/:id", verifyToken, commentControllers.edit);
router.post("/comment", verifyToken, commentControllers.add);
router.delete("/comment/:id", verifyToken, commentControllers.destroy);

const picturestorageControllers = require("./controllers/pictureStorageControllers");

router.get("/picture", verifyToken, picturestorageControllers.browse);
router.get("/picture/:id", verifyToken, picturestorageControllers.read);
router.put("/picture/:id", verifyToken, picturestorageControllers.edit);
router.post("/picture", verifyToken, picturestorageControllers.add);
router.delete("/picture/:id", verifyToken, picturestorageControllers.destroy);

const companyControllers = require("./controllers/companyControllers");

router.get("/register", verifyToken, companyControllers.browse);
router.get("/register/:id", verifyToken, companyControllers.read);
router.put("/register/:id", verifyToken, companyControllers.edit);
router.post("/register", verifyToken, companyControllers.add);
router.delete("/register/:id", verifyToken, companyControllers.destroy);

const teamControllers = require("./controllers/teamControllers");

router.get("/team/:companyId", verifyToken, teamControllers.browse);
router.get("/team/id/:id", verifyToken, teamControllers.read);
router.put("/team/:id", verifyToken, teamControllers.edit);
router.post("/team", verifyToken, teamControllers.add);
router.delete("/team/:id", verifyToken, teamControllers.destroy);

module.exports = router;
