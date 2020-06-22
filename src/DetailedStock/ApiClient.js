import axios from "axios";

var url = "https://api.fusionpointcapital.com";

const client = axios.create({
  baseURL: url
});

export default client;
