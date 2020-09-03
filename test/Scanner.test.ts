import { expect } from 'chai'
import Scanner from '../lib/Scanner/Scanner'

describe('Scanner', () => {
  describe('#scan()', () => {
    it('scans source code string and returns an array of tokens', () => {
      const code = 'if 1 then 0 else 1'
      const tokens = new Scanner(code).scan()

      expect(tokens).to.deep.eq([
        { type: 'IF', literal: 'if' },
        { type: 'NUMBER', literal: 1 },
        { type: 'THEN', literal: 'then' },
        { type: 'NUMBER', literal: 0 },
        { type: 'ELSE', literal: 'else' },
        { type: 'NUMBER', literal: 1 }
      ])
    })
  })
})
