import { tryJson } from '~/helpers/object'
import { querystring } from '~/helpers/string'

type ApiOptions = {
  baseUrl?: string
}
type METHOD = 'POST' | 'GET' | 'PATCH' | 'DELETE'

type RequestParams = {
  params?: Record<string, any>
}

export type ProgressHandler = (progress: number, e?: ProgressEvent, err?: any) => void

export type UploadResponse<T = Record<string, any>> = T & {
  success: boolean
  message?: string
}

export function normalizeUrl(path?: string, queryParams: any = {}): string {
  const [base = '', query = ''] = `${path}`.split('?')
  const params: any = querystring(query)
  return [base.replace(/^(.*)\/$/, '$1'), querystring({ ...params, ...queryParams })].join('?')
}

export class ApiService {
  constructor(private readonly options: ApiOptions) {}

  async fetcher(method: METHOD, url: string, data?: object) {
    try {
      const response = await fetch(`${this.options.baseUrl}${url}`, {
        body: data ? JSON.stringify(data) : undefined,
        method,
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' }
      }).then(res => res.json())
      return response
    } catch (error) {
      return { success: false, message: 'app offline' }
    }
  }

  async getFileByDownload(url: string, params: Record<string, any> = {}) {
    try {
      const u = normalizeUrl(url, params)
      const response = await fetch(`${this.options.baseUrl}${u}`, {
        method: 'GET'
      }).then(res => (res.status === 200 ? res.blob() : null))
      return response
    } catch (error) {
      return null
    }
  }

  async get(url: string, { params }: RequestParams = {}) {
    return this.fetcher('GET', normalizeUrl(url, params))
  }

  async patch(url: string, data: any, { params }: RequestParams = {}) {
    return this.fetcher('PATCH', normalizeUrl(url, params), data)
  }

  async post(url: string, data: any, { params }: RequestParams = {}) {
    return this.fetcher('POST', normalizeUrl(url, params), data)
  }

  async delete(url: string, { params }: RequestParams = {}) {
    return this.fetcher('DELETE', normalizeUrl(url, params))
  }

  async upload(url: string, body?: FormData, _onProgress?: ProgressHandler): Promise<UploadResponse> {
    try {
      const response = await fetch(`${this.options.baseUrl}${url}`, {
        method: 'POST',
        body
      }).then(res => res.json())
      return response
    } catch (error) {
      return { success: false, message: 'app offline' }
    }
  }

  async uploadXMLHttp(url: string, body?: FormData, onProgress?: ProgressHandler): Promise<UploadResponse> {
    return new Promise<UploadResponse>(resolve => {
      const request = new XMLHttpRequest()
      request.open('POST', `${this.options.baseUrl}${url}`)
      request.upload.addEventListener('progress', e => {
        const percentCompleted = e ? (e.loaded / e.total) * 100 : 0
        if (onProgress) onProgress(percentCompleted, e)
      })
      request.addEventListener('load', () => {
        if (request?.status <= 300) {
          const res = tryJson(request?.response)
          resolve({ success: true, ...res })
        } else {
          resolve({ success: false, message: 'Erro no upload', status: request?.status })
        }
      })
      request.addEventListener('error', e => {
        resolve({ success: false, message: 'Erro no upload', error: e })
      })
      request.send(body)
    })
  }
}

export const apiService = new ApiService({ baseUrl: '/api' })
