import { TokenType } from './TokenType'

export type Token = {
  type: TokenType
  literal?: any
}
