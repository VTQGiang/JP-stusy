/* ============================================================
 * data.js  —  Vocabulary data + localStorage CRUD
 * ============================================================ */

const LS_SETS     = 'jlearn_sets';
const LS_PROGRESS = 'jlearn_progress';
const LS_STATS    = 'jlearn_stats';

/* -------------------------------------------------------
   DEFAULT STUDY SETS
   ------------------------------------------------------- */
const DEFAULT_SETS = [
  {
    id: 'n5-bai1',
    name: 'Tiếng Nhật N5 — Bài 1',
    description: 'Đại từ, nghề nghiệp, chào hỏi, số đếm, đồ vật thông dụng',
    level: 'N5',
    color: '#7C6FFF',
    createdAt: Date.now() - 86400000 * 7,
    cards: [
      { id:1,  front:'わたし',          back:'tôi',                      hiragana:'わたし',          romaji:'watashi',          example:'わたしはがくせいです。',               exampleMeaning:'Tôi là học sinh.',               category:'Đại từ' },
      { id:2,  front:'わたしたち',       back:'chúng tôi',                 hiragana:'わたしたち',       romaji:'watashitachi',      example:'わたしたちはともだちです。',           exampleMeaning:'Chúng tôi là bạn bè.',           category:'Đại từ' },
      { id:3,  front:'あなた',           back:'bạn (ngôi thứ hai)',         hiragana:'あなた',           romaji:'anata',            example:'あなたはだれですか。',                 exampleMeaning:'Bạn là ai?',                     category:'Đại từ' },
      { id:4,  front:'あのひと',         back:'người đó',                   hiragana:'あのひと',         romaji:'ano hito',         example:'あのひとはせんせいです。',             exampleMeaning:'Người đó là giáo viên.',         category:'Đại từ' },
      { id:5,  front:'みなさん',         back:'mọi người',                  hiragana:'みなさん',         romaji:'minasan',          example:'みなさん、おはようございます。',       exampleMeaning:'Mọi người, chào buổi sáng.',     category:'Đại từ' },
      { id:6,  front:'せんせい',         back:'giáo viên',                  hiragana:'せんせい',         romaji:'sensei',           example:'やまださんはせんせいです。',           exampleMeaning:'Anh Yamada là giáo viên.',       category:'Nghề nghiệp' },
      { id:7,  front:'がくせい',         back:'học sinh / sinh viên',       hiragana:'がくせい',         romaji:'gakusei',          example:'わたしはがくせいです。',               exampleMeaning:'Tôi là học sinh.',               category:'Nghề nghiệp' },
      { id:8,  front:'かいしゃいん',     back:'nhân viên công ty',          hiragana:'かいしゃいん',     romaji:'kaishain',         example:'ちちはかいしゃいんです。',             exampleMeaning:'Bố tôi là nhân viên công ty.',   category:'Nghề nghiệp' },
      { id:9,  front:'ぎんこういん',     back:'nhân viên ngân hàng',        hiragana:'ぎんこういん',     romaji:'ginkouin',         example:'',                                     exampleMeaning:'',                               category:'Nghề nghiệp' },
      { id:10, front:'いしゃ',           back:'bác sĩ',                     hiragana:'いしゃ',           romaji:'isha',             example:'はははいしゃです。',                   exampleMeaning:'Mẹ tôi là bác sĩ.',             category:'Nghề nghiệp' },
      { id:11, front:'けんきゅうしゃ',   back:'nhà nghiên cứu',             hiragana:'けんきゅうしゃ',   romaji:'kenkyuusha',       example:'',                                     exampleMeaning:'',                               category:'Nghề nghiệp' },
      { id:12, front:'エンジニア',       back:'kỹ sư',                      hiragana:'エンジニア',       romaji:'enjinia',          example:'かれはエンジニアです。',               exampleMeaning:'Anh ấy là kỹ sư.',               category:'Nghề nghiệp' },
      { id:13, front:'にほん',           back:'Nhật Bản',                   hiragana:'にほん',           romaji:'nihon',            example:'にほんにすんでいます。',               exampleMeaning:'Tôi sống ở Nhật Bản.',           category:'Quốc gia' },
      { id:14, front:'にほんご',         back:'tiếng Nhật',                 hiragana:'にほんご',         romaji:'nihongo',          example:'にほんごをべんきょうしています。',     exampleMeaning:'Tôi đang học tiếng Nhật.',       category:'Ngôn ngữ' },
      { id:15, front:'えいご',           back:'tiếng Anh',                  hiragana:'えいご',           romaji:'eigo',             example:'えいごがわかりますか。',               exampleMeaning:'Bạn hiểu tiếng Anh không?',      category:'Ngôn ngữ' },
      { id:16, front:'はい',             back:'vâng / có',                  hiragana:'はい',             romaji:'hai',              example:'はい、そうです。',                     exampleMeaning:'Vâng, đúng vậy.',               category:'Hội thoại' },
      { id:17, front:'いいえ',           back:'không',                      hiragana:'いいえ',           romaji:'iie',              example:'いいえ、そうじゃないです。',           exampleMeaning:'Không, không phải vậy.',         category:'Hội thoại' },
      { id:18, front:'だれ',             back:'ai',                         hiragana:'だれ',             romaji:'dare',             example:'あのひとはだれですか。',               exampleMeaning:'Người đó là ai?',                category:'Câu hỏi' },
      { id:19, front:'なに',             back:'cái gì',                     hiragana:'なに',             romaji:'nani',             example:'それはなにですか。',                   exampleMeaning:'Cái đó là gì?',                  category:'Câu hỏi' },
      { id:20, front:'なんさい',         back:'bao nhiêu tuổi',             hiragana:'なんさい',         romaji:'nansai',           example:'なんさいですか。',                     exampleMeaning:'Bạn bao nhiêu tuổi?',            category:'Câu hỏi' },
      { id:21, front:'どこ',             back:'ở đâu',                      hiragana:'どこ',             romaji:'doko',             example:'どこからきましたか。',                 exampleMeaning:'Bạn đến từ đâu?',               category:'Câu hỏi' },
      { id:22, front:'おなまえ',         back:'tên của bạn',                hiragana:'おなまえ',         romaji:'onamae',           example:'おなまえはなんですか。',               exampleMeaning:'Tên của bạn là gì?',             category:'Hội thoại' },
      { id:23, front:'よろしく',         back:'rất vui được gặp bạn',       hiragana:'よろしく',         romaji:'yoroshiku',        example:'よろしくおねがいします。',             exampleMeaning:'Rất vui được gặp bạn.',          category:'Hội thoại' },
      { id:24, front:'こちらこそ',       back:'ngược lại, tôi cũng vậy',    hiragana:'こちらこそ',       romaji:'kochira koso',     example:'こちらこそ、よろしく。',               exampleMeaning:'Ngược lại, rất vui được gặp.',  category:'Hội thoại' },
      { id:25, front:'しつれいですが',   back:'xin lỗi cho hỏi',            hiragana:'しつれいですが',   romaji:'shitsurei desu ga',example:'しつれいですが、おなまえは？',         exampleMeaning:'Xin lỗi, tên bạn là gì?',       category:'Hội thoại' },
      { id:26, front:'おはようございます',back:'chào buổi sáng (lịch sự)', hiragana:'おはようございます',romaji:'ohayou gozaimasu', example:'おはようございます！',                 exampleMeaning:'Chào buổi sáng!',               category:'Chào hỏi' },
      { id:27, front:'こんにちは',       back:'xin chào (ban ngày)',        hiragana:'こんにちは',       romaji:'konnichiwa',       example:'こんにちは、げんきですか。',           exampleMeaning:'Xin chào, bạn có khỏe không?',  category:'Chào hỏi' },
      { id:28, front:'こんばんは',       back:'chào buổi tối',              hiragana:'こんばんは',       romaji:'konbanwa',         example:'',                                     exampleMeaning:'',                               category:'Chào hỏi' },
      { id:29, front:'さようなら',       back:'tạm biệt',                   hiragana:'さようなら',       romaji:'sayounara',        example:'',                                     exampleMeaning:'',                               category:'Chào hỏi' },
      { id:30, front:'ありがとうございます',back:'cảm ơn (lịch sự)',       hiragana:'ありがとうございます',romaji:'arigatou gozaimasu',example:'ありがとうございます！',              exampleMeaning:'Cảm ơn rất nhiều!',             category:'Chào hỏi' },
      { id:31, front:'すみません',       back:'xin lỗi / excuse me',        hiragana:'すみません',       romaji:'sumimasen',        example:'すみません、ちょっとよろしいですか。', exampleMeaning:'Xin lỗi, bạn có rảnh không?',   category:'Hội thoại' },
      { id:32, front:'はじめまして',     back:'xin chào (lần đầu gặp)',     hiragana:'はじめまして',     romaji:'hajimemashite',    example:'はじめまして、わたしはミンです。',   exampleMeaning:'Xin chào, tôi là Minh.',         category:'Hội thoại' },
      { id:33, front:'げんき',           back:'khỏe mạnh / vui vẻ',         hiragana:'げんき',           romaji:'genki',            example:'おげんきですか。',                     exampleMeaning:'Bạn có khỏe không?',             category:'Tính từ' },
      { id:34, front:'いち',             back:'một (1)',                     hiragana:'いち',             romaji:'ichi',             example:'いちじ (1 giờ)',                        exampleMeaning:'',                               category:'Số đếm' },
      { id:35, front:'に',               back:'hai (2)',                     hiragana:'に',               romaji:'ni',               example:'にほん (Nhật Bản)',                     exampleMeaning:'',                               category:'Số đếm' },
      { id:36, front:'さん',             back:'ba (3)',                      hiragana:'さん',             romaji:'san',              example:'さんがつ (tháng ba)',                   exampleMeaning:'',                               category:'Số đếm' },
      { id:37, front:'し / よん',        back:'bốn (4)',                     hiragana:'し/よん',          romaji:'shi / yon',        example:'よんじゅう (40)',                       exampleMeaning:'',                               category:'Số đếm' },
      { id:38, front:'ご',               back:'năm (5)',                     hiragana:'ご',               romaji:'go',               example:'ごがつ (tháng năm)',                    exampleMeaning:'',                               category:'Số đếm' },
      { id:39, front:'ろく',             back:'sáu (6)',                     hiragana:'ろく',             romaji:'roku',             example:'ろくがつ (tháng sáu)',                  exampleMeaning:'',                               category:'Số đếm' },
      { id:40, front:'なな / しち',      back:'bảy (7)',                     hiragana:'なな/しち',        romaji:'nana / shichi',    example:'しちがつ (tháng bảy)',                  exampleMeaning:'',                               category:'Số đếm' },
      { id:41, front:'はち',             back:'tám (8)',                     hiragana:'はち',             romaji:'hachi',            example:'はちがつ (tháng tám)',                  exampleMeaning:'',                               category:'Số đếm' },
      { id:42, front:'きゅう / く',      back:'chín (9)',                    hiragana:'きゅう/く',        romaji:'kyuu / ku',        example:'くがつ (tháng chín)',                   exampleMeaning:'',                               category:'Số đếm' },
      { id:43, front:'じゅう',           back:'mười (10)',                   hiragana:'じゅう',           romaji:'juu',              example:'じゅうがつ (tháng mười)',               exampleMeaning:'',                               category:'Số đếm' },
      { id:44, front:'これ',             back:'cái này',                    hiragana:'これ',             romaji:'kore',             example:'これはなんですか。',                   exampleMeaning:'Cái này là gì?',                 category:'Chỉ thị từ' },
      { id:45, front:'それ',             back:'cái đó',                     hiragana:'それ',             romaji:'sore',             example:'それをください。',                     exampleMeaning:'Cho tôi cái đó.',               category:'Chỉ thị từ' },
      { id:46, front:'あれ',             back:'cái kia',                    hiragana:'あれ',             romaji:'are',              example:'あれはなんですか。',                   exampleMeaning:'Cái kia là gì?',                 category:'Chỉ thị từ' },
      { id:47, front:'この',             back:'cái này... (trước DT)',       hiragana:'この',             romaji:'kono',             example:'このほんはわたしのです。',             exampleMeaning:'Cuốn sách này là của tôi.',      category:'Chỉ thị từ' },
      { id:48, front:'その',             back:'cái đó... (trước DT)',        hiragana:'その',             romaji:'sono',             example:'そのかばんはだれのですか。',           exampleMeaning:'Cái túi đó là của ai?',          category:'Chỉ thị từ' },
      { id:49, front:'あの',             back:'cái kia... (trước DT)',       hiragana:'あの',             romaji:'ano',              example:'あのひとはだれですか。',               exampleMeaning:'Người kia là ai?',               category:'Chỉ thị từ' },
      { id:50, front:'ほん',             back:'sách',                       hiragana:'ほん',             romaji:'hon',              example:'このほんはおもしろいです。',           exampleMeaning:'Cuốn sách này thú vị.',          category:'Đồ vật' },
      { id:51, front:'えんぴつ',         back:'bút chì',                    hiragana:'えんぴつ',         romaji:'enpitsu',          example:'えんぴつをかしてください。',           exampleMeaning:'Cho mượn bút chì.',              category:'Đồ vật' },
      { id:52, front:'かさ',             back:'ô / dù',                     hiragana:'かさ',             romaji:'kasa',             example:'かさはどこですか。',                   exampleMeaning:'Cái ô ở đâu?',                  category:'Đồ vật' },
      { id:53, front:'てちょう',         back:'sổ tay',                     hiragana:'てちょう',         romaji:'techou',           example:'',                                     exampleMeaning:'',                               category:'Đồ vật' },
      { id:54, front:'さいふ',           back:'ví tiền',                    hiragana:'さいふ',           romaji:'saifu',            example:'さいふがありません。',                 exampleMeaning:'Tôi không có ví.',               category:'Đồ vật' },
      { id:55, front:'でんわ',           back:'điện thoại',                 hiragana:'でんわ',           romaji:'denwa',            example:'でんわをかけます。',                   exampleMeaning:'Gọi điện thoại.',               category:'Đồ vật' },
      { id:56, front:'とけい',           back:'đồng hồ',                    hiragana:'とけい',           romaji:'tokei',            example:'とけいはいくらですか。',               exampleMeaning:'Đồng hồ này bao nhiêu tiền?',   category:'Đồ vật' },
      { id:57, front:'かばん',           back:'túi / cặp',                  hiragana:'かばん',           romaji:'kaban',            example:'かばんのなかにほんがあります。',       exampleMeaning:'Trong túi có sách.',             category:'Đồ vật' },
      { id:58, front:'くつ',             back:'giày',                       hiragana:'くつ',             romaji:'kutsu',            example:'あたらしいくつをかいました。',         exampleMeaning:'Tôi đã mua giày mới.',           category:'Đồ vật' },
      { id:59, front:'めがね',           back:'kính mắt',                   hiragana:'めがね',           romaji:'megane',           example:'めがねをかけています。',               exampleMeaning:'Tôi đang đeo kính.',             category:'Đồ vật' },
      { id:60, front:'じしょ',           back:'từ điển',                    hiragana:'じしょ',           romaji:'jisho',            example:'じしょをひきます。',                   exampleMeaning:'Tra từ điển.',                   category:'Đồ vật' },
      { id:61, front:'だいがく',         back:'trường đại học',             hiragana:'だいがく',         romaji:'daigaku',          example:'だいがくでにほんごをならいます。',     exampleMeaning:'Học tiếng Nhật ở đại học.',      category:'Địa điểm' },
      { id:62, front:'びょういん',       back:'bệnh viện',                  hiragana:'びょういん',       romaji:'byouin',           example:'びょういんにいきます。',               exampleMeaning:'Đi đến bệnh viện.',              category:'Địa điểm' },
      { id:63, front:'ゆうびんきょく',   back:'bưu điện',                   hiragana:'ゆうびんきょく',   romaji:'yuubinkyoku',      example:'',                                     exampleMeaning:'',                               category:'Địa điểm' },
      { id:64, front:'ぎんこう',         back:'ngân hàng',                  hiragana:'ぎんこう',         romaji:'ginkou',           example:'ぎんこうはどこですか。',               exampleMeaning:'Ngân hàng ở đâu?',               category:'Địa điểm' },
    ]
  },
  {
    id: 'n5-doutu',
    name: 'Tiếng Nhật N5 — Động từ',
    description: 'Các động từ cơ bản thường gặp nhất trong N5',
    level: 'N5',
    color: '#FF6B9D',
    createdAt: Date.now() - 86400000 * 3,
    cards: [
      { id:1,  front:'たべます',         back:'ăn',                         hiragana:'たべます',         romaji:'tabemasu',         example:'まいにちごはんをたべます。',           exampleMeaning:'Mỗi ngày tôi ăn cơm.',          category:'Động từ' },
      { id:2,  front:'のみます',         back:'uống',                        hiragana:'のみます',         romaji:'nomimasu',         example:'みずをのみます。',                     exampleMeaning:'Uống nước.',                     category:'Động từ' },
      { id:3,  front:'みます',           back:'xem / nhìn',                  hiragana:'みます',           romaji:'mimasu',           example:'テレビをみます。',                     exampleMeaning:'Xem TV.',                        category:'Động từ' },
      { id:4,  front:'ききます',         back:'nghe',                        hiragana:'ききます',         romaji:'kikimasu',         example:'おんがくをききます。',                 exampleMeaning:'Nghe nhạc.',                     category:'Động từ' },
      { id:5,  front:'よみます',         back:'đọc',                         hiragana:'よみます',         romaji:'yomimasu',         example:'ほんをよみます。',                     exampleMeaning:'Đọc sách.',                      category:'Động từ' },
      { id:6,  front:'かきます',         back:'viết',                        hiragana:'かきます',         romaji:'kakimasu',         example:'てがみをかきます。',                   exampleMeaning:'Viết thư.',                      category:'Động từ' },
      { id:7,  front:'はなします',       back:'nói / trò chuyện',            hiragana:'はなします',       romaji:'hanashimasu',       example:'にほんごではなします。',               exampleMeaning:'Nói bằng tiếng Nhật.',           category:'Động từ' },
      { id:8,  front:'いきます',         back:'đi (đến nơi nào đó)',         hiragana:'いきます',         romaji:'ikimasu',          example:'がっこうへいきます。',                 exampleMeaning:'Đi đến trường.',                 category:'Động từ' },
      { id:9,  front:'きます',           back:'đến / tới',                   hiragana:'きます',           romaji:'kimasu',           example:'うちにきます。',                       exampleMeaning:'Đến nhà.',                       category:'Động từ' },
      { id:10, front:'かえります',       back:'về nhà / trở về',             hiragana:'かえります',       romaji:'kaerimasu',        example:'うちにかえります。',                   exampleMeaning:'Về nhà.',                        category:'Động từ' },
      { id:11, front:'ねます',           back:'ngủ',                         hiragana:'ねます',           romaji:'nemasu',           example:'じゅういちじにねます。',               exampleMeaning:'Ngủ lúc 11 giờ.',               category:'Động từ' },
      { id:12, front:'おきます',         back:'thức dậy',                    hiragana:'おきます',         romaji:'okimasu',          example:'ろくじにおきます。',                   exampleMeaning:'Thức dậy lúc 6 giờ.',           category:'Động từ' },
      { id:13, front:'します',           back:'làm / thực hiện',             hiragana:'します',           romaji:'shimasu',          example:'べんきょうをします。',                 exampleMeaning:'Học bài.',                       category:'Động từ' },
      { id:14, front:'べんきょうします', back:'học (bài tập)',                hiragana:'べんきょうします', romaji:'benkyou shimasu',   example:'まいにちにほんごをべんきょうします。', exampleMeaning:'Mỗi ngày học tiếng Nhật.',       category:'Động từ' },
      { id:15, front:'かいます',         back:'mua',                         hiragana:'かいます',         romaji:'kaimasu',          example:'スーパーでやさいをかいます。',         exampleMeaning:'Mua rau ở siêu thị.',           category:'Động từ' },
      { id:16, front:'あります',         back:'có (đồ vật / không di chuyển)',hiragana:'あります',         romaji:'arimasu',          example:'つくえのうえにほんがあります。',       exampleMeaning:'Trên bàn có sách.',              category:'Động từ' },
      { id:17, front:'います',           back:'có (người / động vật)',        hiragana:'います',           romaji:'imasu',            example:'いぬがいます。',                       exampleMeaning:'Có con chó.',                    category:'Động từ' },
      { id:18, front:'わかります',       back:'hiểu',                        hiragana:'わかります',       romaji:'wakarimasu',        example:'にほんごがわかります。',               exampleMeaning:'Hiểu tiếng Nhật.',               category:'Động từ' },
      { id:19, front:'おしえます',       back:'dạy / chỉ bảo',               hiragana:'おしえます',       romaji:'oshiemasu',        example:'にほんごをおしえます。',               exampleMeaning:'Dạy tiếng Nhật.',               category:'Động từ' },
      { id:20, front:'つかいます',       back:'sử dụng',                     hiragana:'つかいます',       romaji:'tsukaimasu',       example:'パソコンをつかいます。',               exampleMeaning:'Sử dụng máy tính.',              category:'Động từ' },
    ]
  },
  {
    id: 'n5-keiyoshi',
    name: 'Tiếng Nhật N5 — Tính từ',
    description: 'Tính từ i và na thông dụng trong N5',
    level: 'N5',
    color: '#2ECC9A',
    createdAt: Date.now() - 86400000,
    cards: [
      { id:1,  front:'おおきい',   back:'to lớn',        hiragana:'おおきい',   romaji:'ookii',     example:'このかばんはおおきいです。',   exampleMeaning:'Cái túi này to.',       category:'Tính từ -i' },
      { id:2,  front:'ちいさい',   back:'nhỏ bé',        hiragana:'ちいさい',   romaji:'chiisai',   example:'ちいさいねこがいます。',       exampleMeaning:'Có con mèo nhỏ.',       category:'Tính từ -i' },
      { id:3,  front:'あたらしい', back:'mới',           hiragana:'あたらしい', romaji:'atarashii', example:'あたらしいほんをかいました。', exampleMeaning:'Tôi đã mua sách mới.',  category:'Tính từ -i' },
      { id:4,  front:'ふるい',     back:'cũ',            hiragana:'ふるい',     romaji:'furui',     example:'このくつはふるいです。',       exampleMeaning:'Đôi giày này cũ.',      category:'Tính từ -i' },
      { id:5,  front:'たかい',     back:'cao / đắt',     hiragana:'たかい',     romaji:'takai',     example:'このかばんはたかいです。',     exampleMeaning:'Cái túi này đắt.',      category:'Tính từ -i' },
      { id:6,  front:'やすい',     back:'rẻ / thấp',     hiragana:'やすい',     romaji:'yasui',     example:'このほんはやすいです。',       exampleMeaning:'Cuốn sách này rẻ.',     category:'Tính từ -i' },
      { id:7,  front:'おいしい',   back:'ngon',          hiragana:'おいしい',   romaji:'oishii',    example:'このりょうりはおいしいです。', exampleMeaning:'Món ăn này ngon.',      category:'Tính từ -i' },
      { id:8,  front:'まずい',     back:'không ngon',    hiragana:'まずい',     romaji:'mazui',     example:'',                            exampleMeaning:'',                      category:'Tính từ -i' },
      { id:9,  front:'かわいい',   back:'dễ thương',     hiragana:'かわいい',   romaji:'kawaii',    example:'かわいいねこですね。',         exampleMeaning:'Con mèo dễ thương nhỉ.',category:'Tính từ -i' },
      { id:10, front:'むずかしい', back:'khó',           hiragana:'むずかしい', romaji:'muzukashii',example:'にほんごはむずかしいです。',   exampleMeaning:'Tiếng Nhật khó.',       category:'Tính từ -i' },
      { id:11, front:'やさしい',   back:'dễ / tốt bụng', hiragana:'やさしい',   romaji:'yasashii',  example:'やさしいせんせいです。',       exampleMeaning:'Là giáo viên tốt bụng.',category:'Tính từ -i' },
      { id:12, front:'たのしい',   back:'vui vẻ',        hiragana:'たのしい',   romaji:'tanoshii',  example:'たのしいじゅぎょうです。',     exampleMeaning:'Là buổi học vui.',      category:'Tính từ -i' },
      { id:13, front:'きれい（な）',back:'đẹp / sạch sẽ',hiragana:'きれい',     romaji:'kirei',     example:'きれいなはなですね。',         exampleMeaning:'Bông hoa đẹp nhỉ.',     category:'Tính từ -na' },
      { id:14, front:'しずか（な）',back:'yên tĩnh',      hiragana:'しずか',     romaji:'shizuka',   example:'しずかなへやです。',           exampleMeaning:'Căn phòng yên tĩnh.',   category:'Tính từ -na' },
      { id:15, front:'げんき（な）',back:'khỏe mạnh',     hiragana:'げんき',     romaji:'genki',     example:'げんきなこどもです。',         exampleMeaning:'Đứa trẻ khỏe mạnh.',   category:'Tính từ -na' },
    ]
  },
  {
    id: 'n5-kanji-co-ban',
    name: 'Tiếng Nhật N5 — Kanji & Hán tự cơ bản',
    description: 'Bộ Kanji số đếm, thời gian, ngày tháng, thiên nhiên & đời sống',
    level: 'N5',
    color: '#38B2FF',
    createdAt: Date.now(),
    cards: [
      { id:1,  front:'一人で',      back:'một mình',            hiragana:'ひとりで',      romaji:'hitoride',     example:'一人で日本へ行きます。',         exampleMeaning:'Tôi đi Nhật một mình.',          category:'Kanji số đếm' },
      { id:2,  front:'一つ',        back:'1 cái / 1 chiếc',     hiragana:'ひとつ',        romaji:'hitotsu',      example:'りんごを一つください。',         exampleMeaning:'Cho tôi một quả táo.',           category:'Kanji số đếm' },
      { id:3,  front:'一日',        back:'ngày mùng 1 / một ngày',hiragana:'ついたち / いちにち',romaji:'tsuitachi / ichinichi',example:'一日は休みです。',    exampleMeaning:'Ngày mùng 1 được nghỉ.',         category:'Kanji thời gian' },
      { id:4,  front:'一生懸命',    back:'chăm chỉ, hết sức',   hiragana:'いっしょうけんめい',romaji:'isshoukenmei',example:'一生懸命勉強します。',       exampleMeaning:'Tôi học tập hết sức chăm chỉ.',  category:'Kanji từ vựng' },
      { id:5,  front:'二つ',        back:'2 cái / 2 chiếc',     hiragana:'ふたつ',        romaji:'futatsu',      example:'みかんを二つ買いました。',       exampleMeaning:'Tôi đã mua 2 quả quýt.',         category:'Kanji số đếm' },
      { id:6,  front:'二日',        back:'ngày mùng 2 / hai ngày',hiragana:'ふつか',      romaji:'futsuka',      example:'二日に会いましょう。',           exampleMeaning:'Hãy gặp nhau vào ngày mùng 2.',  category:'Kanji thời gian' },
      { id:7,  front:'二月',        back:'tháng 2',             hiragana:'にがつ',        romaji:'nigatsu',      example:'二月は寒いです。',               exampleMeaning:'Tháng 2 trời lạnh.',             category:'Kanji thời gian' },
      { id:8,  front:'三日',        back:'ngày mùng 3 / ba ngày',hiragana:'みっか',       romaji:'mikka',        example:'三日泊まります。',               exampleMeaning:'Tôi trọ lại 3 ngày.',            category:'Kanji thời gian' },
      { id:9,  front:'三つ',        back:'3 cái / 3 chiếc',     hiragana:'みっつ',        romaji:'mittsu',       example:'ケーキを三つください。',         exampleMeaning:'Cho tôi 3 cái bánh.',            category:'Kanji số đếm' },
      { id:10, front:'三月',        back:'tháng 3',             hiragana:'さんがつ',      romaji:'sangatsu',     example:'三月に桜が咲きます。',           exampleMeaning:'Tháng 3 hoa anh đào nở.',        category:'Kanji thời gian' },
      { id:11, front:'四日',        back:'ngày mùng 4 / bốn ngày',hiragana:'よっか',      romaji:'yokka',        example:'四日に帰ります。',               exampleMeaning:'Ngày mùng 4 tôi sẽ về.',         category:'Kanji thời gian' },
      { id:12, front:'四つ',        back:'4 cái / 4 chiếc',     hiragana:'よっつ',        romaji:'yottsu',       example:'椅子が四つあります。',           exampleMeaning:'Có 4 cái ghế.',                  category:'Kanji số đếm' },
      { id:13, front:'四月',        back:'tháng 4',             hiragana:'しがつ',        romaji:'shigatsu',     example:'四月は新学期です。',             exampleMeaning:'Tháng 4 là kỳ học mới.',         category:'Kanji thời gian' },
      { id:14, front:'五つ',        back:'5 cái / 5 chiếc',     hiragana:'いつつ',        romaji:'itsutsu',      example:'卵を五つ使います。',             exampleMeaning:'Tôi dùng 5 quả trứng.',          category:'Kanji số đếm' },
      { id:15, front:'五日',        back:'ngày mùng 5 / năm ngày',hiragana:'いつか',      romaji:'itsuka',       example:'五日はこどもの日です。',         exampleMeaning:'Ngày mùng 5 là tết thiếu nhi.',  category:'Kanji thời gian' },
      { id:16, front:'五月',        back:'tháng 5',             hiragana:'ごがつ',        romaji:'gogatsu',      example:'五月になりました。',             exampleMeaning:'Đã sang tháng 5.',               category:'Kanji thời gian' },
      { id:17, front:'六日',        back:'ngày mùng 6 / sáu ngày',hiragana:'むいか',      romaji:'muika',        example:'六日は土曜日です。',             exampleMeaning:'Ngày mùng 6 là thứ bảy.',       category:'Kanji thời gian' },
      { id:18, front:'六つ',        back:'6 cái / 6 chiếc',     hiragana:'むっつ',        romaji:'muttsu',       example:'箱が六つあります。',             exampleMeaning:'Có 6 cái hộp.',                  category:'Kanji số đếm' },
      { id:19, front:'六月',        back:'tháng 6',             hiragana:'ろくがつ',      romaji:'rokugatsu',    example:'六月は雨が多いです。',           exampleMeaning:'Tháng 6 mưa nhiều.',             category:'Kanji thời gian' },
      { id:20, front:'七日',        back:'ngày mùng 7 / bảy ngày',hiragana:'なのか',      romaji:'nanoka',       example:'七日に出かけます。',             exampleMeaning:'Tôi sẽ ra ngoài vào ngày mùng 7.',category:'Kanji thời gian' },
      { id:21, front:'七つ',        back:'7 cái / 7 chiếc',     hiragana:'ななつ',        romaji:'nanatsu',      example:'星が七つ見えます。',             exampleMeaning:'Nhìn thấy 7 ngôi sao.',          category:'Kanji số đếm' },
      { id:22, front:'七月',        back:'tháng 7',             hiragana:'しちがつ',      romaji:'shichigatsu',  example:'七月は七夕です。',               exampleMeaning:'Tháng 7 có lễ Tanabata.',        category:'Kanji thời gian' },
      { id:23, front:'八日',        back:'ngày mùng 8 / tám ngày',hiragana:'ようか',      romaji:'youka',        example:'八日にテストがあります。',       exampleMeaning:'Ngày mùng 8 có bài kiểm tra.',   category:'Kanji thời gian' },
      { id:24, front:'八月',        back:'tháng 8',             hiragana:'はちがつ',      romaji:'hachigatsu',   example:'八月は夏休みです。',             exampleMeaning:'Tháng 8 là kỳ nghỉ hè.',         category:'Kanji thời gian' },
      { id:25, front:'九日',        back:'ngày mùng 9 / chín ngày',hiragana:'ここのか',   romaji:'kokonoka',     example:'九日に届きます。',               exampleMeaning:'Ngày mùng 9 hàng sẽ tới.',       category:'Kanji thời gian' },
      { id:26, front:'九つ',        back:'9 cái / 9 chiếc',     hiragana:'ここのつ',      romaji:'kokonotsu',    example:'消しゴムが九つあります。',       exampleMeaning:'Có 9 cục tẩy.',                  category:'Kanji số đếm' },
      { id:27, front:'九月',        back:'tháng 9',             hiragana:'くがつ',        romaji:'kugatsu',      example:'九月は秋の始まりです。',         exampleMeaning:'Tháng 9 là bắt đầu mùa thu.',    category:'Kanji thời gian' },
      { id:28, front:'十日',        back:'ngày mùng 10 / mười ngày',hiragana:'とおか',    romaji:'tooka',        example:'十日かかります。',               exampleMeaning:'Mất khoảng 10 ngày.',            category:'Kanji thời gian' },
      { id:29, front:'十分な',      back:'đầy đủ, thỏa đáng',   hiragana:'じゅうぶんな',  romaji:'juubunna',     example:'十分な睡眠をとります。',         exampleMeaning:'Ngủ đủ giấc.',                   category:'Kanji từ vựng' },
      { id:30, front:'十月',        back:'tháng 10',            hiragana:'じゅうがつ',    romaji:'juugatsu',     example:'十月は涼しいです。',             exampleMeaning:'Tháng 10 mát mẻ.',               category:'Kanji thời gian' },
      { id:31, front:'百',          back:'một trăm (100)',      hiragana:'ひゃく',        romaji:'hyaku',        example:'百円です。',                     exampleMeaning:'100 yên.',                       category:'Kanji số đếm' },
      { id:32, front:'三百',        back:'ba trăm (300)',       hiragana:'さんびゃく',    romaji:'sanbyaku',     example:'三百人います。',                 exampleMeaning:'Có 300 người.',                  category:'Kanji số đếm' },
      { id:33, front:'六百',        back:'sáu trăm (600)',      hiragana:'ろっぴゃく',    romaji:'roppyaku',     example:'六百ページあります。',           exampleMeaning:'Có 600 trang.',                  category:'Kanji số đếm' },
      { id:34, front:'八百',        back:'tám trăm (800)',      hiragana:'はっぴゃく',    romaji:'happyaku',     example:'八百屋で野菜を買います。',       exampleMeaning:'Mua rau ở tiệm bán rau củ.',     category:'Kanji số đếm' },
      { id:35, front:'二千',        back:'hai nghìn (2.000)',   hiragana:'にせん',        romaji:'nisen',        example:'二千円かかりました。',           exampleMeaning:'Đã tốn 2.000 yên.',              category:'Kanji số đếm' },
      { id:36, front:'三千',        back:'ba nghìn (3.000)',    hiragana:'さんぜん',      romaji:'sanzen',       example:'標高三千メートルです。',         exampleMeaning:'Độ cao 3.000 mét.',              category:'Kanji số đếm' },
      { id:37, front:'八千',        back:'tám nghìn (8.000)',   hiragana:'はっせん',      romaji:'hassen',       example:'八千円支払います。',             exampleMeaning:'Trả 8.000 yên.',                 category:'Kanji số đếm' },
      { id:38, front:'一万',        back:'mười nghìn (10.000 / 1 vạn)',hiragana:'いちまん',romaji:'ichiman',     example:'一万円札です。',                 exampleMeaning:'Tờ 10.000 yên.',                 category:'Kanji số đếm' },
      { id:39, front:'万里の長城',  back:'Vạn Lý Trường Thành', hiragana:'ばんりのちょうじょう',romaji:'banri no choujou',example:'万里の長城に行きたいです。',exampleMeaning:'Tôi muốn đến Vạn Lý Trường Thành.',category:'Kanji địa danh' },
      { id:40, front:'円',          back:'yên (tiền Nhật) / tròn',hiragana:'えん',        romaji:'en',           example:'千円札があります。',             exampleMeaning:'Có tờ 1.000 yên.',               category:'Kanji tiền tệ' },
      { id:41, front:'五円',        back:'5 yên (đồng xu 5 yên may mắn)',hiragana:'ごえん',romaji:'goen',        example:'五円玉はお守りです。',           exampleMeaning:'Đồng xu 5 yên là bùa may mắn.',  category:'Kanji tiền tệ' },
      { id:42, front:'花火',        back:'pháo hoa',            hiragana:'はなび',        romaji:'hanabi',       example:'夏に花火を見ます。',             exampleMeaning:'Mùa hè đi ngắm pháo hoa.',       category:'Kanji đời sống' },
      { id:43, front:'火',          back:'lửa',                 hiragana:'ひ',            romaji:'hi',           example:'火をつけてください。',           exampleMeaning:'Hãy nhóm lửa.',                  category:'Kanji tự nhiên' },
      { id:44, front:'火曜日',      back:'thứ ba',              hiragana:'かようび',      romaji:'kayoubi',      example:'火曜日に授業があります。',       exampleMeaning:'Thứ ba có buổi học.',            category:'Kanji thời gian' },
      { id:45, front:'火事',        back:'hỏa hoạn, vụ cháy',   hiragana:'かじ',          romaji:'kaji',         example:'火事に気をつけてください。',     exampleMeaning:'Hãy cẩn thận với hỏa hoạn.',     category:'Kanji đời sống' },
      { id:46, front:'畑',          back:'ruộng đồng, ruộng khô, rẫy',hiragana:'はたけ',  romaji:'hatake',       example:'畑で野菜を作ります。',           exampleMeaning:'Trồng rau trên ruộng.',          category:'Kanji tự nhiên' },
      { id:47, front:'秋',          back:'mùa thu',             hiragana:'あき',          romaji:'aki',          example:'秋の紅葉がきれいです。',         exampleMeaning:'Lá đỏ mùa thu rất đẹp.',         category:'Kanji tự nhiên' },
      { id:48, front:'氷',          back:'đá (nước đá), băng',  hiragana:'こおり',        romaji:'koori',        example:'ジュースに氷を入れます。',       exampleMeaning:'Cho đá vào nước ép.',            category:'Kanji tự nhiên' },
      { id:49, front:'泳ぐ',        back:'bơi lội',             hiragana:'およぐ',        romaji:'oyogu',        example:'海で泳ぎます。',                 exampleMeaning:'Bơi ở biển.',                    category:'Kanji động từ' },
      { id:50, front:'水泳',        back:'môn bơi lội',         hiragana:'すいえい',      romaji:'suiei',        example:'水泳が得意です。',               exampleMeaning:'Tôi giỏi môn bơi lội.',          category:'Kanji từ vựng' },
      { id:51, front:'水',          back:'nước',                hiragana:'みず',          romaji:'mizu',         example:'冷たい水を飲みます。',           exampleMeaning:'Uống nước lạnh.',                category:'Kanji tự nhiên' },
      { id:52, front:'水曜日',      back:'thứ tư',              hiragana:'すいようび',    romaji:'suiyoubi',     example:'水曜日は映画に行きます。',       exampleMeaning:'Thứ tư đi xem phim.',            category:'Kanji thời gian' },
      { id:53, front:'水道',        back:'đường nước, nước máy',hiragana:'すいどう',      romaji:'suidou',       example:'水道の水を止めます。',           exampleMeaning:'Khóa nước máy lại.',             category:'Kanji đời sống' },
      { id:54, front:'雨',          back:'mưa',                 hiragana:'あめ',          romaji:'ame',          example:'雨が降っています。',             exampleMeaning:'Trời đang mưa.',                 category:'Kanji tự nhiên' },
      { id:55, front:'電気',        back:'điện / đèn điện',     hiragana:'でんき',        romaji:'denki',        example:'電気を消してください。',         exampleMeaning:'Hãy tắt đèn điện đi.',           category:'Kanji đời sống' },
      { id:56, front:'電話',        back:'điện thoại / gọi điện thoại',hiragana:'でんわ',  romaji:'denwa',        example:'母に電話をかけます。',           exampleMeaning:'Gọi điện cho mẹ.',               category:'Kanji đời sống' },
      { id:57, front:'電車',        back:'tàu điện',            hiragana:'でんしゃ',      romaji:'densha',       example:'電車で会社に行きます。',         exampleMeaning:'Đi làm bằng tàu điện.',          category:'Kanji đời sống' },
      { id:58, front:'電池',        back:'pin',                 hiragana:'でんち',        romaji:'denchi',       example:'リモコンの電池を交換します。',   exampleMeaning:'Thay pin cho điều khiển.',       category:'Kanji đời sống' },
      { id:59, front:'電源',        back:'nguồn điện / nút nguồn',hiragana:'でんげん',    romaji:'dengen',       example:'電源を切ってください。',         exampleMeaning:'Hãy tắt nguồn điện.',            category:'Kanji đời sống' },
      { id:60, front:'雪',          back:'tuyết',               hiragana:'ゆき',          romaji:'yuki',         example:'冬に雪が降ります。',             exampleMeaning:'Mùa đông tuyết rơi.',            category:'Kanji tự nhiên' },
      { id:61, front:'雲',          back:'mây',                 hiragana:'くも',          romaji:'kumo',         example:'空に白い雲があります。',         exampleMeaning:'Trên bầu trời có đám mây trắng.',category:'Kanji tự nhiên' },
    ]
  }
];

