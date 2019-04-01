const express = require("express");
const router = express.router();
const path = require("path");
const request = require("request");
const cherrio = require("cheerio");
const Comment = require("../models/Article.js");

router.get("/", function (req, res) {
    res.redirect("/articles");
});

router.get("/scrape", function (req, res) {
    request("http://www.theverge.com", function (error, response, html) {
        let $ = cheerio.load(html);
        let titlesArray = [];
        $(".c-entry-box--compact_title").each(function (i, element) {
            let result = {};
            result.title = $(this).children("a").text();
            result.link = $(this).children("a").attr("href");

            if (result.title !== "" && result.link !== "") {
                if (titlesArray.indexOf(result.title) == -1) {
                    titlesArray.push(result.title);
                    Article.count({ title: result.title }, function (err, test) {
                        if (test === 0) {
                            let entry = new article(result);
                            entry.save(function (err, doc) {
                                if (err) {
                                    console.log(err);
                                } else {
                                    console.log(doc);
                                }
                            });
                        }
                    });
                } else {
                    console.log("Article already exists.");
                }
            } else {
                console.log("Not saved to DB, missing data");
            }
        });
        res.redirect("/");
    });
});

router.get("/articles", function (req, res) {
    Article.find().sort({ _id: -1 }).exec(function (err, doc) {
        if (err) {
            console.log(err);
        } else {
            let artcl = { article: doc };
            res.render("index", artcl);
        }
    });
});

router.get("/articles-json", function (req, res) {
    Article.find({}, function (err, doc) {
        if (err) {
            console.log(err);
        } else {
            res.json(doc);
        }
    });
});

router.get("/clearAll", function (req, res) {
    Article.remove({}, function (req, doc) {
        if (err) {
            console.log(err);
        } else {
            console.log("removed all articles");
        }
    });
    res.redirect("articles-json");
});

router.get("/readArticle/:id", function (req, res) {
    let articleId = req.params.id;
    let hbsObj = {
        article: [],
        body: []
    };
});