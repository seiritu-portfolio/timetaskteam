import axios from 'axios';

const axiosConfig = axios.create({
  baseURL: process.env.baseUrl,
});

axiosConfig.defaults.headers.common['Access-Control-Allow-Origin'] = '*';
axiosConfig.defaults.headers.common['Content-Type'] = 'application/json';
axiosConfig.defaults.headers.common['Accept'] = 'application/json';

export default axiosConfig;

const axiosConfigForGAuth = axios.create();
axiosConfigForGAuth.defaults.headers.common['Content-Type'] =
  'application/x-www-form-urlencoded';

export { axiosConfigForGAuth };