/* -------------------------------------------------------
   DB CLASS  (localStorage wrapper)
   ------------------------------------------------------- */
class DB {
  /* Sets */
  static getSets() {
    const raw = localStorage.getItem(LS_SETS);
    if (!raw) {
      localStorage.setItem(LS_SETS, JSON.stringify(DEFAULT_SETS));
      return JSON.parse(JSON.stringify(DEFAULT_SETS));
    }
    const current = JSON.parse(raw);
    // Auto-merge any default sets that might not yet exist in localStorage
    let updated = false;
    for (const def of DEFAULT_SETS) {
      if (!current.some(s => s.id === def.id)) {
        current.push(def);
        updated = true;
      }
    }
    if (updated) {
      localStorage.setItem(LS_SETS, JSON.stringify(current));
    }
    return current;
  }

  static getSet(id) {
    return this.getSets().find(s => s.id === id) || null;
  }

  static saveSet(set) {
    const sets = this.getSets();
    const idx  = sets.findIndex(s => s.id === set.id);
    if (idx >= 0) sets[idx] = set;
    else sets.unshift(set);
    localStorage.setItem(LS_SETS, JSON.stringify(sets));
  }

  static deleteSet(id) {
    const sets = this.getSets().filter(s => s.id !== id);
    localStorage.setItem(LS_SETS, JSON.stringify(sets));
    // Remove progress for this set
    const prog = this.getAllProgress();
    Object.keys(prog).filter(k => k.startsWith(id + '_')).forEach(k => delete prog[k]);
    localStorage.setItem(LS_PROGRESS, JSON.stringify(prog));
  }

