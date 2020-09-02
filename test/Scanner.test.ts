import { expect } from 'chai'
import Scanner from '../lib/Scanner/Scanner'

describe('Scanner', () => {
  describe('#scan()', () => {
    it('scans source code string and returns an array of tokens', () => {
      const code = 'if 1 then 0 else 1'
      const tokens = new Scanner(code).scan()

      expect(tokens).to.deep.eq([
        { type: 'IF' },
        { type: 'NUMBER', literal: 1 },
        { type: 'THEN' },
        { type: 'NUMBER', literal: 0 },
        { type: 'ELSE' },
        { type: 'NUMBER', literal: 1 }
      ])
    })
  })
})
