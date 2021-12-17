const prod = {
  API_URL: 'https://api.myjumpdata.fediv.me',
};

const dev = {
  API_URL: 'http://localhost:3333',
};

export const CONF = process.env.NODE_ENV === 'development' ? dev : prod;
export const PrimaryColor = '#F59E0B';
