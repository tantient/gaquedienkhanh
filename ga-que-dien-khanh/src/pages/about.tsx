import { motion } from "framer-motion";
import { useLang } from "@/context/LanguageContext";
import { useSEO } from "@/hooks/useSEO";
import hotpotImg from "../assets/images/hotpot.png";
import grilledChickenImg from "../assets/images/grilled_chicken.png";
import heroImg from "../assets/images/hero.png";

const fadeIn = {
  hidden: { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.75, ease: "easeOut" } },
};

const CONTENT: Record<string, {
  breadcrumb: string;
  heroTitle: string;
  heroSub: string;
  storyLabel: string;
  storyTitle: string;
  story: string[];
  chickenLabel: string;
  chickenTitle: string;
  chicken: string[];
  spaceLabel: string;
  spaceTitle: string;
  space: string[];
  valuesLabel: string;
  values: { title: string; desc: string }[];
}> = {
  vi: {
    breadcrumb: "Về Chúng Tôi",
    heroTitle: "Câu chuyện của chúng tôi",
    heroSub: "Từ tiếng gà gáy sớm nơi vườn quê đến mâm cơm ấm cúng giữa lòng phố biển — một hành trình của hương vị, của ký ức, và của tình yêu dành cho ẩm thực Việt.",
    storyLabel: "Nguồn Gốc",
    storyTitle: "Sinh ra từ vùng đất Diên Khánh",
    story: [
      "Diên Khánh — một miền quê yên ả nép mình giữa lòng Khánh Hòa, nơi tiếng gà gáy còn vang trong sương sớm, nơi những khu vườn rợp bóng cây vẫn xanh mướt quanh năm. Người dân quê chúng tôi vẫn giữ nguyên nếp sống mộc mạc, chân chất — như cách ông bà ngày xưa vẫn sống.",
      "Chính từ mảnh đất ấy, chúng tôi học được một điều giản dị: bữa ăn ngon nhất không nằm ở sơn hào hải vị, mà ở sự tận tâm và nguyên liệu sạch — từ tay người trồng, người nuôi.",
      "Ý tưởng mở quán bắt đầu từ những bữa cơm gia đình bên hiên nhà — nơi mùi lá é quyện cùng hơi nóng nghi ngút của nồi lẩu bốc lên trong gió chiều, nơi tiếng cười nói rộn ràng quanh mâm cơm quê. Đó là khoảnh khắc mà chúng tôi muốn gói ghém, mang theo, và chia sẻ với tất cả mọi người.",
    ],
    chickenLabel: "Gà Ta Diên Khánh",
    chickenTitle: "Gà ta 'đi bộ' — Bí quyết của hương vị",
    chicken: [
      "Điểm khác biệt lớn nhất của chúng tôi nằm ở chất lượng nguyên liệu. Chúng tôi chỉ chọn gà ta thuần chủng — những con gà được thả tự do trong vườn nhà, tự nhiên kiếm ăn từ sáng sớm đến khi mặt trời lặn xuống sau rặng tre.",
      "Gà thả vườn có cơ bắp săn chắc nhờ vận động cả ngày, thớ thịt dai ngọt một cách tự nhiên — thứ hương vị mà gà công nghiệp không bao giờ có được.",
      "Mỗi tuần, chúng tôi chỉ nhận gà từ những hộ nông dân quen thuộc ở Diên Khánh — những người đã gắn bó với quán từ ngày đầu mở cửa. Họ hiểu chúng tôi cần gì, chúng tôi tin họ chăm nuôi thế nào. Đó là cam kết bằng cả tình người, không chỉ bằng giấy tờ.",
    ],
    spaceLabel: "Không Gian Quán",
    spaceTitle: "Một góc quê giữa lòng phố biển",
    space: [
      "Quán nằm tại 27 Tô Hiến Thành — ngay trung tâm khu phố Hàn Quốc sầm uất, chỉ vài bước chân từ chợ Xóm Mới. Vị trí thuận tiện cho cả người dân Nha Trang lẫn du khách ghé thăm.",
      "Bước qua cánh cửa, phố xá ồn ào lùi lại phía sau. Bạn có thể chọn ngồi dưới tán hai cây cổ thụ khổng lồ — nơi nắng xuyên qua kẽ lá, gió mát rượi cả buổi chiều — hoặc vào trong nhà, với sắc vàng ấm của tường quê và ánh đèn dịu nhẹ.",
      "Một không gian xanh mát, mộc mạc, không phô trương. Ngồi tại Gà Quê, bạn không chỉ thưởng thức bữa ăn — bạn đang sống lại khoảnh khắc bình yên của làng quê Việt Nam, ngay giữa lòng Nha Trang nhộn nhịp.",
    ],
    valuesLabel: "Giá Trị Cốt Lõi",
    values: [
      { title: "🌾 Mộc Mạc", desc: "Giữ trọn vẻ đẹp giản dị của làng quê — từ món ăn đến không gian, từ cách phục vụ đến nụ cười." },
      { title: "🐓 Chân Thật", desc: "Gà ta thật, nguyên liệu thật, hương vị thật. Không công nghiệp, không tô vẽ, không hứa hẹn quá lời." },
      { title: "🔥 Tận Tâm", desc: "Mỗi món ăn là một lần dụng tâm — từ khâu chọn nguyên liệu đến lúc dọn lên bàn cho khách." },
      { title: "🏡 Ấm Áp", desc: "Đón khách như đón người thân về nhà — bằng bữa cơm nóng, ly trà nguội, và câu chuyện quê." },
    ],
  },
  en: {
    breadcrumb: "About Us",
    heroTitle: "Our Story",
    heroSub: "From the countryside of Dien Khanh to the heart of Nha Trang — a journey of flavor and culinary love.",
    storyLabel: "Our Origins",
    storyTitle: "Born from the land of Dien Khanh",
    story: [
      "Dien Khanh is a peaceful district nestled deep in Khanh Hoa province, where locals still maintain their simple, honest way of life. It was here that we learned the best meals don't need extravagance — just dedication and clean ingredients.",
      "The idea to open the restaurant started at family dinners on the porch, where the scent of basil leaves mingled with the steam rising from the hotpot in the evening breeze. That is the flavor we want to share with everyone.",
      "When we moved to Nha Trang, we brought not just our recipes but the soul of the countryside — the authenticity, simplicity, and warmth of Dien Khanh people.",
    ],
    chickenLabel: "Dien Khanh Free-Range Chicken",
    chickenTitle: "Walking chickens — The secret to flavor",
    chicken: [
      "The biggest difference at Gà Quê Diên Khánh is the quality of ingredients. We only use pure free-range chickens — birds that roam freely on the red-clay hills of Dien Khanh, naturally foraging from sunrise to sunset.",
      "Hill-raised chickens have firmer muscles from exercise, with a natural sweetness impossible to find in factory-farmed birds. Golden skin, fine-grained meat — these are standards we never compromise.",
      "Each week, we only source chickens from familiar farming households in Dien Khanh who have partnered with us for many years. This is our quality commitment we've kept since day one.",
    ],
    spaceLabel: "The Lemon Leaf Space",
    spaceTitle: "Where nature and cuisine blend into one",
    space: [
      "The Lemon Leaf space draws inspiration from the cool green gardens of Dien Khanh countryside — where lemon tree canopies shade afternoon meals.",
      "We use natural materials: bare wood, bamboo, and fresh foliage to create a space that feels both intimate and refreshing. Natural light and breeze are our indispensable companions.",
      "Sitting at Gà Quê Diên Khánh, you're not just enjoying a meal — you're reliving a peaceful moment of Vietnamese countryside life, even in the middle of the city.",
    ],
    valuesLabel: "Our Core Values",
    values: [
      { title: "Clean Ingredients", desc: "Pure free-range chickens, morning-picked basil, chemical-free vegetables." },
      { title: "Fresh Daily", desc: "Every dish is prepared and cooked fresh each day — no frozen food." },
      { title: "Real Price, Real Flavor", desc: "We use no artificial flavoring. Every taste comes from natural ingredients." },
      { title: "Heartfelt Service", desc: "Every guest is welcomed like family." },
    ],
  },
  ko: {
    breadcrumb: "소개",
    heroTitle: "우리의 이야기",
    heroSub: "디엔 칸 시골에서 나트랑 도심까지 — 맛과 요리에 대한 사랑의 여정.",
    storyLabel: "우리의 기원",
    storyTitle: "디엔 칸 땅에서 태어나다",
    story: [
      "디엔 칸은 칸호아성 깊은 곳에 위치한 평화로운 지역으로, 주민들은 여전히 소박하고 정직한 삶의 방식을 유지하고 있습니다. 이곳에서 우리는 최고의 식사는 화려함이 필요 없으며, 단지 정성과 깨끗한 재료만 있으면 된다는 것을 배웠습니다.",
      "식당을 열겠다는 아이디어는 저녁 바람 속에서 바질잎 향기와 샤부샤부 냄비의 김이 뒤섞이는 베란다에서의 가족 저녁 식사에서 시작되었습니다. 그것이 우리가 모든 사람과 나누고 싶은 맛입니다.",
      "나트랑으로 이사할 때, 우리는 레시피뿐만 아니라 시골의 영혼 — 디엔 칸 사람들의 진정성, 단순함, 따뜻함을 가져왔습니다.",
    ],
    chickenLabel: "디엔 칸 방목 닭",
    chickenTitle: "'걸어다니는 닭' — 맛의 비결",
    chicken: [
      "가 께 디엔 칸의 가장 큰 차이점은 재료의 질입니다. 우리는 순수한 방목 닭만 사용합니다 — 디엔 칸의 붉은 점토 언덕을 자유롭게 뛰어다니며 해가 뜰 때부터 질 때까지 자연스럽게 먹이를 찾는 닭들입니다.",
      "언덕에서 키운 닭은 운동으로 근육이 더 단단하며, 공장식 닭에서는 찾을 수 없는 자연스러운 단맛을 가지고 있습니다. 황금빛 피부, 고운 결 — 이것이 우리가 타협하지 않는 기준입니다.",
      "매주 우리는 수년 동안 파트너 관계를 맺어온 디엔 칸의 친숙한 농가에서만 닭을 공급받습니다. 이것이 첫날부터 지켜온 우리의 품질 약속입니다.",
    ],
    spaceLabel: "레몬잎 공간",
    spaceTitle: "자연과 음식이 하나로 어우러지는 곳",
    space: [
      "레몬잎 공간은 오후의 식사에 레몬 나무 캐노피가 그늘을 드리우는 디엔 칸 시골의 시원한 초록 정원에서 영감을 받았습니다.",
      "우리는 자연 소재를 사용합니다: 맨 나무, 대나무, 신선한 잎을 사용하여 친밀하고 상쾌한 공간을 만듭니다. 자연광과 바람은 없어서는 안 될 동반자입니다.",
      "가 께 디엔 칸에 앉아 있으면, 단순히 식사를 즐기는 것이 아니라 도시 한가운데서도 베트남 시골의 평화로운 순간을 다시 살고 있는 것입니다.",
    ],
    valuesLabel: "핵심 가치",
    values: [
      { title: "깨끗한 재료", desc: "순수 방목 닭, 아침에 딴 바질, 화학 물질 없는 채소." },
      { title: "매일 신선하게", desc: "모든 요리는 매일 신선하게 준비하고 요리합니다 — 냉동 식품 없음." },
      { title: "진짜 가격, 진짜 맛", desc: "인공 향미료를 사용하지 않습니다. 모든 맛은 천연 재료에서 나옵니다." },
      { title: "진심 어린 서비스", desc: "모든 손님을 가족처럼 환영합니다." },
    ],
  },
  zh: {
    breadcrumb: "关于我们",
    heroTitle: "我们的故事",
    heroSub: "从延庆乡村到芽庄市中心 — 一段关于风味与美食热爱的旅程。",
    storyLabel: "我们的起源",
    storyTitle: "诞生于延庆这片土地",
    story: [
      "延庆是庆和省深处一个宁静的地区，当地居民仍然保持着简单、诚实的生活方式。正是在这里，我们学到了最好的饭菜不需要奢华——只需要用心和干净的食材。",
      "开餐厅的想法起源于门廊上的家庭晚餐，夕风中罗勒叶的香气与火锅升腾的热气交融。那是我们想与所有人分享的味道。",
      "搬到芽庄时，我们不仅带来了食谱，还带来了乡村的灵魂——延庆人的真实、朴素与温情。",
    ],
    chickenLabel: "延庆散养土鸡",
    chickenTitle: "'走地鸡' — 风味的秘诀",
    chicken: [
      "嘉桂延庆最大的不同在于食材的质量。我们只使用纯正散养鸡——在延庆红土丘陵自由奔跑、从日出到日落自然觅食的鸡。",
      "山地散养鸡因为运动，肌肉更加紧实，具有工厂鸡无法找到的天然甜味。金黄的皮肤，细腻的肉质——这些是我们从不妥协的标准。",
      "每周，我们只从与我们合作多年的延庆熟悉农户采购鸡。这是我们从开业第一天就坚守的品质承诺。",
    ],
    spaceLabel: "柠檬叶空间",
    spaceTitle: "自然与美食融为一体的地方",
    space: [
      "柠檬叶空间的灵感来自延庆乡村凉爽翠绿的花园——柠檬树冠为下午的餐食遮荫。",
      "我们使用天然材料：原木、竹子和新鲜叶片，营造出既亲切又清新的空间。自然光线和微风是不可或缺的伙伴。",
      "坐在嘉桂延庆，你不仅仅是在享用一餐——即使在城市中央，你也在重温越南乡村生活的宁静时光。",
    ],
    valuesLabel: "核心价值",
    values: [
      { title: "干净食材", desc: "纯正散养鸡、早晨采摘的罗勒叶、无化学物质的蔬菜。" },
      { title: "每日新鲜", desc: "每道菜每天都新鲜准备和烹饪——不使用冷冻食品。" },
      { title: "真实价格，真实口味", desc: "我们不使用人工香精。所有味道都来自天然食材。" },
      { title: "用心服务", desc: "每位客人都像家人一样受到欢迎。" },
    ],
  },
  ru: {
    breadcrumb: "О нас",
    heroTitle: "Наша история",
    heroSub: "Из деревни Зиен Кхань в самое сердце Нячанга — путешествие вкуса и любви к кулинарии.",
    storyLabel: "Наши корни",
    storyTitle: "Рождённые на земле Зиен Кхань",
    story: [
      "Зиен Кхань — тихий район в глубине провинции Кханьхоа, где местные жители по-прежнему ведут простой, честный образ жизни. Именно здесь мы научились, что лучшая трапеза не требует роскоши — достаточно преданности делу и чистых ингредиентов.",
      "Идея открыть ресторан родилась за семейными ужинами на веранде, где аромат базилика смешивался с паром от кипящего фондю в вечернем ветерке. Именно этот вкус мы хотим разделить со всеми.",
      "Переехав в Нячанг, мы принесли не только рецепты, но и душу деревни — искренность, простоту и теплоту людей из Зиен Кхань.",
    ],
    chickenLabel: "Деревенская курица Зиен Кхань",
    chickenTitle: "'Гуляющие куры' — секрет вкуса",
    chicken: [
      "Главное отличие Га Ке Зиен Кхань — качество ингредиентов. Мы используем только чистопородных деревенских кур, которые свободно пасутся на красноглинистых холмах Зиен Кхань, естественно питаясь от рассвета до заката.",
      "Куры, выращенные на холмах, имеют более упругие мышцы из-за движения и природную сладость мяса, которую невозможно найти у фермерских кур. Золотистая кожа, нежное мясо — это стандарты, которыми мы никогда не поступаемся.",
      "Каждую неделю мы принимаем кур только от знакомых фермерских хозяйств в Зиен Кхань, с которыми сотрудничаем много лет. Это наше обязательство по качеству, которое мы хранили с первого дня.",
    ],
    spaceLabel: "Пространство Лимонного листа",
    spaceTitle: "Где природа и кухня сливаются воедино",
    space: [
      "Пространство Лимонного листа вдохновлено прохладными зелёными садами деревни Зиен Кхань, где кроны лимонных деревьев дают тень для послеполуденных трапез.",
      "Мы используем натуральные материалы: необработанное дерево, бамбук и свежую листву, чтобы создать пространство, которое кажется одновременно уютным и свежим. Естественный свет и ветер — наши незаменимые спутники.",
      "Сидя в Га Ке Зиен Кхань, вы не просто наслаждаетесь едой — вы переживаете спокойный момент вьетнамской деревенской жизни, даже находясь в самом центре города.",
    ],
    valuesLabel: "Наши ценности",
    values: [
      { title: "Чистые ингредиенты", desc: "Чистопородные деревенские куры, свежесорванный базилик, овощи без химии." },
      { title: "Ежедневная свежесть", desc: "Каждое блюдо готовится свежим каждый день — никакой заморозки." },
      { title: "Настоящая цена, настоящий вкус", desc: "Мы не используем искусственные ароматизаторы. Каждый вкус — от натуральных ингредиентов." },
      { title: "Душевный сервис", desc: "Каждого гостя мы встречаем как члена семьи." },
    ],
  },
};