  /* Progress */
  static getAllProgress() {
    const raw = localStorage.getItem(LS_PROGRESS);
    return raw ? JSON.parse(raw) : {};
  }

  static getProgress(setId, cardId) {
    const key = `${setId}_${cardId}`;
    return this.getAllProgress()[key] || {
      easeFactor: 2.5,
      interval: 0,
      repetitions: 0,
      nextReview: 0,
      correct: 0,
      incorrect: 0,
      lastSeen: 0,
    };
  }

  static saveProgress(setId, cardId, data) {
    const all = this.getAllProgress();
    all[`${setId}_${cardId}`] = { ...this.getProgress(setId, cardId), ...data };
    localStorage.setItem(LS_PROGRESS, JSON.stringify(all));
  }

  static getSetProgress(setId) {
    const set  = this.getSet(setId);
    if (!set) return { total:0, known:0, learning:0, unseen:0, pct:0 };
    const all  = this.getAllProgress();
    let known = 0, learning = 0, unseen = 0;
    for (const card of set.cards) {
      const p = all[`${setId}_${card.id}`];
      if (!p || p.lastSeen === 0) unseen++;
      else if (p.repetitions >= 3 && p.easeFactor >= 2.3) known++;
      else learning++;
    }
    const total = set.cards.length;
    return { total, known, learning, unseen, pct: Math.round((known / total) * 100) };
  }

