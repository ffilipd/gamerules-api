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
        const cleanArray = array.map(obj => {return {nbr:obj.nbr, text: obj.text.replace(/\r/gm, '')}})
        const chapters = cleanArray.filter(obj => obj.nbr.length == 2);
        const subchapters = cleanArray.filter(obj => !(obj.nbr.split('.'))[1] && obj.nbr.length == 4);
        const rules = cleanArray.filter(obj => (obj.nbr.split('.'))[1]);

        return {chapters, subchapters, rules};
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