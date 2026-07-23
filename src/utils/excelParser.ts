import * as XLSX from 'xlsx';
import { Friend, ExcelImportResult } from '../types';
import { normalizeProvince, inferProvinceFromSchool } from '../data/universityProvinceMap';

// Generate random pastel avatar color for visual flair
const AVATAR_COLORS = [
  'bg-emerald-500 text-white',
  'bg-indigo-500 text-white',
  'bg-amber-500 text-white',
  'bg-rose-500 text-white',
  'bg-cyan-500 text-white',
  'bg-purple-500 text-white',
  'bg-teal-500 text-white',
  'bg-blue-500 text-white',
  'bg-orange-500 text-white'
];

function getRandomAvatarColor(): string {
  return AVATAR_COLORS[Math.floor(Math.random() * AVATAR_COLORS.length)];
}

/**
 * Parses an Excel array buffer
 */
export function parseExcelArrayBuffer(arrayBuffer: ArrayBuffer): ExcelImportResult {
  try {
    const data = new Uint8Array(arrayBuffer);
    const workbook = XLSX.read(data, { type: 'array' });

    // Get first sheet
    const sheetName = workbook.SheetNames[0];
    if (!sheetName) {
      return {
        success: false,
        importedCount: 0,
        skippedCount: 0,
        errors: ['工作簿中未找到有效的工作表 (Sheet)'],
        friends: []
      };
    }

    const sheet = workbook.Sheets[sheetName];
    const rawJson = XLSX.utils.sheet_to_json<Record<string, any>>(sheet, { header: 1 });

    if (rawJson.length < 2) {
      return {
        success: false,
        importedCount: 0,
        skippedCount: 0,
        errors: ['表格内容为空或缺失表头行'],
        friends: []
      };
    }

    // Identify header row index & column mapping
    const headers = (rawJson[0] as any[]).map(h => String(h || '').trim());

    let nameColIdx = -1;
    let schoolColIdx = -1;
    let provinceColIdx = -1;
    let remarkColIdx = -1;
    let contactColIdx = -1;

    headers.forEach((h, idx) => {
      const lower = h.toLowerCase();
      if (['姓名', '名字', '同学', '学生', 'name'].some(k => lower.includes(k))) nameColIdx = idx;
      if (['录取学校', '学校', '录取院校', '大学', '毕业去向', '院校', 'school', 'university'].some(k => lower.includes(k))) schoolColIdx = idx;
      if (['省份', '所在省份', '省', '地区', '省市', 'province'].some(k => lower.includes(k))) provinceColIdx = idx;
      if (['备注', '说明', '寄语', '蹭饭暗号', '蹭饭要求', 'remark', 'note'].some(k => lower.includes(k))) remarkColIdx = idx;
      if (['联系方式', '电话', '微信', '手机', 'phone', 'wechat', 'contact'].some(k => lower.includes(k))) contactColIdx = idx;
    });

    // Fallback column index defaults if headers didn't match keyword explicitly
    if (nameColIdx === -1) nameColIdx = 0;
    if (schoolColIdx === -1) schoolColIdx = 1;
    if (provinceColIdx === -1 && headers.length > 2) provinceColIdx = 2;
    if (remarkColIdx === -1 && headers.length > 3) remarkColIdx = 3;

    const importedFriends: Friend[] = [];
    const errors: string[] = [];
    let skipped = 0;

    for (let i = 1; i < rawJson.length; i++) {
      const row = rawJson[i] as any[];
      if (!row || row.length === 0) continue;

      const rawName = row[nameColIdx] ? String(row[nameColIdx]).trim() : '';
      const rawSchool = row[schoolColIdx] ? String(row[schoolColIdx]).trim() : '';
      const rawProvince = provinceColIdx !== -1 && row[provinceColIdx] ? String(row[provinceColIdx]).trim() : '';
      const rawRemark = remarkColIdx !== -1 && row[remarkColIdx] ? String(row[remarkColIdx]).trim() : '随时欢迎来蹭饭！';
      const rawContact = contactColIdx !== -1 && row[contactColIdx] ? String(row[contactColIdx]).trim() : '';

      if (!rawName) {
        skipped++;
        continue;
      }

      // Auto normalize province name
      const normalizedProvince = normalizeProvince(rawProvince, rawSchool);

      importedFriends.push({
        id: 'friend_' + Date.now() + '_' + i + '_' + Math.random().toString(36).substr(2, 6),
        name: rawName,
        school: rawSchool || '未填写大学',
        province: normalizedProvince,
        remark: rawRemark || '同学见面，管饱！',
        contact: rawContact,
        avatarColor: getRandomAvatarColor(),
        createdAt: Date.now()
      });
    }

    return {
      success: true,
      importedCount: importedFriends.length,
      skippedCount: skipped,
      errors,
      friends: importedFriends
    };
  } catch (err: any) {
    return {
      success: false,
      importedCount: 0,
      skippedCount: 0,
      errors: ['文件解析失败，请确保格式为标准的 .xlsx / .xls 表格文件', err?.message || ''],
      friends: []
    };
  }
}

