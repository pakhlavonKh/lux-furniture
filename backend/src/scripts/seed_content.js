// backend/src/scripts/seed_content.js
import News from "../models/news.model.js";
import Discount from "../models/discount.model.js";
import { connectDB, disconnectDB } from "../config/mongodb_connection.js";

const seedContent = async () => {
  try {
    await connectDB();

    // Clear existing data
    await News.deleteMany({});
    await Discount.deleteMany({});

    // ===========================
    // SEED NEWS
    // ===========================
    const newsItems = [
      {
        title: {
          en: "New Spring Collection Launched",
          ru: "Запущена новая весенняя коллекция",
          uz: "Yangi bahor kolleksiyasi ishga tushdi",
        },
        description: {
          en: "Introducing our stunning spring collection featuring modern minimalist designs and sustainable materials.",
          ru: "Представляем нашу потрясающую весеннюю коллекцию с современным минималистским дизайном и устойчивыми материалами.",
          uz: "Zamonaviy minimalista dizayni va barqaror materiallardan iborat ajoyib bahor kolleksiyasini taqdim etamiz.",
        },
        content: {
          en: "We're thrilled to announce the launch of our spring collection! This season brings fresh designs, eco-friendly materials, and innovative solutions for modern living. Explore pieces that combine elegance with sustainability.",
          ru: "Мы рады объявить о запуске нашей весенней коллекции! Этот сезон привносит свежие дизайны, экологичные материалы и инновационные решения для современной жизни. Изучите предметы, сочетающие элегантность и устойчивость.",
          uz: "Biz o'z bahor kolleksiyasini ishga tushirishni e'lon qilishdan xursandmiz! Bu fasl yangi dizaynlarni, eco-friendly materiallarni va zamonaviy turmush uchun innovatsion yechimlarni keltiradi. Elegantlik va barqarorldikni birlashtiradigan narsalarni o'rganing.",
        },
        image: {
          url: "https://res.cloudinary.com/demo/image/upload/v1/spring-collection.jpg",
          public_id: "spring-collection",
          alt: "Spring Collection Overview",
        },
        isActive: true,
        order: 1,
      },
      {
        title: {
          en: "Interior Design Workshop Series",
          ru: "Серия мастер-классов по дизайну интерьера",
          uz: "Ichki dizayn seminar seriyasi",
        },
        description: {
          en: "Join our expert designers for exclusive workshops on creating your dream interior space.",
          ru: "Присоединяйтесь к нашим экспертным дизайнерам на эксклюзивных мастер-классах по созданию вашего идеального интерьера.",
          uz: "O'z orzu qilgan ichki fazo yaratish bo'yicha eksklyuziv seminarlar uchun bizning mutaxassis dizaynerlaridan qo'shiling.",
        },
        content: {
          en: "This March, we're hosting a series of interactive workshops covering everything from space planning to color theory. Our expert team will guide you through creating beautiful, functional spaces. Register now for limited seats!",
          ru: "В этом марте мы проводим серию интерактивных мастер-классов, охватывающих все от планирования пространства до теории цвета. Наша экспертная команда проведет вас через создание красивых функциональных пространств. Зарегистрируйтесь сейчас, мест ограничено!",
          uz: "Bu mart oyida biz makon rejalashtirilishidan rang nazariasigacha bo'lgan barcha narsalarni o'z ichiga olgan interaktiv seminarlar seriyasini o'tkazmoqdamiz. Bizning mutaxassis jamoamiz sizni chiroyli va funktsional bo'shliqlarni yaratish orqali yo'naltiradi. Hozir ro'yxatdan o'ting, o'rinlar cheklangan!",
        },
        image: {
          url: "https://res.cloudinary.com/demo/image/upload/v1/workshop.jpg",
          public_id: "workshop",
          alt: "Interior Design Workshop",
        },
        isActive: true,
        order: 2,
      },
      {
        title: {
          en: "Sustainable Craftsmanship at Heart",
          ru: "Устойчивое мастерство в сердце",
          uz: "Yurakda barqaror hunarmandlik",
        },
        description: {
          en: "Learn about our commitment to sustainable furniture craftsmanship and ethical sourcing.",
          ru: "Узнайте о нашей приверженности устойчивому мебельному мастерству и этичному источнику.",
          uz: "Barqaror mebel hunarmandligi va axloqiy manba bo'yicha bizning intilishimiz haqida bilib oling.",
        },
        content: {
          en: "Every piece in our collection is crafted with passion and responsibility. We work with artisans who share our commitment to quality and environmental consciousness. Discover the stories behind our most beloved creations.",
          ru: "Каждое изделие в нашей коллекции создано с страстью и ответственностью. Мы работаем с ремесленниками, которые разделяют нашу приверженность качеству и экологическому сознанию. Откройте истории, стоящие за нашими самыми любимыми творениями.",
          uz: "Bizning kolleksiyasidagi har bir narsalar ishtiyoq va mas'uliyat bilan yaratilgan. Biz sifat va ekologik ongga bo'lgan bizning intilishini baham ko'ruvchi hunarmandlar bilan ishlaydi. Bizning eng sevimli ijodlarining ortasidagi hikoyalarni bilib oling.",
        },
        image: {
          url: "https://res.cloudinary.com/demo/image/upload/v1/craftsmanship.jpg",
          public_id: "craftsmanship",
          alt: "Artisan Craftsmanship",
        },
        isActive: true,
        order: 3,
      },
      {
        title: {
          en: "Customer Spotlight: Modern Minimalist Home",
          ru: "Прожектор клиента: современный минималистский дом",
          uz: "Mijoz to'ldirilgani: zamonaviy minimalista uy",
        },
        description: {
          en: "See how Sarah transformed her space using our contemporary furniture collection.",
          ru: "Посмотрите, как Сара преобразила свое пространство, используя нашу современную коллекцию мебели.",
          uz: "Saronaming o'z bo'shliqni bizning zamonaviy mebel kolleksiyasidan foydalanib qanday o'zgartirgani ko'ring.",
        },
        content: {
          en: "Meet Sarah, who created a stunning minimalist home using pieces from our contemporary collection. her journey from cramped apartment to open, airy living space is truly inspiring. Read her full transformation story on our blog.",
          ru: "Познакомьтесь с Сарой, которая создала потрясающий минималистский дом, используя предметы из нашей современной коллекции. Ее путь от тесной квартиры к открытому, просторному жилому пространству действительно вдохновляет. Прочитайте полную историю ее трансформации в нашем блоге.",
          uz: "Saronani tanishtiring, u bizning zamonaviy kolleksiyasidan narsalardan foydalanib ajoyib minimalista uyni yaratdi. Uning tor xonadorondan ochiq, havo beruvchi turmush bo'shliqqa borayotgan yo'li haqiqatan ilhomlantiruvchi. Uning to'liq o'zgarish hikoyasini bizning blogida o'qing.",
        },
        image: {
          url: "https://res.cloudinary.com/demo/image/upload/v1/customer-showcase.jpg",
          public_id: "customer-showcase",
          alt: "Customer Home Showcase",
        },
        isActive: true,
        order: 4,
      },
      {
        title: {
          en: "Premium Materials: What Makes the Difference",
          ru: "Премиальные материалы: что делает разницу",
          uz: "Premium materiallar: nima farqni yaratadi",
        },
        description: {
          en: "Explore the premium materials that set our furniture apart and ensure longevity.",
          ru: "Исследуйте премиальные материалы, которые отличают нашу мебель и обеспечивают долговечность.",
          uz: "Bizning mebelni ajratib turuvchi va uzoq muddat ishlashni ta'minlash uchun premium materiallarni o'rganing.",
        },
        content: {
          en: "Quality materials are the foundation of exceptional furniture. In this article, we break down the materials we use and why they matter. From Italian leather to sustainably harvested teak, each choice is deliberate and thoughtful.",
          ru: "Качественные материалы - основа исключительной мебели. В этой статье мы разбираем материалы, которые мы используем, и почему они имеют значение. От итальянской кожи до экологически собираемого тика - каждый выбор является преднамеренным и вдумчивым.",
          uz: "Sifatli materiallar mustasno mebel'ning asosi. Ushbu maqolada biz foydalanayotgan materiallarni va ularning nega muhim ekanligini bo'lib ko'rsatamiz. Italyan terisidan barqaror qayta ishlangan tikkigacha - har bir tanlov o'zaro va o'ylab topilgan.",
        },
        isActive: true,
        order: 5,
      },
      {
        title: {
          en: "Seasonal Color Trends 2026",
          ru: "Тренды цветов сезона 2026",
          uz: "2026 yildagi fasl ranglar trendi",
        },
        description: {
          en: "Discover the hottest color palettes for 2026 and how to incorporate them into your home.",
          ru: "Откройте самые горячие цветовые палитры на 2026 год и способы их внедрения в ваш дом.",
          uz: "2026 yiling eng isiq rang palitrasini bilib oling va ularni o'z uyingizga qanday kiritish kerak.",
        },
        content: {
          en: "This season's color palette emphasizes warm earth tones, soft pastels, and bold jewel tones. Learn how to mix and match these colors to create stunning visual harmony in your spaces. Our color experts share tips and recommendations.",
          ru: "Цветовая палитра этого сезона подчеркивает теплые земляные тона, мягкие пастельные и смелые драгоценные тона. Узнайте, как смешивать и использовать эти цвета для создания потрясающей визуальной гармонии в ваших пространствах. Наши цветовые эксперты делятся советами и рекомендациями.",
          uz: "Ushbu faslning rang palitrasi iliq ergan tonlarini, yumshoq pastel va dadali qimmatbaho tonlarini ta'kidlaydi. Ushbu ranglarni qanday aralashtirib va mos keltirish orqali o'z bo'shliqlarida ajoyib vizual garmoniya yaratish kerak. Bizning rang mutaxassislari maslahat va tavsiyalarni baham ko'rashadi.",
        },
        image: {
          url: "https://res.cloudinary.com/demo/image/upload/v1/color-trends.jpg",
          public_id: "color-trends",
          alt: "2026 Color Trends",
        },
        isActive: true,
        order: 6,
      },
    ];

    const createdNews = await News.insertMany(newsItems);
    console.log(`✅ Seeded ${createdNews.length} news items`);

    // ===========================
    // SEED DISCOUNTS
    // ===========================
    const discounts = [
      {
        title: {
          en: "Spring Sale - 20% Off",
          ru: "Весенняя распродажа - скидка 20%",
          uz: "Bahor sotuvlari - 20% chegirma",
        },
        description: {
          en: "Celebrate the season with 20% off selected spring collection items. Limited time offer!",
          ru: "Отметьте сезон со скидкой 20% на избранные предметы весенней коллекции. Ограниченное предложение по времени!",
          uz: "Faslni 20% chegirma bilan bahor kolleksiyasining tanlangan narsalari bo'yicha nishonlang. Vaqt cheklangan takliflar!",
        },
        percentage: 20,
        productIds: ["1", "2", "3", "4", "5"],
        code: "SPRING20",
        isActive: true,
        startDate: new Date(),
        endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        order: 1,
      },
      {
        title: {
          en: "Bundle Deal - Save 25%",
          ru: "Предложение комплекта - сэкономьте 25%",
          uz: "Paket kelishilmasi - 25% tejang",
        },
        description: {
          en: "Buy a sofa and coffee table together and save 25% on your entire purchase.",
          ru: "Купите диван и кофейный столик вместе и сэкономьте 25% на всю покупку.",
          uz: "Divan va qahva stolini birga sotib oling va butun sotib olishda 25% tejang.",
        },
        percentage: 25,
        productIds: ["1", "6", "7"],
        code: "BUNDLE25",
        isActive: true,
        startDate: new Date(),
        endDate: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000),
        order: 2,
      },
      {
        title: {
          en: "First-Time Customer Offer",
          ru: "Предложение для новых клиентов",
          uz: "Birinchi marta mijoz taklifi",
        },
        description: {
          en: "New to Lux Furniture? Get 15% off your first order with code WELCOME15.",
          ru: "Новичок в Lux Furniture? Получите 15% скидку на первый заказ с кодом WELCOME15.",
          uz: "Lux Furniture-ga yangi? Kod WELCOME15 bilan birinchi buyurtmangizga 15% chegirma oling.",
        },
        percentage: 15,
        productIds: [],
        code: "WELCOME15",
        isActive: true,
        startDate: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000),
        endDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
        order: 3,
      },
      {
        title: {
          en: "Clearance Event - Up to 40% Off",
          ru: "Распродажа - скидка до 40%",
          uz: "Xohlab sotuvlar - 40% gacha chegirma",
        },
        description: {
          en: "Final sale on previous season items. Stock is limited, shop now!",
          ru: "Финальная распродажа предметов предыдущего сезона. Запасы ограничены, покупайте сейчас!",
          uz: "Oldingi fasl narsalari bo'yicha yakuniy sotuvlar. Soni cheklangan, hozir sotib oling!",
        },
        percentage: 40,
        productIds: ["8", "9", "10"],
        code: "CLEARANCE",
        isActive: true,
        startDate: new Date(),
        endDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
        order: 4,
      },
      {
        title: {
          en: "Loyalty Member Exclusive",
          ru: "Эксклюзив для членов программы лояльности",
          uz: "Loyal'lik a'zolari uchun eksklyuziv",
        },
        description: {
          en: "VIP members get 30% off on all luxury collection items.",
          ru: "VIP-члены получают скидку 30% на все предметы люкс-коллекции.",
          uz: "VIP a'zolar lux kolleksiyasining barcha narsalari bo'yicha 30% chegirma oladilar.",
        },
        percentage: 30,
        productIds: ["11", "12", "13", "14", "15"],
        code: "VIP30",
        isActive: true,
        startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
        endDate: new Date(Date.now() + 120 * 24 * 60 * 60 * 1000),
        order: 5,
      },
      {
        title: {
          en: "Student & Professional Discount",
          ru: "Скидка для студентов и специалистов",
          uz: "Talaba va mutaxassislarga chegirma",
        },
        description: {
          en: "Show your ID and get 12% off all items. No code needed in-store.",
          ru: "Покажите свой ID и получите 12% скидку на все предметы. Код не требуется в магазине.",
          uz: "Shaxsingizni ko'rsating va barcha narsalarda 12% chegirma oling. Magazinda kod kerak emas.",
        },
        percentage: 12,
        productIds: [],
        code: "STUDENT12",
        isActive: true,
        startDate: new Date(Date.now() - 180 * 24 * 60 * 60 * 1000),
        endDate: new Date(Date.now() + 360 * 24 * 60 * 60 * 1000),
        order: 6,
      },
    ];

    const createdDiscounts = await Discount.insertMany(discounts);
    console.log(`✅ Seeded ${createdDiscounts.length} discounts`);

    console.log("\n📊 Content Seeding Complete!");
    console.log(`   News Items: ${createdNews.length}`);
    console.log(`   Discounts: ${createdDiscounts.length}`);

    await disconnectDB();
    process.exit(0);
  } catch (error) {
    console.error("❌ Seeding failed:", error.message);
    await disconnectDB();
    process.exit(1);
  }
};

seedContent();
