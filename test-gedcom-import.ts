import { readFileSync } from 'fs'
import { parseGedcom } from './src/utils/gedcom-parser'

const Gender = {
  MALE: 'MALE',
  FEMALE: 'FEMALE',
  OTHER: 'OTHER'
} as const

function validateMembers(members: ReturnType<typeof parseGedcom>, formatName: string) {
  console.log(`\n========== 验收 ${formatName} 格式 ==========`)
  console.log(`共解析出 ${members.length} 位成员\n`)

  const memberMap = new Map(members.map(m => [m.id, m]))

  let allPassed = true

  function check(condition: boolean, description: string) {
    if (condition) {
      console.log(`✅ ${description}`)
    } else {
      console.log(`❌ ${description}`)
      allPassed = false
    }
  }

  const zhangDawei = memberMap.get('I1')
  const liMeili = memberMap.get('I2')
  const zhangXiaoming = memberMap.get('I3')
  const wangXiaohong = memberMap.get('I4')
  const zhangXiaobao = memberMap.get('I5')

  console.log('\n--- 性别验证 ---')
  check(zhangDawei?.gender === Gender.MALE, `张大伟性别正确 (${zhangDawei?.gender})`)
  check(liMeili?.gender === Gender.FEMALE, `李美丽性别正确 (${liMeili?.gender})`)
  check(zhangXiaoming?.gender === Gender.MALE, `张小明性别正确 (${zhangXiaoming?.gender})`)
  check(wangXiaohong?.gender === Gender.FEMALE, `王小红性别正确 (${wangXiaohong?.gender})`)
  check(zhangXiaobao?.gender === Gender.MALE, `张小宝性别正确 (${zhangXiaobao?.gender})`)

  console.log('\n--- 配偶关系验证 ---')
  check(zhangDawei?.spouseIds.includes('I2'), `张大伟的配偶是李美丽 (${JSON.stringify(zhangDawei?.spouseIds)})`)
  check(liMeili?.spouseIds.includes('I1'), `李美丽的配偶是张大伟 (${JSON.stringify(liMeili?.spouseIds)})`)
  check(zhangXiaoming?.spouseIds.includes('I4'), `张小明的配偶是王小红 (${JSON.stringify(zhangXiaoming?.spouseIds)})`)
  check(wangXiaohong?.spouseIds.includes('I3'), `王小红的配偶是张小明 (${JSON.stringify(wangXiaohong?.spouseIds)})`)

  console.log('\n--- 父子关系验证 ---')
  check(zhangDawei?.childrenIds.includes('I3'), `张大伟的子女是张小明 (${JSON.stringify(zhangDawei?.childrenIds)})`)
  check(liMeili?.childrenIds.includes('I3'), `李美丽的子女是张小明 (${JSON.stringify(liMeili?.childrenIds)})`)
  check(zhangXiaoming?.childrenIds.includes('I5'), `张小明的子女是张小宝 (${JSON.stringify(zhangXiaoming?.childrenIds)})`)
  check(wangXiaohong?.childrenIds.includes('I5'), `王小红的子女是张小宝 (${JSON.stringify(wangXiaohong?.childrenIds)})`)

  console.log('\n--- 父节点验证 ---')
  check(zhangXiaoming?.parentId === 'I1' || zhangXiaoming?.parentId === 'I2', `张小明的父节点正确 (${zhangXiaoming?.parentId})`)
  check(zhangXiaobao?.parentId === 'I3' || zhangXiaobao?.parentId === 'I4', `张小宝的父节点正确 (${zhangXiaobao?.parentId})`)
  check(!zhangDawei?.parentId, `张大伟没有父节点 (${zhangDawei?.parentId || '空'})`)
  check(!liMeili?.parentId, `李美丽没有父节点 (${liMeili?.parentId || '空'})`)
  check(!wangXiaohong?.parentId, `王小红没有父节点 (${wangXiaohong?.parentId || '空'})`)

  console.log('\n--- 代数层级验证 ---')
  check(zhangDawei?.generation === 1, `张大伟是第 1 代 (实际: ${zhangDawei?.generation})`)
  check(liMeili?.generation === 1, `李美丽是第 1 代 (实际: ${liMeili?.generation})`)
  check(zhangXiaoming?.generation === 2, `张小明是第 2 代 (实际: ${zhangXiaoming?.generation})`)
  check(wangXiaohong?.generation === 1, `王小红是第 1 代 (实际: ${wangXiaohong?.generation})`)
  check(zhangXiaobao?.generation === 3, `张小宝是第 3 代 (实际: ${zhangXiaobao?.generation})`)

  console.log('\n--- 完整成员信息 ---')
  for (const m of members) {
    console.log(`  ${m.id}: ${m.name} | 性别:${m.gender} | 代:${m.generation} | 父:${m.parentId || '无'} | 配:${m.spouseIds.join(',') || '无'} | 子:${m.childrenIds.join(',') || '无'}`)
  }

  console.log(`\n${formatName} 格式验证结果: ${allPassed ? '✅ 全部通过' : '❌ 存在失败'}`)
  return allPassed
}

async function main() {
  console.log('\n' + '='.repeat(60))
  console.log('GEDCOM 导入功能验收测试')
  console.log('='.repeat(60))

  const famcContent = readFileSync('./test-famc.ged', 'utf-8')
  const famcMembers = parseGedcom(famcContent)
  const famcPassed = validateMembers(famcMembers, 'FAMC（孩子指向家庭）')

  const famChilContent = readFileSync('./test-fam-chil.ged', 'utf-8')
  const famChilMembers = parseGedcom(famChilContent)
  const famChilPassed = validateMembers(famChilMembers, 'FAM/CHIL（家庭指向孩子）')

  console.log('\n' + '='.repeat(60))
  console.log(`总体验收结果: ${famcPassed && famChilPassed ? '✅ 两种格式全部通过' : '❌ 存在失败'}`)
  console.log('='.repeat(60) + '\n')

  if (!famcPassed || !famChilPassed) {
    process.exit(1)
  }
}

main().catch(console.error)
