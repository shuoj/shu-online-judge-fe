import { AxiosResponse } from 'axios'

interface ErrorResponse extends AxiosResponse {
  code: number
  message: string
  url: string
}

export { ErrorResponse }