const SEO_ABOUT: Record<string, { title: string; description: string }> = {
  vi: { title: "Về Chúng Tôi | Gà Quê Diên Khánh – Câu Chuyện Hương Vị Đồng Quê", description: "Khám phá câu chuyện đằng sau Gà Quê Diên Khánh – nhà hàng mang hương vị gà quê chân thực từ Diên Khánh đến trái tim Nha Trang." },
  en: { title: "About Us | Gà Quê Diên Khánh – Our Story", description: "Discover the story behind Gà Quê Diên Khánh, bringing authentic countryside chicken flavours from Diên Khánh to the heart of Nha Trang." },
  ko: { title: "우리에 대해 | Gà Quê Diên Khánh – 우리의 이야기", description: "지엔 카잉에서 나트랑 중심부까지 정통 시골 닭 요리의 맛을 전하는 가 꿰 지엔 카잉의 이야기를 만나보세요." },
  zh: { title: "关于我们 | Gà Quê Diên Khánh – 我们的故事", description: "探索Gà Quê Diên Khánh背后的故事，将正宗的乡村鸡肉风味从延庆带到芽庄的中心。" },
  ru: { title: "О Нас | Gà Quê Diên Khánh – Наша История", description: "Узнайте историю ресторана Gà Quê Diên Khánh — мы приносим подлинный деревенский вкус курицы из Зиен Кань в сердце Нячанга." },
};

