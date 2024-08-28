# 一些常用的工具

## 内存大小单位转换

```js
/**
 * 格式化给定的大小值，将其从一个单位转换为另一个单位。
 *
 * @param {number} value - 初始大小值。
 * @param {string} fromUnit - 初始值的单位（如 'B', 'KB', 'MB'，不存在为'B'）。
 * @param {string} toUnit - 目标单位（可选）。如果不提供，将转换到最大可能的单位。
 * @returns {string} 格式化后的大小值及其单位。
 */
function formatSizeUnits(value, fromUnit, toUnit) {
  let initValue = Number(value);
  const units = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
  let unitIndex = units.indexOf(fromUnit) < 0 ? 0 : units.indexOf(fromUnit);

  while (unitIndex < units.length - 1 && initValue >= 1024) {
    initValue /= 1024;
    unitIndex++;
    if (toUnit && toUnit === units[unitIndex]) break;
  }

  return `${initValue.toFixed(2)}${units[unitIndex]}`;
}
```
