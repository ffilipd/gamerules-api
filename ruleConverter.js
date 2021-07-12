const fs = require('fs');

let gamerules = [];

const converter = (textData) => {

    // pick out the rule content from text
    const filterArray = (data) => {
        return data.filter(string => {
            let firstChar = string.charAt(0);
            if (Number.isInteger(parseInt(firstChar))) {
                return string;
            }
        })
    }

    // // split strings
    const textToJson = (data) => {
        let jsonData = [];

        // split line to number and text
        data.forEach(line => {
            let nbr = line.substr(0, line.indexOf(' '));
            let text = line.substr(line.indexOf(' ') + 1);

            // push to array
            jsonData.push({
                nbr: nbr,
                text: text
            })
        })
        return jsonData;
    }

    // set rules to subheaders
    const setRules = (subHeaderNbr) => {
        let ruleArray = [];

        rawRulesJson.forEach(rule => {
            let ruleNbr = rule.nbr.substr(0, 4);
            if (ruleNbr == subHeaderNbr && rule.nbr.length > 4) {
                ruleArray.push({
                    nbr: rule.nbr,
                    text: rule.text.replace(/\r/gm, "")
                })
            }
        })
        return ruleArray;
    }



    const makeRules = () => {
        let currentContentNbr = '0';
        let currentContentJson = null;

        rawContentJson.forEach(line => {
            let firstCharOfLine = line.nbr.charAt(0);
            let firstCharOfHeader = currentContentNbr.charAt(0);

            //  content number has changed
            if (line.nbr.length == 2 && currentContentNbr != line.nbr && currentContentJson != null) {
                currentContentNbr = line.nbr;
                gamerules.push(currentContentJson);
                currentContentJson = {};
            }

            // set content numbers
            if (line.nbr.length == 2) {
                currentContentNbr = line.nbr
                currentContentJson = {
                    nbr: line.nbr,
                    header: line.text.replace(/\r/gm, ""),
                    subheaders: []
                }
            }
            // line belongs to current content header
            if (firstCharOfLine == firstCharOfHeader) {
                currentContentJson.subheaders.push({
                    nbr: line.nbr,
                    header: line.text.replace(/\r/gm, ""),
                    rules: setRules(line.nbr)
                })
            }

        })
    }

    // split to content and rules
    const splittedText = textData.split('Glossary');
    const contentTextArray = splittedText[0].split('\n');
    const rulesTextArray = splittedText[1].split('\n');

    // filter the rules from other text
    let contentText = filterArray(contentTextArray);
    let rulesText = filterArray(rulesTextArray);

    // Convert to JSON
    let rawContentJson = textToJson(contentText);
    let rawRulesJson = textToJson(rulesText);

    makeRules();

    return gamerules;
}

module.exports = converter;