export default function About() {
  const { lang } = useLang();
  const cx = CONTENT[lang] ?? CONTENT.vi;
  const seo = SEO_ABOUT[lang] ?? SEO_ABOUT.vi;
  useSEO({ title: seo.title, description: seo.description, canonical: "https://gaquedienkhanh.com/about" });

  return (
    <div className="min-h-screen bg-background text-foreground pt-16">
      {/* Page Hero */}
      <div className="relative h-64 md:h-80 overflow-hidden">
        <div className="absolute inset-0 bg-black/55 z-10" />
        <img src={heroImg} alt="Không gian nhà hàng Gà Quê Diên Khánh tại 27 Tô Hiến Thành Nha Trang" className="w-full h-full object-cover object-center" />
        <div className="absolute inset-0 z-20 flex flex-col items-center justify-center text-center px-6">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
            <p className="text-accent text-xs tracking-[0.3em] uppercase mb-3 font-semibold">{cx.breadcrumb}</p>
            <h1 className="font-serif text-4xl md:text-5xl text-white font-bold">{cx.heroTitle}</h1>
            <p className="text-white/75 text-base mt-4 max-w-2xl font-light">{cx.heroSub}</p>
          </motion.div>
        </div>
      </div>

      {/* Story */}
      <section className="py-20 md:py-28">
        <div className="container mx-auto px-6 md:px-12">
          <div className="flex flex-col lg:flex-row gap-14 lg:gap-20 items-start">
            <motion.div
              initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeIn}
              className="lg:w-1/2"
            >
              <div className="flex items-center gap-3 mb-5">
                <div className="h-px w-10 bg-accent" />
                <span className="text-accent text-xs tracking-widest uppercase font-semibold">{cx.storyLabel}</span>
              </div>
              <h2 className="font-serif text-3xl md:text-4xl text-primary font-bold mb-8 leading-snug">{cx.storyTitle}</h2>
              <div className="space-y-5 text-muted-foreground text-lg leading-relaxed font-light">
                {cx.story.map((p, i) => <p key={i}>{p}</p>)}
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 24 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.8 }}
              className="lg:w-1/2 relative"
            >
              <div className="aspect-[4/3] overflow-hidden rounded-sm">
                <img src={hotpotImg} alt="Lẩu gà lá é trứ danh Gà Quê Diên Khánh Nha Trang" className="w-full h-full object-cover hover:scale-105 transition-transform duration-700" />
              </div>
              <div className="absolute -bottom-5 -left-5 w-28 h-28 border-l-2 border-b-2 border-accent/40 hidden md:block" />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Chicken story */}
      <section className="py-20 md:py-28 bg-[#F6F4ED]">
        <div className="container mx-auto px-6 md:px-12">
          <div className="flex flex-col lg:flex-row-reverse gap-14 lg:gap-20 items-start">
            <motion.div
              initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeIn}
              className="lg:w-1/2"
            >
              <div className="flex items-center gap-3 mb-5">
                <div className="h-px w-10 bg-accent" />
                <span className="text-accent text-xs tracking-widest uppercase font-semibold">{cx.chickenLabel}</span>
              </div>
              <h2 className="font-serif text-3xl md:text-4xl text-primary font-bold mb-8 leading-snug">{cx.chickenTitle}</h2>
              <div className="space-y-5 text-muted-foreground text-lg leading-relaxed font-light">
                {cx.chicken.map((p, i) => <p key={i}>{p}</p>)}
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: -24 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.8 }}
              className="lg:w-1/2 relative"
            >
              <div className="aspect-[4/3] overflow-hidden rounded-sm">
                <img src={grilledChickenImg} alt="Gà nướng than hoa đặc sản Diên Khánh Khánh Hòa" className="w-full h-full object-cover hover:scale-105 transition-transform duration-700" />
              </div>
              <div className="absolute -bottom-5 -right-5 w-28 h-28 border-r-2 border-b-2 border-accent/40 hidden md:block" />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Lemon Leaf Space */}
      <section className="py-20 md:py-28">
        <div className="container mx-auto px-6 md:px-12 max-w-3xl text-center">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeIn}>
            <div className="flex items-center justify-center gap-3 mb-5">
              <div className="h-px w-10 bg-accent" />
              <span className="text-accent text-xs tracking-widest uppercase font-semibold">{cx.spaceLabel}</span>
              <div className="h-px w-10 bg-accent" />
            </div>
            <h2 className="font-serif text-3xl md:text-4xl text-primary font-bold mb-10 leading-snug">{cx.spaceTitle}</h2>
            <div className="space-y-6 text-muted-foreground text-lg leading-relaxed font-light text-left">
              {cx.space.map((p, i) => <p key={i}>{p}</p>)}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Values */}
      <section className="py-20 bg-primary text-primary-foreground">
        <div className="container mx-auto px-6 md:px-12">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeIn} className="text-center mb-12">
            <span className="text-accent text-xs tracking-widest uppercase font-semibold">{cx.valuesLabel}</span>
            <div className="w-12 h-0.5 bg-accent mx-auto mt-4" />
          </motion.div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-3xl mx-auto">
            {cx.values.map((v, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.12 }}
                className="border border-primary-foreground/15 p-6 rounded-sm"
                data-testid={`card-value-${i}`}
              >
                <h3 className="font-serif text-lg font-bold text-white mb-2">{v.title}</h3>
                <p className="text-primary-foreground/70 font-light text-sm leading-relaxed">{v.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
