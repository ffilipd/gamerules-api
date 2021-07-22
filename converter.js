// const axios = require('axios') //FOR USE WHEN DEVELOPING
// const fs = require('fs') //FOR USE WHEN DEVELOPING

const convertTxtFileToJsonString = async (textData) => {

    // GET RULES FOR DEVELOPING
    // const fetchDataFromSourceUrl = async () => {
    //     try {
    //         return axios.get('https://media.wizards.com/2021/downloads/MagicCompRules%2020210419.txt');
    //     }
    //     catch (err) {
    //         throw err;
    //     }
    // }

    const splitTextAndExtractRules = (text) => {
        const textArray = text.split('\n');
        let extractRulesFromContent = textArray.filter(line => {
            return Number.isInteger(parseInt(line[0]))
        })
        return extractRulesFromContent;
    }

    const convertTextToObjects = (array) => {
        let firstCharOfCurrentLine = ''
        let temporaryArray = [];

        array.forEach(line => {
            if (firstCharOfCurrentLine == line[0] || line.split('. ')[0].length == 1) {
                temporaryArray.push(splitLineAndMakeObject(line));
            }
            firstCharOfCurrentLine = line[0]
        })

        return temporaryArray;
    }

    const splitLineAndMakeObject = (line) => {
        let nbr = line.substr(0, line.indexOf(' '));
        let text = line.substr(line.indexOf(' ') + 1);
        return {
            nbr: nbr,
            text: text
        }
    }

    const removeDuplicates = (array) => {
        const filteredArray = array.reduce((acc, current) => {
            const x = acc.find(item => item.nbr === current.nbr);
            if (!x) {
                return acc.concat([current]);
            } else {
                return acc
            }
        }, []);
        return filteredArray;
    }

    const arrangeRulesByChapters = (array) => {
        const chapters = array.filter(obj => obj.nbr.length == 2);
        const subchapters = array.filter(obj => !(obj.nbr.split('.'))[1] && obj.nbr.length == 4);
        const rules = array.filter(obj => (obj.nbr.split('.'))[1]);
        let ruleCardsJson = [];
        let newObj = {};
        chapters.forEach(chapter => {
            newObj = {
                nbr: chapter.nbr,
                name: chapter.text.replace(/\r/gm, ""),
                subchapters: []
            }
            const currentSubchapters = subchapters.filter(subchapter => subchapter.nbr[0] == chapter.nbr[0]);
            currentSubchapters.forEach(subchapter => {
                const currentRules = rules.filter(rule => {return rule.nbr.substr(0, rule.nbr.indexOf('.') + 1) == subchapter.nbr});
                const cleanedUpRules = currentRules.map(rule => {return {nbr: rule.nbr, text: rule.text.replace(/\r/gm, "")}})
                newObj.subchapters.push({
                    nbr: subchapter.nbr,
                    name: subchapter.text.replace(/\r/gm, ""),
                    rules: cleanedUpRules
                })
            })
            ruleCardsJson.push(newObj);
        })
        return ruleCardsJson;

    }


    // const rawTextData = await fetchDataFromSourceUrl(); //UNCOMMENT FOR DEVELOPING
    const arrayWithStringsOfRules = splitTextAndExtractRules(textData);
    const convertedTextWithDuplicates = convertTextToObjects(arrayWithStringsOfRules);
    const cleanArray = removeDuplicates(convertedTextWithDuplicates);
    const finalDataToReturn = arrangeRulesByChapters(cleanArray);

    //FOR USE WHEN DEVELOPING
    // try {
    //     fs.writeFileSync('./test.json', JSON.stringify(finalDataToReturn))
    // } catch (err) {
    //     console.log(err);
    // }

    return finalDataToReturn

}

module.exports = convertTxtFileToJsonString;