/**
 * Parses an uploaded Excel (.xlsx, .xls, .csv) File
 */
export async function parseExcelFile(file: File): Promise<ExcelImportResult> {
  return new Promise((resolve) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      const buffer = e.target?.result as ArrayBuffer;
      if (!buffer) {
        resolve({
          success: false,
          importedCount: 0,
          skippedCount: 0,
          errors: ['无法读取文件内容'],
          friends: []
        });
        return;
      }
      resolve(parseExcelArrayBuffer(buffer));
    };

    reader.onerror = () => {
      resolve({
        success: false,
        importedCount: 0,
        skippedCount: 0,
        errors: ['文件读取错误'],
        friends: []
      });
    };

    reader.readAsArrayBuffer(file);
  });
}

/**
 * Downloads a standard pre-formatted XLSX template for the user
 */
export function downloadExcelTemplate() {
  const templateData = [
    {
      '姓名': '张伟',
      '录取学校': '浙江大学',
      '省份': '浙江',
      '备注': '浙大紫金港校区，宿舍包吃包住！来杭州找我！'
    },
    {
      '姓名': '李华',
      '录取学校': '清华大学',
      '省份': '北京',
      '备注': '清华园随时来，请吃听涛园香锅！'
    },
    {
      '姓名': '王敏',
      '录取学校': '复旦大学',
      '省份': '上海',
      '备注': '复旦邯郸校区，周末可以带吃五角场美食！'
    },
    {
      '姓名': '陈晨',
      '录取学校': '四川大学',
      '省份': '四川',
      '备注': '成都望江校区，安排地道九宫格火锅！'
    },
    {
      '姓名': '刘强',
      '录取学校': '武汉大学',
      '省份': '湖北',
      '备注': '樱花季包导览+请吃热干面！'
    }
  ];

  const worksheet = XLSX.utils.json_to_sheet(templateData);

  // Set column widths
  worksheet['!cols'] = [
    { wch: 12 }, // 姓名
    { wch: 22 }, // 录取学校
    { wch: 12 }, // 省份
    { wch: 45 }  // 备注
  ];

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, '全国蹭饭名单');

  XLSX.writeFile(workbook, '全国蹭饭地图_标准导入模板.xlsx');
}

/**
 * Exports current friends dataset to Excel
 */
export function exportFriendsToExcel(friends: Friend[], fileName = '我的全国蹭饭通讯录.xlsx') {
  const exportData = friends.map(f => ({
    '姓名': f.name,
    '录取学校': f.school,
    '省份': f.province,
    '备注': f.remark,
    '联系方式': f.contact || ''
  }));

  const worksheet = XLSX.utils.json_to_sheet(exportData);
  worksheet['!cols'] = [
    { wch: 12 },
    { wch: 24 },
    { wch: 12 },
    { wch: 40 },
    { wch: 18 }
  ];

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, '蹭饭好友名单');

  XLSX.writeFile(workbook, fileName);
}
