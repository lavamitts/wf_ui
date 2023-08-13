//
// For guidance on how to create routes see:
// https://prototype-kit.service.gov.uk/docs/create-routes
//

const govukPrototypeKit = require('govuk-prototype-kit')
const router = govukPrototypeKit.requests.setupRouter()
const axios = require('axios')
const Context = require('./classes/context');

// Add your routes here
router.get(['/test/'], function (req, res) {
    var context = new Context(req);
    res.render('index', {});
});

router.get([
    '/subheadings/:goods_nomenclature_item_id',
    '/subheadings/:goods_nomenclature_item_id/:geographical_area_id'
], function (req, res) {
    var qs = require('qs');
    var context = new Context(req);
    context.goods_nomenclature_item_id = req.params["goods_nomenclature_item_id"];
    context.geographical_area_id = req.params["geographical_area_id"];
    req.session.data["goods_nomenclature_item_id"] = context.goods_nomenclature_item_id
    req.session.data["geographical_area_id"] = context.geographical_area_id
    context.clean_questions()

    var query_string;
    if (req.query.length > 0) {
        query_string = qs.stringify(req.query)
    } else {
        query_string = ""
        query_string = qs.stringify(req.query)
    }

    var url;
    if (context.geographical_area_id == null) {
        url = `http://127.0.0.1:5000/subheadings/${context.goods_nomenclature_item_id}`
    } else {
        url = `http://127.0.0.1:5000/subheadings/${context.goods_nomenclature_item_id}/${context.geographical_area_id}?${query_string}`
    }
    console.log(url)
    axios.get(url)
        .then((response) => {
            if (response.data["questions"].length > 0) {
                context.check_questions(response.data["questions"].length)
            }
            res.render('subheading', {
                'context': context,
                'data': response.data["data"],
                'trade_context': response.data["trade_context"],
                'questions': response.data["questions"]
            });
        });
});

router.get(['/form_handler'], function (req, res) {
    var context = new Context(req);
    var qs = require('qs');
    context.goods_nomenclature_item_id = req.session.data["goods_nomenclature_item_id"];
    context.geographical_area_id = req.session.data["geographical_area_id"];

    var screen = req.session.data["screen"];
    switch (screen) {
        case "select_geography":
            var url = "/subheadings/goods_nomenclature_item_id/geographical_area_id".replace(
                "goods_nomenclature_item_id", context.goods_nomenclature_item_id
            ).replace(
                "geographical_area_id", context.geographical_area_id
            )
            res.redirect(url)
            break
        case "questions":
            var questions = req.session.data
            for (var key of Object.keys(questions)) {
                if (key.indexOf("question") == -1) {
                    delete questions[key]
                }
            }
            var url = "/subheadings/goods_nomenclature_item_id/geographical_area_id?questions".replace(
                "goods_nomenclature_item_id", context.goods_nomenclature_item_id
            ).replace(
                "geographical_area_id", context.geographical_area_id
            ).replace(
                "questions", qs.stringify(questions)
            )
            res.redirect(url)
            break
    }
});