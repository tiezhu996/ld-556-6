import { Gender, LegacyType, StoryCategory } from './enums'
import type { FamilyMember } from '@/types/family'
import type { LegacyPlan } from '@/types/legacy'
import type { Photo } from '@/types/photo'
import type { Story } from '@/types/story'

export const defaultMembers: FamilyMember[] = [
  {
    id: 'm-ancestor',
    name: '林启明',
    gender: Gender.MALE,
    birthDate: '1932-04-18',
    deathDate: '2016-10-02',
    birthPlace: '浙江宁波',
    bio: '家族第一代记录者，留下了大量书信和迁徙记录。',
    avatar: '',
    parentId: '',
    spouseIds: ['m-grandma'],
    childrenIds: ['m-father'],
    generation: 1
  },
  {
    id: 'm-grandma',
    name: '周婉清',
    gender: Gender.FEMALE,
    birthDate: '1936-09-09',
    deathDate: '',
    birthPlace: '江苏苏州',
    bio: '擅长刺绣和讲家族故事，是照片馆主要人物。',
    avatar: '',
    parentId: '',
    spouseIds: ['m-ancestor'],
    childrenIds: ['m-father'],
    generation: 1
  },
  {
    id: 'm-father',
    name: '林建国',
    gender: Gender.MALE,
    birthDate: '1964-02-12',
    deathDate: '',
    birthPlace: '上海',
    bio: '整理家谱资料并负责数字化迁移。',
    avatar: '',
    parentId: 'm-ancestor',
    spouseIds: ['m-mother'],
    childrenIds: ['m-child'],
    generation: 2
  },
  {
    id: 'm-mother',
    name: '陈若兰',
    gender: Gender.FEMALE,
    birthDate: '1967-08-21',
    deathDate: '',
    birthPlace: '杭州',
    bio: '家族相册守护者，保存多本老照片。',
    avatar: '',
    parentId: '',
    spouseIds: ['m-father'],
    childrenIds: ['m-child'],
    generation: 2
  },
  {
    id: 'm-child',
    name: '林言',
    gender: Gender.OTHER,
    birthDate: '1995-05-30',
    deathDate: '',
    birthPlace: '上海',
    bio: 'LegacyTree 的当前维护者。',
    avatar: '',
    parentId: 'm-father',
    spouseIds: [],
    childrenIds: [],
    generation: 3
  }
]

export const defaultStories: Story[] = [
  {
    id: 's-1',
    authorId: 'm-child',
    memberId: 'm-ancestor',
    title: '木箱里的迁徙日记',
    content: '整理老宅时发现一本蓝布日记，记录了 1954 年举家迁往上海的路线。',
    mediaUrls: [],
    category: StoryCategory.MEMORY,
    date: '1954-07-12',
    isPublic: true
  },
  {
    id: 's-2',
    authorId: 'm-father',
    memberId: 'm-grandma',
    title: '一幅绣了一年的牡丹',
    content: '外婆说每一针都要避开潮湿天气，那幅牡丹后来成了新家的第一件装饰。',
    mediaUrls: [],
    category: StoryCategory.TRADITION,
    date: '1978-04-05',
    isPublic: true
  }
]

export const defaultPhotos: Photo[] = [
  {
    id: 'p-1',
    uploaderId: 'm-mother',
    memberId: 'm-grandma',
    imageUrl: '',
    caption: '苏州老宅门前的全家合影',
    year: 1982,
    location: '苏州',
    people: ['m-grandma', 'm-father'],
    isRestored: false,
    restoredUrl: ''
  },
  {
    id: 'p-2',
    uploaderId: 'm-child',
    memberId: 'm-ancestor',
    imageUrl: '',
    caption: '林启明的工作证照片',
    year: 1961,
    location: '上海',
    people: ['m-ancestor'],
    isRestored: false,
    restoredUrl: ''
  }
]

export const defaultLegacyPlans: LegacyPlan[] = [
  {
    id: 'l-1',
    memberId: 'm-father',
    type: LegacyType.DIGITAL_ASSET,
    content: '整理云盘、邮箱、域名账号和照片备份位置，定期更新交接清单。',
    beneficiaries: ['m-child'],
    status: 'draft',
    createdAt: new Date().toISOString()
  }
]
