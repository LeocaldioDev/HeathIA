import axios from 'axios';

const api = axios.create({
  baseURL: 'https://localhost:7093',
  headers: {
    'Content-Type': 'application/json',
  },
  validateStatus: (status) => status < 500,
});

// Request interceptor to add the token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    // Log para debug de parâmetros
    console.log('Request Config:', {
      url: config.url,
      method: config.method,
      params: config.params,
      baseURL: config.baseURL
    });
    
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor to handle errors (e.g., token expiration)
api.interceptors.response.use(
  (response) => {
    console.log('=== RESPONSE INTERCEPTOR ===');
    console.log('URL:', response.config.url);
    console.log('Status:', response.status);
    console.log('Data original:', response.data);
    console.log('Headers da resposta:', response.headers);
    
    const paginationHeader = response.headers['pagination'] || response.headers['Pagination'];
    console.log('Header de paginação:', paginationHeader);
    
    if (paginationHeader) {
      try {
        const paginationData = JSON.parse(paginationHeader);
        console.log('Dados de paginação parseados:', paginationData);
        // Transformar resposta para incluir paginação no formato esperado
        const originalData = response.data;
        response.data = {
          items: Array.isArray(originalData) ? originalData : [],
          currentPage: paginationData.currentPage,
          pageSize: paginationData.pageSize,
          totalCount: paginationData.totalCount,
          totalPages: paginationData.totalPages,
          hasNext: paginationData.currentPage < paginationData.totalPages,
          hasPrevious: paginationData.currentPage > 1
        };
        console.log('Response.data transformado:', response.data);
      } catch (e) {
        console.error('Erro ao processar header de paginação:', e);
      }
    } else {
      console.log('Nenhum header de paginação - dados retornados como estão');
      console.log('Data final:', response.data);
    }
    return response;
  },
  (error) => {
    // Log detalhado do erro para debug
    console.error('API Error:', {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status,
      config: {
        url: error.config?.url,
        method: error.config?.method,
        baseURL: error.config?.baseURL
      }
    });

    if (error.response && (error.response.status === 401 || error.response.status === 403)) {
      // Auto logout on unauthorized
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      localStorage.removeItem('role');
      localStorage.removeItem('email');
      // Optional: Redirect to login if not already there
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default api;
