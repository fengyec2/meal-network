// Standard 34 China Provincial Administrative Regions
export const CHINA_PROVINCES = [
  '北京', '天津', '河北', '山西', '内蒙古', '辽宁', '吉林', '黑龙江',
  '上海', '江苏', '浙江', '安徽', '福建', '江西', '山东', '河南',
  '湖北', '湖南', '广东', '广西', '海南', '重庆', '四川', '贵州',
  '云南', '西藏', '陕西', '甘肃', '青海', '宁夏', '新疆',
  '台湾', '香港', '澳门'
] as const;

export type ChinaProvince = typeof CHINA_PROVINCES[number];

// Alias mapping for standardizing user province inputs
const PROVINCE_ALIASES: Record<string, ChinaProvince> = {
  '北京': '北京', '北京市': '北京', '京': '北京',
  '天津': '天津', '天津市': '天津', '津': '天津',
  '河北': '河北', '河北省': '河北', '冀': '河北',
  '山西': '山西', '山西省': '山西', '晋': '山西',
  '内蒙古': '内蒙古', '内蒙古自治区': '内蒙古', '蒙': '内蒙古',
  '辽宁': '辽宁', '辽宁省': '辽宁', '辽': '辽宁',
  '吉林': '吉林', '吉林省': '吉林', '吉': '吉林',
  '黑龙江': '黑龙江', '黑龙江省': '黑龙江', '黑': '黑龙江',
  '上海': '上海', '上海市': '上海', '沪': '上海',
  '江苏': '江苏', '江苏省': '江苏', '苏': '江苏',
  '浙江': '浙江', '浙江省': '浙江', '浙': '浙江',
  '安徽': '安徽', '安徽省': '安徽', '皖': '安徽',
  '福建': '福建', '福建省': '福建', '闽': '福建',
  '江西': '江西', '江西省': '江西', '赣': '江西',
  '山东': '山东', '山东省': '山东', '鲁': '山东',
  '河南': '河南', '河南省': '河南', '豫': '河南',
  '湖北': '湖北', '湖北省': '湖北', '鄂': '湖北',
  '湖南': '湖南', '湖南省': '湖南', '湘': '湖南',
  '广东': '广东', '广东省': '广东', '粤': '广东',
  '广西': '广西', '广西壮族自治区': '广西', '桂': '广西',
  '海南': '海南', '海南省': '海南', '琼': '海南',
  '重庆': '重庆', '重庆市': '重庆', '渝': '重庆',
  '四川': '四川', '四川省': '四川', '川': '四川', '蜀': '四川',
  '贵州': '贵州', '贵州省': '贵州', '黔': '贵州', '贵': '贵州',
  '云南': '云南', '云南省': '云南', '滇': '云南', '云': '云南',
  '西藏': '西藏', '西藏自治区': '西藏', '藏': '西藏',
  '陕西': '陕西', '陕西省': '陕西', '陕': '陕西', '秦': '陕西',
  '甘肃': '甘肃', '甘肃省': '甘肃', '甘': '甘肃', '陇': '甘肃',
  '青海': '青海', '青海省': '青海', '青': '青海',
  '宁夏': '宁夏', '宁夏回族自治区': '宁夏', '宁': '宁夏',
  '新疆': '新疆', '新疆维吾尔自治区': '新疆', '新': '新疆',
  '台湾': '台湾', '台湾省': '台湾', '台': '台湾',
  '香港': '香港', '香港特别行政区': '香港', '港': '香港',
  '澳门': '澳门', '澳门特别行政区': '澳门', '澳': '澳门',
};