  /* Stats */
  static getStats() {
    const raw = localStorage.getItem(LS_STATS);
    return raw ? JSON.parse(raw) : { totalStudied:0, totalCorrect:0, totalWrong:0, streak:0, lastDate:'' };
  }

  static updateStats(correct, wrong) {
    const s    = this.getStats();
    const today = new Date().toDateString();
    s.totalStudied += correct + wrong;
    s.totalCorrect  += correct;
    s.totalWrong    += wrong;
    if (s.lastDate !== today) {
      const yesterday = new Date(Date.now() - 86400000).toDateString();
      s.streak = s.lastDate === yesterday ? s.streak + 1 : 1;
      s.lastDate = today;
    }
    localStorage.setItem(LS_STATS, JSON.stringify(s));
  }

  /* Export & Import / Sync */
  static exportAll() {
    return {
      type: 'nihongo_backup',
      version: 1,
      exportedAt: new Date().toISOString(),
      sets: this.getSets(),
      progress: this.getAllProgress(),
      stats: this.getStats()
    };
  }

  static importAll(data) {
    if (!data) throw new Error('Dữ liệu trống!');
    if (typeof data === 'string') {
      try {
        data = JSON.parse(data);
      } catch (e) {
        throw new Error('Định dạng JSON không hợp lệ!');
      }
    }

    if (data.type === 'nihongo_single_set' || (data.cards && data.name)) {
      const set = this.importSet(data);
      return { importedSets: 1, totalSets: this.getSets().length, single: set.name };
    }

    if (!Array.isArray(data.sets)) {
      throw new Error('Dữ liệu không chứa danh sách bộ thẻ hợp lệ!');
    }

    const currentSets = this.getSets();
    const map = new Map(currentSets.map(s => [s.id, s]));
    let addedCount = 0;

    data.sets.forEach(newSet => {
      if (newSet && newSet.name && Array.isArray(newSet.cards)) {
        if (!map.has(newSet.id)) addedCount++;
        map.set(newSet.id, newSet);
      }
    });

    localStorage.setItem(LS_SETS, JSON.stringify(Array.from(map.values())));

    if (data.progress && typeof data.progress === 'object') {
      const currentProg = this.getAllProgress();
      localStorage.setItem(LS_PROGRESS, JSON.stringify({ ...currentProg, ...data.progress }));
    }

    if (data.stats && typeof data.stats === 'object') {
      const curStats = this.getStats();
      localStorage.setItem(LS_STATS, JSON.stringify({
        totalStudied: Math.max(curStats.totalStudied || 0, data.stats.totalStudied || 0),
        totalCorrect: Math.max(curStats.totalCorrect || 0, data.stats.totalCorrect || 0),
        totalWrong:   Math.max(curStats.totalWrong || 0, data.stats.totalWrong || 0),
        streak:       Math.max(curStats.streak || 0, data.stats.streak || 0),
        lastDate:     curStats.lastDate || data.stats.lastDate || ''
      }));
    }

    return { importedSets: data.sets.length, addedCount, totalSets: map.size };
  }

