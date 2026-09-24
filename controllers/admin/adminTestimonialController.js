const Testimonial = require("../../models/Testimonial");
const fs = require("fs");
const path = require("path");

async function homePage(req, res) {
    try {
        let data = await Testimonial.find().sort({ _id: -1 });

        res.render("admin/testimonials/index", {
            session: req.session,
            title: "Admin Testimonial",
            data,
        });
    } catch (error) {
        console.log(error);
    }
}

function createPage(req, res) {
    res.render("admin/testimonials/create", {
        session: req.session,
        title: "Admin Testimonial | Product",
        errorMessage: {},
        data: {},
    });
}

async function storePage(req, res) {
    try {
        var data = new Testimonial(req.body);

        if (req.file) {
            data.pic = `uploads/testimonial/${req.file.filename}`;
        }

        await data.save();

        res.redirect("/admin/testimonial");

    } catch (error) {
        let errorMessage = {};

        error.errors.name
            ? (errorMessage["name"] = error.errors.name.message)
            : "";

        error.errors.pic
            ? (errorMessage["pic"] = error.errors.pic.message)
            : "";

        error.errors.profession
            ? (errorMessage["profession"] = error.errors.profession.message)
            : "";

        error.errors.message
            ? (errorMessage["message"] = error.errors.message.message)
            : "";

        console.log(errorMessage);

        res.render("admin/testimonials/create", {
            session: req.session,
            title: "Admin Testimonial | Product",
            errorMessage,
            data,
        });
    }
}

async function editPage(req, res) {
    try {
        let data = await Testimonial.findOne({
            _id: req.params._id
        });

        res.render("admin/testimonials/edit", {
            session: req.session,
            title: "Admin Testimonial | Product Edit",
            errorMessage: {},
            data: data,
        });

    } catch (error) {
        console.log(error);
    }
}

async function storeUpdatePage(req, res) {
    try {
        var data = await Testimonial.findOne({
            _id: req.params._id
        });

        data.name = req.body.name ? req.body.name : data.name;

        data.profession = req.body.profession
            ? req.body.profession
            : data.profession;

        data.message = req.body.message
            ? req.body.message
            : data.message;

        // Update image only if a new image was selected
        if (req.file) {

            // Delete old image
            if (data.pic) {
                try {
                    const oldImagePath = path.join("public", data.pic);
                    fs.unlinkSync(oldImagePath);
                } catch (error) {
                    console.log(
                        "Old image delete error:",
                        error.message
                    );
                }
            }

            // Save new image path
            data.pic = `uploads/testimonial/${req.file.filename}`;
        }

        await data.save();

        res.redirect("/admin/testimonial");

    } catch (error) {

        console.log(error);

        let errorMessage = {};

        if (error.keyValue) {
            errorMessage["name"] =
                "This testimonial is Already Created";
        }

        res.render("admin/testimonials/edit", {
            session: req.session,
            title: "Admin testimonial | Product",
            errorMessage,
            data,
        });
    }
}

async function deleteRecord(req, res) {
    try {

        let data = await Testimonial.findOne({
            _id: req.params._id
        });

        if (data) {

            if (data.pic) {
                try {
                    const imagePath = path.join("public", data.pic);
                    fs.unlinkSync(imagePath);
                } catch (error) {
                    console.log(
                        "Image delete error:",
                        error.message
                    );
                }
            }

            await data.deleteOne();
        }

        res.redirect("/admin/testimonial");

    } catch (error) {

        console.log(error);

        res.redirect("/admin/testimonial");
    }
}

module.exports = {
    homePage,
    createPage,
    storePage,
    deleteRecord,
    editPage,
    storeUpdatePage
};
