import http from '@/apis/http.js'
const apikey = import.meta.env.VITE_API_KEY;

export function getDailyRainfalls() {
    return http.get(`/C-B0025-001/`, {
        param: {
          Authorization: apikey,
          limit: 20,
          offset: 0,
          format: 'JSON'
        }
    })
}