var MarkdownIt = require('markdown-it');

//
// For guidance on how to create filters see:
// https://prototype-kit.service.gov.uk/docs/filters
//

const govukPrototypeKit = require('govuk-prototype-kit')
const addFilter = govukPrototypeKit.views.addFilter

// Add your filters here

addFilter('uppercase', function (content) {
    return content.toUpperCase()
})

addFilter('trim_significant', function (content) {
    if (content.length == 10) {
        if (content.slice(-6) == "000000") {
            content = content.slice(0, 4)
        } else if (content.slice(-4) == "0000") {
            content = content.slice(0, 6)
        } else if (content.slice(-2) == "00") {
            content = content.slice(0, 8)
        }
    }
    return content
})

addFilter('convert_markdown', function (content) {
    md = new MarkdownIt();
    content = md.render(content);
    content = content.replace('a href', 'a target="_blank" href')
    return content
})