  static exportSet(setId) {
    const set = this.getSet(setId);
    if (!set) return null;
    const allProg = this.getAllProgress();
    const setProg = {};
    (set.cards || []).forEach(c => {
      const key = `${setId}_${c.id}`;
      if (allProg[key]) setProg[key] = allProg[key];
    });
    return {
      type: 'nihongo_single_set',
      version: 1,
      exportedAt: new Date().toISOString(),
      set,
      progress: setProg
    };
  }

  static importSet(data) {
    if (typeof data === 'string') data = JSON.parse(data);
    const set = data.set || data;
    if (!set || !set.name || !Array.isArray(set.cards)) {
      throw new Error('Dữ liệu bộ thẻ không hợp lệ!');
    }
    if (!set.id) set.id = generateId();
    this.saveSet(set);
    if (data.progress && typeof data.progress === 'object') {
      const allProg = this.getAllProgress();
      localStorage.setItem(LS_PROGRESS, JSON.stringify({ ...allProg, ...data.progress }));
    }
    return set;
  }

  static downloadJSON(filename, dataObj) {
    const str = JSON.stringify(dataObj, null, 2);
    const blob = new Blob([str], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  static generateSetJsCode(setId) {
    const set = this.getSet(setId);
    if (!set) return '';
    return JSON.stringify(set, null, 2);
  }
}

/* -------------------------------------------------------
   UTILITY HELPERS
   ------------------------------------------------------- */
function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
}

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function getSetIdFromURL() {
  return new URLSearchParams(window.location.search).get('set');
}