// University to Province mapping dictionary (Popular universities)
const UNIVERSITY_PROVINCE_DICT: Record<string, ChinaProvince> = {
  '清华大学': '北京', '北京大学': '北京', '中国人民大学': '北京', '北京航空航天大学': '北京',
  '北京理工大学': '北京', '北京师范大学': '北京', '中国农业大学': '北京', '北京交通大学': '北京',
  '北京邮电大学': '北京', '对外经济贸易大学': '北京', '中央财经大学': '北京', '中国政法大学': '北京',
  '中央美术学院': '北京', '中央音乐学院': '北京', '北京科技大学': '北京', '北京化工大学': '北京',
  '浙江大学': '浙江', '宁波大学': '浙江', '浙江工业大学': '浙江', '杭州电子科技大学': '浙江',
  '浙江师范大学': '浙江', '温州医科大学': '浙江', '浙江理工大学': '浙江', '浙江工商大学': '浙江',
  '复旦大学': '上海', '上海交通大学': '上海', '同济大学': '上海', '华东师范大学': '上海',
  '上海财经大学': '上海', '上海外国语大学': '上海', '东华大学': '上海', '华东理工大学': '上海',
  '南京大学': '江苏', '东南大学': '江苏', '南京航空航天大学': '江苏', '南京理工大学': '江苏',
  '河海大学': '江苏', '南京农业大学': '江苏', '中国药科大学': '江苏', '苏州大学': '江苏',
  '江南大学': '江苏', '中国矿业大学': '江苏', '江苏大学': '江苏', '南京师范大学': '江苏',
  '中国科学技术大学': '安徽', '合肥工业大学': '安徽', '安徽大学': '安徽', '安徽师范大学': '安徽',
  '厦门大学': '福建', '福州大学': '福建', '福建师范大学': '福建', '福建农林大学': '福建',
  '南昌大学': '江西', '江西师范大学': '江西', '江西财经大学': '江西', '华东交通大学': '江西',
  '山东大学': '山东', '中国海洋大学': '山东', '中国石油大学（华东）': '山东', '哈尔滨工业大学（威海）': '山东',
  '青岛大学': '山东', '山东师范大学': '山东', '山东农业大学': '山东',
  '武汉大学': '湖北', '华中科技大学': '湖北', '武汉理工大学': '湖北', '华中师范大学': '湖北',
  '华中农业大学': '湖北', '中国地质大学（武汉）': '湖北', '中南财经政法大学': '湖北',
  '中南大学': '湖南', '湖南大学': '湖南', '国防科技大学': '湖南', '湖南师范大学': '湖南',
  '中山大学': '广东', '华南理工大学': '广东', '暨南大学': '广东', '华南师范大学': '广东',
  '深圳大学': '广东', '南方科技大学': '广东', '广东工业大学': '广东', '华南农业大学': '广东',
  '四川大学': '四川', '电子科技大学': '四川', '西南交通大学': '四川', '西南财经大学': '四川',
  '四川农业大学': '四川', '成都理工大学': '四川', '四川师范大学': '四川',
  '重庆大学': '重庆', '西南大学': '重庆', '重庆医科大学': '重庆', '重庆邮电大学': '重庆',
  '西安交通大学': '陕西', '西北工业大学': '陕西', '西安电子科技大学': '陕西', '西北农林科技大学': '陕西',
  '陕西师范大学': '陕西', '西北大学': '陕西', '长安大学': '陕西',
  '哈尔滨工业大学': '黑龙江', '哈尔滨工程大学': '黑龙江', '东北林业大学': '黑龙江', '东北农业大学': '黑龙江',
  '吉林大学': '吉林', '东北师范大学': '吉林', '延边大学': '吉林',
  '大连理工大学': '辽宁', '东北大学': '辽宁', '辽宁大学': '辽宁', '大连海事大学': '辽宁',
  '南开大学': '天津', '天津大学': '天津', '天津医科大学': '天津', '河北工业大学': '天津',
  '郑州大学': '河南', '河南大学': '河南', '河南师范大学': '河南',
  '太原理工大学': '山西', '山西大学': '山西', '中北大学': '山西',
  '河北大学': '河北', '燕山大学': '河北', '华北电力大学': '河北',
  '海南大学': '海南', '海南师范大学': '海南',
  '广西大学': '广西', '广西师范大学': '广西',
  '贵州大学': '贵州', '贵州师范大学': '贵州',
  '云南大学': '云南', '昆明理工大学': '云南', '云南师范大学': '云南',
  '兰州大学': '甘肃', '西北师范大学': '甘肃', '兰州理工大学': '甘肃',
  '青海大学': '青海', '青海师范大学': '青海',
  '宁夏大学': '宁夏',
  '新疆大学': '新疆', '石河子大学': '新疆',
  '西藏大学': '西藏',
  '内蒙古大学': '内蒙古', '内蒙古农业大学': '内蒙古',
  '香港大学': '香港', '香港中文大学': '香港', '香港科技大学': '香港', '香港理工大学': '香港', '香港城市大学': '香港',
  '澳门大学': '澳门', '澳门科技大学': '澳门',
  '台湾大学': '台湾', '清华大学（新竹）': '台湾', '成功大学': '台湾'
};

