const vision = require('@google-cloud/vision');


const CONFIG =  
{
    Credential: {
        private_key: CREDENTIALS.private_key,
        client_email: CREDENTIALS.client_email
    }
}

// vision client
const client = new vision.ImageAnnotatorClient(CONFIG);

const detectImage = async (filePath) => {
    let [result] = await client.textDetection(filePath)
    const endRes = result?.fullTextAnnotation?.text
    console.log("result = ", endRes);
    return endRes;
}


const processData = (dataStr) => {
    let result = {};
    let now = new Date();
    let currYear =now.getFullYear();
    let possiblePronouns = ['mr.', 'mis', 'mrs'];
    dataStr.split("+").forEach((s) => {
        let s1 = s.trim()
        let str = s1.substring(1,s1.length-2);
        let year = str.substring(str.length-6, str.length);
        let str2 = str.replaceAll(" ", '');
        console.log("matching = ", str.length, str2.length);
        if(str.trim().length === 17 && str2.length === 13){
            console.log("inside if");
             result["identification_number"] = str;
        }
        else if(possiblePronouns.includes(str.substring(0,3).toLowerCase())) result["name"] = str;
        else if (/^[\d]*$/.test(year)) {
            if(!result["date-of-birth"]) {
                result["date-of-birth"] = str;
            }
            else {
                if(year > currYear){
                    result["date-of-expiry"] = str;
                }
                else {
                    result["date-of-issue"] = str;
                }
            }
        
        }  
    })

    console.log("result = ", result);
}



module.exports = {detectImage, processData};