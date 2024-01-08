const express = require("express");
const { NotesModel } = require("../model/notes.modle");
var colors = require("colors");
const multer = require("multer");
const path = require("path");

const NotesRouter = express.Router();

// Multer setup
const storage = multer.diskStorage({
  destination: "./uploads/",
  filename: function (req, file, cb) {
    cb(
      null,
      file.fieldname + "-" + Date.now() + path.extname(file.originalname)
    );
  },
});

const upload = multer({ storage: storage });

// Add new Note

NotesRouter.post("/add", upload.single("image"), async (req, res) => {
  try {
    const userId = req.body.userId;
    const imageUrl = req.file ? req.file.filename : null;
    const { title, description, tags, private } = req.body;
    const parsedTags = tags ? JSON.parse(tags) : [];
    const parsedPrivate = private ? JSON.parse(private) : false;
console.log(req.file)
    const newNote = new NotesModel({
      userId,
      title,
      description,
      tags: parsedTags,
      isPrivate: parsedPrivate,
      imageUrl,
    });

    await newNote.save();

    // console.log("Saved Note2", newNote);
    res.status(200).json({ msg: "New note added", success: true });
  } catch (error) {
    // console.error("Error saving note:", error);

    res
      .status(500)
      .json({ msg: "Unabe to add note", success: false, error: error.message });
  }
});

// Get all notes

NotesRouter.get("/", async (req, res) => {
  try {
    const userId = req.body.userId;
    const allNotes = await NotesModel.find({ userId });
    res.status(200).json({ msg: "All Notes", allNotes });
  } catch (error) {
    res
      .status(500)
      .json({ msg: "Err in getting all Notes", error: error.message });
  }
});

// Update Note by id
NotesRouter.patch("/update/:id", async (req, res) => {
  try {
    const userId = req.body.userId;
    const id = req.params.id;
    const Onenote = await NotesModel.findById(id);

    if (Onenote.userId !== userId) {
      console.log(colors.bgRed(userId, "!==", note.userId));
      res
        .status(200)
        .json({ msg: "You are not authorized to this action", success: false });
    } else {
      await NotesModel.findByIdAndUpdate(id, req.body);
      res.status(200).json({ msg: "Note updated", success: true });
    }
  } catch (error) {
    res
      .status(500)
      .json({
        msg: "Unabe to update note",
        success: false,
        error: error.message,
      });
  }
});

// Delete note by Id

NotesRouter.delete("/delete/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.body.userId;
    const note = await NotesModel.findById(id);

    if (userId !== note.userId) {
      console.log(colors.bgRed(userId, "!==", note.userId));
      res
        .status(200)
        .json({ msg: "You are not authorized to this action", success: false });
    } else {
      await NotesModel.findByIdAndDelete(id);
      res.status(200).json({ msg: "Note Deleted", success: true });
    }
  } catch (error) {
    res
      .status(500)
      .json({
        msg: "Unabe to update note",
        success: false,
        error: error.message,
      });
  }
});

module.exports = { NotesRouter };
