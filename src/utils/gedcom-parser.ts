import { Gender } from '@/constants/enums'
import type { FamilyMember } from '@/types/family'

interface GedcomPerson {
  id: string
  name: string
  gender: Gender
  birthDate: string
  deathDate: string
  parentFamilyId: string
  spouseFamilyIds: string[]
}

interface GedcomFamily {
  id: string
  husbandId: string
  wifeId: string
  childIds: string[]
}

export function parseGedcom(content: string): FamilyMember[] {
  const lines = content.split(/\r?\n/)
  const people = new Map<string, GedcomPerson>()
  const families = new Map<string, GedcomFamily>()
  let currentId = ''
  let currentFamilyId = ''
  let currentEvent: 'BIRT' | 'DEAT' | '' = ''
  let currentSection: 'INDI' | 'FAM' | '' = ''

  for (const line of lines) {
    const match = line.match(/^(\d+)\s+(?:@([^@]+)@\s+)?([A-Z0-9_]+)\s?(.*)$/)
    if (!match) continue
    const [, level, pointer, tag, value] = match

    if (level === '0' && pointer) {
      if (tag === 'INDI') {
        currentId = pointer
        currentSection = 'INDI'
        people.set(currentId, {
          id: currentId,
          name: '未命名成员',
          gender: Gender.OTHER,
          birthDate: '',
          deathDate: '',
          parentFamilyId: '',
          spouseFamilyIds: []
        })
        currentEvent = ''
        continue
      } else if (tag === 'FAM') {
        currentFamilyId = pointer
        currentSection = 'FAM'
        families.set(currentFamilyId, {
          id: currentFamilyId,
          husbandId: '',
          wifeId: '',
          childIds: []
        })
        continue
      }
    }

    if (currentSection === 'INDI') {
      const person = people.get(currentId)
      if (!person) continue
      if (tag === 'NAME') person.name = value.replace(/\//g, '').trim() || person.name
      if (tag === 'SEX') person.gender = value === 'M' ? Gender.MALE : value === 'F' ? Gender.FEMALE : Gender.OTHER
      if (tag === 'BIRT' || tag === 'DEAT') currentEvent = tag
      if (tag === 'DATE' && currentEvent === 'BIRT') person.birthDate = normalizeGedcomDate(value)
      if (tag === 'DATE' && currentEvent === 'DEAT') person.deathDate = normalizeGedcomDate(value)
      if (tag === 'FAMC') person.parentFamilyId = extractPointer(value)
      if (tag === 'FAMS') person.spouseFamilyIds.push(extractPointer(value))
    } else if (currentSection === 'FAM') {
      const family = families.get(currentFamilyId)
      if (!family) continue
      if (tag === 'HUSB') family.husbandId = extractPointer(value)
      if (tag === 'WIFE') family.wifeId = extractPointer(value)
      if (tag === 'CHIL') family.childIds.push(extractPointer(value))
    }
  }

  const memberMap = new Map<string, FamilyMember>()
  for (const person of people.values()) {
    const member: FamilyMember = {
      id: person.id,
      name: person.name,
      gender: person.gender,
      birthDate: person.birthDate,
      deathDate: person.deathDate,
      birthPlace: '',
      bio: '由 GEDCOM 导入生成。',
      avatar: '',
      parentId: '',
      spouseIds: [],
      childrenIds: [],
      generation: 1
    }
    memberMap.set(person.id, member)
  }

  for (const person of people.values()) {
    const member = memberMap.get(person.id)!
    if (person.parentFamilyId) {
      const parentFamily = families.get(person.parentFamilyId)
      if (parentFamily) {
        if (parentFamily.husbandId && memberMap.has(parentFamily.husbandId)) {
          const father = memberMap.get(parentFamily.husbandId)!
          if (!member.parentId) {
            member.parentId = parentFamily.husbandId
          }
          if (!father.childrenIds.includes(member.id)) {
            father.childrenIds.push(member.id)
          }
        }
        if (parentFamily.wifeId && memberMap.has(parentFamily.wifeId)) {
          const mother = memberMap.get(parentFamily.wifeId)!
          if (!member.parentId) {
            member.parentId = parentFamily.wifeId
          }
          if (!mother.childrenIds.includes(member.id)) {
            mother.childrenIds.push(member.id)
          }
        }
      }
    }
    for (const familyId of person.spouseFamilyIds) {
      const family = families.get(familyId)
      if (!family) continue
      const spouseId = family.husbandId === person.id ? family.wifeId : family.husbandId
      if (spouseId && memberMap.has(spouseId) && !member.spouseIds.includes(spouseId)) {
        member.spouseIds.push(spouseId)
      }
    }
  }

  for (const family of families.values()) {
    for (const childId of family.childIds) {
      if (!memberMap.has(childId)) continue
      const child = memberMap.get(childId)!
      if (family.husbandId && memberMap.has(family.husbandId)) {
        const father = memberMap.get(family.husbandId)!
        if (!child.parentId) {
          child.parentId = family.husbandId
        }
        if (!father.childrenIds.includes(childId)) {
          father.childrenIds.push(childId)
        }
      }
      if (family.wifeId && memberMap.has(family.wifeId)) {
        const mother = memberMap.get(family.wifeId)!
        if (!child.parentId) {
          child.parentId = family.wifeId
        }
        if (!mother.childrenIds.includes(childId)) {
          mother.childrenIds.push(childId)
        }
      }
    }
    if (family.husbandId && family.wifeId) {
      const husband = memberMap.get(family.husbandId)
      const wife = memberMap.get(family.wifeId)
      if (husband && wife) {
        if (!husband.spouseIds.includes(wife.id)) {
          husband.spouseIds.push(wife.id)
        }
        if (!wife.spouseIds.includes(husband.id)) {
          wife.spouseIds.push(husband.id)
        }
      }
    }
  }

  const roots = [...memberMap.values()].filter((m) => !m.parentId)
  const visited = new Set<string>()
  for (const root of roots) {
    assignGeneration(root, 1, memberMap, visited)
  }
  for (const member of memberMap.values()) {
    if (!visited.has(member.id)) {
      assignGeneration(member, 1, memberMap, visited)
    }
  }

  return [...memberMap.values()]
}

function extractPointer(value: string): string {
  const match = value.match(/@([^@]+)@/)
  return match ? match[1] : ''
}

function assignGeneration(member: FamilyMember, generation: number, memberMap: Map<string, FamilyMember>, visited: Set<string>) {
  if (visited.has(member.id)) return
  visited.add(member.id)
  member.generation = generation
  for (const childId of member.childrenIds) {
    const child = memberMap.get(childId)
    if (child) assignGeneration(child, generation + 1, memberMap, visited)
  }
}

function normalizeGedcomDate(value: string): string {
  const year = value.match(/\d{4}/)?.[0] || ''
  if (!year) return ''
  return `${year}-01-01`
}
