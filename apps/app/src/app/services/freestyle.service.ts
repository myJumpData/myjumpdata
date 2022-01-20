import api from './api';

const getFreestyle = (params) => {
  return api.get('/freestyle' + params);
};

const FreestyleService = {
  getFreestyle,
};

export default FreestyleService;
