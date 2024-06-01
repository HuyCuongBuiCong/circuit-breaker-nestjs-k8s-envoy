const axios = require('axios');
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
const makeRequest = async () => {
    for (let i = 1; i <= 20; i++) {
         console.log(`Making request ${i}`);
         const response = await axios.get('http://localhost:3000/recommendation');
         await sleep(1000);
         console.log(response.data);
    }
}
makeRequest();
