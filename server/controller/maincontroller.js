const mongoose = require("mongoose");

const Note = require("../models/note");

exports.homepage = async (req, res) => {
  const locals = {
    title: "Notes App ",
    description: "Free Node js Notes App",
  };
  res.render("index", {
    locals,
    layout: "../views/layouts/front-page.ejs",
  });
};
exports.aboutPage = async (req, res) => {
  const locals = {
    title: "About - Notes App ",
    description: "Free Node js Notes App",
  };
  res.render("about", locals);
};

exports.dashboard = async (req, res) => {
  const perPage = 12;
  const page = req.query.page || 1;

  const locals = {
    title: "DashBoard",
    description: "Free Node js Notes App",
  };

  try {
    const notes = await Note.aggregate([
      {
        $sort: {
          updatedAt: -1,
        },
      },
      {
        $match: {
          user: new mongoose.Types.ObjectId(req.user.id),
        },
      },
      {
        $project: {
          title: { $substr: ["$title", 0, 30] },
          body: { $substr: ["$body", 0, 100] },
        },
      },
    ])
      .skip(perPage * page - perPage)
      .limit(perPage);

    const count = await Note.countDocuments({
      user: new mongoose.Types.ObjectId(req.user.id),
    });

    res.render("dashboard/index1", {
      userName: req.user.firstName,
      locals,
      notes,
      layout: "../views/layouts/dashboard",
    });
  } catch (error) {
    console.log(error);
  }
};

//view notes

exports.viewNote = async (req, res) => {
  const note = await Note.findById({ _id: req.params.id }).where({
    user: req.user.id,
  });

  const locals = {
    title: "View-notes ",
    description: "Free Node js Notes App",
  };

  if (note) {
    res.render("dashboard/view-notes", {
      noteID: req.params.id,
      note,
      locals,
      layout: "../views/layouts/dashboard",
    });
  } else {
    res.send("Somethin went Wrong ");
  }
};

//Update Note

exports.updateNote = async (req, res) => {
  try {
    await Note.findOneAndUpdate(
      {
        _id: req.params.id,
      },
      {
        title: req.body.title,
        body: req.body.body,
        updatedAt:Date.now()
      }
    ).where({ user: req.user.id });

    res.redirect("/dashboard");
  } catch (error) {
    console.log(error);
  }
};

//DeleteNote

exports.deleteNote = async (req, res) => {
  try {
    await Note.deleteOne({ _id: req.params.id }).where({ user: req.user.id });

    res.redirect("/dashboard");
  } catch (error) {
    console.log(error);
  }
};

//Add Note

exports.addNote = async (req, res) => {
  const locals = {
    title: "Add Note",
    description: "Free Node js Notes App",
  };

  res.render("dashboard/add.ejs", {
    layout: "../views/layouts/dashboard",
    locals,
  });
};


//Submit a new Note

exports.addNoteSubmit = async (req,res) =>{

  try{
    
    req.body.user=req.user.id;
    await Note.create(req.body)

     res.redirect("/dashboard");
  }
  catch(error){
    console.log(error);
  }

}

//Search a Note 

exports.searchNote = async (req,res) =>{

  const locals = {
    title: "Search Note",
    description: "Free Node js Notes App",
  };


  res.render("dashboard/search",{
    searchResults:"",
    layout: "../views/layouts/dashboard",
    locals

  })
}

exports.serachNoteSubmit = async (req, res) => {
  try {
    let searchTerm = req.body.searchTerm;
    const searchNoSpecialChars = searchTerm.replace(/[^a-zA-Z0-9 ]/g, "");

    const searchResults = await Note.find({
      $or: [
        { title: { $regex: new RegExp(searchNoSpecialChars, "i") } },
        { body: { $regex: new RegExp(searchNoSpecialChars, "i") } },
      ],
    }).where({ user: req.user.id });

    res.render("dashboard/search", {
      searchResults,
      layout: "../views/layouts/dashboard",
    });
  } catch (error) {
    console.log(error);
  }
};