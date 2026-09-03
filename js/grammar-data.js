/* ============================================================
 * grammar-data.js — Default N5 Grammar list & LocalStorage Helper
 * ============================================================ */

const LS_GRAMMAR = 'jlearn_grammar_items';
const LS_GEMINI_KEY = 'jlearn_gemini_api_key';

const DEFAULT_GRAMMAR = [
  {
    id: 'g-n5-01',
    pattern: '～は～です',
    meaning: 'N1 là N2 (Khẳng định lịch sự)',
    connection: 'Danh từ 1 + は + Danh từ 2 + です',
    note: 'Trợ từ は đọc là "wa". Dùng để giới thiệu tên, nghề nghiệp, quốc tịch, trạng thái.',
    date: new Date().toISOString().split('T')[0],
    level: 'N5',
    examples: [
      { jp: 'わたしは学生です。', reading: 'わたしはがくせいです。', vn: 'Tôi là học sinh.' },
      { jp: 'ミラーさんはアメリカ人です。', reading: 'ミラーさんはアメリカじんです。', vn: 'Anh Miller là người Mỹ.' },
      { jp: '山田さんは先生です。', reading: 'やまださんはせんせいです。', vn: 'Anh Yamada là giáo viên.' }
    ]
  },
  {
    id: 'g-n5-02',
    pattern: '～じゃありません / ～ではありません',
    meaning: 'N1 không phải là N2 (Phủ định lịch sự)',
    connection: 'Danh từ 1 + は + Danh từ 2 + じゃありません',
    note: 'じゃありません thường dùng trong văn nói hàng ngày, ではありません mang tính trang trọng hơn.',
    date: new Date().toISOString().split('T')[0],
    level: 'N5',
    examples: [
      { jp: 'わたしは医者じゃありません。', reading: 'わたしはいしゃじゃありません。', vn: 'Tôi không phải là bác sĩ.' },
      { jp: 'サントスさんは学生じゃありません。', reading: 'サントスさんはがくせいじゃありません。', vn: 'Anh Santos không phải là học sinh.' }
    ]
  },
  {
    id: 'g-n5-03',
    pattern: '～も',
    meaning: 'Cũng... (Đồng nhất với vế trước)',
    connection: 'Danh từ + も',
    note: 'Thay thế cho trợ từ は khi nêu sự việc tương tự với sự việc đã nói trước đó.',
    date: new Date().toISOString().split('T')[0],
    level: 'N5',
    examples: [
      { jp: 'わたしもベトナム人です。', reading: 'わたしもベトナムじんです。', vn: 'Tôi cũng là người Việt Nam.' },
      { jp: 'ミラーさんも会社員です。', reading: 'ミラーさんもかいしゃいんです。', vn: 'Anh Miller cũng là nhân viên công ty.' }
    ]
  },
  {
    id: 'g-n5-04',
    pattern: '～の～',
    meaning: 'Của... / Thuộc về...',
    connection: 'Danh từ 1 + の + Danh từ 2',
    note: 'N1 bổ nghĩa cho N2, thể hiện sở hữu hoặc xuất xứ, thuộc tổ chức nào.',
    date: new Date().toISOString().split('T')[0],
    level: 'N5',
    examples: [
      { jp: 'これはわたしの本です。', reading: 'これはわたしのほんです。', vn: 'Đây là cuốn sách của tôi.' },
      { jp: 'IMCの社員です。', reading: 'アイエムシーのしゃいんです。', vn: 'Là nhân viên của công ty IMC.' }
    ]
  },
  {
    id: 'g-n5-05',
    pattern: '～を～（動詞）',
    meaning: 'Làm cái gì (Tác động lên đối tượng)',
    connection: 'Danh từ + を + Động từ tha động từ',
    note: 'Trợ từ を đọc là "o", chỉ đối tượng trực tiếp của hành động.',
    date: new Date().toISOString().split('T')[0],
    level: 'N5',
    examples: [
      { jp: 'ごはんを食べます。', reading: 'ごはんをたべます。', vn: 'Tôi ăn cơm.' },
      { jp: '水を飲みます。', reading: 'みずをのみます。', vn: 'Tôi uống nước.' },
      { jp: '本を読みます。', reading: 'ほんをよみます。', vn: 'Tôi đọc sách.' }
    ]
  },
  {
    id: 'g-n5-06',
    pattern: '～へ行きます / 来ます / 帰ります',
    meaning: 'Đi / Đến / Về đâu đó',
    connection: 'Địa điểm + へ + 行きます / 来ます / 帰ります',
    note: 'Trợ từ へ đọc là "e", chỉ phương hướng di chuyển.',
    date: new Date().toISOString().split('T')[0],
    level: 'N5',
    examples: [
      { jp: '学校へ行きます。', reading: 'がっこうへいきます。', vn: 'Tôi đi đến trường.' },
      { jp: '日本へ来ました。', reading: 'にほんへきました。', vn: 'Tôi đã đến Nhật Bản.' },
      { jp: 'うちへ帰ります。', reading: 'うちへかえります。', vn: 'Tôi về nhà.' }
    ]
  },
  {
    id: 'g-n5-07',
    pattern: '～で～（場所 / 手段）',
    meaning: 'Tại đâu / Bằng phương tiện, công cụ gì',
    connection: 'Địa điểm / Phương tiện + で + Hành động',
    note: 'で chỉ nơi diễn ra hành vi, hoặc phương tiện (xe bus, tàu), công cụ (đũa, tiếng Nhật).',
    date: new Date().toISOString().split('T')[0],
    level: 'N5',
    examples: [
      { jp: '図書館で勉強します。', reading: 'としょかんでべんきょうします。', vn: 'Tôi học bài ở thư viện.' },
      { jp: '電車で会社へ行きます。', reading: 'でんしゃでかいしゃへいきます。', vn: 'Tôi đi làm bằng tàu điện.' },
      { jp: '日本語で話します。', reading: 'にほんごではなします。', vn: 'Nói chuyện bằng tiếng Nhật.' }
    ]
  },
  {
    id: 'g-n5-08',
    pattern: '～てください',
    meaning: 'Xin hãy... / Hãy... (Nhờ vả, yêu cầu lịch sự)',
    connection: 'Động từ thể て + ください',
    note: 'Dùng khi nhờ ai đó làm gì một cách lịch sự.',
    date: new Date().toISOString().split('T')[0],
    level: 'N5',
    examples: [
      { jp: 'ちょっと待ってください。', reading: 'ちょっとまってください。', vn: 'Xin hãy đợi một chút.' },
      { jp: '名前を書いてください。', reading: 'なまえをかいてください。', vn: 'Xin hãy viết tên vào đây.' },
      { jp: '日本語で言ってください。', reading: 'にほんごでいってください。', vn: 'Xin hãy nói bằng tiếng Nhật.' }
    ]
  },
  {
    id: 'g-n5-09',
    pattern: '～てもいいです',
    meaning: 'Được phép làm... (Hỏi xin phép hoặc cho phép)',
    connection: 'Động từ thể て + もいいです',
    note: 'Khi hỏi thêm か ở cuối: ～てもいいですか (Tôi có thể... được không?)',
    date: new Date().toISOString().split('T')[0],
    level: 'N5',
    examples: [
      { jp: '写真を撮ってもいいですか。', reading: 'しゃしんをとってもいいですか。', vn: 'Tôi chụp ảnh ở đây có được không?' },
      { jp: 'ここに座ってもいいです。', reading: 'ここにすわってもいいです。', vn: 'Bạn có thể ngồi ở đây.' }
    ]
  },
  {
    id: 'g-n5-10',
    pattern: '～てはいけません',
    meaning: 'Không được làm... (Cấm đoán)',
    connection: 'Động từ thể て + はいけません',
    note: 'Dùng để cấm đoán, biểu thị điều luật, quy định hoặc người trên nói với người dưới.',
    date: new Date().toISOString().split('T')[0],
    level: 'N5',
    examples: [
      { jp: 'ここでタバコを吸ってはいけません。', reading: 'ここですってはいけません。', vn: 'Không được hút thuốc ở đây.' },
      { jp: 'お酒を飲んではいけません。', reading: 'おさけをのんではいけません。', vn: 'Không được uống rượu.' }
    ]
  }
];

