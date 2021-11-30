/**
 * Cache keys are comma separated, this function tests if one of the comma-separated units matches the toTest parameter
 */
export default function keyIncludes(toTest: string, target: string): boolean {
  const re = new RegExp(`^${toTest},|,${toTest},|,${toTest}$|^${toTest}$`)
  return re.test(target)
}
