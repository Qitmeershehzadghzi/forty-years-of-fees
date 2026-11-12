import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 45000,
});

api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const message = error.response?.data?.message || error.message || 'API network error';
    return Promise.reject(new Error(message));
  }
);

export async function request(path, options = {}) {
  const method = (options.method || 'GET').toLowerCase();
  const url = path.startsWith('/api') ? path.replace('/api', '') : path;
  const config = {
    url,
    method,
    ...options,
  };
  if (options.body && typeof options.body === 'string') {
    try {
      config.data = JSON.parse(options.body);
    } catch {
      config.data = options.body;
    }
  }
  return api(config);
}

export function downloadCSV(rows, name = "journey40-fees.csv", headers) {
  const keys = headers || [...new Set(rows.flatMap(r => Object.keys(r)))];
  const cell = v => '"' + String(v ?? "").replace(/^[=+@\-\t\r]/, "'$&").replaceAll('"', '""') + '"';
  const blob = new Blob([[keys.map(cell).join(","), ...rows.map(r => keys.map(k => cell(r[k])).join(","))].join("\r\n")], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob), a = document.createElement("a");
  a.href = url; a.download = name; a.click(); URL.revokeObjectURL(url);
}

export default api;
