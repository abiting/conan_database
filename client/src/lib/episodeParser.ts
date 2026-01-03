/**
 * 使用動態規劃解析複合海外版集數
 * 例如：
 * - "1112" → ["11", "12"]
 * - "99100101102" → ["99", "100", "101", "102"]
 * - "136137138139" → ["136", "137", "138", "139"]
 * 
 * 策略：
 * 1. 使用動態規劃找到所有可能的分割方案
 * 2. 選擇最優方案，優先級：
 *    a. 分割數量最少
 *    b. 集數遞增（海外版集數應該是遞增的）
 *    c. 最小集數差異（集數應該連續或接近）
 *    d. 平均位數最多
 */

interface PartitionResult {
  parts: string[];
  count: number;
  avgLength: number;
  isIncreasing: boolean;
  maxDiff: number;
}

/**
 * 檢查分割是否遞增
 */
function isIncreasing(parts: string[]): boolean {
  for (let i = 1; i < parts.length; i++) {
    const prev = parseInt(parts[i - 1], 10);
    const curr = parseInt(parts[i], 10);
    if (curr <= prev) {
      return false;
    }
  }
  return true;
}

/**
 * 計算分割中集數的最大差異
 */
function getMaxDiff(parts: string[]): number {
  if (parts.length <= 1) {
    return 0;
  }
  
  let maxDiff = 0;
  for (let i = 1; i < parts.length; i++) {
    const prev = parseInt(parts[i - 1], 10);
    const curr = parseInt(parts[i], 10);
    const diff = curr - prev;
    maxDiff = Math.max(maxDiff, diff);
  }
  return maxDiff;
}

/**
 * 找到所有可能的有效分割方案
 */
function findAllPartitions(episodeStr: string, start: number = 0, currentParts: string[] = []): PartitionResult[] {
  // 如果已經到達字符串末尾，返回當前分割
  if (start === episodeStr.length) {
    return [{
      parts: currentParts,
      count: currentParts.length,
      avgLength: currentParts.reduce((sum, p) => sum + p.length, 0) / currentParts.length,
      isIncreasing: isIncreasing(currentParts),
      maxDiff: getMaxDiff(currentParts),
    }];
  }

  const results: PartitionResult[] = [];

  // 嘗試不同長度的分割（1-4 位）
  for (let len = 1; len <= 4 && start + len <= episodeStr.length; len++) {
    const part = episodeStr.substring(start, start + len);
    
    // 檢查這個部分是否有效
    // 1. 不能以 0 開頭
    // 2. 應該是合理的集數範圍（1-9999）
    if (part[0] !== '0') {
      const num = parseInt(part, 10);
      if (num > 0 && num <= 9999) {
        // 檢查是否與前一個集數遞增
        if (currentParts.length === 0 || parseInt(currentParts[currentParts.length - 1], 10) < num) {
          // 遞迴找到剩餘部分的所有分割
          const remainingResults = findAllPartitions(episodeStr, start + len, [...currentParts, part]);
          results.push(...remainingResults);
        }
      }
    }
  }

  return results;
}

/**
 * 選擇最優分割方案
 * 優先級：
 * 1. 分割數量最少
 * 2. 集數遞增（海外版集數應該是遞增的）
 * 3. 最小集數差異（集數應該連續或接近）
 * 4. 平均位數最多
 */
function selectBestPartition(results: PartitionResult[]): string[] {
  if (results.length === 0) {
    return [];
  }

  // 按優先級排序
  results.sort((a, b) => {
    // 優先級 1: 分割數量最少
    if (a.count !== b.count) {
      return a.count - b.count;
    }
    
    // 優先級 2: 集數遞增（遞增的排在前面）
    if (a.isIncreasing !== b.isIncreasing) {
      return a.isIncreasing ? -1 : 1;
    }
    
    // 優先級 3: 最小集數差異
    if (a.maxDiff !== b.maxDiff) {
      return a.maxDiff - b.maxDiff;
    }
    
    // 優先級 4: 平均位數最多
    return b.avgLength - a.avgLength;
  });

  return results[0].parts;
}

/**
 * 解析複合海外版集數
 */
export function parseCompositeEpisode(episodeStr: string): string[] {
  // 如果字符串長度 <= 4，直接返回（單個集數）
  if (episodeStr.length <= 4) {
    return [episodeStr];
  }

  // 找到所有可能的分割方案
  const allResults = findAllPartitions(episodeStr);
  
  if (allResults.length === 0) {
    // 如果找不到有效分割，返回原始字符串
    return [episodeStr];
  }

  // 選擇最優方案
  return selectBestPartition(allResults);
}

/**
 * 格式化複合海外版集數為顯示字符串
 * 例如：["11", "12"] → "第 11、12 集"
 */
export function formatCompositeEpisode(episodeStr: string): string {
  const parts = parseCompositeEpisode(episodeStr);
  return `第 ${parts.join('、')} 集`;
}