class GrammarDB {
  static getAll() {
    const raw = localStorage.getItem(LS_GRAMMAR);
    if (!raw) {
      localStorage.setItem(LS_GRAMMAR, JSON.stringify(DEFAULT_GRAMMAR));
      return JSON.parse(JSON.stringify(DEFAULT_GRAMMAR));
    }
    const current = JSON.parse(raw);
    let updated = false;
    for (const def of DEFAULT_GRAMMAR) {
      if (!current.some(item => item.id === def.id)) {
        current.push(def);
        updated = true;
      }
    }
    if (updated) localStorage.setItem(LS_GRAMMAR, JSON.stringify(current));
    return current;
  }

  static getById(id) {
    return this.getAll().find(g => g.id === id) || null;
  }

  static save(grammar) {
    const list = this.getAll();
    const idx = list.findIndex(g => g.id === grammar.id);
    if (idx >= 0) {
      list[idx] = grammar;
    } else {
      list.unshift(grammar);
    }
    localStorage.setItem(LS_GRAMMAR, JSON.stringify(list));
  }

  static delete(id) {
    const list = this.getAll().filter(g => g.id !== id);
    localStorage.setItem(LS_GRAMMAR, JSON.stringify(list));
  }

  static getTodayItems() {
    const today = new Date().toISOString().split('T')[0];
    return this.getAll().filter(g => g.date === today);
  }

  static getGeminiKey() {
    return localStorage.getItem(LS_GEMINI_KEY) || '';
  }

  static saveGeminiKey(key) {
    localStorage.setItem(LS_GEMINI_KEY, key.trim());
  }
}
