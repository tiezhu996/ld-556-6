import { Gender } from '@/constants/enums'
import type { FamilyMember } from '@/types/family'

interface GedcomPerson {
  id: string
  name: string
  gender: Gender
  birthDate: string
  deathDate: string
}

export function parseGedcom(content: string): FamilyMember[] {
  const lines = content.split(/\r?\n/)
  const people = new Map<string, GedcomPerson>()
  let currentId = ''
  let currentEvent: 'BIRT' | 'DEAT' | '' = ''

  for (const line of lines) {
    const match = line.match(/^(\d+)\s+(?:@([^@]+)@\s+)?([A-Z0-9_]+)\s?(.*)$/)
    if (!match) continue
    const [, level, pointer, tag, value] = match
    if (level === '0' && pointer && tag === 'INDI') {
      currentId = pointer
      people.set(currentId, { id: currentId, name: '未命名成员', gender: Gender.OTHER, birthDate: '', deathDate: '' })
      currentEvent = ''
      continue
    }
    const person = people.get(currentId)
    if (!person) continue
    if (tag === 'NAME') person.name = value.replace(/\//g, '').trim() || person.name
    if (tag === 'SEX') person.gender = value === 'M' ? Gender.MALE : value === 'F' ? Gender.FEMALE : Gender.OTHER
    if (tag === 'BIRT' || tag === 'DEAT') currentEvent = tag
    if (tag === 'DATE' && currentEvent === 'BIRT') person.birthDate = normalizeGedcomDate(value)
    if (tag === 'DATE' && currentEvent === 'DEAT') person.deathDate = normalizeGedcomDate(value)
  }

  return [...people.values()].map((person, index) => ({
    id: person.id,
    name: person.name,
    gender: Gender.OTHER,
    birthDate: person.birthDate,
    deathDate: person.deathDate,
    birthPlace: '',
    bio: '由 GEDCOM 导入生成。',
    avatar: '',
    parentId: '',
    spouseIds: [],
    childrenIds: [],
    generation: 1
  }))
}

function normalizeGedcomDate(value: string): string {
  const year = value.match(/\d{4}/)?.[0] || ''
  if (!year) return ''
  return `${year}-01-01`
}
