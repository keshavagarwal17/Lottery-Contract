import web3 from './web3';
const address = process.env.REACT_APP_ADDRESS;

const abi = JSON.parse(process.env.REACT_APP_ABI);

export default new web3.eth.Contract(abi,address)