/**
 * Normalizes input string to a standard China province name
 */
export function normalizeProvince(input: string, schoolName?: string): string {
  if (!input && schoolName) {
    // Try inferring from school name
    const inferred = inferProvinceFromSchool(schoolName);
    if (inferred) return inferred;
  }

  if (!input) return '其他';

  const clean = input.trim();
  
  // Direct match in alias table
  if (PROVINCE_ALIASES[clean]) {
    return PROVINCE_ALIASES[clean];
  }

  // Substring search in alias table
  for (const [key, stdName] of Object.entries(PROVINCE_ALIASES)) {
    if (clean.includes(key) || key.includes(clean)) {
      return stdName;
    }
  }

  // Try inferring from school if province input is messy
  if (schoolName) {
    const inferred = inferProvinceFromSchool(schoolName);
    if (inferred) return inferred;
  }

  return clean;
}

/**
 * Infer province from university name keywords or exact dictionary match
 */
export function inferProvinceFromSchool(schoolName: string): ChinaProvince | null {
  if (!schoolName) return null;
  const s = schoolName.trim();

  // Check exact dictionary
  if (UNIVERSITY_PROVINCE_DICT[s]) {
    return UNIVERSITY_PROVINCE_DICT[s];
  }

  // Check keyword matches in school name
  for (const prov of CHINA_PROVINCES) {
    if (s.startsWith(prov) || s.includes(prov)) {
      return prov;
    }
  }

  // Fuzzy matches for city names embedded in school names
  if (s.includes('杭州') || s.includes('宁波') || s.includes('温州')) return '浙江';
  if (s.includes('南京') || s.includes('苏州') || s.includes('无锡') || s.includes('常州')) return '江苏';
  if (s.includes('广州') || s.includes('深圳') || s.includes('珠海') || s.includes('汕头')) return '广东';
  if (s.includes('成都') || s.includes('绵阳')) return '四川';
  if (s.includes('武汉') || s.includes('宜昌')) return '湖北';
  if (s.includes('长沙') || s.includes('湘潭')) return '湖南';
  if (s.includes('西安') || s.includes('咸阳')) return '陕西';
  if (s.includes('沈阳') || s.includes('大连')) return '辽宁';
  if (s.includes('长春') || s.includes('吉林')) return '吉林';
  if (s.includes('哈尔滨')) return '黑龙江';
  if (s.includes('济南') || s.includes('青岛') || s.includes('威海')) return '山东';
  if (s.includes('郑州') || s.includes('洛阳')) return '河南';
  if (s.includes('福州') || s.includes('厦门') || s.includes('泉州')) return '福建';
  if (s.includes('南昌')) return '江西';
  if (s.includes('合肥')) return '安徽';
  if (s.includes('昆明')) return '云南';
  if (s.includes('贵阳')) return '贵州';
  if (s.includes('南宁') || s.includes('桂林')) return '广西';
  if (s.includes('海口') || s.includes('三亚')) return '海南';
  if (s.includes('兰州')) return '甘肃';
  if (s.includes('太原')) return '山西';
  if (s.includes('石家庄') || s.includes('保定')) return '河北';
  if (s.includes('呼和浩特') || s.includes('包头')) return '内蒙古';
  if (s.includes('乌鲁木齐')) return '新疆';
  if (s.includes('银川')) return '宁夏';
  if (s.includes('西宁')) return '青海';
  if (s.includes('拉萨')) return '西藏';

  return null;
}
