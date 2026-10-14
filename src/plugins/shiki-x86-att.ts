import type { LanguageRegistration } from 'shiki'
import assembly from 'shiki/langs/asm.mjs'

// Reuse Shiki's x86 instruction and number rules, adding GNU/AT&T syntax.
// Astro maps `asm` fences to this dedicated scope through `langAlias`.
const x86Att: LanguageRegistration = {
  name: 'x86asm',
  displayName: 'x86 Assembly (AT&T)',
  scopeName: 'source.asm.x86.att',
  aliases: ['gas', 'att', 'attasm', 'asm-att', 'x86asm-att'],
  patterns: [
    { begin: '/\\*', end: '\\*/', name: 'comment.block.asm.att' },
    { match: '#.*$', name: 'comment.line.number-sign.asm.att' },
    {
      begin: '"',
      end: '"',
      name: 'string.quoted.double.asm.att',
      patterns: [{ match: '\\\\.', name: 'constant.character.escape.asm.att' }]
    },
    { match: "\\$?'(?:\\\\.|[^'\\\\\\s])'?", name: 'constant.character.asm.att' },
    {
      match: '(?<![\\w.$%])(?:[A-Za-z_.$][\\w.$]*|\\d+):',
      name: 'entity.name.function.label.asm.att'
    },
    {
      match: '(?:^|(?<=[;:]))[ \\t]*(\\.[A-Za-z_][\\w.]*)\\b',
      captures: { 1: { name: 'keyword.control.directive.asm.att' } }
    },
    {
      match:
        '(?i)%(?:' +
        [
          '[a-d][hl]|[er]?[a-d]x|[er]?(?:di|si|bp|sp|ip)|dil|sil|bpl|spl',
          'r(?:[89]|1[0-5])[bwd]?|[c-gs]s|[er]?flags|[er]iz',
          '[xyz]mm\\d+|mm[0-7]|k[0-7]|tmm[0-7]|(?:cr|dr)\\d+|mxcsr',
          'st(?:\\([0-7]\\))?'
        ].join('|') +
        ')(?![\\w])',
      name: 'constant.language.register.asm.att'
    },
    {
      match: '\\$[-+]?(?:0[xX][\\da-fA-F]+|0[bB][01]+|\\d+)\\b',
      name: 'constant.numeric.immediate.asm.att'
    },
    {
      match: '\\$[A-Za-z_.$][\\w.$]*(?:@[A-Za-z_][\\w]*)?',
      name: 'variable.other.constant.immediate.asm.att'
    },
    {
      match: '(?i)\\b(?:mov[sz](?:bw|bl|bq|wl|wq|lq)|cbtw|cwtl|cwtd|cltd|cltq|cqto)\\b',
      name: 'keyword.operator.word.mnemonic.asm.att'
    },
    {
      match:
        '(?i)\\b(?:' +
        [
          'mov(?:abs|be|[sz]x)?|lea|pushf?|popf?',
          'add|adc|sub|sbb|inc|dec|neg|cmp|test|and|or|xor|not|i?mul|i?div',
          'sal|sar|shl|shr|shld|shrd|rol|ror|rcl|rcr',
          'xchg|xadd|cmpxchg|bswap|bsf|bsr|bt[crs]?|popcnt|[lt]zcnt|crc32',
          'cmov(?:n?[abceglopsz]|n?[abgl]e|p[eo])',
          'l?call|l?jmp|ret|iret|leave|enter|nop'
        ].join('|') +
        ')(?:[bwlq])?\\b',
      name: 'keyword.operator.word.mnemonic.asm.att'
    },
    {
      match:
        '(?i)\\b(?:f(?:add|subr?|mul|divr?|ld|stp?|com(?:p)?)[slt]|' +
        'fi(?:add|subr?|mul|divr?|ld|stp?|com(?:p)?)[wlq])\\b',
      name: 'keyword.operator.word.mnemonic.fpu.asm.att'
    },
    { include: '#mnemonics' },
    { match: '\\b\\d+[fb]\\b|\\.L[\\w.$]+', name: 'entity.name.label.asm.att' },
    { include: '#constants' },
    { match: '[;(),]', name: 'punctuation.separator.asm.att' },
    { match: '[*+\\-]', name: 'keyword.operator.asm.att' }
  ],
  repository: assembly[0].repository
}

export default x86Att
