const axios = require('axios')
const fs = require('fs')

const convertTxtFileToJsonString = async () => {

    const fetchDataFromSourceUrl = async () => {
        try {
            return axios.get('https://media.wizards.com/2021/downloads/MagicCompRules%2020210419.txt');
        }
        catch (err) {
            throw err;
        }
    }

    const splitTextAndExtractRules = (text) => {
        const textArray = text.data.split('\n');
        let extractRulesFromContent = textArray.filter(line => {
            return Number.isInteger(parseInt(line[0]))
        })
        return extractRulesFromContent;
    }

    const convertTextToJson = (array) => {
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
        const chapters = array.filter(obj => obj.nbr.length == 1);
        const subchapters = array.filter(obj => !(obj.nbr.split('.'))[1] && obj.nbr.length == 3);
        const rules = array.filter(obj => (obj.nbr.split('.'))[1]);

    }


    const rawTextData = await fetchDataFromSourceUrl();
    const arrayWithStringsOfRules = splitTextAndExtractRules(rawTextData);
    const convertedTextWithDuplicates = convertTextToJson(arrayWithStringsOfRules);
    const cleanArray = removeDuplicates(convertedTextWithDuplicates);
    const finalDataToReturn = arrangeRulesByChapters(cleanArray);


    try {
        fs.writeFileSync('./test.json', JSON.stringify(cleanArray))
    } catch (err) {
        console.log(err);
    }

}

convertTxtFileToJsonString();