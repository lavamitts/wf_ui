const Question = require('../classes/question.js')

class Context {
    constructor(req) {
        this.req = req
    }

    check_questions(question_count) {
        this.completed_questions = []
        console.log("Checking questions")
        // console.log(this.req.session.data)
        for (var key of Object.keys(this.req.session.data)) {
            if (key.indexOf("question") > -1) {
                var measure_type_id = key.slice(9, 12)
                var document_code = key.slice(-3)
                this.completed_questions.push(key)
            }
        }
        
        // console.log(this.completed_questions)

        if (this.completed_questions.length >= question_count) {
            console.log("All questions answered")
        }
    }

    clean_questions() {
        if (typeof this.geographical_area_id === "undefined") {
            console.log("Cleaning questions")
            for (var key of Object.keys(this.req.session.data)) {
                if (key.indexOf("question") > -1) {
                    delete this.req.session.data[key]
                }
                // console.log(key + " -> " + this.req.session.data[key])
            }
        }
    }

}
module.exports = Context
