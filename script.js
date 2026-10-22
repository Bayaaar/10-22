(() => {
    "use strict";

    /* =====================================================
       DOM туслах функцууд
       ===================================================== */
    const $ = (selector, parent = document) => parent.querySelector(selector);
    const $$ = (selector, parent = document) => [...parent.querySelectorAll(selector)];

    /* =====================================================
       Бүтээгдэхүүний зураг
       Доорх Unsplash холбоосыг HTTP шалгалтаар 200 OK гэж баталсан.
       ===================================================== */
    const unsplash = (id) => `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=800&q=80`;

    const IMG = {
        bear: unsplash("1559454403-b8fb88521f11"),
        train: unsplash("1596461404969-9ae70f2830c1"),
        legoPile: unsplash("1587654780291-39c9404d746b"),
        legoBlue: unsplash("1560961911-ba7ef651a56c"),
        mario: unsplash("1595429035839-c99c298ffdde"),
        marioTrio: unsplash("1566576912321-d58ddd7a6088"),
        rings: unsplash("1618842676088-c4d48a6a7c9d"),
        walle: unsplash("1589254065878-42c9da997008"),
        robot: unsplash("1485827404703-89b55fcc595e"),
        asimo: unsplash("1535378917042-10a22c95931a"),
        car: unsplash("1594736797933-d0501ba2fe65"),
        brushesMacro: unsplash("1513364776144-60967b0f800f"),
        brushesPile: unsplash("1460661419201-fd4cecdf8a8b"),
        abcBlocks: unsplash("1503676260728-1c00da094a0b"),
        paint: unsplash("1541961017774-22349e4a1262"),
        paintKid: unsplash("1503454537195-1dcabb73ffb9"),
        hoop: unsplash("1546519638-68e109498ffc"),
        bball: unsplash("1519861531473-9200262188bf"),
        soccer: unsplash("1575361204480-aadea25e6e68"),
        skate: unsplash("1520045892732-304bc3ac5d8e"),
        gift: unsplash("1549465220-1a8b9238cd48"),
        kids: unsplash("1488521787991-ed7bbaae773c")
    };

    /* =====================================================
       Галерей (демо зургууд — шалгагдсан холбоосууд)
       ===================================================== */
    const galleryItems = [
        { title: "Тоглоомын ертөнц", image: `${IMG.train}`.replace("w=800", "w=1200"), emoji: "🧸" },
        { title: "Бүтээх хүч", image: `${IMG.legoPile}`.replace("w=800", "w=1000"), emoji: "🧩" },
        { title: "Зөөлөн найзууд", image: `${IMG.bear}`.replace("w=800", "w=1000"), emoji: "🧸" },
        { title: "Хөгжүүлэх мөч", image: `${IMG.soccer}`.replace("w=800", "w=1000"), emoji: "⚽" },
        { title: "Баатрын дүр", image: `${IMG.mario}`.replace("w=800", "w=1000"), emoji: "🎎" },
        { title: "Төрсөн өдрийн баяр", image: "https://images.unsplash.com/photo-1464349095431-e9a21285b5f3?auto=format&fit=crop&w=1000&q=80", emoji: "🎂" },
        { title: "Бэлэг авах мөч", image: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=1000&q=80", emoji: "🎁" },
        { title: "Гэр бүлийн тоглолт", image: "https://images.unsplash.com/photo-1516627145497-ae6968895b74?auto=format&fit=crop&w=1200&q=80", emoji: "🎈" },
        { title: "Баярын ширээ", image: "https://images.unsplash.com/photo-1608889175123-8ee362201f81?auto=format&fit=crop&w=1200&q=80", emoji: "🎉" }
    ];

    /* =====================================================
       localStorage түлхүүрүүд (frontend демо хадгалалт)
       ===================================================== */
    const storageKeys = {
        cart: "happy-toy-cart",
        wishlist: "happy-toy-wishlist",
        saleEnd: "happy-toy-sale-end",
        stock: "happy-toy-stock",
        users: "happy-toy-users",
        session: "happy-toy-session",
        orders: "happy-toy-orders",
        admins: "happy-toy-admins",
        adminSession: "happy-toy-admin-session",
        adminProducts: "happy-toy-admin-products",
        adminDeleted: "happy-toy-admin-deleted",
        adminOverrides: "happy-toy-admin-overrides",
        requests: "happy-toy-requests"
    };

    /* Хайлтын түүх (зөвхөн энэ төхөөрөмжийн нэргүй демо статистик) */
    storageKeys.searchHistory = "happy-toy-search-history";

    /* =====================================================
       Идэвхтэй төлөв
       ===================================================== */
    const state = {
        cart: readArrayStorage(storageKeys.cart),
        wishlist: readArrayStorage(storageKeys.wishlist),
        stockOverride: readObjectStorage(storageKeys.stock),
        users: readUsersStorage(storageKeys.users),
        session: readStorage(storageKeys.session, null),
        orders: readArrayStorage(storageKeys.orders),
        searchHistory: readArrayStorage(storageKeys.searchHistory),
        admins: readArrayStorage(storageKeys.admins),
        adminSession: readStorage(storageKeys.adminSession, null),
        adminProducts: readArrayStorage(storageKeys.adminProducts),
        adminDeleted: readObjectStorage(storageKeys.adminDeleted),
        adminOverrides: readObjectStorage(storageKeys.adminOverrides),
        requests: readArrayStorage(storageKeys.requests),
        adminView: "dashboard",
        adminProductSearch: "",
        adminProductCategory: "all",
        adminEditingId: null,
        adminUserSearch: "",
        adminUserEditingId: null,
        adminOrderOpenId: null,
        adminRequestOpenId: null,
        category: "all",
        query: "",
        sort: "featured",
        saleOnly: false,
        inStock: false,
        age: "",
        minPrice: "",
        maxPrice: "",
        slide: 0,
        accountTab: "login",
        userRole: null,
        ordersOpen: false,
        profileEditing: false,
        profileEditingAddress: null,
        addressFormVisible: false,
        pwFormVisible: false,
        checkoutDelivery: "delivery",
        checkoutPayment: "card"
    };

    let elements = {};
    let slideTimer = null;
    let toastTimer = null;
    let countdownTimer = null;
    let touchStartX = 0;

    /* =====================================================
       Аюулгүй унших/бичих
       ===================================================== */
    function readStorage(key, fallback) {
        try {
            const value = localStorage.getItem(key);
            return value ? JSON.parse(value) : fallback;
        } catch (error) {
            return fallback;
        }
    }

    function readArrayStorage(key) {
        const value = readStorage(key, []);
        return Array.isArray(value) ? value : [];
    }

    function readObjectStorage(key) {
        const value = readStorage(key, null);
        return value && typeof value === "object" && !Array.isArray(value) ? value : {};
    }

    function readUsersStorage(key) {
        const value = readStorage(key, []);
        return Array.isArray(value) ? value : [];
    }

    function writeStorage(key, value) {
        try {
            localStorage.setItem(key, JSON.stringify(value));
        } catch (error) {
            // localStorage идэвхгүй байвал энэ хуудасны хугацаанд л ажиллана.
        }
    }

    /* =====================================================
       Үнийн формат ба туслах
       ===================================================== */
    function formatPrice(value) {
        return `${Number(value).toLocaleString("en-US")}₮`;
    }

    function escapeHtml(value) {
        return String(value)
            .replaceAll("&", "&amp;")
            .replaceAll("<", "&lt;")
            .replaceAll(">", "&gt;")
            .replaceAll('"', "&quot;")
            .replaceAll("'", "&#039;");
    }

    function getProduct(id) {
        return allProducts().find((product) => product.id === id);
    }

    function discountPercent(product) {
        if (!product.oldPrice || product.oldPrice <= product.price) return 0;
        return Math.round((1 - product.price / product.oldPrice) * 100);
    }

    /* =====================================================
       100 бүтээгдэхүүн (демо өгөгдөл)
       Талбарууд: id, name, category, price, oldPrice (сонголттой;
       үргэлж price-аас их байна), rating, reviews, badge
       (сонголттой), stock (0 бол дууссан), age, size, material,
       emoji, image, description
       ===================================================== */
    const products = [
        /* ---------- Чихмэл (16) ---------- */
        { id: "soft-bear-classic", name: "Баавгайн чихмэл тоглоом", category: "soft", price: 35000, oldPrice: 45000, rating: 5, reviews: 128, stock: 24, age: "3–6 нас", size: "32 см", material: "Хөвөн бүрдэл, зөөлөн арьс", emoji: "🧸", image: IMG.bear, description: "Маш зөөлөн, хөөрхөн баавгай — хүүхдийн хамгийн дуртай тоглоомын найз." },
        { id: "soft-bear-big", name: "Баавгайн чихмэл (том)", category: "soft", price: 55000, oldPrice: 65000, rating: 5, reviews: 89, stock: 14, age: "3–7 нас", size: "45 см", material: "Хөвөн бүрдэл, тэрлэн арьс", emoji: "🧸", image: IMG.bear, description: "Том хэмжээний баавгай — орон дээр тулталж унтаж чадна." },
        { id: "soft-bear-mini", name: "Баавгайн чихмэл (жижиг)", category: "soft", price: 25000, rating: 5, reviews: 67, stock: 40, age: "2–5 нас", size: "20 см", material: "Хөвөн бүрдэл", emoji: "🧸", image: IMG.bear, description: "Жижиг, дэгжин баавгай — бэлэг болон аялалдаа авч явахад тохиромжтой." },
        { id: "soft-rabbit", name: "Туулайн чихмэл", category: "soft", price: 30000, oldPrice: 40000, rating: 5, reviews: 183, stock: 18, age: "3–6 нас", size: "30 см", material: "Хөвөн бүрдэл, тэрлэн арьс", emoji: "🐰", image: IMG.bear, description: "Урт чихтэй, маш зөөлөн туулай — хүүхдийг тайвшруулах зөөлөн найз." },
        { id: "soft-panda", name: "Пандын чихмэл", category: "soft", price: 38000, oldPrice: 44000, rating: 5, reviews: 96, stock: 22, age: "4–8 нас", size: "28 см", material: "Хөвөн бүрдэл", emoji: "🐼", image: IMG.bear, description: "Хар цагаан өнгийн хөөрхөн панда — өрөөний сайхан дурсамж." },
        { id: "soft-cat", name: "Муурийн чихмэл", category: "soft", price: 27000, rating: 4, reviews: 54, stock: 31, age: "2–6 нас", size: "26 см", material: "Хөвөн бүрдэл", emoji: "🐱", image: IMG.bear, description: "Зөөлөн муурийн чихмэл — бага насны хүүхдийн эхний найз." },
        { id: "soft-dog", name: "Нохойн чихмэл", category: "soft", price: 26000, oldPrice: 32000, rating: 5, reviews: 71, stock: 19, age: "3–7 нас", size: "27 см", material: "Хөвөн бүрдэл, аюулгүй нийлэг", emoji: "🐶", image: IMG.bear, description: "Хөөрхөн нохойн чихмэл — аюулгүй материалтай, уян хатан найз." },
        { id: "soft-frog", name: "Мэлхийн чихмэл", category: "soft", price: 22000, rating: 4, reviews: 40, stock: 27, age: "3–7 нас", size: "24 см", material: "Хөвөн бүрдэл", emoji: "🐸", image: IMG.bear, description: "Ногоон өнгийн зөөлөн мэлхий — инээдтэй хэлбэртэй, аюулгүй." },
        { id: "soft-lion", name: "Арслангийн чихмэл", category: "soft", price: 42000, rating: 5, reviews: 55, stock: 16, age: "4–8 нас", size: "31 см", material: "Хөвөн бүрдэл, тэрлэн арьс", emoji: "🦁", image: IMG.bear, description: "Сарсан оройтой хөөрхөн арслан — бахархалтай захиалгаар олддог тоглоом." },
        { id: "soft-deer", name: "Зээрийн чихмэл", category: "soft", price: 34000, rating: 4, reviews: 42, stock: 33, age: "3–7 нас", size: "29 см", material: "Хөвөн бүрдэл", emoji: "🦌", image: IMG.bear, description: "Амархан харах зээрийн чихмэл — орон дээр тавтай дурсгагч найз." },
        { id: "soft-gift", name: "Бэлгийн чихмэл багц (2 тоглоом)", category: "soft", price: 58000, oldPrice: 69000, rating: 5, reviews: 77, stock: 12, age: "3–8 нас", size: "Хайрцаг 30×22 см", material: "Хөвөн бүрдэл, гоёмсог савлагаа", emoji: "🎁", image: IMG.gift, description: "Бэлгийн савлагаатай багц — 2 ширхэг хөвөн бүрдэл тоглоомтой." },
        { id: "soft-pillow", name: "Баавгайн дэр (зөөлөн)", category: "soft", price: 23000, rating: 4, reviews: 35, stock: 36, age: "2–6 нас", size: "23 см", material: "Хөвөн бүрдэл", emoji: "🧸", image: IMG.bear, description: "Орон дээр тулталж унтах зөөлөн баавгайн дэр — амар хөөрхөн ерөөс." },
        { id: "soft-mouse", name: "Хулганы чихмэл", category: "soft", price: 17000, rating: 4, reviews: 28, stock: 44, age: "2–5 нас", size: "14 см", material: "Хөвөн бүрдэл", emoji: "🐭", image: IMG.bear, description: "Жижиг, зөөлөн хулганы чихмэл — бага хэмжээний эхний найз." },
        { id: "soft-dragon", name: "Луугийн чихмэл", category: "soft", price: 36000, rating: 5, reviews: 61, stock: 21, age: "4–9 нас", size: "34 см", material: "Хөвөн бүрдэл", emoji: "🐲", image: IMG.bear, description: "Хоймор могойн хөөрхөн луу — адал явдалтай тоглох дуртай найз." },
        { id: "soft-snowman", name: "Цасан хүн чихмэл", category: "soft", price: 19000, rating: 4, reviews: 24, stock: 38, age: "2–6 нас", size: "22 см", material: "Хөвөн бүрдэл", emoji: "⛄", image: IMG.bear, description: "Амархан инээдтэй цасан хүн — өвлийн сайхан бэлэг." },
        { id: "soft-elephant", name: "Зааны чихмэл тоглоом", category: "soft", price: 28000, rating: 4, reviews: 37, stock: 27, age: "3–6 нас", size: "25 см", material: "Хөвөн бүрдэл", emoji: "🐘", image: IMG.bear, description: "Том чихтэй, зөөлөн заан — хүүхдийн эхний найз." },

        /* ---------- Машин (16) ---------- */
        { id: "car-rc", name: "Удирдлагатай RC машин", category: "car", price: 55000, rating: 5, reviews: 96, stock: 30, age: "5–9 нас", size: "1:24 хэмжээ", material: "Хуванцар, металл", emoji: "🚗", image: IMG.car, description: "Удирдлагатай RC машин нь 2.4G удирдлагатай, хурдан хөдөлгөөнт. Хөнгөн, авч явахад амар." },
        { id: "car-rc-sport", name: "Удирдлагатай спорт машин", category: "car", price: 75000, rating: 5, reviews: 64, stock: 4, age: "6–10 нас", size: "1:18 хэмжээ", material: "Хуванцар, металл", emoji: "🏎️", image: IMG.car, description: "Удирдлагатай спорт машин — Супер спорт дизайнтай, түргэн уралдаант. Идэвхтэй тоглолтод зориулсан сонголт." },
        { id: "car-rc-jeep", name: "Удирдлагатай жийп", category: "car", price: 85000, oldPrice: 95000, rating: 5, reviews: 43, stock: 18, age: "6–10 нас", size: "1:16 хэмжээ", material: "Хуванцар, металл", emoji: "🚙", image: IMG.car, description: "Удирдлагатай жийп — Том дугуйтай, барзгар зам өнгөрнө. Аюулгүй материал, бат бэх угсралттай." },
        { id: "car-rc-tractor", name: "Удирдлагатай трактор", category: "car", price: 62000, rating: 4, reviews: 31, stock: 25, age: "5–9 нас", size: "1:20 хэмжээ", material: "Хуванцар", emoji: "🚜", image: IMG.car, description: "Удирдлагатай трактор: Ажлын фермерийн хэлбэртэй. Хүүхдийн дуртай хувилбар." },
        { id: "car-train", name: "Модон галт тэрэг", category: "car", price: 48000, rating: 5, reviews: 210, stock: 22, age: "3–7 нас", size: "28 төмөр хэсэг", material: "Мод, эко барилын будаг", emoji: "🚂", image: IMG.train, description: "Модон галт тэрэг нь Модон рельстэй, аюулгүй материалтай. Хөнгөн, авч явахад амар." },
        { id: "car-fire", name: "Гал сөнөөгч машины тоглоом", category: "car", price: 24000, oldPrice: 30000, rating: 4, reviews: 52, stock: 26, age: "3–7 нас", size: "15 см", material: "Хуванцар", emoji: "🚒", image: IMG.car, description: "Гал сөнөөгч машины тоглоом — Хөдөлгөөнт шат, аюулгүй дугуйтай. Идэвхтэй тоглолтод зориулсан сонголт." },
        { id: "car-bus", name: "Автобусны тоглоом", category: "car", price: 19000, rating: 4, reviews: 38, stock: 41, age: "3–8 нас", size: "16 см", material: "Хуванцар", emoji: "🚌", image: IMG.car, description: "Автобусны тоглоом — Нээгдэх хаалгатай. Аюулгүй материал, бат бэх угсралттай." },
        { id: "car-set6", name: "Автомашины эвлүүлэг (6 ширхэг)", category: "car", price: 32000, rating: 5, reviews: 84, stock: 34, age: "3–8 нас", size: "6×7 см", material: "Металл, хуванцар", emoji: "🚗", image: IMG.car, description: "Автомашины эвлүүлэг (6 ширхэг): 6 төрлийн хотын машин нэг багцад. Хүүхдийн дуртай хувилбар." },
        { id: "car-track", name: "Автомашины уралдааны зам", category: "car", price: 45000, oldPrice: 55000, rating: 5, reviews: 71, stock: 15, age: "4–10 нас", size: "3.6 м сүлжээ", material: "Хуванцар", emoji: "🏁", image: IMG.car, description: "Автомашины уралдааны зам нь Уралдааны 2 зам, хурдан машинтай. Хөнгөн, авч явахад амар." },
        { id: "car-police", name: "Цагдаагийн машины тоглоом", category: "car", price: 18000, rating: 4, reviews: 47, stock: 29, age: "3–8 нас", size: "14 см", material: "Хуванцар", emoji: "🚓", image: IMG.car, description: "Цагдаагийн машины тоглоом — Чичилгээтэй чимэглэлтэй. Идэвхтэй тоглолтод зориулсан сонголт." },
        { id: "car-ambulance", name: "Түргэн тусламжийн тоглоом", category: "car", price: 18000, rating: 4, reviews: 33, stock: 27, age: "3–8 нас", size: "14 см", material: "Хуванцар", emoji: "🚑", image: IMG.car, description: "Түргэн тусламжийн тоглоом — Байрны ажиллагаатай хаалгатай. Аюулгүй материал, бат бэх угсралттай." },
        { id: "car-monster", name: "Том дугуйтай машин (монстр трак)", category: "car", price: 36000, rating: 5, reviews: 58, stock: 21, age: "5–10 нас", size: "18 см", material: "Хуванцар, металл", emoji: "🛻", image: IMG.car, description: "Том дугуйтай машин (монстр трак): Өргөсөн дугуйтай, босогч давж гарна. Хүүхдийн дуртай хувилбар." },
        { id: "car-mini3", name: "Жижиг машин эвлүүлэг (3 ширхэг)", category: "car", price: 14000, rating: 4, reviews: 25, stock: 48, age: "2–6 нас", size: "3×6 см", material: "Хуванцар", emoji: "🚗", image: IMG.car, description: "Жижиг машин эвлүүлэг (3 ширхэг) нь Бага насны хүүхдэд зориулсан. Хөнгөн, авч явахад амар." },
        { id: "car-garage", name: "Машины гаражийн тоглоом", category: "car", price: 29000, oldPrice: 35000, rating: 4, reviews: 39, stock: 23, age: "3–8 нас", size: "34×20 см", material: "Хуванцар", emoji: "🏢", image: IMG.car, description: "Машины гаражийн тоглоом — Автомашины давхар гараж, лифттэй. Идэвхтэй тоглолтод зориулсан сонголт." },
        { id: "car-cement", name: "Цемент зөөгч тоглоом", category: "car", price: 21000, rating: 4, reviews: 29, stock: 32, age: "3–8 нас", size: "16 см", material: "Хуванцар", emoji: "🚛", image: IMG.car, description: "Цемент зөөгч тоглоом — Эргэдэг барабантай, цементээ зөөнө. Аюулгүй материал, бат бэх угсралттай." },
        { id: "car-taxi", name: "Таксийн машины тоглоом", category: "car", price: 17000, rating: 4, reviews: 21, stock: 40, age: "3–8 нас", size: "13 см", material: "Хуванцар", emoji: "🚕", image: IMG.car, description: "Таксийн машины тоглоом: Шар өнгийн сонгодог загвар. Хүүхдийн дуртай хувилбар." },

        /* ---------- Угсардаг (18) ---------- */
        { id: "lego-classic", name: "Сонгодог угсруулагч багц", category: "lego", price: 42000, rating: 5, reviews: 143, stock: 26, age: "4–10 нас", size: "480 хэсэг", material: "Хуванцар", emoji: "🧩", image: IMG.legoPile, description: "Сонгодог угсруулагч багц нь 480 хэсэг, чөлөөт бүтээмж. Угсрахад хялбар." },
        { id: "lego-duplo", name: "ДЮПЛО угсруулагч (том хэсэг)", category: "lego", price: 34000, oldPrice: 41000, rating: 5, reviews: 88, stock: 21, age: "2–5 нас", size: "60 хэсэг", material: "Аюулгүй хуванцар", emoji: "🧩", image: IMG.rings, description: "ДЮПЛО угсруулагч (том хэсэг) — Том хэсэгтэй, бага насанд. Олон жил тоглохуйц чанартай." },
        { id: "lego-city", name: "Хотын полиц станц", category: "lego", price: 68000, rating: 5, reviews: 65, stock: 12, age: "6–12 нас", size: "700 хэсэг", material: "Хуванцар", emoji: "🧩", image: IMG.legoBlue, description: "Хотын полиц станц — Станц, автомашинаар бүрдсэн. Аюулгүй материал, бат бэх хэсгүүд." },
        { id: "lego-fire", name: "Гал сөнөөгчийн станц", category: "lego", price: 62000, oldPrice: 74000, rating: 5, reviews: 54, stock: 14, age: "6–12 нас", size: "640 хэсэг", material: "Хуванцар", emoji: "🧩", image: IMG.legoPile, description: "Гал сөнөөгчийн станц: Гал машин, авто шаттай. Хүүхдийн дуртай хувилбар." },
        { id: "lego-technic", name: "Техник уралдааны машин", category: "lego", price: 78000, rating: 4, reviews: 41, stock: 3, age: "8–14 нас", size: "512 хэсэг", material: "Хуванцар, металл дэл", emoji: "🧩", image: IMG.car, description: "Техник уралдааны машин нь Ажиллагаатай хөдөлгүүртэй. Угсрахад хялбар." },
        { id: "lego-space", name: "Сансрын судлалын станц", category: "lego", price: 74000, rating: 5, reviews: 58, stock: 13, age: "7–12 нас", size: "520 хэсэг", material: "Хуванцар", emoji: "🚀", image: IMG.robot, description: "Сансрын судлалын станц — Ракет, станцтой бүрдэл. Олон жил тоглохуйц чанартай." },
        { id: "lego-animals", name: "Амьтны ертөнцийн багц", category: "lego", price: 24000, rating: 4, reviews: 49, stock: 30, age: "3–8 нас", size: "150 хэсэг", material: "Хуванцар", emoji: "🧩", image: IMG.legoPile, description: "Амьтны ертөнцийн багц — 8 амьтны загвар. Аюулгүй материал, бат бэх хэсгүүд." },
        { id: "lego-farm", name: "Фермын багц", category: "lego", price: 36000, oldPrice: 43000, rating: 4, reviews: 36, stock: 18, age: "4–9 нас", size: "240 хэсэг", material: "Хуванцар", emoji: "🧩", image: IMG.rings, description: "Фермын багц: Фермер, амьтадтай. Хүүхдийн дуртай хувилбар." },
        { id: "lego-pirate", name: "Далайн дээрэмчдийн хөлөг", category: "lego", price: 56000, rating: 5, reviews: 44, stock: 11, age: "7–12 нас", size: "430 хэсэг", material: "Хуванцар", emoji: "⚓", image: IMG.legoBlue, description: "Далайн дээрэмчдийн хөлөг нь Хөлөг онгоц, ахмад дүртэй. Угсрахад хялбар." },
        { id: "lego-dinosaur", name: "Динозаврын ертөнц", category: "lego", price: 48000, rating: 5, reviews: 92, stock: 16, age: "5–10 нас", size: "380 хэсэг", material: "Хуванцар", emoji: "🦖", image: IMG.legoPile, description: "Динозаврын ертөнц — Т-Рекс загвартай. Олон жил тоглохуйц чанартай." },
        { id: "lego-castle", name: "Гүнжийн цамхаг", category: "lego", price: 44000, oldPrice: 52000, rating: 4, reviews: 61, stock: 15, age: "5–10 нас", size: "340 хэсэг", material: "Хуванцар", emoji: "🏰", image: IMG.rings, description: "Гүнжийн цамхаг — Цамхаг, гүнжийн өрөөтэй. Аюулгүй материал, бат бэх хэсгүүд." },
        { id: "lego-robot", name: "Роботын эвлүүлэг", category: "lego", price: 71000, rating: 5, reviews: 73, stock: 10, age: "8–13 нас", size: "480 хэсэг", material: "Хуванцар, электрон", emoji: "🤖", image: IMG.robot, description: "Роботын эвлүүлэг: Хөдөлгөөнт робот бүтээнэ. Хүүхдийн дуртай хувилбар." },
        { id: "lego-train", name: "Угсардаг галт тэрэг", category: "lego", price: 52000, rating: 5, reviews: 57, stock: 17, age: "5–10 нас", size: "320 хэсэг", material: "Хуванцар", emoji: "🚂", image: IMG.legoPile, description: "Угсардаг галт тэрэг нь Рельс, моторт тэрэгтэй. Угсрахад хялбар." },
        { id: "lego-street", name: "Хотын гудамжны багц", category: "lego", price: 40000, rating: 4, reviews: 28, stock: 19, age: "6–11 нас", size: "260 хэсэг", material: "Хуванцар", emoji: "🧩", image: IMG.legoBlue, description: "Хотын гудамжны багц — Дэлгүүр, тэрэг, хүмүүстэй. Олон жил тоглохуйц чанартай." },
        { id: "lego-racecar", name: "Уралдааны машин (угсардаг)", category: "lego", price: 29000, rating: 4, reviews: 81, stock: 28, age: "5–9 нас", size: "180 хэсэг", material: "Хуванцар", emoji: "🏎️", image: IMG.car, description: "Уралдааны машин (угсардаг) — 3 хувилбар бүтээж болно. Аюулгүй материал, бат бэх хэсгүүд." },
        { id: "lego-house", name: "Анхны байшин багц", category: "lego", price: 27000, oldPrice: 33000, rating: 4, reviews: 39, stock: 24, age: "4–9 нас", size: "170 хэсэг", material: "Хуванцар", emoji: "🧩", image: IMG.legoPile, description: "Анхны байшин багц: Тавилгатай өрөө бүхий. Хүүхдийн дуртай хувилбар." },
        { id: "lego-multi", name: "Олон загвартай багц (12 в 1)", category: "lego", price: 22000, rating: 4, reviews: 46, stock: 32, age: "4–10 нас", size: "120 хэсэг", material: "Хуванцар", emoji: "🧩", image: IMG.rings, description: "Олон загвартай багц (12 в 1) нь 12 төрлийн загвар барна. Угсрахад хялбар." },
        { id: "lego-arch", name: "Их угсралтын иж бүрдэл", category: "lego", price: 98000, oldPrice: 115000, rating: 5, reviews: 120, stock: 0, age: "6–12 нас", size: "1100 хэсэг", material: "Хуванцар", emoji: "🧩", image: IMG.legoPile, description: "Их угсралтын иж бүрдэл — Их бүрдэл, 40 загвартай. Олон жил тоглохуйц чанартай." },

        /* ---------- Хүүхэлдэй (16) ---------- */
        { id: "doll-hair", name: "Үстэй хүүхэлдэй (30 см)", category: "doll", price: 32000, oldPrice: 38000, rating: 5, reviews: 97, stock: 15, age: "4–9 нас", size: "30 см", material: "Хөв, хуванцар", emoji: "👱", image: IMG.mario, description: "Үстэй хүүхэлдэй (30 см) — Үсийг нь засаж болно. Бэлэг болох сайн сонголт." },
        { id: "doll-princess", name: "Гүнжийн хүүхэлдэй", category: "doll", price: 28000, rating: 5, reviews: 84, stock: 20, age: "3–8 нас", size: "28 см", material: "Хуванцар, даавуу", emoji: "👗", image: IMG.gift, description: "Гүнжийн хүүхэлдэй — Гүнжийн хувцастай. Зөөлөн, хүүхдэд аюулгүй." },
        { id: "doll-princess-red", name: "Улаан гүнж хүүхэлдэй", category: "doll", price: 29000, rating: 4, reviews: 52, stock: 4, age: "3–8 нас", size: "28 см", material: "Хуванцар, даавуу", emoji: "👗", image: IMG.gift, description: "Улаан гүнж хүүхэлдэй: Улаан маягийн хувцастай. Хүүхдийн дуртай тоглолт." },
        { id: "doll-baby", name: "Нярай хүүхэлдэй", category: "doll", price: 26000, rating: 5, reviews: 66, stock: 23, age: "2–6 нас", size: "24 см", material: "Хөв, зөөлөн хуванцар", emoji: "👶", image: IMG.mario, description: "Нярай хүүхэлдэй нь Чимээ гаргадаг. Бага насны дуртай сонголт." },
        { id: "doll-twin", name: "Хос хүүхэлдэй", category: "doll", price: 38000, oldPrice: 46000, rating: 5, reviews: 43, stock: 12, age: "3–8 нас", size: "26×2 см", material: "Хуванцар, хөв", emoji: "👭", image: IMG.marioTrio, description: "Хос хүүхэлдэй — 2 хүүхэлдэй, 4 хувцастай. Бэлэг болох сайн сонголт." },
        { id: "doll-house", name: "Хүүхэлдэйний байшин", category: "doll", price: 89000, rating: 5, reviews: 110, stock: 2, age: "3–10 нас", size: "62×34 см", material: "Мод, хуванцар", emoji: "🏠", image: IMG.marioTrio, description: "Хүүхэлдэйний байшин — Хоёр давхар, тавилгатай. Зөөлөн, хүүхдэд аюулгүй." },
        { id: "doll-furniture", name: "Тавилгын багц", category: "doll", price: 34000, rating: 4, reviews: 31, stock: 26, age: "3–9 нас", size: "24 хэсэг", material: "Мод", emoji: "🛋️", image: IMG.marioTrio, description: "Тавилгын багц: 24 ширхэг тавилга. Хүүхдийн дуртай тоглолт." },
        { id: "doll-bed", name: "Хүүхэлдэйний орон", category: "doll", price: 22000, rating: 4, reviews: 27, stock: 0, age: "2–7 нас", size: "36×22 см", material: "Мод, даавуу", emoji: "🛏️", image: IMG.marioTrio, description: "Хүүхэлдэйний орон нь Хөнжил, дэр бүхий. Бага насны дуртай сонголт." },
        { id: "doll-outfit", name: "Хүүхэлдэйний хувцас (6 маяг)", category: "doll", price: 18000, rating: 4, reviews: 38, stock: 33, age: "3–9 нас", size: "6 маяг", material: "Даавуу, хөв", emoji: "👚", image: IMG.gift, description: "Хүүхэлдэйний хувцас (6 маяг) — Гутал бүхий. Бэлэг болох сайн сонголт." },
        { id: "doll-tea", name: "Цайны багц", category: "doll", price: 19000, oldPrice: 24000, rating: 4, reviews: 57, stock: 29, age: "3–8 нас", size: "17 хэсэг", material: "Хуванцар", emoji: "🍵", image: IMG.gift, description: "Цайны багц — Аяга, таваг бүрэн. Зөөлөн, хүүхдэд аюулгүй." },
        { id: "doll-kitchen", name: "Гал тогооны багц", category: "doll", price: 45000, oldPrice: 53000, rating: 5, reviews: 74, stock: 13, age: "3–9 нас", size: "60×28 см", material: "Хуванцар", emoji: "🍳", image: IMG.marioTrio, description: "Гал тогооны багц: Аяга таваг, ногоо бүхий. Хүүхдийн дуртай тоглолт." },
        { id: "doll-doctor", name: "Эмчийн багц", category: "doll", price: 21000, rating: 4, reviews: 46, stock: 31, age: "4–9 нас", size: "12 хэсэг", material: "Аюулгүй хуванцар", emoji: "🩺", image: IMG.gift, description: "Эмчийн багц нь Стетоскоптой. Бага насны дуртай сонголт." },
        { id: "doll-bath", name: "Усанд оршдог хүүхэлдэй", category: "doll", price: 14000, rating: 4, reviews: 35, stock: 37, age: "1–5 нас", size: "18 см", material: "Аюулгүй хуванцар", emoji: "🛁", image: IMG.mario, description: "Усанд оршдог хүүхэлдэй — Усанд тоглох аюулгүй. Бэлэг болох сайн сонголт." },
        { id: "doll-music", name: "Дуутай хүүхэлдэй", category: "doll", price: 24000, oldPrice: 29000, rating: 4, reviews: 29, stock: 22, age: "2–6 нас", size: "24 см", material: "Хөв, электрон", emoji: "🎀", image: IMG.mario, description: "Дуутай хүүхэлдэй — Дуу хөгжим гаргадаг. Зөөлөн, хүүхдэд аюулгүй." },
        { id: "doll-keychain", name: "Гарын жижиг хүүхэлдэй", category: "doll", price: 6500, rating: 4, reviews: 18, stock: 42, age: "3–10 нас", size: "8 см", material: "Хөв", emoji: "🎎", image: IMG.gift, description: "Гарын жижиг хүүхэлдэй: Түлхүүр дээр өлгөнө. Хүүхдийн дуртай тоглолт." },
        { id: "doll-wedding", name: "Бэлгийн хүүхэлдэй (баглаатай)", category: "doll", price: 24000, oldPrice: 30000, rating: 5, reviews: 49, stock: 17, age: "4–10 нас", size: "32 см", material: "Хөв, даавуу", emoji: "💐", image: IMG.gift, description: "Бэлгийн хүүхэлдэй (баглаатай) нь Бэлгийн савлагаатай. Бага насны дуртай сонголт." },

        /* ---------- Спорт (18) ---------- */
        { id: "sport-ball", name: "Хөл бөмбөг (№5)", category: "sport", price: 16000, rating: 4, reviews: 88, stock: 45, age: "6–14 нас", size: "Ø 22 см", material: "PU арьс", emoji: "⚽", image: IMG.bball, description: "Хөл бөмбөг (№5): №5 хэмжээ, зөөлөн. Идэвхтэй тоглолтын хэрэгсэл." },
        { id: "sport-basket", name: "Сагсан бөмбөг (№7)", category: "sport", price: 22000, rating: 4, reviews: 64, stock: 30, age: "8–14 нас", size: "Ø 24 см", material: "PU арьс", emoji: "🏀", image: IMG.bball, description: "Сагсан бөмбөг (№7) нь №7 хэмжээ. Хөдөлгөөнд сайн." },
        { id: "sport-volley", name: "Волейболын бөмбөг", category: "sport", price: 18000, rating: 4, reviews: 41, stock: 25, age: "10–16 нас", size: "Ø 21 см", material: "PU арьс", emoji: "🏐", image: IMG.bball, description: "Волейболын бөмбөг — Хөнгөн, зөөлөн. Багийн тоглолтод тохирно." },
        { id: "sport-hoop", name: "Сагсны тоглоомын багц", category: "sport", price: 34000, oldPrice: 41000, rating: 5, reviews: 76, stock: 0, age: "3–10 нас", size: "110 см өндөр", material: "Хуванцар, төмөр", emoji: "🏀", image: IMG.hoop, description: "Сагсны тоглоомын багц — Өндөр нь тохируулдаг. Спортын хэрэгсэл бат бэх." },
        { id: "sport-badminton", name: "Бадминтоны багц", category: "sport", price: 19000, rating: 4, reviews: 52, stock: 34, age: "6–12 нас", size: "62 см", material: "Металл, хуванцар", emoji: "🏸", image: IMG.soccer, description: "Бадминтоны багц: 2 бамбар, хайрцагтай. Идэвхтэй тоглолтын хэрэгсэл." },
        { id: "sport-table", name: "Пин-понгийн ширээ", category: "sport", price: 165000, oldPrice: 189000, rating: 5, reviews: 23, stock: 8, age: "6–14 нас", size: "150×70 см", material: "Хуванцар, төмөр хөл", emoji: "🏓", image: IMG.soccer, description: "Пин-понгийн ширээ нь Эвхэгддэг хөлтэй. Хөдөлгөөнд сайн." },
        { id: "sport-tennis", name: "Пин-понгийн багц", category: "sport", price: 12000, rating: 4, reviews: 66, stock: 50, age: "5–12 нас", size: "Бамбар 16 см", material: "Мод, хуванцар", emoji: "🏓", image: IMG.soccer, description: "Пин-понгийн багц — Бамбар, бөмбөгтэй. Багийн тоглолтод тохирно." },
        { id: "sport-bike", name: "Хүүхдийн дугуй (12 инч)", category: "sport", price: 189000, rating: 5, reviews: 34, stock: 12, age: "3–6 нас", size: "12 инч", material: "Ган хүрээ", emoji: "🚲", image: IMG.skate, description: "Хүүхдийн дугуй (12 инч) — Нэмэлт дугуй, тоормостой. Спортын хэрэгсэл бат бэх." },
        { id: "sport-scooter", name: "Хүүхдийн скутер", category: "sport", price: 95000, oldPrice: 110000, rating: 4, reviews: 47, stock: 2, age: "5–10 нас", size: "Тулгуур 60 см", material: "Алюминий, хуванцар", emoji: "🛴", image: IMG.skate, description: "Хүүхдийн скутер: Эвхэгддэг. Идэвхтэй тоглолтын хэрэгсэл." },
        { id: "sport-skate", name: "Скэйтборд", category: "sport", price: 52000, rating: 4, reviews: 29, stock: 5, age: "8–14 нас", size: "61 см", material: "Мод, алюминий", emoji: "🛹", image: IMG.skate, description: "Скэйтборд нь Дугуй эргэлт хурдан. Хөдөлгөөнд сайн." },
        { id: "sport-balance", name: "Баланс дугуй", category: "sport", price: 129000, rating: 5, reviews: 26, stock: 9, age: "2–5 нас", size: "10 инч", material: "Ган хүрээ", emoji: "🚲", image: IMG.skate, description: "Баланс дугуй — Педалгүй, тэнцвэр сургана. Багийн тоглолтод тохирно." },
        { id: "sport-boxing", name: "Боксны бээлий", category: "sport", price: 17000, rating: 4, reviews: 58, stock: 26, age: "5–11 нас", size: "22 см", material: "Хуванцар арьс, хөв дотор", emoji: "🥊", image: IMG.kids, description: "Боксны бээлий — Зөөлөн, аюулгүй. Спортын хэрэгсэл бат бэх." },
        { id: "sport-frisbee", name: "Фризби", category: "sport", price: 6000, rating: 4, reviews: 21, stock: 60, age: "4–12 нас", size: "Ø 22 см", material: "Аюулгүй хуванцар", emoji: "🥏", image: IMG.kids, description: "Фризби: Гадна тоглолтод тохиромжтой. Идэвхтэй тоглолтын хэрэгсэл." },
        { id: "sport-stick", name: "Хула бамбар", category: "sport", price: 17500, rating: 4, reviews: 19, stock: 22, age: "6–12 нас", size: "70 см", material: "Хуванцар, мод", emoji: "🏑", image: IMG.soccer, description: "Хула бамбар нь Бөмбөг бүхий багц. Хөдөлгөөнд сайн." },
        { id: "sport-golf", name: "Гольфын мини тоглоом", category: "sport", price: 14000, rating: 4, reviews: 24, stock: 18, age: "5–11 нас", size: "Хоса 60 см", material: "Хуванцар, металл", emoji: "⛳", image: IMG.kids, description: "Гольфын мини тоглоом — 3 бөмбөг, 2 нүхтэй. Багийн тоглолтод тохирно." },
        { id: "sport-swim", name: "Усанд сэлэгчийн багц", category: "sport", price: 8500, oldPrice: 9900, rating: 4, reviews: 37, stock: 33, age: "4–12 нас", size: "Нэг хэмжээ", material: "Аюулгүй хуванцар", emoji: "🩱", image: IMG.kids, description: "Усанд сэлэгчийн багц — Нүдний шил, бамбайтай. Спортын хэрэгсэл бат бэх." },
        { id: "sport-set", name: "Спортын эхний багц", category: "sport", price: 33000, rating: 4, reviews: 43, stock: 14, age: "5–11 нас", size: "6 хэрэгсэл", material: "Хуванцар", emoji: "🎽", image: IMG.kids, description: "Спортын эхний багц: 6 төрлийн хэрэгсэлтэй. Идэвхтэй тоглолтын хэрэгсэл." },
        { id: "sport-darts", name: "Дартс (магниттэй)", category: "sport", price: 16000, rating: 4, reviews: 31, stock: 20, age: "6–12 нас", size: "Талбай 32 см", material: "Магнит, хуванцар", emoji: "🎯", image: IMG.kids, description: "Дартс (магниттэй) нь Магниттэй, аюулгүй. Хөдөлгөөнд сайн." },

        /* ---------- Хичээлийн хэрэгсэл (19) ---------- */
        { id: "bbrush-water24", name: "Усан будаг (24 өнгө)", category: "bambruush", price: 7500, oldPrice: 9000, rating: 5, reviews: 92, stock: 55, age: "3–10 нас", size: "24 өнгө", material: "Аюулгүй пигмент", emoji: "🎨", image: IMG.paint, description: "Усан будаг (24 өнгө) — Усаар угаардаг. Бүх материал нь аюулгүй." },
        { id: "bbrush-water12", name: "Усан будаг (12 өнгө)", category: "bambruush", price: 4900, rating: 4, reviews: 61, stock: 60, age: "3–8 нас", size: "12 өнгө", material: "Аюулгүй пигмент", emoji: "🎨", image: IMG.paint, description: "Усан будаг (12 өнгө): Эхлэгчид зориулсан. Уран бүтээлд ашигтай." },
        { id: "bbrush-acrylic", name: "Акрил будгийн багц", category: "bambruush", price: 12000, rating: 4, reviews: 35, stock: 24, age: "6–12 нас", size: "12 тун", material: "Акрил пигмент", emoji: "🖌️", image: IMG.paint, description: "Акрил будгийн багц нь Хурдан хатаадаг. Хялбар, сонирхолтой." },
        { id: "bbrush-brush", name: "Худар эвлүүлэг (10 ширхэг)", category: "bambruush", price: 6500, rating: 4, reviews: 48, stock: 42, age: "3–12 нас", size: "Өөр өөр хэмжээ", material: "Синтетик, модон бариултай", emoji: "🖌️", image: IMG.brushesMacro, description: "Худар эвлүүлэг (10 ширхэг) — 10 хэмжээний худар. Бэлэг түгээхэд сайн." },
        { id: "bbrush-canvas", name: "Зураг самбар (канвас 5 ш)", category: "bambruush", price: 8500, rating: 4, reviews: 30, stock: 30, age: "5–12 нас", size: "20×20 см", material: "Даавуун канвас", emoji: "🖼️", image: IMG.brushesPile, description: "Зураг самбар (канвас 5 ш) — Шууд зурж болно. Бүх материал нь аюулгүй." },
        { id: "bbrush-pastel", name: "Тосон пастель (24 өнгө)", category: "bambruush", price: 9900, oldPrice: 11500, rating: 4, reviews: 28, stock: 28, age: "5–12 нас", size: "24 өнгө", material: "Тосон, пигмент", emoji: "🖍️", image: IMG.brushesPile, description: "Тосон пастель (24 өнгө): Гүн, цэвэр өнгөтэй. Уран бүтээлд ашигтай." },
        { id: "bbrush-plasticine", name: "Пластилин (12 өнгө)", category: "bambruush", price: 5500, rating: 5, reviews: 74, stock: 44, age: "2–7 нас", size: "12 өнгө", material: "Аюулгүй материал", emoji: "🎨", image: IMG.brushesMacro, description: "Пластилин (12 өнгө) нь Хэлбэр өөрчлөхөд амар. Хялбар, сонирхолтой." },
        { id: "bbrush-slime", name: "Слайм (гялгар хөөс)", category: "bambruush", price: 7900, oldPrice: 9500, rating: 4, reviews: 66, stock: 25, age: "5–11 нас", size: "250 г", material: "Аюулгүй полимер", emoji: "🎨", image: IMG.paintKid, description: "Слайм (гялгар хөөс) — Сунаж, гялгардаг. Бэлэг түгээхэд сайн." },
        { id: "bbrush-sand", name: "Өнгөт элсний урлалын багц", category: "bambruush", price: 9800, rating: 4, reviews: 51, stock: 27, age: "4–10 нас", size: "8 өнгө", material: "Аюулгүй элс", emoji: "🎨", image: IMG.paintKid, description: "Өнгөт элсний урлалын багц — Хээ дээр цацна. Бүх материал нь аюулгүй." },
        { id: "bbrush-sticker", name: "Стикерын багц", category: "bambruush", price: 3900, rating: 4, reviews: 77, stock: 58, age: "3–10 нас", size: "500 стикер", material: "Хуванцар наалт", emoji: "🌈", image: IMG.brushesMacro, description: "Стикерын багц: Дэвтэр, цонхон дээр наана. Уран бүтээлд ашигтай." },
        { id: "bbrush-marker", name: "Маркерийн багц (12 өнгө)", category: "bambruush", price: 6900, rating: 4, reviews: 43, stock: 38, age: "4–11 нас", size: "12 өнгө", material: "Усан суурьтай", emoji: "🖊️", image: IMG.brushesMacro, description: "Маркерийн багц (12 өнгө) нь Усаар угаардаг, аюулгүй. Хялбар, сонирхолтой." },
        { id: "bbrush-origami", name: "Оригами цаасны багц", category: "bambruush", price: 5200, rating: 4, reviews: 26, stock: 35, age: "5–12 нас", size: "3 хэмжээ", material: "Өнгөт цаас", emoji: "✂️", image: IMG.paintKid, description: "Оригами цаасны багц — Маягийн зураг бүхий. Бэлэг түгээхэд сайн." },
        { id: "bbrush-kinetic", name: "Кинетик элс (1 кг)", category: "bambruush", price: 11500, oldPrice: 13000, rating: 5, reviews: 63, stock: 19, age: "3–10 нас", size: "1 кг", material: "Аюулгүй полимер", emoji: "🎨", image: IMG.paintKid, description: "Кинетик элс (1 кг) — Хэлбэрээ хадгалдаг. Бүх материал нь аюулгүй." },
        { id: "bbrush-frame", name: "Зургийн хүрээ (5 ширхэг)", category: "bambruush", price: 6800, rating: 4, reviews: 22, stock: 21, age: "4–12 нас", size: "18×24 см", material: "Мод, хуванцар", emoji: "🖼️", image: IMG.brushesPile, description: "Зургийн хүрээ (5 ширхэг): Зурсан зургаа хадгална. Уран бүтээлд ашигтай." },
        { id: "bbrush-set", name: "Уран сайхны том багц", category: "bambruush", price: 21000, oldPrice: 25000, rating: 5, reviews: 87, stock: 13, age: "6–12 нас", size: "60 хэсэг", material: "Холимог материал", emoji: "🎨", image: IMG.brushesPile, description: "Уран сайхны том багц нь Будаг, худар, канвастай. Хялбар, сонирхолтой." },
        { id: "bbrush-small", name: "Жижиг урлалын багц", category: "bambruush", price: 4900, rating: 3, reviews: 14, stock: 0, age: "3–8 нас", size: "8 хэсэг", material: "Аюулгүй материал", emoji: "🎨", image: IMG.brushesMacro, description: "Жижиг урлалын багц — Аялалд тохиромжтой. Бэлэг түгээхэд сайн." },
        { id: "bbrush-notebook", name: "Дэвтрийн багц (5 ширхэг)", category: "bambruush", price: 5900, rating: 4, reviews: 22, stock: 30, age: "6–12 нас", size: "5 ширхэг", material: "Цаас, наалт", emoji: "📓", image: IMG.paint, description: "Дэвтрийн багц (5 ширхэг) — Зураг зурах, сурах бичигт тохиромжтой. Хямд, чанартай." },
        { id: "bbrush-pencil24", name: "Өнгөт харандаа (24 өнгө)", category: "bambruush", price: 8900, rating: 5, reviews: 48, stock: 33, age: "4–12 нас", size: "24 харандаа", material: "Аюулгүй өнгөт хөрс", emoji: "✏️", image: IMG.brushesMacro, description: "Өнгөт харандаа (24 өнгө) — Уусдаггүй, аюулгүй. Зураг зурах дуртай хүүхдэд." },
        { id: "bbrush-bag", name: "Хичээлийн цүнх", category: "bambruush", price: 14900, rating: 4, reviews: 35, stock: 16, age: "5–12 нас", size: "38×28 см", material: "Ус нэвтэрдэггүй даавуу", emoji: "🎒", image: IMG.abcBlocks, description: "Хичээлийн цүнх — Өнгөт загвартай, хөнгөн. Хичээлийн хэрэгсэлээ тээвэрлэхэд." }
    ];

    /* =====================================================
       Ангиллын нэр (HTML шүүлтүүрийн утгуудтай таарна)
       ===================================================== */
    const categoryNames = {
        all: "Бүх ангилал",
        soft: "Чихмэл",
        car: "Машин",
        lego: "Угсардаг",
        doll: "Хүүхэлдэй",
        sport: "Спорт",
        bambruush: "Хичээлийн хэрэгсэл"
    };

    const AUTO_SLIDE_DELAY = 7000;
    const LOW_STOCK_LIMIT = 5;
    const SALE_DURATION = 7 * 24 * 60 * 60 * 1000;

    /* =====================================================
       Сайтын нэр ба одоогийн хуудас
       ===================================================== */
    const BRAND_NAME = "Аз жаргалын тоглоом";
    const pageName = document.body && document.body.dataset ? (document.body.dataset.page || "home") : "home";
    const SEARCH_HISTORY_LIMIT = 8;
    const BUNDLE_PRICE_RATE = 0.85; /* багцын хямдрал: багц үнэ = нийлбэр × 0.85 (бодит тооцоо) */

    let isPlacingOrder = false;
    let saleEndAt = 0;
    let isInitialized = false;

    /* =====================================================
       Баярын багцийн төвлөрсөн тохиргоо (дэлхийн нэг газар)
       Баяруудын хугацааг зөвхөн энд бүртгэнэ — код даяар давтагдахгүй.
       Цагаан сар сарны тооллоос хамаарч өөрчлөгддөг тул бодит огноог
       жагсаалтаар өгнө (demo тохиргоо, шаардлагатай үед шинэчилнэ).
       ===================================================== */
    const HOLIDAY_CONFIG = [
        {
            key: "childrens-day",
            name: "Хүүхдийн баяр",
            /* Жил бүрийн 6-р сарын 1–3 */
            ranges: [{ start: { month: 6, day: 1 }, end: { month: 6, day: 3 } }]
        },
        {
            key: "naadam",
            name: "Үндэсний баяр наадам",
            /* Жил бүрийн 7-р сарын 11–15 */
            ranges: [{ start: { month: 7, day: 11 }, end: { month: 7, day: 15 } }]
        },
        {
            key: "new-year",
            name: "Шинэ жил",
            /* Жил бүрийн 12-р сарын 15 – дараа оны 1-р сарын 14 */
            ranges: [{ start: { month: 12, day: 15 }, end: { month: 1, day: 14 }, spansYear: true }]
        },
        {
            key: "tsagaan-sar",
            name: "Цагаан сар",
            /* Сарны тооллын бодит огноо (demo тохиргоо) */
            ranges: [{ fixed: ["2027-02-06", "2027-02-08"] }, { fixed: ["2028-01-26", "2028-01-28"] }]
        }
    ];

    /* =====================================================
       Баярын багцууд (дотоод демо өгөгдөл)
       Багцад орсон бүтээгдэхүүн нь бодит products массивын бодит
       ID, үнэ болон үлдэгдэлд тулгуурлана. oldPrice = багцын барааны
       нийлбэр үнэ; price = нийлбэр × BUNDLE_PRICE_RATE (тооцоолсон).
       ===================================================== */
    const holidayBundles = [
        {
            id: "bundle-newyear-big",
            holiday: "new-year",
            name: "Шинэ жилийн том бэлгийн багц",
            emoji: "🎁",
            image: IMG.gift,
            stock: 10,
            age: "3–8 нас",
            description: "Зөөлөн баавгай, удирдлагатай RC машин, угсардаг сонгодог багц — Шинэ жилийн натурал бэлгэнд зориулсан гоёмсог багц.",
            items: [
                { id: "soft-bear-classic", qty: 1 },
                { id: "car-rc", qty: 1 },
                { id: "lego-classic", qty: 1 }
            ]
        },
        {
            id: "bundle-newyear-small",
            holiday: "new-year",
            name: "Шинэ жилийн жижиг бэлгийн багц",
            emoji: "🎄",
            image: IMG.gift,
            stock: 15,
            age: "3–10 нас",
            description: "Туулайн чихмэл, уран сайхны том багц, хөл бөмбөг — жижиг, сонирхолтой бэлгийн багц.",
            items: [
                { id: "soft-rabbit", qty: 1 },
                { id: "bbrush-set", qty: 1 },
                { id: "sport-ball", qty: 1 }
            ]
        },
        {
            id: "bundle-newyear-builder",
            holiday: "new-year",
            name: "Угсардаг бүтээн байгуулагчийн багц",
            emoji: "🚀",
            image: IMG.legoPile,
            stock: 8,
            age: "7–12 нас",
            description: "Сансрын станц болон уралдааны машин угсардаг багц — бүтээх сонирхолтой хүүхдэд зориулсан баярын бэлэг.",
            items: [
                { id: "lego-space", qty: 1 },
                { id: "lego-racecar", qty: 1 }
            ]
        },
        {
            id: "bundle-childrens-day-joy",
            holiday: "childrens-day",
            name: "Хүүхдийн баярын аз жаргалын багц",
            emoji: "🎈",
            image: IMG.kids,
            stock: 12,
            age: "3–8 нас",
            description: "Хүүхдийн баярын өдөр тутмын бэлгэнд зориулсан зөөлөн баавгай, пластилин, цайны багц.",
            items: [
                { id: "soft-bear-mini", qty: 1 },
                { id: "bbrush-plasticine", qty: 1 },
                { id: "doll-tea", qty: 1 }
            ]
        },
        {
            id: "bundle-naadam-sport",
            holiday: "naadam",
            name: "Наадмын спортын багц",
            emoji: "🏹",
            image: IMG.soccer,
            stock: 10,
            age: "5–12 нас",
            description: "Наадмын үеэр гадна тоглох хөл бөмбөг, фризби, хула бамбарын багц.",
            items: [
                { id: "sport-ball", qty: 1 },
                { id: "sport-frisbee", qty: 1 },
                { id: "sport-stick", qty: 1 }
            ]
        },
        {
            id: "bundle-tsagaan-sar-soft",
            holiday: "tsagaan-sar",
            name: "Цагаан сарын зөөлөн бэлэг",
            emoji: "🧧",
            image: IMG.gift,
            stock: 9,
            age: "2–7 нас",
            description: "Цагаан сарын найрсаг мөчид зориулсан баавгайн дэр, цасан хүн, нярай хүүхэлдэй.",
            items: [
                { id: "soft-pillow", qty: 1 },
                { id: "soft-snowman", qty: 1 },
                { id: "doll-baby", qty: 1 }
            ]
        }
    ];

    /* Багцын бодит үнийг products массивын бодит үнээс тооцоолнол */
    holidayBundles.forEach((bundle) => {
        const sum = bundle.items.reduce((total, entry) => {
            const product = products.find((item) => item.id === entry.id);
            return product ? total + product.price * entry.qty : total;
        }, 0);
        bundle.sumPrice = sum;
        bundle.price = Math.round((sum * BUNDLE_PRICE_RATE) / 1000) * 1000;
        bundle.oldPrice = sum > bundle.price ? sum : 0;
        bundle.imageUrl = bundle.image;
    });

    /* =====================================================
       Урамшууллын төвлөрсөн тохиргоо (нэг газраас удирдана).
       Үнэгүй хүргэлтийн босгыг хаа ч давтахгүй — бүх тооцоо
       PROMO_CONFIG болон getShippingFee() хоёроос шууд авна.
       ===================================================== */
    const PROMO_CONFIG = {
        freeShippingThreshold: 50000, /* энэ дүнгээс дээш захиалгад хүргэлт үнэгүй */
        shippingFee: 5000             /* босгод хүрээгүй үеийн хүргэлтийн төлбөр */
    };

    function getShippingFee(subtotal) {
        /* Өөрөө авах сонголтод төлбөргүй; босгод давсан бол үнэгүй */
        if (!state || state.checkoutDelivery === "pickup") return 0;
        return subtotal >= PROMO_CONFIG.freeShippingThreshold ? 0 : PROMO_CONFIG.shippingFee;
    }

    /* Сагсны урамшууллын ахицын зурвас — PROMO_CONFIG-оос шууд тооцно */
    function shippingPromoHtml() {
        const subtotal = cartTotalAmount();
        if (!subtotal || cartTotalQuantity() <= 0) return "";
        if (state.checkoutDelivery === "pickup") {
            return `<div class="promo-line">🏬 Өөрөө очиж авах сонголтод хүргэлтийн төлбөр орохгүй.</div>`;
        }
        const threshold = PROMO_CONFIG.freeShippingThreshold;
        const remaining = threshold - subtotal;
        if (remaining <= 0) {
            return `<div class="promo-line is-free">🎉 Үнэгүй хүргэлт идэвхжлээ! Хүргэлтийн төлбөр 0₮ байна.</div>
                <div class="promo-bar" aria-hidden="true"><span style="width:100%"></span></div>`;
        }
        const percent = Math.max(1, Math.min(99, Math.round((subtotal / threshold) * 100)));
        return `<div class="promo-line">✦ Үнэгүй хүргэлт авахад ${formatPrice(Math.round(remaining))} дутуу байна.</div>
            <div class="promo-bar" aria-hidden="true"><span style="width:${percent}%"></span></div>`;
    }

    /* =====================================================
       Төрсөн өдрийн бэлгийн багцууд (бүх цагт нээлттэй).
       Баярын хугацаанд гардаг holidayBundles систем эвдрэхгүй;
       төрсөн өдрийн багцууд тусгай жагсаалтад хадгалагдана.
       Багцын үнэ нь бүрэлдэхүүний бодит үнээс бага байх ёстой; тооцоолохдоо
       BUNDLE_PRICE_RATE ба products массивын бодит ID, үнэ ашиглана.
       ===================================================== */
    const birthdayBundles = [
        {
            id: "bd-mini-gift",
            holiday: "birthday",
            tag: "Төрсөн өдрийн бэлэг",
            name: "Төрсөн өдрийн бяцхан бэлэг",
            emoji: "🎂",
            image: IMG.gift,
            stock: 15,
            age: "3–8 нас",
            description: "Жижиг баавгай, өнгөт харандаа, дэвтрийн багц — төрсөн өдрийн бяцхан бэлэг.",
            items: [
                { id: "soft-bear-mini", qty: 1 },
                { id: "bbrush-pencil24", qty: 1 },
                { id: "bbrush-notebook", qty: 1 }
            ]
        },
        {
            id: "bd-creator-kit",
            holiday: "birthday",
            tag: "Төрсөн өдрийн бэлэг",
            name: "Бүтээлч хүүхдийн багц",
            emoji: "🎨",
            image: IMG.legoPile,
            stock: 12,
            age: "4–10 нас",
            description: "Олон загвартай угсардаг тоглоом, усан будаг, стикер — бүтээлч хүүхдэд зориулсан багц.",
            items: [
                { id: "lego-multi", qty: 1 },
                { id: "bbrush-water24", qty: 1 },
                { id: "bbrush-sticker", qty: 1 }
            ]
        },
        {
            id: "bd-adventure",
            holiday: "birthday",
            tag: "Төрсөн өдрийн бэлэг",
            name: "Адал явдлын багц",
            emoji: "🏎️",
            image: IMG.car,
            stock: 10,
            age: "3–10 нас",
            description: "Уралдааны зам, жижиг машин, зааны чихмэл — адал явдалт хүүхдийн багц.",
            items: [
                { id: "car-track", qty: 1 },
                { id: "car-mini3", qty: 1 },
                { id: "soft-elephant", qty: 1 }
            ]
        },
        {
            id: "bd-mega-party",
            holiday: "birthday",
            tag: "Төрсөн өдрийн бэлэг",
            name: "Том баярын багц",
            emoji: "🎉",
            image: IMG.gift,
            stock: 6,
            age: "3–9 нас",
            description: "Том баавгай, динозаврын угсардаг, уран сайхны том багц, цайны багц — том төрсөн өдрийн бэлгийн багц.",
            items: [
                { id: "soft-bear-classic", qty: 1 },
                { id: "lego-dinosaur", qty: 1 },
                { id: "bbrush-set", qty: 1 },
                { id: "doll-tea", qty: 1 }
            ]
        }
    ];

    /* Төрсөн өдрийн багцын үнийг бүрэлдэхүүний бодит үнээс тооцно */
    birthdayBundles.forEach((bundle) => {
        const sum = bundle.items.reduce((total, entry) => {
            const product = products.find((item) => item.id === entry.id);
            return product ? total + product.price * entry.qty : total;
        }, 0);
        bundle.sumPrice = sum;
        bundle.price = Math.round((sum * BUNDLE_PRICE_RATE) / 1000) * 1000;
        bundle.oldPrice = sum > bundle.price ? sum : 0;
        bundle.imageUrl = bundle.image;
    });

    /* =====================================================
       Баярын зургийн тохиргоо — нэг газар тодорхойлсон демо зураг.
       Зураг ачааллахгүй эсвэл алдагдсан үед fallback emoji автоматаар харуулна. автоматadget деп тавина.
       ===================================================== */
    const HOLIDAY_IMG = [
        {
            src: "https://images.unsplash.com/photo-1464349095431-e9a21285b5f3?auto=format&fit=crop&w=900&q=70",
            emoji: "🎂",
            alt: "Төрсөн өдрийн тоортой ширээ, бэлгийн уур амьсгал",
            caption: "Төрсөн өдрийн ширээ",
            text: "Төрсөн өдрийн ширээ дээр тоортой бэлгийн багц"
        },
        {
            src: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=900&q=70",
            emoji: "🎁",
            alt: "Бэлгийн хайрцаг, чимэглэсэн савлагаа",
            caption: "Бэлгийн савлагаа",
            text: "Бэлгийн хайрцагтай тоглоом бэлэглэх мөч"
        },
        {
            src: "https://images.unsplash.com/photo-1516627145497-ae6968895b74?auto=format&fit=crop&w=900&q=70",
            emoji: "👨‍👩‍👧‍👦",
            alt: "Гэр бүлийн хамт тоглолт",
            caption: "Гэр бүлийн хамт",
            text: "Гэр бүл хамтдаа тоглоом тоглож байна"
        },
        {
            src: "https://images.unsplash.com/photo-1608889175123-8ee362201f81?auto=format&fit=crop&w=900&q=70",
            emoji: "🎈",
            alt: "Баярын бөмбөрцөг, пилейт чимэглэл",
            caption: "Баярын уур амьсгал",
            text: "Баярын уур амьсгалтай тоглоомын өрөө"
        }
    ];

    /* =====================================================
       Каталог туслах: бүтээгдэхүүн + баярын багц
       ===================================================== */
    function getCatalogItem(id) {
        if (!id) return null;
        const product = getProduct(id);
        if (product) return product;
        const bundle = holidayBundles.find((item) => item.id === id) ||
            birthdayBundles.find((item) => item.id === id);
        if (!bundle) return null;
        return {
            type: "bundle",
            id: bundle.id,
            name: bundle.name,
            price: bundle.price,
            oldPrice: bundle.oldPrice,
            sumPrice: bundle.sumPrice,
            stock: bundle.stock,
            age: bundle.age,
            holiday: bundle.holiday,
            tag: bundle.tag,
            emoji: bundle.emoji,
            image: bundle.image,
            description: bundle.description,
            items: bundle.items
        };
    }

    /* =====================================================
       Нөөц хадгалах туслах
       ===================================================== */
    function persistCart() { writeStorage(storageKeys.cart, state.cart); }
    function persistWishlist() { writeStorage(storageKeys.wishlist, state.wishlist); }
    function persistStock() { writeStorage(storageKeys.stock, state.stockOverride); }
    function persistUsers() { writeStorage(storageKeys.users, state.users); }
    /* -----------------------------------------------------
       Хэрэглэгчийн устгах (localStorageдоорхийг онголох)
       ----------------------------------------------------- */
    function deleteUser(email) {
        // Эсвэл нэрөөс хайх аль atlаа
        const targetUser = state.users.find(
            (u) => u && typeof u.email === "string" && u.email.toLowerCase() === email.toLowerCase()
        );
        
        // Админ account-ийг устгахгүй
        if (targetUser && targetUser.demo) {
            showToast("Админ account-ийг устгахгүй байна.", true);
            return;
        }
        
        // Current userээс алгагддаг бол session аziiлдags
        if (state.session && state.session.email && state.session.email.toLowerCase() === email.toLowerCase()) {
            state.session = null;
            persistSession();
        }
        
        // Users array dan useruul that have demo: true (admins) eesen
        if (!Array.isArray(state.users)) state.users = [];
        const beforeLength = state.users.length;
        state.users = state.users.filter(
            (u) => !(u && typeof u.email === "string" && u.email.toLowerCase() === email.toLowerCase() && !u.demo)
        );
        
        // Устгагдсанэ Owner total too too too too too too too too too too too too too too too too too too too too too
        if (state.users.length === beforeLength) {
            showToast("Эхлээд бүртгэл олдсонгүй эсвэл үүнийг устгах эрх үлдээгүй.", true);
            return;
        }
        
        persistUsers();
        renderAccountPage();
        updateAccountButton();
        showToast("Хэрэглэгч амжилттай устгагдлаa.");
    }

    function persistSession() { writeStorage(storageKeys.session, state.session); }
    function persistOrders() { writeStorage(storageKeys.orders, state.orders); }

    function effectiveStock(product) {
        if (!product) return 0;
        const base = Math.max(0, Math.floor(Number(product.stock)) || 0);
        const override = state.stockOverride[product.id];
        if (typeof override !== "number" || !Number.isFinite(override)) return base;
        return Math.max(0, Math.min(base, Math.floor(override)));
    }

    function cartQuantityOf(id) {
        const line = state.cart.find((item) => item && item.id === id);
        const qty = Number(line && line.qty);
        return Number.isFinite(qty) && qty > 0 ? Math.floor(qty) : 0;
    }

    function cartTotalQuantity() {
        return state.cart.reduce((sum, item) => sum + cartQuantityOf(item && item.id), 0);
    }

    function cartTotalAmount() {
        return state.cart.reduce((sum, item) => {
            const catalog = getCatalogItem(item && item.id);
            return catalog ? sum + catalog.price * cartQuantityOf(catalog.id) : sum;
        }, 0);
    }

    function isWishlisted(id) {
        return state.wishlist.indexOf(id) !== -1;
    }

    function currentUser() {
        if (!state.session || typeof state.session !== "object") return null;
        const email = typeof state.session.email === "string" ? state.session.email : "";
        if (!email) return null;
        return state.users.find((user) => user && user.email === email) || null;
    }

    function resolveUserRole(user) {
        if (!user || typeof user !== "object") return null;
        const explicitRole = typeof user.role === "string" ? user.role.trim().toLowerCase() : "";
        if (explicitRole === "admin" || explicitRole === "user") return explicitRole;
        if (typeof user.demo === "boolean") return user.demo ? "admin" : "user";
        return null;
    }

    /* Нууц үгийг энгийн текстээр биш, хэшлэсэн утгаар л локал хадгална (демо). */
    function hashPassword(password) {
        const str = `happy-toy::${password}`;
        let h1 = 0xdeadbeef;
        let h2 = 0x41c6ce57;
        for (let i = 0; i < str.length; i += 1) {
            const ch = str.charCodeAt(i);
            h1 = Math.imul(h1 ^ ch, 2654435761);
            h2 = Math.imul(h2 ^ ch, 1597334677);
        }
        h1 = Math.imul(h1 ^ (h1 >>> 16), 2246822507) ^ Math.imul(h2 ^ (h2 >>> 13), 3266489909);
        h2 = Math.imul(h2 ^ (h2 >>> 16), 2246822507) ^ Math.imul(h1 ^ (h1 >>> 13), 3266489909);
        return (h2 >>> 0).toString(16).padStart(8, "0") + (h1 >>> 0).toString(16).padStart(8, "0");
    }

    /* =====================================================
       Toast, overlay, панел удирдлага
       ===================================================== */
    function showToast(message, isError = false) {
        if (!elements.toast || !elements.toastMessage) return;
        elements.toastMessage.textContent = message;
        elements.toast.classList.toggle("is-error", Boolean(isError));
        elements.toast.classList.add("is-visible");
        if (toastTimer) clearTimeout(toastTimer);
        toastTimer = setTimeout(() => {
            if (elements.toast) elements.toast.classList.remove("is-visible");
            toastTimer = null;
        }, 3200);
    }

    function getPanels() {
        return [
            elements.searchModal,
            elements.cartDrawer,
            elements.wishlistDrawer,
            elements.productModal,
            elements.accountModal,
            elements.checkoutModal,
            elements.successModal,
            elements.galleryLightbox
        ].filter(Boolean);
    }

    function anyPanelOpen() {
        return getPanels().some((panel) => panel.classList.contains("is-open"));
    }

    function refreshOverlay() {
        const hasPanel = anyPanelOpen();
        if (elements.pageOverlay) elements.pageOverlay.classList.toggle("is-visible", hasPanel);
        document.body.classList.toggle("no-scroll", hasPanel);
    }

    function openPanel(panel) {
        if (!panel) return;
        panel.classList.add("is-open");
        panel.setAttribute("aria-hidden", "false");
        refreshOverlay();
    }

    function openExclusive(panel) {
        getPanels().forEach((other) => {
            if (other !== panel) {
                other.classList.remove("is-open");
                other.setAttribute("aria-hidden", "true");
            }
        });
        openPanel(panel);
    }

    function closePanel(panel) {
        if (!panel) return;
        panel.classList.remove("is-open");
        panel.setAttribute("aria-hidden", "true");
        refreshOverlay();
    }

    function closeAllPanels() {
        getPanels().forEach((panel) => {
            panel.classList.remove("is-open");
            panel.setAttribute("aria-hidden", "true");
        });
        refreshOverlay();
    }

    function scrollToSection(id) {
        const target = document.getElementById(id);
        if (target) target.scrollIntoView({ behavior: "smooth", block: "start" });
    }

    /* =====================================================
       Хуудас шилжүүлэг — бүтээгдэхүүний дэлгэрэнгүй, баярын багц
       ===================================================== */
    function navigateToProduct(id) {
        const catalog = getCatalogItem(id);
        if (!catalog) { showToast("Бараа олдсонгүй.", true); return; }
        spawnNavBubbles();
        window.location.href = `product.html?id=${encodeURIComponent(id)}`;
    }

    /* =====================================================
       Хуудас шилжилтийн анимаци (хөнгөн, нэг удаа)
       View Transitions API дэмждэг бол CSS @view-transition
       ажиллана; дэмждэггүй бол main fade-in хийнэ.
       ===================================================== */
    function prefersReducedMotion() {
        return typeof window.matchMedia === "function" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    }

    function initPageReveal() {
        /* Chrome 126+ дээр @view-transition өөрөө ажилладаг тул давхарлахгүй */
        if (typeof window.ViewTransition === "function" || typeof window.ViewTransition === "object") return;
        if (prefersReducedMotion()) return;
        const main = document.querySelector("main");
        if (main) main.classList.add("page-reveal");
    }

    let bubblesTimer = null;
    function spawnNavBubbles() {
        if (prefersReducedMotion()) return;
        if (document.getElementById("navBubbles")) return; /* давхар хуримтлахгүй */
        const host = document.createElement("div");
        host.id = "navBubbles";
        host.setAttribute("aria-hidden", "true");
        for (let i = 0; i < 7; i++) {
            const bubble = document.createElement("span");
            bubble.className = "nav-bubble";
            bubble.style.left = `${6 + Math.round(Math.random() * 88)}%`;
            bubble.style.animationDelay = `${i * 45}ms`;
            host.appendChild(bubble);
        }
        document.body.appendChild(host);
        bubblesTimer = setTimeout(() => {
            if (host.parentNode) host.parentNode.removeChild(host);
            bubblesTimer = null;
        }, 1000);
    }

    function relatedProductsHtml(product, limit = 4) {
        const related = products
            .filter((item) => item.category === product.category && item.id !== product.id)
            .slice(0, limit);
        if (!related.length) return "";
        return `<div class="section-heading"><div><span class="section-kicker">ИЖИЛ АНГИЛЛЫН СОНГОЛТ</span><h2>Мөн үзэж болохуйц <em>тоглоомууд</em></h2></div><a class="text-link" href="products.html?category=${product.category}">Ангилал дээр үзэх <svg class="icon"><use href="#icon-arrow"></use></svg></a></div>
            <div class="product-grid related-grid">${related.map(createProductCard).join("")}</div>`;
    }

    function pageBackLink(text, href, target) {
        return `<div class="page-backline"><a class="text-link" href="${href}">← ${escapeHtml(text)}</a>${target ? `<small>${escapeHtml(target)}</small>` : ""}</div>`;
    }

    function bundleItemRowsHtml(bundle) {
        return bundle.items.map((entry) => {
            const product = getProduct(entry.id);
            if (!product) return "";
            return `<div class="bundle-item-row"><span class="bundle-item-emoji">${product.emoji}</span><b>${entry.qty} × ${escapeHtml(product.name)}</b><small>${formatPrice(product.price * entry.qty)}</small></div>`;
        }).join("");
    }

    function bundleDetailHtml(bundle) {
        const info = stockInfo(bundle);
        const holiday = HOLIDAY_CONFIG.find((item) => item.key === bundle.holiday);
        const savings = bundle.oldPrice > bundle.price ? bundle.oldPrice - bundle.price : 0;
        return `<div class="product-detail-head">
            <div class="product-detail-image">${mediaHtml(bundle.image, bundle.emoji, bundle.name)}</div>
            <div class="product-detail-info">
                <div class="product-detail-badges">
                    <span class="detail-chip">Баярын багц</span>
                    <span class="detail-chip">${escapeHtml(holiday ? holiday.name : (bundle.tag || "Баярын багц"))}</span>
                    <span class="detail-chip">${escapeHtml(bundle.age)}</span>
                    ${info.stock <= 0 ? `<span class="detail-chip is-out">Дууссан байна</span>` : ""}
                </div>
                <h2 id="pageTitle">${escapeHtml(bundle.name)}</h2>
                <p class="product-detail-desc">${escapeHtml(bundle.description)}</p>
                <div class="bundle-items">${bundleItemRowsHtml(bundle)}</div>
                <div class="detail-specs">
                    ${bundle.items.length ? `<div class="detail-row"><span>Багцад багтах тоглоом</span><b>${bundle.items.reduce((sum, entry) => sum + entry.qty, 0)} ширхэг</b></div>` : ""}
                    <div class="detail-row"><span>Багцын бодит нийлбэр үнэ</span><b>${formatPrice(bundle.sumPrice)}</b></div>
                    ${savings > 0 ? `<div class="detail-row"><span>Багцын хэмнэлэлт (demo хямдрал)</span><b>${formatPrice(savings)}</b></div>` : ""}
                    <div class="detail-row"><span>Үлдэгдэл</span><b>${info.stock <= 0 ? "Дууссан" : `${info.stock} ширхэг`}</b></div>
                </div>
                <div class="detail-price-row">
                    <span class="detail-price">${bundle.oldPrice && bundle.oldPrice > bundle.price ? `<del>${formatPrice(bundle.oldPrice)}</del>` : ""}${formatPrice(bundle.price)}</span>
                    <span class="stock-line${info.css}">${info.text}</span>
                </div>
                <div class="detail-actions">
                    <button type="button" class="button button-primary" data-action="add-cart" data-id="${bundle.id}"${info.stock <= 0 ? " disabled" : ""}>Сагсанд нэмэх</button>
                    <a class="button button-ghost" href="gift-bundles.html">Бүх багц үзэх</a>
                </div>
            </div>
        </div>`;
    }

    function createBundleCard(bundle) {
        const info = stockInfo(bundle);
        const holiday = HOLIDAY_CONFIG.find((item) => item.key === bundle.holiday);
        const savings = bundle.oldPrice > bundle.price ? bundle.oldPrice - bundle.price : 0;
        const discount = bundle.sumPrice > 0 ? Math.round((1 - bundle.price / bundle.sumPrice) * 100) : 0;
        return `<article class="product-card" data-action="open-product" data-id="${bundle.id}">
            <div class="product-image">
                <span class="product-badge">${escapeHtml(holiday ? holiday.name : (bundle.tag || "Баярын багц"))}</span>
                <span class="product-category-tag">Баярын багц · ${bundle.items.reduce((sum, entry) => sum + entry.qty, 0)} тоглоом</span>
                <button type="button" class="wishlist-button" disabled aria-label="Багц хүссэн барааны шүүлтүүрд орохгүй"><svg class="icon"><use href="#icon-heart"></use></svg></button>
                ${mediaHtml(bundle.image, bundle.emoji, bundle.name)}
            </div>
            <div class="product-info">
                <div class="product-rating">✦ <span>${bundle.items.length} төрлийн тоглоом</span></div>
                <h3>${escapeHtml(bundle.name)}</h3>
                <p>${escapeHtml(bundle.description)}</p>
                <span class="stock-line${info.css}">${info.text}</span>
                <div class="price-row">
                    <div class="price-copy">
                        ${bundle.oldPrice && bundle.oldPrice > bundle.price ? `<del>${formatPrice(bundle.oldPrice)}</del>` : ""}
                        <strong>${formatPrice(bundle.price)}</strong>
                        ${savings > 0 ? `<small class="bundle-savings">+ ${formatPrice(savings)} хэмнэлэлт</small>` : ""}
                    </div>
                    <button type="button" class="add-button" data-action="add-cart" data-id="${bundle.id}"${info.stock <= 0 ? " disabled" : ""} aria-label="Сагсанд нэмэх">+</button>
                </div>
            </div>
        </article>`;
    }

    /* --- Баярын хугацааны төлөв --- */
    function todayToDate() {
        const now = new Date();
        return new Date(now.getFullYear(), now.getMonth(), now.getDate());
    }

    function parseIsoDay(text) {
        const parts = String(text).split("-").map(Number);
        return new Date(parts[0], parts[1] - 1, parts[2]);
    }

    /* Хөгжүүлэлтийн туршилтын горим — продакшндаа заавал хоосон үлдэнэ. */
    const DEV_PREVIEW_HOLIDAY = "";

    function rangesToSpans(range, year) {
        if (range.fixed) {
            return [{ start: parseIsoDay(range.fixed[0]), end: parseIsoDay(range.fixed[1]) }];
        }
        if (range.spansYear) {
            return [
                { start: new Date(year - 1, range.start.month - 1, range.start.day), end: new Date(year, range.end.month - 1, range.end.day) },
                { start: new Date(year, range.start.month - 1, range.start.day), end: new Date(year + 1, range.end.month - 1, range.end.day) }
            ];
        }
        return [
            { start: new Date(year, range.start.month - 1, range.start.day), end: new Date(year, range.end.month - 1, range.end.day) }
        ];
    }

    function activeHoliday() {
        if (DEV_PREVIEW_HOLIDAY) {
            const devHoliday = HOLIDAY_CONFIG.find((holiday) => holiday.key === DEV_PREVIEW_HOLIDAY);
            if (devHoliday) return devHoliday;
        }
        const today = todayToDate();
        for (const holiday of HOLIDAY_CONFIG) {
            for (const range of holiday.ranges) {
                const spans = rangesToSpans(range, today.getFullYear());
                for (const span of spans) {
                    if (today >= span.start && today <= span.end) return holiday;
                }
            }
        }
        return null;
    }

    function nextHoliday() {
        const today = todayToDate();
        let best = null;
        HOLIDAY_CONFIG.forEach((holiday) => {
            holiday.ranges.forEach((range) => {
                const year = today.getFullYear();
                rangesToSpans(range, year).concat(rangesToSpans(range, year + 1)).forEach((span) => {
                    if (span.start > today && (!best || span.start < best.start)) best = { holiday, start: span.start };
                });
            });
        });
        return best;
    }

    function activeBundles() {
        const holiday = activeHoliday();
        if (!holiday) return [];
        return holidayBundles.filter((bundle) => bundle.holiday === holiday.key);
    }

    function renderBundleShowcase() {
        if (!elements.bundleShowcase) return;
        const active = activeBundles();
        const holiday = activeHoliday();
        if (!holiday || !active.length) {
            elements.bundleShowcase.hidden = true;
            elements.bundleShowcase.innerHTML = "";
            return;
        }
        elements.bundleShowcase.hidden = false;
        if (elements.bundleKicker) elements.bundleKicker.textContent = `${holiday.name.toUpperCase()}`;
        if (elements.bundleHeading) {
            const next = nextHoliday();
            const daysLeft = next ? Math.ceil((next.start - todayToDate()) / 86400000) : 0;
            elements.bundleHeading.innerHTML = `${escapeHtml(holiday.name)}-ийн баярын <em>багцууд</em>`;
            if (elements.bundleNote) elements.bundleNote.textContent = `${holiday.name} дуустал ажиллана${daysLeft > 0 ? ` — ${daysLeft} хоног үлдсэн` : ""}.`;
        }
        if (elements.bundleGrid) {
            elements.bundleGrid.innerHTML = active.map(createBundleCard).join("");
            watchMedia(elements.bundleGrid);
        }
    }

    function renderBundlesPage() {
        if (!elements.bundlesGrid) return;
        const active = activeBundles();
        const holiday = activeHoliday();
        if (holiday && active.length) {
            if (elements.bundlePageIntro) {
                elements.bundlePageIntro.hidden = false;
                elements.bundlePageIntro.querySelector(".page-kicker").textContent = holiday.name.toUpperCase();
            }
            elements.bundlesGrid.innerHTML = active.map(createBundleCard).join("");
            watchMedia(elements.bundlesGrid);
            if (elements.bundlePageEmpty) elements.bundlePageEmpty.hidden = true;
        } else {
            const next = nextHoliday();
            if (elements.bundlePageIntro) elements.bundlePageIntro.hidden = true;
            if (elements.bundlePageEmpty) {
                const when = next ? next.start.toLocaleDateString() : "";
                elements.bundlePageEmpty.hidden = false;
                elements.bundlePageEmpty.querySelector("p").textContent = when
                    ? `Одоогоор идэвхтэй баярын багц байхгүй. Удахгүй ${next.holiday.name} (${when})-д зориулсан багцууд дахин нээгдэнэ.`
                    : `Одоогоор идэвхтэй баярын багц байхгүй. Одоо байгаа тоглоомуудыг products.html хуудаснаас үзээрэй.`;
            }
            elements.bundlesGrid.innerHTML = "";
        }
    }

    /* Төрсөн өдрийн багцууд — бүх цагт нээлттэй (баярын тоолуурын систем орохгүй) */
    function renderBirthdayShowcase() {
        const grids = $$("[data-birthday-grid]");
        grids.forEach((grid) => {
            grid.innerHTML = birthdayBundles.map(createBundleCard).join("");
            watchMedia(grid);
        });
    }

    /* Баярын зургийн сан — HOLIDAY_IMG тохиргооны зурагтай карточнууд */
    function renderHolidayGallery() {
        const host = document.getElementById("holidayGallery");
        if (!host) return;
        host.innerHTML = HOLIDAY_IMG.map((item) => `<figure class="holiday-card">
                <div class="holiday-card-media">${mediaHtml(item.src, item.emoji, item.alt, "holiday-fallback")}</div>
                <figcaption class="holiday-card-caption"><b>${escapeHtml(item.caption)}</b><small>${escapeHtml(item.text)}</small></figcaption>
            </figure>`).join("");
        watchMedia(host);
    }

    /* =====================================================
       Тусдаа хуудсууд: product, cart, favorites, account
       ===================================================== */
    function renderProductPage() {
        if (!elements.pageDetail) return;
        let id = "";
        try { id = new URLSearchParams(window.location.search).get("id") || ""; } catch (error) { id = ""; }
        const catalog = getCatalogItem(id);
        if (!catalog) {
            elements.pageDetail.innerHTML = `<div class="empty-results"><span>🔎</span><h3>Бараа олдсонгүй</h3><p>Хайсан холбоос нь буруу эсвэл бараа байхгүй болсон байна.</p><a class="button button-ghost" href="products.html">Бүх тоглоом үзэх</a></div>`;
            return;
        }
        if (catalog.type === "bundle") {
            elements.pageDetail.innerHTML = pageBackLink("Бүх багц руу буцах", "gift-bundles.html", "") + bundleDetailHtml(catalog);
        } else {
            elements.pageDetail.innerHTML = pageBackLink("Бүх тоглоом руу буцах", "products.html", catalog.name)
                + productDetailHtml(catalog)
                + `<h2 class="related-title">Ижил ангиллын сонголт</h2><div class="related-grid" id="relatedGrid"></div>`;
            const relatedGrid = $("#relatedGrid", elements.pageDetail);
            if (relatedGrid) {
                const related = allProducts().filter((item) => item.category === catalog.category && item.id !== catalog.id).slice(0, 4);
                if (related.length) {
                    relatedGrid.innerHTML = related.map(createProductCard).join("");
                    watchMedia(relatedGrid);
                } else {
                    relatedGrid.hidden = true;
                }
            }
        }
        watchMedia(elements.pageDetail);
        document.title = `${catalog.name} — ${BRAND_NAME}`;
    }

    function renderFavoritesPage() {
        if (!elements.favoritesGrid) return;
        state.wishlist = state.wishlist.filter((id) => getProduct(id));
        if (!state.wishlist.length) {
            elements.favoritesGrid.hidden = true;
            if (elements.favoritesEmpty) elements.favoritesEmpty.hidden = false;
            return;
        }
        elements.favoritesGrid.hidden = false;
        if (elements.favoritesEmpty) elements.favoritesEmpty.hidden = true;
        elements.favoritesGrid.innerHTML = state.wishlist.map((id) => createProductCard(getProduct(id))).join("");
        watchMedia(elements.favoritesGrid);
    }

    /* =====================================================
       Профайл (account.html) — хаягууд, захиалгууд
       ===================================================== */
    function normalizeUser(user) {
        if (!user) return null;
        if (!Array.isArray(user.addresses)) {
            user.addresses = user.address ? [{ ...user.address, isDefault: true }] : [];
        }
        if (user.addresses.length && !user.addresses.some((entry) => entry.isDefault)) user.addresses[0].isDefault = true;
        if (typeof user.phone === "number") user.phone = String(user.phone);
        return user;
    }

    function defaultAddressOf(user) {
        if (!user) return null;
        normalizeUser(user);
        return user.addresses.find((entry) => entry.isDefault) || user.addresses[0] || null;
    }

    function addressLine(address) {
        if (!address) return "";
        return [address.city, address.district, address.khoroo, address.street, address.extra].filter(Boolean).join(", ");
    }

    function addressCardsHtml(user) {
        if (!user.addresses.length) return `<p class="profile-hint text-muted">Хүргэлтийн хаяг хадгалаагүй байна.</p>`;
        return user.addresses.map((address, index) => `<div class="address-card${address.isDefault ? " is-default" : ""}">
                <div class="address-card-head">
                    ${address.isDefault ? `<span class="detail-chip">Үндсэн хаяг</span>` : `<span class="detail-chip is-neutral">Нэмэлт</span>`}
                    <span class="order-chip small">${escapeHtml(address.city || "")}</span>
                </div>
                <p>${escapeHtml(addressLine(address))}</p>
                <div class="address-card-actions">
                    ${!address.isDefault ? `<button type="button" class="filter-clear-all" data-action="address-default" data-index="${index}">Үндсэн болгох</button>` : ""}
                    <button type="button" class="filter-clear-all" data-action="address-edit" data-index="${index}">Засах</button>
                    <button type="button" class="filter-clear-all" data-action="address-delete" data-index="${index}">Устгах</button>
                </div>
            </div>`).join("");
    }

    function orderChipsPageHtml() {
        const orders = state.orders;
        if (!orders.length) return `<p class="profile-hint text-muted">Одоогоор захиалга бүртгэгдээгүй байна.</p>`;
        return orders.map((order, index) => {
            const date = new Date(order.date);
            const dateText = Number.isNaN(date.getTime()) ? "" : date.toLocaleDateString();
            const itemCount = Array.isArray(order.items) ? order.items.reduce((sum, item) => sum + (Math.floor(Number(item && item.qty)) || 0), 0) : 0;
            const itemsHtml = Array.isArray(order.items)
                ? order.items.map((item) => `<div class="bundle-item-row"><b>${(Math.floor(Number(item.qty)) || 0)} × ${escapeHtml(item.name || "")}</b><small>${formatPrice((Number(item.price) || 0) * (Math.floor(Number(item.qty)) || 0))}</small></div>`).join("")
                : "";
            return `<div class="order-chip"><b>${escapeHtml(order.code || "")}</b><small>${dateText} · ${itemCount} бараа · ${formatPrice(order.total || 0)}</small>
                <button type="button" class="filter-clear-all" data-action="order-toggle" data-index="${index}" aria-expanded="false">Дэлгэрэнгүй</button>
                </div><div class="order-items" data-order-items="${index}" hidden>${itemsHtml}</div>`;
        }).join("");
    }

    /* =====================================================
       Профайлын зураг (avatar) — demo түвшний бүртгэл
       Зургийг 512×512 хэмжээнд багасгаж JPEG-ээр цэгцлэх учир
       localStorage-ийг өөрийн байг хамгаалах хувьцай хийгдэнэ.
       ===================================================== */
    function persistUsersGuarded() {
        try {
            writeStorage(storageKeys.users, state.users);
            const verification = readStorage(storageKeys.users, null);
            return Array.isArray(verification) && verification.length > 0;
        } catch (error) {
            return false;
        }
    }

    function handleAvatarFile(file) {
        const user = currentUser();
        if (!user) return;
        if (!file) { showToast("Зураг (файл) сонгодоггүй байна.", true); return; }
        const allowedTypes = ["image/jpeg", "image/png", "image/webp"];
        if (!allowedTypes.includes(file.type)) { showToast("Зөвхөн JPEG, PNG, WebP зураг сонгоорой.", true); return; }
        if (file.size > 4 * 1024 * 1024) { showToast("Зургийн файл 4МБ-аас бага байвал зохино.", true); return; }
        const reader = new FileReader();
        reader.onerror = () => { showToast("Зургийг уншихад алдаа гарлаа.", true); };
        reader.onload = () => {
            const image = new Image();
            image.onerror = () => { showToast("Зургийг уншихад алдаа гарлаа.", true); };
            image.onload = () => {
                const width = image.naturalWidth;
                const height = image.naturalHeight;
                if (!width || !height) { showToast("Зургийн хэмжээ буруу байна.", true); return; }
                const side = Math.min(width, height, 512);
                const canvas = document.createElement("canvas");
                canvas.width = side;
                canvas.height = side;
                const ctx = canvas.getContext("2d");
                if (!ctx) { showToast("Зураг боловсруулахад алдаа гарлаа.", true); return; }
                ctx.drawImage(image, (width - side) / 2, (height - side) / 2, side, side, 0, 0, side, side);
                const dataUrl = canvas.toDataURL("image/jpeg", 0.82);
                if (typeof dataUrl !== "string" || dataUrl.length <= 22 || dataUrl.length > 400000) {
                    showToast("Зураг нийлгүй хэмжээ орон байна — бага зураг сонгоорой.", true);
                    return;
                }
                const previous = user.avatar;
                user.avatar = dataUrl;
                if (!persistUsersGuarded()) {
                    if (previous) user.avatar = previous;
                    else delete user.avatar;
                    renderAccountPage();
                    showToast("Зургийг хадгалж чадсангүй — төхөөрөмжийн сан дүүрсэн байж магадгүй. Профайлын бусад мэдээлэл эвдэрсэнгүй.", true);
                    return;
                }
                renderAccountPage();
                showToast("Профайлын зураг шинэчлэгдлээ.");
            };
            image.src = String(reader.result);
        };
        reader.readAsDataURL(file);
    }

    function avatarBlockHtml(user) {
        const initial = (String(user.name || "").trim().charAt(0) || "Х").toUpperCase();
        const photo = user.avatar
            ? `<img src="${escapeHtml(user.avatar)}" alt="Профайлын зураг: ${escapeHtml(user.name || "")}">`
            : `<span class="profile-avatar-fallback" aria-hidden="true">${escapeHtml(initial)}</span>`;
        return `<div class="profile-hero">
            <span class="profile-avatar">${photo}</span>
            <div class="profile-hero-info">
                <h2>${escapeHtml(user.name || "")}</h2>
                <p>${user.email ? escapeHtml(user.email) : "И-мэйл бүртгэгдээгүй"}</p>
            </div>
            <div class="profile-avatar-actions">
                <button type="button" class="button button-ghost" data-action="avatar-pick">${user.avatar ? "Зургаа солих" : "Зураг сонгох"}</button>
                ${user.avatar ? `<button type="button" class="filter-clear-all" data-action="avatar-reset">Анхны зураг</button>` : ""}
            </div>
            <input type="file" id="profileAvatarInput" accept="image/jpeg,image/png,image/webp" hidden>
        </div>`;
    }

    function profilePageHtml(user) {
        normalizeUser(user);
        const rows = [
            ["Овог", user.surname || "—"],
            ["Өөрийн нэр", user.givenName || user.name || "—"],
            ["И-мэйл", user.email || "—"],
            ["Утас", user.phone || "Бүртгэлгүй"]
        ];
        const quickLinks = `<div class="profile-actions">
                <a class="button button-ghost" href="favorites.html">Хүссэн бараа (${state.wishlist.length})</a>
                <a class="button button-ghost" href="cart.html">Сагс (${cartTotalQuantity()})</a>
            </div>`;
        if (state.profileEditing) {
            return `${avatarBlockHtml(user)}<form class="account-form page-account-form" id="profileForm" novalidate>
                <div class="form-field"><label for="profileSurname">Овог</label><input id="profileSurname" type="text" value="${escapeHtml(user.surname || "")}"></div>
                <div class="form-field"><label for="profileName">Өөрийн нэр</label><input id="profileName" type="text" value="${escapeHtml(user.givenName || user.name || "")}"></div>
                <div class="form-field"><label for="profilePhone">Утас</label><input id="profilePhone" type="tel" value="${escapeHtml(user.phone || "")}" placeholder="9911-2233"></div>
                <div class="form-field"><label for="profileEmail">И-мэйл</label><input id="profileEmail" type="email" value="${escapeHtml(user.email || "")}" disabled></div>
                <button class="button button-primary" type="submit">Хадгалах</button>
            </form>
            <div class="profile-actions"><button type="button" class="button button-ghost" data-action="profile-cancel">Цуцлах</button></div>`;
        }
        const editingIndex = state.profileEditingAddress;
        const addressFormVisible = state.addressFormVisible;
        const editingAddress = Number.isFinite(editingIndex) ? user.addresses[editingIndex] : null;
        return `${avatarBlockHtml(user)}<div class="profile-list">${rows.map(([label, value]) => `<div class="profile-row"><span>${escapeHtml(label)}</span><b>${escapeHtml(value)}</b></div>`).join("")}</div>
            <div class="profile-actions">
                <button type="button" class="button button-primary" data-action="profile-edit">Мэдээлэл засах</button>
                <button type="button" class="button button-primary" data-action="logout">Гарах</button>
            </div>

            <h3 class="account-section-title">Хүргэлтийн хаягууд</h3>
            <div class="address-grid">${addressCardsHtml(user)}</div>
            ${addressFormVisible ? `<form class="account-form page-account-form" id="addressForm" novalidate>
                <input type="hidden" id="addressIndex" value="${Number.isFinite(editingIndex) ? String(editingIndex) : ""}">
                <div class="form-field"><label for="addressCity">Хот, аймаг</label><input id="addressCity" type="text" value="${escapeHtml(editingAddress ? editingAddress.city || "" : "")}" list="cityListCustom"></div>
                <div class="form-field"><label for="addressDistrict">Дүүрэг, сум</label><input id="addressDistrict" type="text" value="${escapeHtml(editingAddress ? editingAddress.district || "" : "")}"></div>
                <div class="form-field"><label for="addressKhoroo">Хороо, баг</label><input id="addressKhoroo" type="text" value="${escapeHtml(editingAddress ? editingAddress.khoroo || "" : "")}" placeholder="шаардлагагүй"></div>
                <div class="form-field"><label for="addressStreet">Гудамж, байр</label><input id="addressStreet" type="text" value="${escapeHtml(editingAddress ? editingAddress.street || "" : "")}"></div>
                <div class="form-field"><label for="addressExtra">Орц, давхар</label><input id="addressExtra" type="text" value="${escapeHtml(editingAddress ? editingAddress.extra || "" : "")}" placeholder="шаардлагагүй"></div>
                <div class="form-field"><label class="check-label"><input type="checkbox" id="addressDefault"${editingAddress && editingAddress.isDefault ? " checked" : ""}> Үндсэн хаяг болгох</label></div>
                <button class="button button-primary" type="submit">${Number.isFinite(editingIndex) ? "Хаяг шинэчлэх" : "Хаяг нэмэх"}</button>
            </form>
            <div class="profile-actions"><button type="button" class="button button-ghost" data-action="address-cancel">Цуцлах</button></div>` : `<div class="profile-actions"><button type="button" class="button button-ghost" data-action="address-new">Шинэ хаяг нэмэх</button></div>`}
            <datalist id="cityListCustom"><option value="Улаанбаатар"></option><option value="Дархан-Уул"></option><option value="Орхон"></option><option value="Сэлэнгэ"></option><option value="Хөвсгөл"></option></datalist>

            <h3 class="account-section-title">Өмнөх захиалгууд</h3>
            <div class="order-chip-list">${orderChipsPageHtml()}</div>
            ${quickLinks}

            <h3 class="account-section-title">Тохиргоо</h3>
            <p class="secure-note">Демо бүртгэл — нууц үг зөвхөн hash-ээр локал хадгалагдана.</p>
            <div class="profile-actions">
                <button type="button" class="button button-ghost" data-action="password-toggle">${state.pwFormVisible ? "Болих" : "Нууц үг солих"}</button>
                <button type="button" class="button button-ghost" data-action="data-export">Мэдээллээ татах</button>
            </div>
            ${state.pwFormVisible ? `<form class="account-form page-account-form" id="passwordForm" novalidate>
                ${passwordFieldHtml("currentPassword", "Одоогийн нууц үг", "current-password")}
                ${passwordFieldHtml("newPassword", "Шинэ нууц үг", "new-password")}
                ${passwordFieldHtml("confirmPassword", "Шинэ нууц үг (давтах)", "new-password")}
                <button class="button button-primary" type="submit">Нууц үг шинэчлэх</button>
            </form>
            <div class="profile-actions"><button type="button" class="button button-ghost" data-action="password-cancel">Цуцлах</button></div>` : ""}`;
    }

    function accountPageBodyHtml() {
        const user = currentUser();
        if (user) return profilePageHtml(user);
        const isLogin = state.accountTab !== "register";
        return `<div class="account-tabs">
                <button type="button" class="account-tab${isLogin ? " is-active" : ""}" data-action="account-tab" data-tab="login">Нэвтрэх</button>
                <button type="button" class="account-tab${isLogin ? "" : " is-active"}" data-action="account-tab" data-tab="register">Бүртгүүлэх</button>
            </div>
            ${isLogin ? loginFormHtml() : registerFormHtml()}`;
    }

    function renderAccountPage() {
        if (!elements.accountPageBody) { renderAccount(); return; }
        elements.accountPageBody.innerHTML = accountPageBodyHtml();
        document.title = currentUser() ? "Миний профайл — " + BRAND_NAME : "Бүртгэл ба нэвтрэх — " + BRAND_NAME;
    }

    /* =====================================================
       Зураг + fallback туслах
       ===================================================== */
    function mediaHtml(url, emoji, alt, fallbackClass = "product-fallback") {
        return `<img src="${escapeHtml(url)}" alt="${escapeHtml(alt)}" loading="lazy" data-media>` +
            `<span class="${fallbackClass}" hidden>${emoji}</span>`;
    }

    function watchMedia(scope = document) {
        $$("img[data-media]", scope).forEach((img) => {
            if (img.dataset.mediaWatched === "1") return;
            img.dataset.mediaWatched = "1";
            const fallback = img.nextElementSibling;
            const showImage = () => {
                img.hidden = false;
                img.classList.add("is-ready");
                if (fallback) fallback.hidden = true;
            };
            const showFallback = () => {
                img.hidden = true;
                img.classList.remove("is-ready");
                if (fallback) fallback.hidden = false;
            };
            img.addEventListener("load", showImage);
            img.addEventListener("error", showFallback);
            if (img.complete && img.naturalWidth > 0) showImage();
            else if (img.complete) showFallback();
        });
    }

    /* index.html дотор буй (hero, галерей) статик зургууд */
    function watchStaticImages() {
        $$("img[data-fallback]").forEach((img) => {
            if (img.dataset.staticWatched === "1") return;
            img.dataset.staticWatched = "1";
            img.addEventListener("load", () => {
                img.hidden = false;
                img.classList.add("is-ready");
            });
            img.addEventListener("error", () => { img.hidden = true; });
        });
    }

    function ratingStars(value) {
        const rating = Math.max(1, Math.min(5, Math.round(Number(value) || 0)));
        return "★".repeat(rating) + "☆".repeat(5 - rating);
    }

    /* =====================================================
       Хайлтын эрэмбэ + олон шүүлтүүр
       ===================================================== */
    function rankProduct(product, q) {
        const name = product.name.toLowerCase();
        if (name === q) return 0;                          /* 1. Нэр яг таарна */
        if (name.startsWith(q)) return 1;                  /* 2. Нэр хайлтын үгээр эхэлнэ */
        if (name.includes(q)) return 2;                    /* 3. Нэрийн дотор таарна */
        const extra = `${product.category} ${categoryNames[product.category] || ""} ${product.age} ${product.size} ${product.material} ${product.id}`.toLowerCase();
        if (extra.includes(q)) return 3;                   /* 4. Ангилал, нас, хэмжээ, материал, ID */
        if (product.description.toLowerCase().includes(q)) return 4; /* 5. Тайлбар */
        return 99;
    }

    function ageOptions() {
        const ages = new Set();
        allProducts().forEach((product) => ages.add(product.age));
        return [...ages].sort((a, b) => {
            const first = (text) => parseInt(text.match(/\d+/) ? text.match(/\d+/)[0] : "99", 10);
            return first(a) - first(b);
        });
    }

    function priceOfBounds() {
        return {
            min: Math.min(...allProducts().map((product) => product.price)),
            max: Math.max(...allProducts().map((product) => product.price))
        };
    }

    function getFilteredProducts() {
        const query = state.query.trim().toLowerCase();
        const minPrice = parseInt(state.minPrice, 10);
        const maxPrice = parseInt(state.maxPrice, 10);
        const list = allProducts().filter((product) => {
            if (state.category !== "all" && product.category !== state.category) return false;
            if (state.saleOnly && discountPercent(product) <= 0) return false;
            if (state.inStock && effectiveStock(product) <= 0) return false;
            if (state.age && product.age !== state.age) return false;
            if (Number.isFinite(minPrice) && product.price < minPrice) return false;
            if (Number.isFinite(maxPrice) && product.price > maxPrice) return false;
            if (query && rankProduct(product, query) === 99) return false;
            return true;
        });
        const byPrice = (dir) => (a, b) => dir * (a.price - b.price);
        const byRating = (a, b) => (b.rating - a.rating) || (b.reviews - a.reviews);
        if (query) {
            /* Хайлтын үг байвал эрэмбэ нь хайлтын тэр бүр эхэлнэ; ижил зэргийг хэрэглэгчийн эрэмбэ дугуйлна */
            list.sort((a, b) => {
                const diff = rankProduct(a, query) - rankProduct(b, query);
                if (diff !== 0) return diff;
                if (state.sort === "price-low") return byPrice(1)(a, b);
                if (state.sort === "price-high") return byPrice(-1)(a, b);
                return byRating(a, b);
            });
        } else if (state.sort === "price-low") list.sort(byPrice(1));
        else if (state.sort === "price-high") list.sort(byPrice(-1));
        else if (state.sort === "rating") list.sort(byRating);
        return list;
    }

    /* =====================================================
       URL-ийн шүүлт, хайлтын төлөв
       ===================================================== */
    function readUrlFilters() {
        try {
            const params = new URLSearchParams(window.location.search);
            if (params.get("q") !== null) state.query = params.get("q");
            if (params.get("category") && categoryNames[params.get("category")]) state.category = params.get("category");
            if (params.get("sort") && ["featured", "price-low", "price-high", "rating", "popular"].includes(params.get("sort"))) state.sort = params.get("sort");
            if (params.get("min") !== null) state.minPrice = params.get("min");
            if (params.get("max") !== null) state.maxPrice = params.get("max");
            if (params.get("age")) state.age = params.get("age");
            if (params.get("sale") === "1") state.saleOnly = true;
            if (params.get("stock") === "1") state.inStock = true;
            const filterBody = document.body && document.body.dataset;
            if (filterBody && filterBody.salePreset === "true") state.saleOnly = true;
        } catch (error) {
            /* URL задлахад алдаа гарвал энгийн төлөвт үлдэнэ */
        }
    }

    function writeUrlFilters() {
        if (pageName !== "products" && pageName !== "sales") return;
        try {
            const params = new URLSearchParams();
            if (state.query.trim()) params.set("q", state.query.trim());
            if (state.category !== "all") params.set("category", state.category);
            if (state.sort !== "featured") params.set("sort", state.sort);
            if (state.minPrice !== "") params.set("min", state.minPrice);
            if (state.maxPrice !== "") params.set("max", state.maxPrice);
            if (state.age) params.set("age", state.age);
            if (state.inStock) params.set("stock", "1");
            if (state.saleOnly && pageName === "products") params.set("sale", "1");
            const query = params.toString();
            const url = `${window.location.pathname}${query ? `?${query}` : ""}`;
            window.history.replaceState(null, "", url);
        } catch (error) {
            /* history боломжгүй үед үл тохирно */
        }
    }

    function currentFilters() {
        const parts = [];
        if (state.query.trim()) parts.push({ key: "q", label: `Хайлт: "${state.query.trim()}"` });
        if (state.category !== "all") parts.push({ key: "category", label: `Ангилал: ${categoryNames[state.category] || state.category}` });
        if (state.age) parts.push({ key: "age", label: `Нас: ${state.age}` });
        if (state.minPrice !== "" || state.maxPrice !== "") {
            const minText = state.minPrice ? formatPrice(state.minPrice) : "0";
            const maxText = state.maxPrice ? formatPrice(state.maxPrice) : "∞";
            parts.push({ key: "price", label: `Үнэ: ${minText} – ${maxText}` });
        }
        if (state.inStock) parts.push({ key: "stock", label: "Нөөцтэй" });
        if (state.saleOnly && pageName === "products") parts.push({ key: "sale", label: "Хямдралтай" });
        return parts;
    }

    function removeFilter(key) {
        if (key === "q") state.query = "";
        else if (key === "category") state.category = "all";
        else if (key === "age") state.age = "";
        else if (key === "price") { state.minPrice = ""; state.maxPrice = ""; }
        else if (key === "stock") state.inStock = false;
        else if (key === "sale") state.saleOnly = false;
        else if (key === "all") {
            state.query = "";
            state.category = "all";
            state.age = "";
            state.minPrice = "";
            state.maxPrice = "";
            state.inStock = false;
            state.saleOnly = false;
        }
        renderProducts();
        scrollToSection("products");
    }

    /* =====================================================
       Хайлтын түүх (нэргүй, локал, хязгаартай)
       ===================================================== */
    function recordSearch(query) {
        const value = String(query || "").trim().toLowerCase();
        if (value.length < 2 || value.length > 40) return;
        state.searchHistory = state.searchHistory.filter((item) => item !== value);
        state.searchHistory.unshift(value);
        state.searchHistory = state.searchHistory.slice(0, SEARCH_HISTORY_LIMIT);
        writeStorage(storageKeys.searchHistory, state.searchHistory);
    }

    function clearSearchHistory() {
        state.searchHistory = [];
        writeStorage(storageKeys.searchHistory, state.searchHistory);
        closeSearchSuggest();
        showToast("Хайлтын түүхийг цэвэрлэлээ.");
    }

    function popularSearchTerms() {
        /* Демо статистик: энэ төхөөрөмж дээрх бодит хайлтаас гадна ангиллын нэр
           гаргана. Нийт хэрэглэгчийн статистик байхгүй тул бусад статаар хуурмагаар
           танилцуулахгүй. */
        const own = [...state.searchHistory];
        const extras = ["чихмэл", "машин", "угсардаг", "хүүхэлдэй", "бамбуруш"].filter((term) => !own.includes(term));
        return own.concat(extras).slice(0, 5);
    }

    function suggestProducts(query, limit = 6) {
        const q = query.trim().toLowerCase();
        if (q.length < 1) return [];
        return getFilteredProducts()
            .filter((product) => rankProduct(product, q) !== 99)
            .sort((a, b) => (rankProduct(a, q) - rankProduct(b, q)) || (b.reviews - a.reviews))
            .slice(0, limit);
    }

    function suggestHtml(query) {
        const q = String(query || "").trim();
        const matches = suggestProducts(q, 6);
        const rows = [];
        matches.forEach((product) => {
            rows.push(`<a class="suggest-item" href="product.html?id=${encodeURIComponent(product.id)}">
                <span class="suggest-thumb">${product.emoji}</span>
                <span class="suggest-text"><b>${escapeHtml(product.name)}</b><small>${escapeHtml(categoryNames[product.category] || "")}</small></span>
                <span class="suggest-price">${formatPrice(product.price)}</span>
            </a>`);
        });
        if (!q) {
            const recent = state.searchHistory.slice(0, 5);
            const popular = popularSearchTerms();
            if (recent.length) {
                rows.push(`<div class="suggest-head">Таны өмнөх хайлтууд<button type="button" data-action="clear-search-history" aria-label="Хайлтын түүх цэвэрлэх">цэвэрлэх</button></div>`);
                recent.forEach((term) => rows.push(`<a class="suggest-item suggest-term" href="products.html?q=${encodeURIComponent(term)}"><span class="suggest-thumb">🕘</span><span class="suggest-text">${escapeHtml(term)}</span></a>`));
            }
            rows.push(`<div class="suggest-head">Түгээмэл хайлтууд (энэ төхөөрөмжийн демо)</div>`);
            popular.forEach((term) => rows.push(`<a class="suggest-item suggest-term" href="products.html?q=${encodeURIComponent(term)}"><span class="suggest-thumb">✦</span><span class="suggest-text">${escapeHtml(term)}</span></a>`));
        }
        if (q && !matches.length) {
            rows.push(`<div class="suggest-empty">"${escapeHtml(q)}" таарсан тоглоом олдсонгүй.</div>`);
        }
        return rows.join("");
    }

    function closeSearchSuggest() {
        $$(".search-suggest").forEach((panel) => {
            panel.hidden = true;
            panel.innerHTML = "";
        });
    }

    function openSearchSuggest(input) {
        const panelClass = input === elements.productSearch ? "productSuggest" : "modalSuggest";
        const panel = panelClass === "productSuggest" ? elements.productSuggest : elements.modalSuggest;
        if (!panel) return;
        panel.innerHTML = suggestHtml(input.value || "");
        panel.hidden = false;
        const term = (input.value || "").trim().toLowerCase();
        if (panelClass === "productSuggest" && term) panel.classList.toggle("is-open", true);
    }

    function handleSearchSubmitUI(input) {
        const value = input.value.trim();
        if (!value) { closeSearchSuggest(); input.focus(); return; }
        recordSearch(value);
        closeSearchSuggest();
        if (pageName === "products" || pageName === "sales") {
            state.query = value;
            renderProducts();
            scrollToSection("products");
        } else {
            window.location.href = `products.html?q=${encodeURIComponent(value)}`;
        }
    }

    /* =====================================================
       Бүтээгдэхүүний шүүлт, эрэмбэ, дүрслэл
       ===================================================== */
    function stockInfo(item) {
        const stock = effectiveStock(item);
        if (stock <= 0) return { stock, text: "Дууссан байна", css: " is-out" };
        if (stock <= LOW_STOCK_LIMIT) return { stock, text: `Үлдэгдэл: ${stock} ширхэг (бага)`, css: " is-low" };
        return { stock, text: `Үлдэгдэл: ${stock} ширхэг`, css: "" };
    }

    function createProductCard(product) {
        const info = stockInfo(product);
        const discount = discountPercent(product);
        const topBadge = discount > 0
            ? `<span class="product-discount">-${discount}%</span>`
            : (product.badge ? `<span class="product-badge">${escapeHtml(product.badge)}</span>` : "");
        const wished = isWishlisted(product.id);
        return `<article class="product-card" data-action="open-product" data-id="${product.id}">
            <div class="product-image">
                ${topBadge}
                <span class="product-category-tag">${escapeHtml(categoryNames[product.category] || "")}</span>
                <button type="button" class="wishlist-button${wished ? " is-active" : ""}" data-action="toggle-wishlist" data-id="${product.id}" aria-label="Хүссэн бараанд нэмэх" aria-pressed="${wished ? "true" : "false"}">
                    <svg class="icon"><use href="#icon-heart"></use></svg>
                </button>
                ${mediaHtml(product.image, product.emoji, product.name)}
            </div>
            <div class="product-info">
                <div class="product-rating">${ratingStars(product.rating)} <span>${product.reviews} үнэлгээ</span></div>
                <h3>${escapeHtml(product.name)}</h3>
                <p>${escapeHtml(product.description)}</p>
                <span class="stock-line${info.css}">${info.text}</span>
                <div class="price-row">
                    <div class="price-copy">
                        ${product.oldPrice && product.oldPrice > product.price ? `<del>${formatPrice(product.oldPrice)}</del>` : ""}
                        <strong>${formatPrice(product.price)}</strong>
                    </div>
                    <button type="button" class="add-button" data-action="add-cart" data-id="${product.id}"${info.stock <= 0 ? " disabled" : ""} aria-label="Сагсанд нэмэх">+</button>
                </div>
            </div>
        </article>`;
    }

    function renderProducts() {
        if (!elements.productGrid) return;
        let list = getFilteredProducts();
        const limit = parseInt(elements.productGrid.dataset.limit, 10);
        const isLimited = Number.isFinite(limit) && limit > 0;
        if (isLimited) list = list.slice(0, limit);
        renderFilterChips();
        elements.productGrid.innerHTML = list.map(createProductCard).join("");
        watchMedia(elements.productGrid);
        if (elements.resultCount) elements.resultCount.textContent = String(list.length);
        if (elements.emptyResults) elements.emptyResults.hidden = list.length > 0;
        if (elements.resultsLine) elements.resultsLine.hidden = isLimited;
        syncFilterInputs();
        writeUrlFilters();
    }

    function renderFilterChips() {
        if (!elements.activeChips) return;
        const parts = currentFilters();
        /* Тиймээс нүүр болон sale хуудас нэт үл хамаарна */
        if (!parts.length) { elements.activeChips.innerHTML = ""; return; }
        const chips = parts.map((part) => `<span class="filter-chip">${escapeHtml(part.label)}<button type="button" data-action="remove-filter" data-filter="${part.key}" aria-label="Шүүлт арилгах">×</button></span>`);
        chips.push(`<button type="button" class="filter-clear-all" data-action="clear-filters">Бүх шүүлт цэвэрлэх</button>`);
        elements.activeChips.innerHTML = chips.join("");
    }

    function syncFilterInputs() {
        const range = priceOfBounds();
        if (elements.filterMin) {
            elements.filterMin.min = String(range.min);
            elements.filterMin.max = String(range.max);
        }
        if (elements.filterMax) {
            elements.filterMax.min = String(range.min);
            elements.filterMax.max = String(range.max);
        }
        /* Насны ангиллын select-ыг бодит өгөгдлөөс дүүргэнэ */
        if (elements.filterAge && elements.filterAge.options.length <= 1) {
            elements.filterAge.innerHTML = `<option value="">Бүх нас</option>` + ageOptions().map((age) => `<option value="${escapeHtml(age)}">${escapeHtml(age)}</option>`).join("");
        }
    }

    function updateCategoryCounts() {
        elements.categoryCounts.forEach((node) => {
            const key = node.getAttribute("data-cat-count");
            const count = allProducts().filter((product) => product.category === key).length;
            node.textContent = `${count} тоглоом`;
        });
    }

    function resetFilters() {
        state.query = "";
        state.category = "all";
        state.age = "";
        state.minPrice = "";
        state.maxPrice = "";
        state.inStock = false;
        state.saleOnly = false;
        if (elements.productSearch) elements.productSearch.value = "";
        if (elements.categoryFilter) elements.categoryFilter.value = "all";
        if (elements.filterMin) elements.filterMin.value = "";
        if (elements.filterMax) elements.filterMax.value = "";
        if (elements.filterAge) elements.filterAge.value = "";
        if (elements.filterStock) elements.filterStock.checked = false;
        renderProducts();
        scrollToSection("products");
    }

    function applySearchQuery(query) {
        state.query = String(query || "").trim();
        if (elements.productSearch) elements.productSearch.value = state.query;
        closeAllPanels();
        closeSearchSuggest();
        if (pageName !== "products" && pageName !== "sales") {
            const target = state.query ? `products.html?q=${encodeURIComponent(state.query)}` : "products.html";
            if (state.query) recordSearch(state.query);
            window.location.href = target;
            return;
        }
        recordSearch(state.query);
        renderProducts();
        scrollToSection("products");
    }

    /* =====================================================
       Hero слайдер
       ===================================================== */
    function setSlide(index) {
        const total = elements.heroSlides.length;
        if (!total) return;
        const next = ((index % total) + total) % total;
        state.slide = next;
        elements.heroSlides.forEach((slide) => slide.classList.toggle("is-active", Number(slide.dataset.slide) === next));
        elements.heroArts.forEach((art) => art.classList.toggle("is-active", Number(art.dataset.art) === next));
        elements.sliderDots.forEach((dot) => dot.classList.toggle("is-active", Number(dot.dataset.slideTo) === next));
        if (elements.currentSlide) elements.currentSlide.textContent = String(next + 1).padStart(2, "0");
    }

    function resetSlideTimer() {
        if (!elements.heroSlides || !elements.heroSlides.length) return;
        if (slideTimer) clearInterval(slideTimer);
        slideTimer = setInterval(() => setSlide(state.slide + 1), AUTO_SLIDE_DELAY);
    }

    /* =====================================================
       Сагс
       ===================================================== */
    function sanitizeCart() {
        state.cart = state.cart
            .filter((item) => item && getCatalogItem(item.id))
            .map((item) => {
                const catalog = getCatalogItem(item.id);
                const qty = Math.floor(Number(item.qty)) || 0;
                return { id: item.id, qty: Math.max(0, Math.min(effectiveStock(catalog), qty)) };
            })
            .filter((item) => item.qty > 0);
    }

    function cartItemHtml(item) {
        const catalog = getCatalogItem(item.id);
        const stock = effectiveStock(catalog);
        const tagHtml = catalog.type === "bundle" ? `<span class="detail-chip is-neutral">Баярын багц</span> ` : "";
        return `<div class="cart-item" data-id="${catalog.id}">
            <div class="cart-item-image">${mediaHtml(catalog.image, catalog.emoji, catalog.name, "visual-fallback")}</div>
            <div class="cart-item-info">
                <h3>${escapeHtml(catalog.name)}</h3>
                <p>${tagHtml}${formatPrice(catalog.price)}</p>
                <div class="cart-item-actions">
                    <div class="quantity-control">
                        <button type="button" data-action="cart-decrease" data-id="${catalog.id}" aria-label="Тоо хэмжээ хасах">−</button>
                        <span>${item.qty}</span>
                        <button type="button" data-action="cart-increase" data-id="${catalog.id}" aria-label="Тоо хэмжээ нэмэх"${item.qty >= stock ? " disabled" : ""}>+</button>
                    </div>
                    <button type="button" class="remove-item" data-action="cart-remove" data-id="${catalog.id}" aria-label="Сагснаас хасах">✕</button>
                </div>
            </div>
        </div>`;
    }

    function renderCart() {
        sanitizeCart();
        if (elements.cartItems) {
            if (!state.cart.length) {
                elements.cartItems.innerHTML = `<div class="empty-drawer"><span>🧺</span><h3>Сагс хоосон байна</h3><p>Дуртай тоглоомоо сагсанд нэмээрэй — баярыг хамтдаа эхэлцгэье!</p><a class="button button-ghost" href="products.html">Тоглоом үзэх</a></div>`;
            } else {
                elements.cartItems.innerHTML = state.cart.map(cartItemHtml).join("");
                watchMedia(elements.cartItems);
            }
        }
        if (elements.cartFooter) elements.cartFooter.hidden = state.cart.length === 0;
        if (elements.cartTotal) elements.cartTotal.textContent = formatPrice(cartTotalAmount());
        const qty = cartTotalQuantity();
        if (elements.cartCount) elements.cartCount.textContent = String(qty);
        if (elements.cartQuantityInline) elements.cartQuantityInline.textContent = String(qty);
        /* Сагсын тусдаа хуудас буй бол мөн шинэчилнэ */
        if (elements.cartPageItems) {
            if (!state.cart.length) {
                elements.cartPageItems.innerHTML = `<div class="empty-drawer"><span>🧺</span><h3>Сагс хоосон байна</h3><p>Дуртай тоглоомоо олж сагсандаа нэмээрэй.</p><a class="button button-ghost" href="products.html">Тоглоом үзэх</a></div>`;
                if (elements.cartPageSummary) elements.cartPageSummary.hidden = true;
            } else {
                elements.cartPageItems.innerHTML = state.cart.map(cartItemHtml).join("");
                watchMedia(elements.cartPageItems);
                if (elements.cartPageSummary) {
                    elements.cartPageSummary.hidden = false;
                    if (elements.cartPageTotal) elements.cartPageTotal.textContent = formatPrice(cartTotalAmount());
                }
            }
        }
        persistCart();
        /* Урамшууллын ахиц — drawer болон сагсын хуудасанд зэрэг шинэчилнэ */
        const promoHtml = shippingPromoHtml();
        const drawerPromo = document.getElementById("drawerShippingPromo");
        if (drawerPromo) { drawerPromo.innerHTML = promoHtml; drawerPromo.hidden = !promoHtml; }
        const cartPromo = document.getElementById("cartShippingPromo");
        if (cartPromo) { cartPromo.innerHTML = promoHtml; cartPromo.hidden = !promoHtml; }
        /* Сагс өөрчлөгдсөн үед checkout нээлттэй бол түүний хураангуйг ч dabхар шинэчилнэ */
        if (elements.checkoutModal && !elements.checkoutModal.hidden && elements.checkoutModal.getAttribute("aria-hidden") === "false") updateCheckoutSummary();
    }

    function bumpCartTrigger() {
        const trigger = elements.cartTrigger;
        if (!trigger) return;
        trigger.classList.remove("bump");
        void trigger.offsetWidth;
        trigger.classList.add("bump");
        setTimeout(() => trigger.classList.remove("bump"), 500);
    }

    function addToCart(id, silent = false) {
        const catalog = getCatalogItem(id);
        if (!catalog) { showToast("Бараа олдсонгүй.", true); return false; }
        const stock = effectiveStock(catalog);
        if (stock <= 0) { showToast("Уучлаарай, энэ бараа дууссан байна.", true); return false; }
        const current = cartQuantityOf(id);
        if (current >= stock) { showToast(`Уучлаарай, үлдэгдэл зөвхөн ${stock} ширхэг байна.`, true); return false; }
        const line = state.cart.find((item) => item && item.id === id);
        if (line) line.qty = Math.min(stock, (Math.floor(Number(line.qty)) || 0) + 1);
        else state.cart.push({ id, qty: 1 });
        renderCart();
        if (!silent) showToast(`"${catalog.name}" сагсанд нэмэгдлээ.`);
        bumpCartTrigger();
        return true;
    }

    function changeCartQuantity(id, delta) {
        const catalog = getCatalogItem(id);
        if (!catalog) return;
        const current = cartQuantityOf(id);
        const next = current + delta;
        if (next <= 0) { removeCartItem(id); return; }
        if (next > effectiveStock(catalog)) { showToast(`Уучлаарай, үлдэгдэл зөвхөн ${effectiveStock(catalog)} ширхэг байна.`, true); return; }
        const line = state.cart.find((item) => item && item.id === id);
        if (line) line.qty = next;
        renderCart();
    }

    function removeCartItem(id) {
        const catalog = getCatalogItem(id);
        state.cart = state.cart.filter((item) => item && item.id !== id);
        renderCart();
        if (catalog) showToast(`"${catalog.name}" сагснаас хасагдлаа.`);
    }

    /* =====================================================
       Хүссэн бараа
       ===================================================== */
    function wishlistItemHtml(id) {
        const product = getProduct(id);
        const stock = effectiveStock(product);
        return `<div class="wishlist-item" data-id="${product.id}">
            <div class="wishlist-item-image">${mediaHtml(product.image, product.emoji, product.name, "visual-fallback")}</div>
            <div class="wishlist-item-info">
                <h3>${escapeHtml(product.name)}</h3>
                <p>${formatPrice(product.price)}</p>
            </div>
            <div class="cart-item-actions">
                <button type="button" class="add-button" data-action="wishlist-add" data-id="${product.id}"${stock <= 0 ? " disabled" : ""} aria-label="Сагсанд нэмэх">+</button>
                <button type="button" class="remove-item" data-action="wishlist-remove" data-id="${product.id}" aria-label="Хүссэн бараанаас хасах">✕</button>
            </div>
        </div>`;
    }

    function renderWishlist() {
        state.wishlist = state.wishlist.filter((id) => getProduct(id));
        if (elements.wishlistItems) {
            if (state.wishlist.length) {
                elements.wishlistItems.innerHTML = state.wishlist.map(wishlistItemHtml).join("");
                watchMedia(elements.wishlistItems);
            } else {
                elements.wishlistItems.innerHTML = `<div class="empty-drawer"><span>💝</span><h3>Хүссэн бараа хоосон</h3><p>Таалагдсан тоглоомоо зүрхэн дээр дарж хадгалаарай.</p><button class="button button-ghost" data-action="go-products">Тоглоом үзэх</button></div>`;
            }
        }
        const count = state.wishlist.length;
        if (elements.wishlistCount) elements.wishlistCount.textContent = String(count);
        if (elements.wishlistCountInline) elements.wishlistCountInline.textContent = `(${count})`;
        persistWishlist();
    }

    function toggleWishlist(id) {
        const product = getProduct(id);
        if (!product) return;
        if (isWishlisted(id)) {
            state.wishlist = state.wishlist.filter((wishId) => wishId !== id);
            showToast(`"${product.name}" хүссэн бараанаас хасагдлаа.`);
        } else {
            state.wishlist.push(id);
            showToast(`"${product.name}" хүссэн бараанд хадгалагдлаа.`);
        }
        renderWishlist();
        renderProducts();
    }

    /* =====================================================
       Барааны дэлгэрэнгүй модал
       ===================================================== */
    function productDetailHtml(product) {
        const info = stockInfo(product);
        const discount = discountPercent(product);
        const wished = isWishlisted(product.id);
        const stockChip = info.stock <= 0
            ? `<span class="detail-chip is-out">Дууссан байна</span>`
            : (info.stock <= LOW_STOCK_LIMIT ? `<span class="detail-chip is-neutral">Үлдэгдэл цөөн</span>` : "");
        return `<div class="product-detail-head">
            <div class="product-detail-image">${mediaHtml(product.image, product.emoji, product.name)}</div>
            <div class="product-detail-info">
                <div class="product-rating">${ratingStars(product.rating)} <span>${product.reviews} үнэлгээ</span></div>
                <h2 id="productModalTitle">${escapeHtml(product.name)}</h2>
                <div class="product-detail-badges">
                    <span class="detail-chip">${escapeHtml(categoryNames[product.category] || "")}</span>
                    ${product.age ? `<span class="detail-chip">${escapeHtml(product.age)}</span>` : ""}
                    ${product.size ? `<span class="detail-chip is-neutral">${escapeHtml(product.size)}</span>` : ""}
                    ${stockChip}
                </div>
                <p class="product-detail-desc">${escapeHtml(product.description)}</p>
                <div class="detail-specs">
                    <div class="detail-row"><span>Материал</span><b>${escapeHtml(product.material)}</b></div>
                    <div class="detail-row"><span>Насны бүлэг</span><b>${escapeHtml(product.age)}</b></div>
                    <div class="detail-row"><span>Үлдэгдэл</span><b>${info.stock <= 0 ? "Дууссан" : `${info.stock} ширхэг`}</b></div>
                    ${discount > 0 ? `<div class="detail-row"><span>Хямдрал</span><b>-${discount}%</b></div>` : ""}
                </div>
                <div class="detail-price-row">
                    <span class="detail-price">${product.oldPrice && product.oldPrice > product.price ? `<del>${formatPrice(product.oldPrice)}</del>` : ""}${formatPrice(product.price)}</span>
                    <span class="stock-line${info.css}">${info.text}</span>
                </div>
                <div class="detail-actions">
                    <button type="button" class="button button-primary" data-action="detail-add" data-id="${product.id}"${info.stock <= 0 ? " disabled" : ""}>Сагсанд нэмэх</button>
                    <button type="button" class="button button-ghost" data-action="detail-wishlist" data-id="${product.id}">${wished ? "♡ Хадгалахаа болих" : "♡ Хадгалах"}</button>
                </div>
            </div>
        </div>`;
    }

    /* =====================================================
       Бүртгэл / нэвтрэх / профайл
       ===================================================== */
    function passwordFieldHtml(id, label, autocomplete) {
        return `<div class="form-field"><label for="${id}">${escapeHtml(label)}</label>` +
            `<div class="password-wrap"><input id="${id}" type="password" placeholder="Нууц үг" autocomplete="${escapeHtml(autocomplete)}">` +
            `<button type="button" class="password-toggle" data-action="toggle-password" data-target="${id}">Харах</button></div></div>`;
    }

    function loginFormHtml() {
        return `<form class="account-form" id="loginForm" novalidate>
            <div class="form-field"><label for="loginEmail">И-мэйл эсвэл бүртгэлтэй нэр</label><input id="loginEmail" type="text" placeholder="you@example.com" autocomplete="username"></div>
            ${passwordFieldHtml("loginPassword", "Нууц үг", "current-password")}
            <button class="button button-primary" type="submit">Нэвтрэх</button>
        </form>`;
    }

    function registerFormHtml() {
        return `<form class="account-form page-account-form" id="registerForm" novalidate>
            <p class="secure-note">Демо бүртгэл — нууц үгийг энгийн текстээр хадгалахгүй, зөвхөн hash-ээр хадгална.</p>
            <div class="form-field"><label for="registerSurname">Овог</label><input id="registerSurname" type="text" placeholder="Овог оруулна уу" autocomplete="family-name"></div>
            <div class="form-field"><label for="registerName">Өөрийн нэр</label><input id="registerName" type="text" placeholder="Нэр оруулна уу" autocomplete="given-name"></div>
            <div class="form-field"><label for="registerPhone">Утасны дугаар</label><input id="registerPhone" type="tel" placeholder="9911-2233" autocomplete="tel"></div>
            <div class="form-field"><label for="registerEmail">И-мэйл</label><input id="registerEmail" type="email" placeholder="you@example.com" autocomplete="email"></div>
            ${passwordFieldHtml("registerPassword", "Нууц үг (6+ тэмдэгт)", "new-password")}
            ${passwordFieldHtml("registerConfirm", "Нууц үгийн баталгаажуулалт", "new-password")}
            <div class="address-fields">
                <div class="form-field"><label for="registerCity">Хот, аймаг (үндсэн хүргэлтийн хаяг)</label><input id="registerCity" type="text" placeholder="Улаанбаатар" list="cityListCustom"></div>
                <div class="form-field"><label for="registerDistrict">Дүүрэг, сум</label><input id="registerDistrict" type="text" placeholder="Хан-Уул дүүрэг"></div>
                <div class="form-field"><label for="registerKhoroo">Хороо, баг (шаардлагагүй)</label><input id="registerKhoroo" type="text" placeholder="11-р хороо"></div>
                <div class="form-field"><label for="registerStreet">Гудамж, байр, орц</label><input id="registerStreet" type="text" placeholder="Наадамчдын гудамж, 25-р байр"></div>
            </div>
            <datalist id="cityListCustom"><option value="Улаанбаатар"></option><option value="Дархан-Уул"></option><option value="Орхон"></option><option value="Сэлэнгэ"></option><option value="Хөвсгөл"></option></datalist>
            <div class="form-check"><input type="checkbox" id="registerAgree" checked><label for="registerAgree">Демо нөхцөлийг хүлээн зөвшөөрч байна</label></div>
            <button class="button button-primary" type="submit">Бүртгүүлэх</button>
        </form>`;
    }

    function authBodyHtml() {
        const isLogin = state.accountTab !== "register";
        return `<div class="account-tabs">
                <button type="button" class="account-tab${isLogin ? " is-active" : ""}" data-action="account-tab" data-tab="login">Нэвтрэх</button>
                <button type="button" class="account-tab${isLogin ? "" : " is-active"}" data-action="account-tab" data-tab="register">Бүртгүүлэх</button>
            </div>
            ${isLogin ? loginFormHtml() : registerFormHtml()}`;
    }

    function profileViewHtml(user) {
        const address = user.address || null;
        const baseRows = [
            ["Нэр", user.name || "—"],
            ["И-мэйл", user.email || "—"],
            ["Утас", user.phone || "Бүртгэлгүй"]
        ];
        if (address) {
            baseRows.push(["Хот/Аймаг", address.city || "—"]);
            baseRows.push(["Дүүрэг/Сум", address.district || "—"]);
            baseRows.push(["Хаяг", [address.khoroo, address.street].filter(Boolean).join(", ") || "—"]);
        }
        const rowsHtml = baseRows
            .map(([label, value]) => `<div class="profile-row"><span>${escapeHtml(label)}</span><b>${escapeHtml(value)}</b></div>`)
            .join("");
        const orders = state.orders.slice(0, 5);
        const ordersHtml = orders.length
            ? orders.map((order) => {
                const date = new Date(order.date);
                const dateText = Number.isNaN(date.getTime()) ? "" : date.toLocaleDateString();
                const itemCount = Array.isArray(order.items)
                    ? order.items.reduce((sum, item) => sum + (Math.floor(Number(item && item.qty)) || 0), 0)
                    : 0;
                return `<div class="order-chip"><b>${escapeHtml(order.code || "")}</b><small>${dateText} · ${itemCount} бараа · ${formatPrice(order.total || 0)}</small></div>`;
            }).join("")
            : `<p class="product-detail-desc">Одоогоор захиалга бүртгэгдээгүй байна.</p>`;
        return `<div class="profile-list">${rowsHtml}</div>
            <div class="order-chip-list">${ordersHtml}</div>
            <div class="profile-actions">
                <button type="button" class="button button-ghost" data-action="profile-edit">Мэдээлэл засах</button>
                <button type="button" class="button button-primary" data-action="logout">Гарах</button>
            </div>`;
    }

    function profileEditHtml(user) {
        const address = user.address || null;
        const addressText = address ? [address.city, address.district, [address.khoroo, address.street].filter(Boolean).join(", ")].filter(Boolean).join(" · ") : "";
        return `<form class="account-form" id="profileForm" novalidate>
            <div class="form-field"><label for="profileName">Таны нэр</label><input id="profileName" type="text" value="${escapeHtml(user.name || "")}"></div>
            <div class="form-field"><label for="profilePhone">Утас</label><input id="profilePhone" type="tel" value="${escapeHtml(user.phone || "")}" placeholder="9911-2233"></div>
            <div class="form-field"><label for="profileEmail">И-мэйл</label><input id="profileEmail" type="email" value="${escapeHtml(user.email || "")}" disabled></div>
            <div class="form-field"><label for="profileAddress">Хадгалсан хаяг</label><input id="profileAddress" type="text" value="${escapeHtml(addressText)}" placeholder="Хаяг хадгалаагүй" disabled></div>
            <button class="button button-primary" type="submit">Хадгалах</button>
        </form>
        <div class="profile-actions">
            <button type="button" class="button button-ghost" data-action="profile-cancel">Цуцлах</button>
        </div>`;
    }

    function renderAccount() {
        if (!elements.accountBody) return;
        const user = currentUser();
        if (user) elements.accountBody.innerHTML = state.profileEditing ? profileEditHtml(user) : profileViewHtml(user);
        else elements.accountBody.innerHTML = authBodyHtml();
    }

    function updateAccountButton() {
        const user = currentUser();
        if (elements.accountName) {
            elements.accountName.hidden = !user;
            elements.accountName.textContent = user ? (user.name || "Хэрэглэгч") : "";
        }
        if (elements.accountDot) elements.accountDot.hidden = !user;
    }

    function logout() {
        const previousRole = resolveUserRole(currentUser());
        state.session = null;
        state.userRole = null;
        state.profileEditing = false;
        state.profileEditingAddress = null;
        state.addressFormVisible = false;
        state.accountTab = "login";
        persistSession();
        if (previousRole === "admin") { window.location.href = "admin.html"; return; }
        window.location.href = "index.html";

        updateAccountButton();
        renderAccountPage();
        showToast("Та амжилттай гарлаа. Дахин уулзъя!");
    }

    function textOf(id) {
        const el = document.getElementById(id);
        return el && typeof el.value === "string" ? el.value.trim() : "";
    }

    function handleLogin() {
        const identifier = textOf("loginEmail").trim().toLowerCase();
        const password = textOf("loginPassword");
        if (!identifier) { showToast("И-мэйл эсвэл нэрээ оруулна уу.", true); return; }
        if (!password) { showToast("Нууц үгээ оруулна уу.", true); return; }

        const user = state.users.find((item) => {
            if (!item) return false;
            const byEmail = typeof item.email === "string" && item.email.toLowerCase() === identifier;
            const byName = typeof item.name === "string" && item.name.toLowerCase() === identifier;
            return byEmail || byName;
        });

        const admin = !user ? state.admins.find((item) => {
            if (!item) return false;
            const byEmail = typeof item.email === "string" && item.email.toLowerCase() === identifier;
            const byName = typeof item.name === "string" && item.name.toLowerCase() === identifier;
            return byEmail || byName;
        }) : null;

        const account = user || admin;
        if (!account) { showToast("И-мэйл/нэр эсвэл нууц үг таарахгүй байна.", true); return; }
        if (account.hash !== hashPassword(password)) { showToast("И-мэйл/нэр эсвэл нууц үг таарахгүй байна.", true); return; }

        const role = resolveUserRole(account);
        if (!role) { showToast("И-мэйл/нэр эсвэл нууц үг таарахгүй байна.", true); return; }

        state.session = { email: account.email, at: Date.now() };
        state.userRole = role;
        state.profileEditing = false;
        state.profileEditingAddress = null;
        state.addressFormVisible = false;
        state.pwFormVisible = false;
        persistSession();
        updateAccountButton();

        if (role === "admin") {
            state.adminSession = { email: account.email, at: Date.now() };
            persistAdminSession();
            window.location.href = "admin.html";
            return;
        }

        window.location.href = "index.html";
    }

    function handleRegister() {
        const surname = textOf("registerSurname");
        const givenName = textOf("registerName");
        const phone = textOf("registerPhone");
        const email = textOf("registerEmail").toLowerCase();
        const password = textOf("registerPassword");
        const confirm = textOf("registerConfirm");
        const city = textOf("registerCity");
        const district = textOf("registerDistrict");
        const khoroo = textOf("registerKhoroo");
        const street = textOf("registerStreet");
        if (surname.length < 2) { showToast("Овгоо оруулна уу.", true); return; }
        if (givenName.length < 2) { showToast("Өөрийн нэрээ оруулна уу.", true); return; }
        if (phone.replace(/\D/g, "").length < 8) { showToast("Утасны дугаараа зөв оруулна уу (хамгийн багадаа 8 цифр).", true); return; }
        if (!/^\S+@\S+\.\S+$/.test(email)) { showToast("И-мэйл хаягаа зөв оруулна уу.", true); return; }
        if (password.length < 6) { showToast("Нууц үг наасан дор хаяж 6 тэмдэгттэй байх ёстой.", true); return; }
        if (confirm !== password) { showToast("Нууц үгийн баталгаажуулалт таарахгүй байна.", true); return; }
        if (city.length < 2) { showToast("Хот эсвэл аймгаа оруулна уу.", true); return; }
        if (district.length < 2) { showToast("Дүүрэг эсвэл сумаа оруулна уу.", true); return; }
        if (street.length < 2) { showToast("Гудамж, байрныеа оруулна уу.", true); return; }
        if (state.users.some((item) => item && typeof item.email === "string" && item.email.toLowerCase() === email)) {
            showToast("Энэ и-мэйлээр бүртгэл аль хэдийн байна. Нэвтэрч орно уу.", true);
            return;
        }
        const name = [surname, givenName].filter(Boolean).join(" ");
        const user = {
            name,
            surname,
            givenName,
            email,
            role: "user",
            hash: hashPassword(password),
            phone,
            addresses: [{ city, district, khoroo, street, extra: "", isDefault: true }],
            createdAt: new Date().toISOString()
        };
        state.users.push(user);
        persistUsers();
        state.session = { email: user.email, at: Date.now() };
        state.profileEditing = false;
        state.profileEditingAddress = null;
        state.addressFormVisible = false;
        persistSession();
        updateAccountButton();
        renderAccountPage();
        showToast(`Бүртгэл амжилттай үүслээ. Тавтай морил, ${name}!`);
    }

    function handleProfileSave() {
        const user = currentUser();
        if (!user) { state.profileEditing = false; renderAccountPage(); return; }
        const name = textOf("profileName");
        const phone = textOf("profilePhone");
        const surname = textOf("profileSurname");
        if (name.length < 2) { showToast("Нэрээ оруулна уу.", true); return; }
        user.phone = phone;
        if (surname) {
            user.surname = surname;
            user.givenName = name;
            user.name = [surname, name].filter(Boolean).join(" ");
        } else {
            user.name = name;
        }
        persistUsers();
        state.profileEditing = false;
        renderAccountPage();
        updateAccountButton();
        showToast("Мэдээлэл амжилттай шинэчлэгдлээ.");
    }

    /* =====================================================
       Тохиргоо: нууц үг солих + өгөгдөл татах (локал демо)
       ===================================================== */
    function handlePasswordChange() {
        const user = currentUser();
        if (!user) return;
        const current = textOf("currentPassword");
        const next = textOf("newPassword");
        const confirm = textOf("confirmPassword");
        if (user.hash !== hashPassword(current)) { showToast("Одоогийн нууц үг таарахгүй байна.", true); return; }
        if (next.length < 6) { showToast("Шинэ нууц үг дор хаяж 6 тэмдэгттэй байх ёстой.", true); return; }
        if (next === current) { showToast("Шинэ нууц үг өмнөхөөсөө өөр байх ёстой.", true); return; }
        if (confirm !== next) { showToast("Нууц үгийн баталгаажуулалт таарахгүй байна.", true); return; }
        user.hash = hashPassword(next);
        persistUsers();
        state.pwFormVisible = false;
        renderAccountPage();
        showToast("Нууц үг амжилттай солигдлоо.");
    }

    function handleDataExport() {
        const user = currentUser();
        if (!user) return;
        const emailLower = typeof user.email === "string" ? user.email.toLowerCase() : "";
        const payload = {
            exportedAt: new Date().toISOString(),
            source: "Аз жаргалын тоглоом — локал демо өгөгдөл",
            profile: { name: user.name, surname: user.surname, givenName: user.givenName, email: user.email, phone: user.phone, addresses: Array.isArray(user.addresses) ? user.addresses : [] },
            orders: state.orders.filter((order) => order && order.customer && typeof order.customer.email === "string" && order.customer.email.toLowerCase() === emailLower),
            shoppingList: { cart: state.cart, wishlist: state.wishlist }
        };
        try {
            const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
            const url = URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.href = url;
            link.download = `happy-toy-${Date.now()}.json`;
            document.body.appendChild(link);
            link.click();
            link.remove();
            setTimeout(() => URL.revokeObjectURL(url), 2000);
            showToast("Мэдээллийг .json файл болгон татаж авлаа.");
        } catch (error) {
            showToast("Файл татах боломжгүй байна.", true);
        }
    }

    /* =====================================================
       Хүргэлтийн хаягийн CRUD (account.html)
       ===================================================== */
    function handleAddressSave() {
        const user = currentUser();
        if (!user) return;
        normalizeUser(user);
        const indexRaw = textOf("addressIndex");
        const editIndex = indexRaw === "" ? -1 : parseInt(indexRaw, 10);
        const city = textOf("addressCity");
        const district = textOf("addressDistrict");
        const khoroo = textOf("addressKhoroo");
        const street = textOf("addressStreet");
        const extra = textOf("addressExtra");
        const defaultBox = document.getElementById("addressDefault");
        const makeDefault = defaultBox ? defaultBox.checked : false;
        if (city.length < 2) { showToast("Хот эсвэл аймгаа оруулна уу.", true); return; }
        if (district.length < 2) { showToast("Дүүрэг эсвэл сумаа оруулна уу.", true); return; }
        if (street.length < 2) { showToast("Гудамж, байрныеа оруулна уу.", true); return; }
        if (editIndex >= 0 && !user.addresses[editIndex]) { showToast("Хаяг олдсонгүй.", true); return; }
        const address = { city, district, khoroo, street, extra, isDefault: Boolean(makeDefault) };
        if (makeDefault) user.addresses.forEach((entry, index) => { entry.isDefault = editIndex === index; });
        if (editIndex >= 0) user.addresses[editIndex] = address;
        else user.addresses.push(address);
        if (!user.addresses.some((entry) => entry.isDefault)) user.addresses[0].isDefault = true;
        persistUsers();
        state.addressFormVisible = false;
        state.profileEditingAddress = null;
        renderAccountPage();
        showToast(editIndex >= 0 ? "Хаяг шинэчлэгдлээ." : "Шинэ хаяг нэмэгдлээ.");
    }

    function profileAddressAction(action, index) {
        const user = currentUser();
        if (!user) return;
        normalizeUser(user);
        if (action === "address-new") {
            state.profileEditingAddress = null;
            state.addressFormVisible = true;
        } else if (action === "address-edit") {
            if (!user.addresses[index]) { showToast("Хаяг олдсонгүй.", true); return; }
            state.profileEditingAddress = index;
            state.addressFormVisible = true;
        } else if (action === "address-delete") {
            user.addresses.splice(index, 1);
            if (!user.addresses.some((entry) => entry.isDefault) && user.addresses[0]) user.addresses[0].isDefault = true;
            persistUsers();
            showToast("Хаяг устгагдлаа.");
        } else if (action === "address-default") {
            user.addresses.forEach((entry, entryIndex) => { entry.isDefault = entryIndex === index; });
            persistUsers();
            showToast("Үндсэн хаяг шинэчлэгдлээ.");
        } else if (action === "address-cancel") {
            state.addressFormVisible = false;
            state.profileEditingAddress = null;
        }
        renderAccountPage();
    }

    /* =====================================================
       Захиалга (checkout)
       ===================================================== */
    function prefillCheckout() {
        const user = currentUser();
        const address = defaultAddressOf(user);
        const setValue = (id, value) => {
            const el = document.getElementById(id);
            if (el && value) el.value = value;
        };
        if (user) {
            setValue("checkoutName", user.name);
            setValue("checkoutPhone", user.phone);
        }
        if (address) {
            setValue("checkoutCity", address.city);
            setValue("checkoutDistrict", address.district);
            setValue("checkoutKhoroo", address.khoroo);
            setValue("checkoutStreet", address.street);
            setValue("checkoutExtra", address.extra);
            setValue("checkoutNote", address.note);
        }
    }

    function updateCheckoutTotal() {
        updateCheckoutSummary();
    }

    /* =====================================================
       Төлбөр ба хүргэлтийн сонголт (демо)
       избран төлбөрийн арга бодит кино захиалгат холбогдохгүй;
       бодит төлбөрийг баталгаажуулалгүй демо байдлаас харуулна.
       ===================================================== */
    const CHECKOUT_PAYMENT_NAMES = { card: "Банкны карт", qpay: "QPay" };
    const CHECKOUT_DELIVERY_NAMES = { delivery: "Гэрт хүргүүлэх", pickup: "Өөрөө очиж авах" };

    function paymentDemoNote() {
        return state.checkoutPayment === "qpay"
            ? "Демо горим: QPay QR холболт системд одоогоор байхгүй тул захиалгат төлбөрийг бодитоор баталгаажуулахгүй."
            : "Демо горим: картын мэдээлэл хадгалагдахгүй, захиалгат төлбөрийг бодитоор авахгүй.";
    }

    function checkoutChargeName() {
        return `Төлбөрийн арга: ${CHECKOUT_PAYMENT_NAMES[state.checkoutPayment] || "Демо"}`;
    }

    function updateCheckoutSummary() {
        const subtotal = cartTotalAmount();
        const fee = getShippingFee(subtotal);
        const payEl = document.getElementById("checkoutSummaryPayment");
        const delEl = document.getElementById("checkoutSummaryDelivery");
        const subEl = document.getElementById("checkoutSubtotal");
        const feeEl = document.getElementById("checkoutShippingFee");
        if (payEl) payEl.textContent = `${CHECKOUT_PAYMENT_NAMES[state.checkoutPayment] || "Демо"} (демо төлбөр)`;
        if (delEl) delEl.textContent = CHECKOUT_DELIVERY_NAMES[state.checkoutDelivery] || "Гэрт хүргүүлэх";
        if (subEl) subEl.textContent = formatPrice(subtotal);
        if (feeEl) feeEl.textContent = fee === 0 ? "Үнэгүй" : formatPrice(fee);
        if (elements.checkoutTotal) elements.checkoutTotal.textContent = formatPrice(subtotal + fee);
        if (elements.checkoutItemHint) elements.checkoutItemHint.textContent = `Нийт дүн (${cartTotalQuantity()} бараа)`;
    }

    function applyCheckoutState() {
        const form = elements.checkoutForm;
        if (!form) return;
        $$('input[name="checkoutDelivery"]', form).forEach((radio) => { radio.checked = radio.value === state.checkoutDelivery; });
        $$('input[name="checkoutPayment"]', form).forEach((radio) => { radio.checked = radio.value === state.checkoutPayment; });
        $$("#checkoutForm .option-card", form).forEach((card) => {
            const input = card.querySelector('input[type="radio"]');
            if (input) card.classList.toggle("is-selected", input.checked);
        });
        const pickup = state.checkoutDelivery === "pickup";
        const addressWrap = document.getElementById("checkoutAddressFields");
        if (addressWrap) addressWrap.hidden = pickup;
        const pickupWrap = document.getElementById("checkoutPickupWrap");
        if (pickupWrap) pickupWrap.hidden = !pickup;
        const saveWrap = document.getElementById("checkoutSaveWrap");
        if (saveWrap) saveWrap.hidden = pickup;
        const note = document.getElementById("checkoutPaymentNote");
        if (note) note.textContent = paymentDemoNote();
        updateCheckoutSummary();
    }

    function handleCheckoutOptionChange(input) {
        if (!input || !input.name) return;
        if (input.name === "checkoutDelivery" && CHECKOUT_DELIVERY_NAMES[input.value]) {
            state.checkoutDelivery = input.value;
            clearCheckoutErrors();
        } else if (input.name === "checkoutPayment" && CHECKOUT_PAYMENT_NAMES[input.value]) {
            state.checkoutPayment = input.value;
        } else {
            return;
        }
        applyCheckoutState();
    }

    function setFieldError(inputId, message) {
        const input = document.getElementById(inputId);
        const error = document.querySelector(`[data-error-for="${inputId}"]`);
        if (input) {
            input.classList.add("is-invalid");
            input.setAttribute("aria-invalid", "true");
        }
        if (error) error.textContent = message;
    }

    function clearCheckoutErrors() {
        $$("#checkoutForm .field-error").forEach((node) => { node.textContent = ""; });
        $$("#checkoutForm input, #checkoutForm textarea").forEach((el) => el.classList.remove("is-invalid"));
    }

    function validateCheckout() {
        let firstInvalid = null;
        /* Өөрөө авах сонголтод гэрийн хаягийн талбарыг шаарддаггүй */
        const pickup = state.checkoutDelivery === "pickup";
        const checks = [
            ["checkoutName", (value) => value.length >= 3, "Хүлээн авагчийн бүтэн нэрийг оруулна уу."],
            ["checkoutPhone", (value) => (value.match(/\d/g) || []).length >= 8, "Утасны дугаар наасан дор хаяж 8 орон байх ёстой."]
        ];
        if (!pickup) {
            checks.push(
                ["checkoutCity", (value) => value.length >= 2, "Хот эсвэл аймгаа оруулна уу."],
                ["checkoutDistrict", (value) => value.length >= 2, "Дүүрэг эсвэл сумаа оруулна уу."],
                ["checkoutStreet", (value) => value.length >= 3, "Гудамж, байрны дугаараа оруулна уу."]
            );
        }
        checks.forEach(([id, test, message]) => {
            const value = textOf(id);
            if (!test(value)) {
                setFieldError(id, message);
                if (!firstInvalid) firstInvalid = id;
            }
        });
        return firstInvalid;
    }

    function openCheckout() {
        if (!state.cart.length) { showToast("Сагс тань хоосон байна.", true); return; }
        sanitizeCart();
        if (!state.cart.length) { showToast("Уучлаарай, сонгосон барааны үлдэгдэл дууссан байна.", true); return; }
        let adjusted = false;
        state.cart.forEach((item) => {
            const catalog = getCatalogItem(item.id);
            const stock = effectiveStock(catalog);
            if (item.qty > stock) { item.qty = stock; adjusted = true; }
        });
        state.cart = state.cart.filter((item) => item.qty > 0);
        if (!state.cart.length) { renderCart(); showToast("Уучлаарай, бүх барааны үлдэгдэл дууссан байна.", true); return; }
        if (adjusted) showToast("Зарим барааны тоо үлдэгдлийн хүрээнд багтаалаа.", true);
        renderCart();
        clearCheckoutErrors();
        applyCheckoutState();
        prefillCheckout();
        if (elements.checkoutSubmit) elements.checkoutSubmit.disabled = false;
        openExclusive(elements.checkoutModal);
    }

    function clearCheckoutForm() {
        if (elements.checkoutForm) elements.checkoutForm.reset();
        clearCheckoutErrors();
    }

    function handleCheckoutSubmit() {
        if (isPlacingOrder) return;
        clearCheckoutErrors();
        const firstInvalid = validateCheckout();
        if (firstInvalid) {
            showToast("Мэдээллийг бүрэн, зөв бөглөнө үү.", true);
            const el = document.getElementById(firstInvalid);
            if (el) el.focus();
            return;
        }
        sanitizeCart();
        if (!state.cart.length) {
            closePanel(elements.checkoutModal);
            showToast("Сагс тань хоосон болсон байна.", true);
            return;
        }
        isPlacingOrder = true;
        if (elements.checkoutSubmit) elements.checkoutSubmit.disabled = true;
        try {
            const user = currentUser();
            const info = {
                name: textOf("checkoutName"),
                phone: textOf("checkoutPhone"),
                email: user ? user.email : "",
                city: textOf("checkoutCity"),
                district: textOf("checkoutDistrict"),
                khoroo: textOf("checkoutKhoroo"),
                street: textOf("checkoutStreet"),
                extra: textOf("checkoutExtra"),
                note: textOf("checkoutNote")
            };
            const items = state.cart.map((item) => {
                const catalog = getCatalogItem(item.id);
                return { id: catalog.id, name: catalog.name, price: catalog.price, qty: item.qty, bundle: catalog.type === "bundle" };
            });
            const pickup = state.checkoutDelivery === "pickup";
            const subtotal = items.reduce((sum, item) => sum + item.price * item.qty, 0);
            const shippingFee = getShippingFee(subtotal);
            const total = subtotal + shippingFee;
            /* Төлбөрийн бодит интеграци байхгүй тул захиалгад demo гэж тэмдэглэнэ */
            const order = {
                code: `HT-${Date.now().toString(36).toUpperCase()}`,
                date: new Date().toISOString(),
                items,
                subtotal,
                shippingFee,
                total,
                delivery: {
                    type: state.checkoutDelivery,
                    name: CHECKOUT_DELIVERY_NAMES[state.checkoutDelivery] || "Гэрт хүргүүлэх",
                    address: {
                        city: info.city,
                        district: info.district,
                        khoroo: info.khoroo,
                        street: info.street,
                        extra: info.extra,
                        note: info.note
                    }
                },
                payment: {
                    method: state.checkoutPayment,
                    name: CHECKOUT_PAYMENT_NAMES[state.checkoutPayment] || "Демо",
                    status: "pending",
                    demo: true
                },
                customer: { ...info }
            };
            state.orders = state.orders.filter((item) => item && item.code && Array.isArray(item.items));
            state.orders.unshift(order);
            persistOrders();

            /* Үлдэгдлийг захиалга амжилттай бүртгэгдсэний дараа л нэг удаа бууруулна. */
            items.forEach((item) => {
                const catalog = getCatalogItem(item.id);
                if (!catalog) return;
                const remaining = Math.max(0, effectiveStock(catalog) - item.qty);
                if (remaining === catalog.stock) delete state.stockOverride[catalog.id];
                else state.stockOverride[catalog.id] = remaining;
            });
            persistStock();

            const saveWrap = document.getElementById("checkoutSaveAddress");
            if (!pickup && user && saveWrap && saveWrap.checked) {
                user.address = { ...info };
                user.phone = info.phone;
                persistUsers();
            }

            state.cart = [];
            renderCart();
            closePanel(elements.checkoutModal);
            clearCheckoutForm();
            if (elements.successMessage) {
                const deliveryText = pickup
                    ? "Дэлгүүрийн цэгээс өөрөө авна. Хүргэлтийн төлбөр: үнэгүй."
                    : `Гэрт хүргүүлнэ. Хүргэлтийн төлбөр: ${shippingFee === 0 ? "үнэгүй" : formatPrice(shippingFee)}.`;
                elements.successMessage.textContent = `Захиалга ${order.code} хүлээн авлаа. Нийт дүн: ${formatPrice(order.total)}. ${deliveryText} Төлбөрийн арга (${order.payment.name}) нь демо сонголт бөгөөд бодит төлбөрийг бидний ажилтан захиалга баталгаажуулахад нь л тооцно.`;
            }
            renderProducts();
            updateAccountButton();
            openPanel(elements.successModal);
            showToast("Захиалга амжилттай бүртгэгдлээ!");
        } finally {
            isPlacingOrder = false;
            if (elements.checkoutSubmit) elements.checkoutSubmit.disabled = false;
        }
    }

    /* =====================================================
       Хямдралын тоолуур
       ===================================================== */
    function pad(value) {
        return String(Math.max(0, value)).padStart(2, "0");
    }

    function startCountdown() {
        if (!elements.saleDays) return; /* Хямдралын тоолуур нүүр болон sales хуудаст л байдаг */
        const stored = readStorage(storageKeys.saleEnd, 0);
        saleEndAt = typeof stored === "number" && stored > Date.now() ? stored : 0;
        if (!saleEndAt) {
            saleEndAt = Date.now() + SALE_DURATION;
            writeStorage(storageKeys.saleEnd, saleEndAt);
        }
        const update = () => {
            let diff = saleEndAt - Date.now();
            if (diff <= 0) {
                saleEndAt = Date.now() + SALE_DURATION;
                writeStorage(storageKeys.saleEnd, saleEndAt);
                diff = saleEndAt - Date.now();
            }
            if (elements.saleDays) elements.saleDays.textContent = pad(Math.floor(diff / 86400000));
            if (elements.saleHours) elements.saleHours.textContent = pad(Math.floor(diff / 3600000) % 24);
            if (elements.saleMinutes) elements.saleMinutes.textContent = pad(Math.floor(diff / 60000) % 60);
            if (elements.saleSeconds) elements.saleSeconds.textContent = pad(Math.floor(diff / 1000) % 60);
        };
        update();
        if (countdownTimer) clearInterval(countdownTimer);
        countdownTimer = setInterval(update, 1000);
    }

    /* =====================================================
       Галерей
       ===================================================== */
    function buildGalleryLightbox() {
        const lightbox = document.createElement("div");
        lightbox.className = "gallery-lightbox";
        lightbox.id = "galleryLightbox";
        lightbox.setAttribute("role", "dialog");
        lightbox.setAttribute("aria-modal", "true");
        lightbox.setAttribute("aria-hidden", "true");
        lightbox.innerHTML = `<div class="gallery-lightbox-card">
            <button type="button" class="modal-close" data-action="close-gallery" aria-label="Галерейг хаах"><svg class="icon"><use href="#icon-close"></use></svg></button>
            <div class="gallery-lightbox-image"><span>🧸</span><img src="" alt="" hidden></div>
            <div class="gallery-lightbox-caption">
                <span class="modal-kicker">АЗ ЖАРГАЛ ГАЛЕРЕЙ</span>
                <h2 id="galleryLightboxTitle"></h2>
                <p>Бодит зураг бүр хүүхдэд аюулгүй, чанартай тоглоомын өдөр тутмын мөчийг харуулж байна.</p>
            </div>
        </div>`;
        document.body.appendChild(lightbox);
        return lightbox;
    }

    function openGalleryLightbox(index) {
        if (!elements.galleryLightbox) return;
        const item = galleryItems[Number(index)];
        if (!item) return;
        const image = $("img", elements.galleryLightbox);
        const emoji = $(".gallery-lightbox-image span", elements.galleryLightbox);
        const title = $("#galleryLightboxTitle", elements.galleryLightbox);
        if (image) {
            image.hidden = false;
            image.classList.remove("is-ready");
            image.alt = item.title;
            image.src = item.image;
            image.onload = () => image.classList.add("is-ready");
            image.onerror = () => { image.hidden = true; };
        }
        if (emoji) emoji.textContent = item.emoji;
        if (title) title.textContent = item.title;
        openExclusive(elements.galleryLightbox);
    }

    /* =====================================================
       Мобайл цэс, навигаци, гүйлгэлт
       ===================================================== */
    function setMenu(open) {
        if (!elements.mainNav) return;
        elements.mainNav.classList.toggle("is-open", open);
        if (elements.menuToggle) elements.menuToggle.setAttribute("aria-expanded", open ? "true" : "false");
    }

    function onScroll() {
        const y = window.scrollY;
        if (elements.header) elements.header.classList.toggle("is-scrolled", y > 8);
        if (elements.backToTop) elements.backToTop.classList.toggle("is-visible", y > 600);
        updateActiveNav();
    }

    function updateActiveNav() {
        if (!elements.mainNav) return;
        const links = $$(".nav-link", elements.mainNav);
        if (!links.length) return;
        if (pageName !== "home") {
            /* Олон хуудастай горим: body[data-page] дээр тулгуурлана */
            links.forEach((link) => link.classList.toggle("active", (link.getAttribute("data-nav-page") || "") === pageName));
            return;
        }
        const marker = window.scrollY + 150;
        let current = null;
        links.forEach((link) => {
            const id = (link.getAttribute("href") || "").replace("#", "");
            const section = id && !id.includes(".html") ? document.getElementById(id) : null;
            if (section && section.offsetTop <= marker) current = link;
        });
        if (!current) current = links[0];
        links.forEach((link) => link.classList.toggle("active", link === current));
    }

    /* =====================================================
       Глации=event delegation — бүх даралт, form
       ===================================================== */
    function handleAction(el) {
        const action = el.dataset.action;
        switch (action) {
            case "open-search":
                openExclusive(elements.searchModal);
                if (elements.modalSearchInput) {
                    elements.modalSearchInput.focus();
                    openSearchSuggest(elements.modalSearchInput);
                }
                break;
            case "close-search": closePanel(elements.searchModal); break;
            case "open-wishlist": renderWishlist(); openExclusive(elements.wishlistDrawer); break;
            case "close-wishlist": closePanel(elements.wishlistDrawer); break;
            case "open-cart": renderCart(); openExclusive(elements.cartDrawer); break;
            case "close-cart": closePanel(elements.cartDrawer); break;
            case "open-account": window.location.href = "account.html"; break;
            case "open-product": navigateToProduct(el.dataset.id); break;
            case "close-checkout": closePanel(elements.checkoutModal); break;
            case "close-success": closeAllPanels(); break;
            case "close-panels": setMenu(false); closeAllPanels(); break;
            case "close-gallery": closePanel(elements.galleryLightbox); break;
            case "toggle-menu":
                setMenu(!(elements.mainNav && elements.mainNav.classList.contains("is-open")));
                break;
            case "prev-slide": setSlide(state.slide - 1); resetSlideTimer(); break;
            case "next-slide": setSlide(state.slide + 1); resetSlideTimer(); break;
            case "add-cart": addToCart(el.dataset.id); break;
            case "cart-increase": changeCartQuantity(el.dataset.id, 1); break;
            case "cart-decrease": changeCartQuantity(el.dataset.id, -1); break;
            case "cart-remove": removeCartItem(el.dataset.id); break;
            case "toggle-wishlist": toggleWishlist(el.dataset.id); break;
            case "wishlist-add": addToCart(el.dataset.id); break;
            case "wishlist-remove": {
                const product = getProduct(el.dataset.id);
                state.wishlist = state.wishlist.filter((id) => id !== el.dataset.id);
                renderWishlist();
                renderProducts();
                if (product) showToast(`"${product.name}" хүссэн бараанаас хасагдлаа.`);
                break;
            }
            case "detail-add": addToCart(el.dataset.id); break;
            case "detail-wishlist": toggleWishlist(el.dataset.id); break;
            case "checkout": openCheckout(); break;
            case "go-products":
                closeAllPanels();
                if (elements.productGrid) scrollToSection("products");
                else window.location.href = "products.html";
                break;
            case "clear-filters": resetFilters(); break;
            case "remove-filter": removeFilter(el.dataset.filter || "all"); break;
            case "clear-search-history": clearSearchHistory(); break;
            case "order-toggle": {
                const node = document.querySelector(`[data-order-items="${el.dataset.index}"]`);
                if (node) {
                    node.hidden = !node.hidden;
                    el.setAttribute("aria-expanded", node.hidden ? "false" : "true");
                    el.textContent = node.hidden ? "Дэлгэрэнгүй" : "Хаах";
                }
                break;
            }
            case "address-new": profileAddressAction("address-new"); break;
            case "address-edit": profileAddressAction("address-edit", parseInt(el.dataset.index, 10)); break;
            case "address-delete": profileAddressAction("address-delete", parseInt(el.dataset.index, 10)); break;
            case "address-default": profileAddressAction("address-default", parseInt(el.dataset.index, 10)); break;
            case "address-cancel": profileAddressAction("address-cancel"); break;
            case "password-toggle": state.pwFormVisible = !state.pwFormVisible; renderAccountPage(); break;
            case "password-cancel": state.pwFormVisible = false; renderAccountPage(); break;
            case "data-export": handleDataExport(); break;
            case "show-sale":
                if (pageName === "products") {
                    state.saleOnly = true;
                    if (elements.categoryFilter) elements.categoryFilter.value = "all";
                    renderProducts();
                    scrollToSection("products");
                } else {
                    window.location.href = "sales.html";
                }
                break;
            case "subscribe": handleSubscribe(); break;
            case "account-tab": state.accountTab = el.dataset.tab === "register" ? "register" : "login"; renderAccountPage(); break;
            case "toggle-password": {
                const input = document.getElementById(el.dataset.target || "");
                if (input && input instanceof HTMLInputElement) {
                    const show = input.type === "password";
                    input.type = show ? "text" : "password";
                    el.textContent = show ? "Нуух" : "Харах";
                }
                break;
            }
            case "logout": logout(); break;
            case "profile-edit": state.profileEditing = true; renderAccountPage(); break;
            case "profile-cancel": state.profileEditing = false; renderAccountPage(); break;
            case "avatar-pick": {
                const input = document.getElementById("profileAvatarInput");
                if (input) input.click();
                break;
            }
            case "avatar-reset": {
                const avatarUser = currentUser();
                if (avatarUser && avatarUser.avatar) {
                    delete avatarUser.avatar;
                    if (!persistUsersGuarded()) persistUsers();
                    renderAccountPage();
                    showToast("Анхны зураг руу буцлаа.");
                }
                break;
            }
            /* --- Админ самбар --- */
            case "admin-view": state.adminView = el.dataset.view || "dashboard"; renderAdminPage(); break;
            case "admin-logout": handleAdminLogout(); break;
            case "admin-new-product": state.adminEditingId = "new"; renderAdminPage(); break;
            case "admin-edit-product": state.adminEditingId = el.dataset.id; renderAdminPage(); break;
            case "admin-cancel-edit": state.adminEditingId = null; renderAdminPage(); break;
            case "admin-delete-product": adminDeleteProduct(el.dataset.id); break;
            case "admin-user-edit": state.adminUserEditingId = el.dataset.email || null; renderAdminPage(); break;
            case "admin-user-cancel": state.adminUserEditingId = null; renderAdminPage(); break;
            case "admin-toggle-order": state.adminOrderOpenId = state.adminOrderOpenId === el.dataset.code ? null : el.dataset.code; renderAdminPage(); break;
            case "admin-toggle-request": state.adminRequestOpenId = state.adminRequestOpenId === el.dataset.id ? null : el.dataset.id; renderAdminPage(); break;
            case "admin-mark-read": adminSetRequestStatus(el.dataset.id, "read"); break;
            case "admin-mark-resolved": adminSetRequestStatus(el.dataset.id, "resolved"); break;
            default: break;
        }
    }

    function onDocumentClick(event) {
        const target = event.target instanceof Element ? event.target : null;
        if (!target) return;

        /* Хайлтын санал болгох товчууд (data-search-value) */
        const suggestion = target.closest("[data-search-value]");
        if (suggestion) { applySearchQuery(suggestion.getAttribute("data-search-value") || ""); return; }

        const actionEl = target.closest("[data-action]");
        if (actionEl) handleAction(actionEl);

        /* Дотоод хуудасны холбоос дээр бөмбөлөг шилжилт */
        const link = target.closest('a[href$=".html"], a[href*=".html?"]');
        if (link && !link.hasAttribute("target") && link.getAttribute("href") && !link.getAttribute("href").startsWith("http")) {
            spawnNavBubbles();
        }

        /* Хайлтын зөвлөмж — талбар, панелас гадна дарвал хаана */
        if (!target.closest(".search-suggest") && !target.closest("#productSearch") && !target.closest("#modalSearchInput") && !target.closest("#searchModal") && !target.closest('[data-action="open-search"]')) {
            closeSearchSuggest();
        }

        /* Мобайл цэс — гадна дарвал хаана */
        if (elements.mainNav && elements.mainNav.classList.contains("is-open")
            && !target.closest("#mainNav") && !target.closest(".menu-toggle")) {
            setMenu(false);
        }
    }

    function handleSubscribe() {
        const input = elements.emailInput;
        if (!input) return;
        const value = input.value.trim();
        if (!/^\S+@\S+\.\S+$/.test(value)) { showToast("Зөв и-мэйл хаяг оруулна уу.", true); input.focus(); return; }
        input.value = "";
        showToast("Баярлалаа! Аз жаргалын мэдээллийг тун удахгүй илгээнэ.");
    }

    /* Хэрэглэгчийн хүсэлт админ самбарт очдог болгох (локал демо хадгалалт) */
    function handleContactSubmit() {
        const name = textOf("contactName").trim();
        const contact = textOf("contactPhone").trim();
        const type = textOf("contactType") || "Санал, хүсэлт";
        const message = textOf("contactMessage").trim();
        if (name.length < 2) { showToast("Нэрээ оруулна уу.", true); return; }
        const isEmail = /^\S+@\S+\.\S+$/.test(contact);
        const isPhone = contact.replace(/\D/g, "").length >= 8;
        if (!isEmail && !isPhone) { showToast("Зөв и-мэйл эсвэл утасны дугаар оруулна уу.", true); return; }
        if (message.length < 5) { showToast("Хүсэлтийн дэлгэрэнгүйг оруулна уу.", true); return; }
        const request = {
            id: `req-${Date.now().toString(36)}`,
            name,
            contact,
            type,
            message,
            createdAt: new Date().toISOString(),
            status: "new"
        };
        state.requests.push(request);
        persistRequests();
        const form = document.getElementById("contactForm");
        if (form) form.reset();
        showToast("Хүсэлт амжилттай илгээгдлээ. Бид удахгүй хариу илгээнэ.");
    }

    function onDocumentSubmit(event) {
        const form = event.target instanceof HTMLFormElement ? event.target : null;
        if (!form) return;
        switch (form.id) {
            case "searchForm": {
                event.preventDefault();
                const value = elements.modalSearchInput ? elements.modalSearchInput.value.trim() : "";
                closeSearchSuggest();
                if (value) applySearchQuery(value);
                break;
            }
            case "contactForm":
                event.preventDefault();
                handleContactSubmit();
                break;
            case "adminLoginForm": event.preventDefault(); handleAdminLogin(); break;
            case "adminProductForm": event.preventDefault(); handleAdminProductSubmit(); break;
            case "adminProductSearchForm":
                event.preventDefault();
                state.adminProductSearch = textOf("adminProductSearch");
                renderAdminProductsTable();
                break;
            case "adminUserSearchForm":
                event.preventDefault();
                state.adminUserSearch = textOf("adminUserSearch");
                renderAdminPage();
                break;
            case "adminUserForm": event.preventDefault(); handleAdminUserSubmit(); break;
            case "checkoutForm": event.preventDefault(); handleCheckoutSubmit(); break;
            case "loginForm": event.preventDefault(); handleLogin(); break;
            case "registerForm": event.preventDefault(); handleRegister(); break;
            case "profileForm": event.preventDefault(); handleProfileSave(); break;
            case "addressForm": event.preventDefault(); handleAddressSave(); break;
            case "passwordForm": event.preventDefault(); handlePasswordChange(); break;
            default: break;
        }
    }

    function onDocumentKeydown(event) {
        if (event.key === "Escape") {
            closeSearchSuggest();
            if (elements.mainNav && elements.mainNav.classList.contains("is-open")) setMenu(false);
            if (anyPanelOpen()) closeAllPanels();
        }
        /* Хайлтын талбар дээр Enter дарж хайна */
        if (event.key === "Enter" && (event.target === elements.productSearch || event.target === elements.modalSearchInput)) {
            event.preventDefault();
            handleSearchSubmitUI(event.target);
        }
    }

    /* =====================================================
       Element cache
       ===================================================== */
    function cacheElements() {
        elements = {
            header: $("#siteHeader"),
            mainNav: $("#mainNav"),
            menuToggle: $(".menu-toggle"),
            pageOverlay: $("#pageOverlay"),
            toast: $("#toast"),
            toastMessage: $("#toastMessage"),
            backToTop: $("#backToTop"),
            currentYear: $("#currentYear"),
            cartTrigger: $(".cart-trigger"),
            cartCount: $("#cartCount"),
            cartQuantityInline: $("#cartQuantityInline"),
            wishlistCount: $("#wishlistCount"),
            accountName: $("#accountName"),
            accountDot: $("#accountDot"),
            currentSlide: $("#currentSlide"),
            heroSlides: $$(".hero-slide"),
            heroArts: $$(".hero-art"),
            sliderDots: $$(".slider-dot"),
            slidesWrap: $(".hero-slides"),
            categoryCards: $$(".category-card"),
            categoryCounts: $$("[data-cat-count]"),
            productGrid: $("#productGrid"),
            emptyResults: $("#emptyResults"),
            resultCount: $("#resultCount"),
            resultsLine: $("#resultsLine"),
            activeChips: $("#activeChips"),
            activeFilterWrap: $("#activeFilterWrap"),
            activeFilterText: $("#activeFilterText"),
            productSearch: $("#productSearch"),
            categoryFilter: $("#categoryFilter"),
            sortFilter: $("#sortFilter"),
            filterMin: $("#filterMinPrice"),
            filterMax: $("#filterMaxPrice"),
            filterAge: $("#filterAge"),
            filterStock: $("#filterStock"),
            productSuggest: $("#productSuggest"),
            modalSuggest: $("#modalSuggest"),
            showSaleButton: $("#showSale"),
            saleDays: $("#days"),
            saleHours: $("#hours"),
            saleMinutes: $("#minutes"),
            saleSeconds: $("#seconds"),
            galleryTiles: $$(".gallery-tile"),
            emailInput: $("#emailInput"),
            searchModal: $("#searchModal"),
            modalSearchInput: $("#modalSearchInput"),
            searchForm: $("#searchForm"),
            cartDrawer: $("#cartDrawer"),
            cartItems: $("#cartItems"),
            cartFooter: $("#cartFooter"),
            cartTotal: $("#cartTotal"),
            cartPageItems: $("#cartPageItems"),
            cartPageSummary: $("#cartPageSummary"),
            cartPageTotal: $("#cartPageTotal"),
            wishlistDrawer: $("#wishlistDrawer"),
            wishlistItems: $("#wishlistItems"),
            wishlistCountInline: $("#wishlistCountInline"),
            productModal: $("#productModal"),
            productModalBody: $("#productModalBody"),
            accountModal: $("#accountModal"),
            accountBody: $("#accountBody"),
            accountPageBody: $("#accountPageBody"),
            pageDetail: $("#pageDetail"),
            favoritesGrid: $("#favoritesGrid"),
            favoritesEmpty: $("#favoritesEmpty"),
            bundleShowcase: $("#bundleShowcase"),
            bundleKicker: $("#bundleKicker"),
            bundleHeading: $("#bundleHeading"),
            bundleNote: $("#bundleNote"),
            bundleGrid: $("#bundleGrid"),
            bundlesGrid: $("#bundlesGrid"),
            bundlePageIntro: $("#bundlePageIntro"),
            bundlePageEmpty: $("#bundlePageEmpty"),
            checkoutModal: $("#checkoutModal"),
            checkoutForm: $("#checkoutForm"),
            checkoutTotal: $("#checkoutTotal"),
            checkoutItemHint: $("#checkoutItemHint"),
            checkoutSubmit: $("#checkoutSubmit"),
            successModal: $("#successModal"),
            successMessage: $("#successMessage"),
            galleryLightbox: null,
            adminApp: $("#adminApp")
        };
    }

    /* =====================================================
       Статик event listener-үүд
       ===================================================== */
    function bindStaticEvents() {
        elements.sliderDots.forEach((dot, index) => {
            dot.addEventListener("click", () => { setSlide(index); resetSlideTimer(); });
        });

        elements.categoryCards.forEach((card) => {
            card.addEventListener("click", (event) => {
                const key = card.getAttribute("data-category");
                if (!key || !categoryNames[key]) return;
                /* Нүүр/ангиллын хуудаснаас шууч шүүлтүүртэй products хуудас руу шилжинэ */
                if (pageName !== "products" && pageName !== "sales") {
                    window.location.href = `products.html?category=${encodeURIComponent(key)}`;
                    return;
                }
                state.category = key;
                if (elements.categoryFilter) elements.categoryFilter.value = key;
                renderProducts();
                scrollToSection("products");
            });
        });

        elements.galleryTiles.forEach((tile) => {
            tile.addEventListener("click", () => {
                const index = Number(tile.getAttribute("data-gallery"));
                if (Number.isInteger(index)) openGalleryLightbox(index);
            });
        });

        if (elements.productSearch) {
            elements.productSearch.addEventListener("input", () => {
                state.query = elements.productSearch.value || "";
                renderProducts();
                openSearchSuggest(elements.productSearch);
            });
            elements.productSearch.addEventListener("focus", () => openSearchSuggest(elements.productSearch));
        }
        if (elements.modalSearchInput) {
            elements.modalSearchInput.addEventListener("input", () => openSearchSuggest(elements.modalSearchInput));
            elements.modalSearchInput.addEventListener("focus", () => openSearchSuggest(elements.modalSearchInput));
        }
        if (elements.categoryFilter) {
            elements.categoryFilter.addEventListener("change", () => {
                state.category = elements.categoryFilter.value || "all";
                renderProducts();
            });
        }
        if (elements.sortFilter) {
            elements.sortFilter.addEventListener("change", () => {
                state.sort = elements.sortFilter.value || "featured";
                renderProducts();
            });
        }
        if (elements.filterAge) {
            elements.filterAge.addEventListener("change", () => {
                state.age = elements.filterAge.value || "";
                renderProducts();
            });
        }
        if (elements.filterStock) {
            elements.filterStock.addEventListener("change", () => {
                state.inStock = elements.filterStock.checked;
                renderProducts();
            });
        }
        [elements.filterMin, elements.filterMax].forEach((input, index) => {
            if (!input) return;
            input.addEventListener("change", () => {
                const isMin = index === 0;
                const minValue = parseInt(elements.filterMin ? elements.filterMin.value : "", 10);
                const maxValue = parseInt(elements.filterMax ? elements.filterMax.value : "", 10);
                if (Number.isFinite(minValue) && Number.isFinite(maxValue) && minValue > maxValue) {
                    showToast("Үнийн хязгаар буруу байна: доод хязгаар дээд хязгаараас бага байх ёстой.", true);
                    if (isMin && elements.filterMin) elements.filterMin.value = "";
                    else if (!isMin && elements.filterMax) elements.filterMax.value = "";
                    return;
                }
                state.minPrice = Number.isFinite(minValue) ? String(minValue) : "";
                state.maxPrice = Number.isFinite(maxValue) ? String(maxValue) : "";
                renderProducts();
            });
        });

        /* Hero — хуруу шударснаар слайд өөрчлөгдөнө */
        if (elements.slidesWrap) {
            elements.slidesWrap.addEventListener("touchstart", (event) => {
                touchStartX = event.changedTouches[0].clientX;
            }, { passive: true });
            elements.slidesWrap.addEventListener("touchend", (event) => {
                const delta = event.changedTouches[0].clientX - touchStartX;
                if (Math.abs(delta) > 45) {
                    setSlide(state.slide + (delta < 0 ? 1 : -1));
                    resetSlideTimer();
                }
            }, { passive: true });
        }

        window.addEventListener("scroll", onScroll, { passive: true });

        if (elements.backToTop) {
            elements.backToTop.addEventListener("click", () => {
                window.scrollTo({ top: 0, behavior: "smooth" });
            });
        }

        if (elements.mainNav) {
            $$(".nav-link", elements.mainNav).forEach((link) => {
                link.addEventListener("click", () => setMenu(false));
            });
        }

        document.addEventListener("click", onDocumentClick);
        document.addEventListener("submit", onDocumentSubmit);
        document.addEventListener("keydown", onDocumentKeydown);
        document.addEventListener("change", onDocumentChange);
    }

    function onDocumentChange(event) {
        const target = event.target;
        if (!(target instanceof Element)) return;
        /* Төлбөр болон хүргэлтийн radio сонголт */
        if (target.name === "checkoutDelivery" || target.name === "checkoutPayment") {
            handleCheckoutOptionChange(target);
            return;
        }
        /* Прóфайлын зураг файл сонгосон */
        if (target.id === "profileAvatarInput") {
            const file = target.files && target.files[0];
            handleAvatarFile(file);
            target.value = "";
        }
        /* Админ: ангиллын шүүлт болон захиалгын төлөв */
        if (target.id === "adminProductCategoryFilter") {
            state.adminProductCategory = target.value || "all";
            renderAdminProductsTable();
            return;
        }
        if (target.id === "adminOrderStatus") {
            adminSetOrderStatus(target.getAttribute("data-code"), target.value);
            return;
        }
    }

    /* =====================================================
       АДМИН САМБАР (демо, localStorage-д суурилсан)
       -----------------------------------------------------
       Тайлбар: backend байхгүй тул энэ админ самбар нь зөвхөн
       локал демо. Нууц үг hash-ээр хадгалагддаг боловч production-
       д серверийн authentication шаардлагатай.
       ===================================================== */
    const DEMO_ADMIN_EMAIL = "admin@happy.toy";
    const DEMO_ADMIN_PASSWORD = "admin123";
    const ORDER_STATUSES = {
        new: "Шинэ",
        processing: "Бэлтгэл үргэлжилж байна",
        delivered: "Хүргэгдсэн",
        cancelled: "Цуцлагдсан"
    };
    const REQUEST_STATUSES = {
        new: "Шинэ",
        read: "Уншсан",
        resolved: "Шийдвэрлэсэн"
    };

    function persistAdmins() { writeStorage(storageKeys.admins, state.admins); }
    function persistAdminSession() { writeStorage(storageKeys.adminSession, state.adminSession); }
    function persistAdminProducts() { writeStorage(storageKeys.adminProducts, state.adminProducts); }
    function persistAdminDeleted() { writeStorage(storageKeys.adminDeleted, state.adminDeleted); }
    function persistAdminOverrides() { writeStorage(storageKeys.adminOverrides, state.adminOverrides); }
    function persistRequests() { writeStorage(storageKeys.requests, state.requests); }

    function seedDemoAdmin() {
        if (!Array.isArray(state.admins)) state.admins = [];
        if (state.admins.some((admin) => admin && admin.email === DEMO_ADMIN_EMAIL)) return;
        state.admins.push({ email: DEMO_ADMIN_EMAIL, hash: hashPassword(DEMO_ADMIN_PASSWORD), name: "Демо админ", role: "admin", demo: true });
        persistAdmins();
    }

    function adminLoggedIn() {
        return Boolean(state.adminSession && state.adminSession.email);
    }

    function formatDate(value) {
        const date = new Date(value);
        if (Number.isNaN(date.getTime())) return "—";
        const pad = (num) => String(num).padStart(2, "0");
        return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
    }

    /* ---------------- Админ: бараа ---------------- */
    function baseProduct(id) {
        return products.find((product) => product.id === id) || null;
    }

    function allProducts() {
        const deleted = state.adminDeleted || {};
        const overrides = state.adminOverrides || {};
        const base = products
            .filter((product) => !deleted[product.id])
            .map((product) => overrides[product.id] ? Object.assign({}, product, overrides[product.id]) : product);
        const added = Array.isArray(state.adminProducts) ? state.adminProducts : [];
        return base.concat(added);
    }

    function adminEditingProduct() {
        const id = state.adminEditingId;
        if (!id || id === "new") return null;
        return allProducts().find((product) => product.id === id) || null;
    }

    function adminProductRows() {
        const query = (state.adminProductSearch || "").trim().toLowerCase();
        const category = state.adminProductCategory || "all";
        return allProducts().filter((product) => {
            if (category !== "all" && product.category !== category) return false;
            if (query && !String(product.name || "").toLowerCase().includes(query) && !String(product.id || "").toLowerCase().includes(query)) return false;
            return true;
        });
    }

    function adminProductTableHtml() {
        const rows = adminProductRows();
        if (!rows.length) return `<div class="empty-results"><span>🔎</span><h3>Бараа олдсонгүй</h3></div>`;
        return `<div class="table-scroll"><table class="admin-table"><thead><tr>
            <th>Зураг</th><th>Нэр</th><th>Ангилал</th><th>Үнэ</th><th>Хямдрал</th><th>Үлдэгдэл</th><th>Үйлдэл</th>
        </tr></thead><tbody>${rows.map((product) => {
            const discount = discountPercent(product);
            const stock = effectiveStock(product);
            return `<tr>
                <td><span class="admin-thumb">${product.image ? `<img src="${escapeHtml(product.image)}" alt="${escapeHtml(product.name)}" loading="lazy">` : escapeHtml(product.emoji || "🧸")}</span></td>
                <td><b>${escapeHtml(product.name)}</b><small>${escapeHtml(product.id)}</small></td>
                <td>${escapeHtml(categoryNames[product.category] || product.category)}</td>
                <td>${formatPrice(product.price)}</td>
                <td>${discount ? `<span class="badge badge-sale">-${discount}%</span>` : "—"}</td>
                <td><span class="badge ${stock > 0 ? "badge-stock" : "badge-out"}">${stock}</span></td>
                <td class="admin-actions">
                    <button class="button button-ghost sm" data-action="admin-edit-product" data-id="${escapeHtml(product.id)}">Засах</button>
                    <button class="button button-ghost sm danger" data-action="admin-delete-product" data-id="${escapeHtml(product.id)}">Устгах</button>
                </td>
            </tr>`;
        }).join("")}</tbody></table></div>`;
    }

    function adminProductFormHtml() {
        const editing = adminEditingProduct();
        const isNew = state.adminEditingId === "new";
        const value = (key, fallback) => (editing && editing[key] !== undefined ? escapeHtml(editing[key]) : fallback);
        return `<form class="admin-form card" id="adminProductForm" novalidate>
            <h3>${isNew ? "Шинэ бараа нэмэх" : "Бараа засах"}</h3>
            <input type="hidden" id="adminProductId" value="${isNew ? "new" : escapeHtml(editing.id)}">
            <div class="form-grid">
                <div class="form-field"><label for="adminProductName">Барааны нэр</label><input id="adminProductName" type="text" value="${value("name", "")}"></div>
                <div class="form-field"><label for="adminProductCategory">Ангилал</label><select id="adminProductCategory">${Object.keys(categoryNames).map((key) => `<option value="${key}"${editing && editing.category === key ? " selected" : ""}>${escapeHtml(categoryNames[key])}</option>`).join("")}</select></div>
                <div class="form-field"><label for="adminProductPrice">Үнэ (₮)</label><input id="adminProductPrice" type="number" min="0" step="100" value="${value("price", "")}"></div>
                <div class="form-field"><label for="adminProductOldPrice">Хуучин үнэ (хямдрал)</label><input id="adminProductOldPrice" type="number" min="0" step="100" value="${value("oldPrice", "")}"></div>
                <div class="form-field"><label for="adminProductStock">Үлдэгдэл</label><input id="adminProductStock" type="number" min="0" value="${editing ? effectiveStock(editing) : ""}"></div>
                <div class="form-field"><label for="adminProductImage">Зурагны URL</label><input id="adminProductImage" type="url" placeholder="https://..." value="${value("image", "")}"></div>
                <div class="form-field"><label for="adminProductEmoji">Тэмдэг (зураг байхгүй үед)</label><input id="adminProductEmoji" maxlength="4" value="${value("emoji", "🧸")}"></div>
                <div class="form-field"><label for="adminProductDescription">Тайлбар</label><input id="adminProductDescription" type="text" value="${value("description", "")}"></div>
            </div>
            <div class="admin-form-actions">
                <button class="button button-primary" type="submit">${isNew ? "Нэмэх" : "Шинэчлэх"}</button>
                <button class="button button-ghost" type="button" data-action="admin-cancel-edit">Цуцлах</button>
            </div>
        </form>`;
    }

    function handleAdminProductSubmit() {
        const idRaw = (textOf("adminProductId") || "").trim();
        const name = textOf("adminProductName").trim();
        const category = textOf("adminProductCategory") || "soft";
        const price = Math.round(Number(textOf("adminProductPrice")) || 0);
        const oldPriceRaw = Math.round(Number(textOf("adminProductOldPrice")) || 0);
        const stock = Math.max(0, Math.floor(Number(textOf("adminProductStock")) || 0));
        const image = (textOf("adminProductImage") || "").trim();
        const emoji = (textOf("adminProductEmoji") || "🧸").trim();
        const description = textOf("adminProductDescription").trim();
        if (name.length < 2) { showToast("Барааны нэрийг оруулна уу.", true); return; }
        if (!categoryNames[category]) { showToast("Ангилалыг сонгоно уу.", true); return; }
        if (!Number.isFinite(price) || price <= 0) { showToast("Үнийг зөв оруулна уу.", true); return; }
        if (image && !/^https?:\/\//.test(image)) { showToast("Зурагны хаяг зөв URL байх ёстой.", true); return; }
        const oldPrice = oldPriceRaw > price ? oldPriceRaw : 0;
        if (!Array.isArray(state.adminProducts)) state.adminProducts = [];
        if (!state.adminOverrides || typeof state.adminOverrides !== "object") state.adminOverrides = {};
        const addedIndex = state.adminProducts.findIndex((product) => product && product.id === idRaw);
        if (addedIndex >= 0) {
            const product = state.adminProducts[addedIndex];
            product.name = name;
            product.category = category;
            product.price = price;
            product.oldPrice = oldPrice;
            product.stock = stock;
            product.image = image;
            product.emoji = emoji || "🧸";
            product.description = description || name;
            persistAdminProducts();
            state.adminEditingId = null;
            renderAdminPage();
            showToast("Бараа шинэчлэгдлээ.");
            return;
        }
        if (idRaw && idRaw !== "new" && baseProduct(idRaw)) {
            state.adminOverrides[idRaw] = {
                name, category, price, oldPrice, stock, image, emoji: emoji || "🧸",
                description: description || name
            };
            persistAdminOverrides();
            state.adminEditingId = null;
            renderAdminPage();
            showToast("Бараа шинэчлэгдлээ.");
            return;
        }
        if (idRaw && idRaw !== "new") { showToast("Бараа олдсонгүй.", true); return; }
        state.adminProducts.push({
            id: `admin-${Date.now().toString(36)}`,
            name, category, price, oldPrice, stock, image, emoji: emoji || "🧸",
            description: description || name,
            rating: 0, reviews: 0, age: "3–8 нас", size: "—", material: "—",
            adminAdded: true
        });
        persistAdminProducts();
        state.adminEditingId = null;
        renderAdminPage();
        showToast("Шинэ бараа нэмэгдлээ.");
    }

    function adminDeleteProduct(id) {
        if (!id) return;
        const addedIndex = (state.adminProducts || []).findIndex((product) => product && product.id === id);
        if (addedIndex >= 0) {
            state.adminProducts.splice(addedIndex, 1);
            persistAdminProducts();
        } else if (baseProduct(id)) {
            if (!state.adminDeleted || typeof state.adminDeleted !== "object") state.adminDeleted = {};
            state.adminDeleted[id] = true;
            persistAdminDeleted();
        } else {
            showToast("Бараа олдсонгүй.", true);
            return;
        }
        if (state.adminEditingId === id) state.adminEditingId = null;
        renderAdminPage();
        showToast("Бараа устгагдлаа.");
    }

    /* ---------------- Админ: захиалга ---------------- */
    function orderStatus(order) {
        return order && order.status ? order.status : "new";
    }

    function displayText(value, fallback = "—") {
        if (value === null || value === undefined || value === "") return fallback;
        return String(value).trim() || fallback;
    }

    function orderAddressSummary(order) {
        const customer = order && order.customer ? order.customer : {};
        const parts = [
            customer.city,
            customer.district,
            customer.khoroo,
            customer.street,
            customer.extra
        ].filter((part) => String(part || "").trim());
        return parts.length ? parts.join(", ") : "Байр, хаяг оруулаагүй";
    }

    function adminOrderDetailHtml(order) {
        const customer = order && order.customer ? order.customer : {};
        const payment = order && order.payment ? order.payment : {};
        const delivery = order && order.delivery ? order.delivery : {};
        const shippingLabel = delivery.name || "Гэрт хүргүүлэх";
        const paymentStatus = payment.status || "Батлагдаагүй";
        const paymentLabel = payment.name || "Демо";
        return `<div class="admin-order-detail-card">
            <div class="admin-detail-row"><span>Захиалгын дугаар</span><b>${escapeHtml(order.code || "—")}</b></div>
            <div class="admin-detail-row"><span>Огноо</span><b>${escapeHtml(formatDate(order.date))}</b></div>
            <div class="admin-detail-row"><span>Төлөв</span><b>${escapeHtml(ORDER_STATUSES[orderStatus(order)] || orderStatus(order))}</b></div>
            <div class="admin-detail-row"><span>Хүлээн авагч</span><b>${escapeHtml(displayText(customer.name, "—"))}</b></div>
            <div class="admin-detail-row"><span>Утас</span><b>${escapeHtml(displayText(customer.phone, "—"))}</b></div>
            <div class="admin-detail-row"><span>И-мэйл</span><b>${escapeHtml(displayText(customer.email, "—"))}</b></div>
            <div class="admin-detail-row"><span>Хүргэлтийн төрөл</span><b>${escapeHtml(shippingLabel)}</b></div>
            <div class="admin-detail-row"><span>Бүртгэлтэй хаяг</span><b>${escapeHtml(orderAddressSummary(order))}</b></div>
            <div class="admin-detail-row"><span>Хот, аймаг</span><b>${escapeHtml(displayText(customer.city, "—"))}</b></div>
            <div class="admin-detail-row"><span>Дүүрэг, сум</span><b>${escapeHtml(displayText(customer.district, "—"))}</b></div>
            <div class="admin-detail-row"><span>Хороо, баг</span><b>${escapeHtml(displayText(customer.khoroo, "Бөглөөгүй"))}</b></div>
            <div class="admin-detail-row"><span>Гудамж, байр</span><b>${escapeHtml(displayText(customer.street, "—"))}</b></div>
            <div class="admin-detail-row"><span>Орц, давхар, хаалга</span><b>${escapeHtml(displayText(customer.extra, "Бөглөөгүй"))}</b></div>
            <div class="admin-detail-row"><span>Тэмдэглэл</span><b>${escapeHtml(displayText(customer.note, "Бөглөөгүй"))}</b></div>
            <div class="admin-detail-row"><span>Төлбөр</span><b>${escapeHtml(paymentLabel)} · ${escapeHtml(paymentStatus)}</b></div>
            <div class="admin-detail-row"><span>Үнийн дүн</span><b>${formatPrice(order.subtotal)} + хүргэлт ${formatPrice(order.shippingFee)} = ${formatPrice(order.total)}</b></div>
            <div class="admin-order-items">${(order.items || []).map((item) => {
                const catalog = getCatalogItem(item.id);
                return `<div class="admin-order-item"><span>${catalog ? escapeHtml(catalog.name) : escapeHtml(item.name || item.id)}</span><b>${Number(item.qty) || 0} × ${formatPrice(Number(item.price) || 0)}</b></div>`;
            }).join("")}</div>
            <div class="form-field"><label for="adminOrderStatus">Захиалгын төлөв</label>
                <select id="adminOrderStatus" data-code="${escapeHtml(order.code || "")}">
                    ${Object.keys(ORDER_STATUSES).map((key) => `<option value="${key}"${orderStatus(order) === key ? " selected" : ""}>${ORDER_STATUSES[key]}</option>`).join("")}
                </select>
            </div>
        </div>`;
    }

    function adminSetOrderStatus(code, status) {
        const order = state.orders.find((item) => item && item.code === code);
        if (!order || !ORDER_STATUSES[status]) return;
        order.status = status;
        persistOrders();
        renderAdminPage();
        showToast("Захиалгын төлөв шинэчлэгдлээ.");
    }

    /* ---------------- Админ: хүсэлт ---------------- */
    function requestStatus(request) {
        return request && request.status ? request.status : "new";
    }

    function adminRequestDetailHtml(request, id) {
        return `<div class="admin-order-detail-card">
            <div class="admin-detail-row"><span>Холбогдох</span><b>${escapeHtml(request.contact || "—")}</b></div>
            <div class="admin-detail-row"><span>Төрөл</span><b>${escapeHtml(request.type || "—")}</b></div>
            <div class="admin-detail-row admin-detail-message"><span>Дэлгэрэнгүй</span><p>${escapeHtml(request.message || "—")}</p></div>
            <div class="admin-form-actions">
                <button class="button button-ghost sm" data-action="admin-mark-read" data-id="${escapeHtml(id)}">Уншсан</button>
                <button class="button button-primary sm" data-action="admin-mark-resolved" data-id="${escapeHtml(id)}">Шийдвэрлэсэн</button>
            </div>
        </div>`;
    }

    function adminSetRequestStatus(id, status) {
        const request = state.requests.find((item) => item && item.id === id);
        if (!request || !REQUEST_STATUSES[status]) return;
        request.status = status;
        persistRequests();
        renderAdminPage();
        showToast(status === "resolved" ? "Хүсэлтийг шийдвэрлэсэн гэж тэмдэглэлээ." : "Хүсэлтийг уншсан гэж тэмдэглэлээ.");
    }

    /* ---------------- Борлуулалтын статистик ---------------- */
    function salesStats() {
        const perProduct = new Map();
        let revenue = 0;
        let units = 0;
        const statusCounts = {};
        state.orders.forEach((order) => {
            if (!order || !Array.isArray(order.items)) return;
            const status = orderStatus(order);
            statusCounts[status] = (statusCounts[status] || 0) + 1;
            if (status === "cancelled") return;
            revenue += Number(order.total) || 0;
            order.items.forEach((item) => {
                const catalog = getCatalogItem(item.id);
                const qty = Number(item.qty) || 0;
                units += qty;
                const entry = perProduct.get(item.id) || { id: item.id, name: catalog ? catalog.name : item.id, units: 0, revenue: 0 };
                entry.units += qty;
                entry.revenue += (catalog ? catalog.price : 0) * qty;
                perProduct.set(item.id, entry);
            });
        });
        const list = [...perProduct.values()];
        return {
            revenue,
            units,
            orderCount: state.orders.length,
            productCount: allProducts().length,
            byProduct: list,
            topByUnits: list.slice().sort((a, b) => b.units - a.units),
            topByRevenue: list.slice().sort((a, b) => b.revenue - a.revenue),
            statusCounts
        };
    }

    /* ---------------- Админ: хэсэгний HTML ---------------- */
    function adminStatCard(label, value, icon) {
        return `<div class="admin-stat card"><span class="admin-stat-icon">${icon}</span><div><b>${value}</b><small>${escapeHtml(label)}</small></div></div>`;
    }

    function adminNavItem(view, label, badge) {
        const active = state.adminView === view ? " is-active" : "";
        return `<button type="button" class="admin-nav-item${active}" data-action="admin-view" data-view="${view}">${escapeHtml(label)}${badge ? `<span class="admin-badge">${badge}</span>` : ""}</button>`;
    }

    function adminShellHtml(view) {
        const freshRequests = state.requests.filter((request) => requestStatus(request) === "new").length;
        return `<div class="admin-shell">
            <aside class="admin-sidebar">
                <a class="admin-brand" href="index.html"><span class="brand-mark">🧸</span><span>Аз жаргалын <strong>тоглоом</strong></span></a>
                <div class="admin-user"><span class="admin-avatar">🛠</span><div><b>${escapeHtml((state.adminSession && state.adminSession.email) || "")}</b><small>Админ · демо сесс</small></div></div>
                <nav class="admin-nav">
                    ${adminNavItem("dashboard", "Хяналтын самбар")}
                    ${adminNavItem("products", "Барааны удирдлага")}
                    ${adminNavItem("stats", "Борлуулалтын статистик")}
                    ${adminNavItem("orders", "Захиалгын удирдлага")}
                    ${adminNavItem("users", "Хэрэглэгчид")}
                    ${adminNavItem("requests", "Хэрэглэгчдийн хүсэлт", freshRequests)}
                </nav>
                <div class="admin-sidebar-footer">
                    <a class="button button-ghost" href="index.html">Сайт руу буцах</a>
                    <button class="button button-ghost danger" data-action="admin-logout">Гарах</button>
                </div>
            </aside>
            <main class="admin-main">${adminViewHtml(view)}</main>
        </div>`;
    }

    function adminDashboardHtml() {
        const stats = salesStats();
        return `<div class="admin-page-head"><h1>Хяналтын самбар</h1><p>Өгөгдөл энэ төхөөрөмжийн localStorage-с уншигддаг (демо).</p></div>
        <div class="admin-stats">
            ${adminStatCard("Нийт бараа", String(stats.productCount), "🧸")}
            ${adminStatCard("Нийт захиалга", String(stats.orderCount), "📦")}
            ${adminStatCard("Борлуулалтын орлого", formatPrice(stats.revenue), "💰")}
            ${adminStatCard("Борлуулсан ширхэг", String(stats.units), "📈")}
        </div>
        <div class="admin-cols">
            <div class="admin-panel card"><h3>Сүүлийн захиалгууд</h3>${adminRecentOrdersHtml()}</div>
            <div class="admin-panel card"><h3>Шинэ хүсэлтүүд</h3>${adminRecentRequestsHtml()}</div>
        </div>`;
    }

    function adminProductsHtml() {
        const editing = state.adminEditingId;
        return `<div class="admin-page-head"><h1>Барааны удирдлага</h1><p>Бүтээгдхүүн нэмэх, засах, устгах.</p></div>
        ${editing ? adminProductFormHtml() : ""}
        <div class="admin-toolbar card">
            <form class="admin-search" id="adminProductSearchForm" novalidate>
                <input id="adminProductSearch" type="search" placeholder="Барааны нэр хайх" value="${escapeHtml(state.adminProductSearch || "")}">
                <button class="button button-ghost sm" type="submit">Хайх</button>
            </form>
            <select id="adminProductCategoryFilter">${["all", ...Object.keys(categoryNames)].map((key) => `<option value="${key}"${state.adminProductCategory === key ? " selected" : ""}>${key === "all" ? "Бүх ангилал" : escapeHtml(categoryNames[key])}</option>`).join("")}</select>
            <button class="button button-primary" data-action="admin-new-product">+ Шинэ бараа</button>
            <span class="muted" id="adminProductsCount">${adminProductRows().length} бараа</span>
        </div>
        <div class="admin-panel card" id="adminProductsTable">${adminProductTableHtml()}</div>`;
    }

    function adminStatsHtml() {
        const stats = salesStats();
        const hasData = stats.byProduct.length > 0;
        return `<div class="admin-page-head"><h1>Борлуулалтын статистик</h1></div>
        ${hasData ? `<div class="admin-stats">
            ${adminStatCard("Нийт орлого", formatPrice(stats.revenue), "💰")}
            ${adminStatCard("Борлуулсан ширхэг", String(stats.units), "📈")}
            ${adminStatCard("Захиалгын тоо", String(stats.orderCount), "📦")}
            ${adminStatCard("Амжилттай захиалга", String(stats.orderCount - (stats.statusCounts.cancelled || 0)), "✅")}
        </div>
        <div class="admin-cols">
            <div class="admin-panel card"><h3>Хамгийн их борлуулагдсан</h3>${adminRankingHtml(stats.topByUnits, "units")}</div>
            <div class="admin-panel card"><h3>Хамгийн их орлого бүрдүүлсэн</h3>${adminRankingHtml(stats.topByRevenue, "revenue")}</div>
        </div>
        <div class="admin-panel card"><h3>Хамгийн их борлуулалттай бараа</h3>${adminTopSellingHtml(stats)}</div>
        <div class="admin-panel card"><h3>Бараа тус бүрийн борлуулалт</h3>${adminProductSalesTableHtml(stats)}</div>`
        : `<div class="empty-results"><span>📊</span><h3>Одоогоор борлуулалтын мэдээлэл алга</h3><p>Захиалга бүртгэгдсэний дараа энд статистик гарна.</p></div>`}`;
    }

    function adminOrdersHtml() {
        if (!state.orders.length) return `<div class="admin-page-head"><h1>Захиалгын удирдлага</h1></div><div class="empty-results"><span>📦</span><h3>Захиалга байхгүй байна</h3></div>`;
        return `<div class="admin-page-head"><h1>Захиалгын удирдлага</h1></div>
        <div class="admin-panel card table-scroll-wrap"><div class="table-scroll"><table class="admin-table"><thead><tr>
            <th>Код</th><th>Огноо</th><th>Харилцагч</th><th>Бараанууд</th><th>Нийт</th><th>Төлөв</th><th>Дэлгэрэнгүй</th>
        </tr></thead><tbody>${state.orders.map((order) => {
            const status = orderStatus(order);
            const open = state.adminOrderOpenId === order.code;
            return `<tr>
                <td><b>${escapeHtml(order.code || "")}</b></td>
                <td>${escapeHtml(formatDate(order.date))}</td>
                <td><b>${escapeHtml((order.customer && order.customer.name) || "—")}</b><small>${escapeHtml((order.customer && (order.customer.phone || order.customer.email)) || "—")}</small></td>
                <td>${order.items.length} баглаа</td>
                <td>${formatPrice(order.total)}</td>
                <td><span class="badge badge-status-${status}">${ORDER_STATUSES[status] || status}</span></td>
                <td><button class="button button-ghost sm" data-action="admin-toggle-order" data-code="${escapeHtml(order.code || "")}">${open ? "Хаах" : "Дэлгэрэнгүй"}</button></td>
            </tr>
            ${open ? `<tr class="admin-detail-row-full"><td colspan="7">${adminOrderDetailHtml(order)}</td></tr>` : ""}`;
        }).join("")}</tbody></table></div></div>`;
    }

    function adminRequestsHtml() {
        const list = [...state.requests].reverse();
        if (!list.length) return `<div class="admin-page-head"><h1>Хэрэглэгчдийн хүсэлт</h1></div><div class="empty-results"><span>✉</span><h3>Хүсэлт байхгүй байна</h3></div>`;
        return `<div class="admin-page-head"><h1>Хэрэглэгчдийн хүсэлт</h1></div>
        <div class="admin-panel card"><div class="table-scroll"><table class="admin-table"><thead><tr>
            <th>Огноо</th><th>Нэр</th><th>Холбогдох</th><th>Төрөл</th><th>Төлөв</th><th>Үйлдэл</th>
        </tr></thead><tbody>${list.map((request) => {
            const id = request.id || "";
            const status = requestStatus(request);
            const open = state.adminRequestOpenId === id;
            return `<tr>
                <td>${escapeHtml(formatDate(request.createdAt))}</td>
                <td><b>${escapeHtml(request.name)}</b></td>
                <td>${escapeHtml(request.contact)}</td>
                <td>${escapeHtml(request.type)}</td>
                <td><span class="badge badge-status-${status}">${REQUEST_STATUSES[status] || status}</span></td>
                <td class="admin-actions"><button class="button button-ghost sm" data-action="admin-toggle-request" data-id="${escapeHtml(id)}">${open ? "Хаах" : "Унших"}</button></td>
            </tr>
            ${open ? `<tr class="admin-detail-row-full"><td colspan="6">${adminRequestDetailHtml(request, id)}</td></tr>` : ""}`;
        }).join("")}</tbody></table></div></div>`;
    }

    function adminRankingHtml(list, key) {
        if (!list.length) return `<p class="muted">Одоогоор борлуулалтын мэдээлэл алга.</p>`;
        return `<div class="admin-ranking">${list.slice(0, 8).map((item, index) => `<div class="admin-rank-row"><span class="admin-rank-index">${index + 1}</span><b>${escapeHtml(item.name)}</b><span>${key === "units" ? `${item.units} ширхэг` : formatPrice(item.revenue)}</span></div>`).join("")}</div>`;
    }

    function adminProductSalesTableHtml(stats) {
        if (!stats.byProduct.length) return `<p class="muted">Одоогоор борлуулалтын мэдээлэл алга.</p>`;
        return `<div class="table-scroll"><table class="admin-table"><thead><tr><th>Бараа</th><th>Борлуулсан ширхэг</th><th>Орлого</th></tr></thead><tbody>
            ${stats.byProduct.slice().sort((a, b) => b.units - a.units).map((item) => `<tr><td><b>${escapeHtml(item.name)}</b><small>${escapeHtml(item.id)}</small></td><td>${item.units}</td><td>${formatPrice(item.revenue)}</td></tr>`).join("")}
        </tbody></table></div>`;
    }

    function adminRecentOrdersHtml() {
        if (!state.orders.length) return `<p class="muted">Захиалга байхгүй байна.</p>`;
        return `<div class="admin-ranking">${state.orders.slice(0, 5).map((order) => `<div class="admin-rank-row"><b>${escapeHtml(order.code || "")}</b><span class="badge badge-status-${orderStatus(order)}">${ORDER_STATUSES[orderStatus(order)] || ""}</span><span>${formatPrice(order.total)}</span></div>`).join("")}</div>`;
    }

    function adminRecentRequestsHtml() {
        const fresh = state.requests.filter((request) => requestStatus(request) === "new");
        if (!fresh.length) return `<p class="muted">Шинэ хүсэлт байхгүй байна.</p>`;
        return `<div class="admin-ranking">${fresh.slice(0, 5).map((request) => `<div class="admin-rank-row"><b>${escapeHtml(request.name)}</b><small>${escapeHtml(request.type)}</small></div>`).join("")}</div>`;
    }

    function adminTopSellingHtml(stats) {
        const products = (stats && Array.isArray(stats.topByUnits) ? stats.topByUnits : []).slice(0, 10);
        if (!products.length) return `<p class="muted">Одоогоор борлуулалтын түүх алга. Захиалга нэмэгдсэн үед энд автоматаар харагдана.</p>`;
        return `<div class="admin-ranking">${products.map((item, index) => {
            const product = getCatalogItem(item.id) || null;
            return `<div class="admin-rank-row"><span class="admin-rank-index">${index + 1}</span><b>${escapeHtml(product ? product.name : item.name)}</b><small>${item.units} ширхэг · ${formatPrice(item.revenue)}</small></div>`;
        }).join("")}</div>`;
    }

    function adminUsersHtml() {
        const users = adminUserRows();
        const editing = state.adminUserEditingId ? state.users.find((user) => user && user.email === state.adminUserEditingId) || null : null;
        return `<div class="admin-page-head"><h1>Хэрэглэгчийн удирдлага</h1><p>Бүртгэлтэй хэрэглэгчийн мэдээллийг харах, засах боломжтой.</p></div>
        ${editing ? adminUserFormHtml(editing) : ""}
        <div class="admin-toolbar card">
            <form class="admin-search" id="adminUserSearchForm" novalidate>
                <input id="adminUserSearch" type="search" placeholder="Хэрэглэгч хайх..." value="${escapeHtml(state.adminUserSearch || "")}">
                <button class="button button-ghost sm" type="submit">Хайх</button>
            </form>
        </div>
        <div class="admin-panel card"><div class="table-scroll"><table class="admin-table"><thead><tr>
            <th>Нэр</th><th>И-мэйл</th><th>Утас</th><th>Эрх</th><th>Үйлдэл</th>
        </tr></thead><tbody>${users.length ? users.map((user) => `<tr>
            <td><b>${escapeHtml(user.name || "—")}</b><small>${escapeHtml((user.givenName || user.surname) ? [user.surname, user.givenName].filter(Boolean).join(" ") : "—")}</small></td>
            <td>${escapeHtml(user.email || "—")}</td>
            <td>${escapeHtml(user.phone || "—")}</td>
            <td><span class="badge ${adminUserRole(user) === "admin" ? "badge-stock" : "badge-status-new"}">${escapeHtml(adminUserRole(user))}</span></td>
            <td class="admin-actions"><button class="button button-ghost sm" data-action="admin-user-edit" data-email="${escapeHtml(user.email || "")}">Засах</button></td>
        </tr>`).join("") : `<tr><td colspan="5"><div class="empty-results"><span>👤</span><h3>Хэрэглэгч олдсонгүй</h3></div></td></tr>`}</tbody></table></div></div>`;
    }

    function adminUserRole(user) {
        if (!user || typeof user !== "object") return "user";
        const role = typeof user.role === "string" ? user.role.trim().toLowerCase() : "";
        if (role === "admin" || role === "user") return role;
        return user.demo ? "admin" : "user";
    }

    function adminUserRows() {
        const query = (state.adminUserSearch || "").trim().toLowerCase();
        return state.users.filter((user) => {
            if (!user) return false;
            const haystack = [user.name, user.givenName, user.surname, user.email, user.phone, adminUserRole(user)].join(" ").toLowerCase();
            return !query || haystack.includes(query);
        });
    }

    function adminUserFormHtml(user) {
        const name = String(user.name || "");
        const surname = String(user.surname || "");
        const givenName = String(user.givenName || "");
        const role = adminUserRole(user);
        return `<form class="admin-form card" id="adminUserForm" novalidate>
            <h3>Хэрэглэгчийн мэдээлэл засах</h3>
            <div class="form-grid">
                <div class="form-field"><label for="adminUserSurname">Овог</label><input id="adminUserSurname" type="text" value="${escapeHtml(surname)}"></div>
                <div class="form-field"><label for="adminUserGivenName">Нэр</label><input id="adminUserGivenName" type="text" value="${escapeHtml(givenName || name || "")}"></div>
                <div class="form-field"><label for="adminUserEmail">И-мэйл</label><input id="adminUserEmail" type="email" value="${escapeHtml(user.email || "")}" disabled></div>
                <div class="form-field"><label for="adminUserPhone">Утас</label><input id="adminUserPhone" type="tel" value="${escapeHtml(user.phone || "")}"></div>
                <div class="form-field"><label for="adminUserRole">Эрх</label><select id="adminUserRole">
                    <option value="user"${role === "user" ? " selected" : ""}>user</option>
                    <option value="admin"${role === "admin" ? " selected" : ""}>admin</option>
                </select></div>
            </div>
            <div class="admin-form-actions">
                <button class="button button-primary" type="submit">Хадгалах</button>
                <button class="button button-ghost" type="button" data-action="admin-user-cancel">Цуцлах</button>
            </div>
        </form>`;
    }

    function handleAdminUserSubmit() {
        const email = (textOf("adminUserEmail") || "").trim().toLowerCase();
        if (!email) { showToast("Хэрэглэгч олдсонгүй.", true); return; }
        const user = state.users.find((item) => item && typeof item.email === "string" && item.email.toLowerCase() === email);
        if (!user) { showToast("Хэрэглэгч олдсонгүй.", true); return; }

        const surname = textOf("adminUserSurname");
        const givenName = textOf("adminUserGivenName");
        const phone = textOf("adminUserPhone");
        const role = textOf("adminUserRole");
        if (!surname || surname.length < 2) { showToast("Овгоо зөв оруулна уу.", true); return; }
        if (!givenName || givenName.length < 2) { showToast("Нэрээ зөв оруулна уу.", true); return; }
        if (phone.replace(/\D/g, "").length < 8) { showToast("Утасны дугаараа зөв оруулна уу.", true); return; }
        if (role !== "admin" && role !== "user") { showToast("Хэрэглэгчийн эрхийг зөв сонгоно уу.", true); return; }

        const fullName = [surname, givenName].filter(Boolean).join(" ");
        user.surname = surname;
        user.givenName = givenName;
        user.name = fullName;
        user.phone = phone;
        user.role = role;
        if (typeof user.demo === "boolean") user.demo = role === "admin";
        persistUsers();
        if (state.session && state.session.email && state.session.email.toLowerCase() === email) {
            state.userRole = role;
            persistSession();
        }
        state.adminUserEditingId = null;
        renderAdminPage();
        updateAccountButton();
        showToast("Хэрэглэгчийн мэдээлэл амжилттай шинэчлэгдлээ.");
    }

    function adminLoginHtml() {
        return `<div class="admin-login">
            <div class="admin-login-card card">
                <div class="admin-login-head"><span class="brand-mark">🧸</span><h1>Админ самбар</h1><p>Аз жаргалын тоглоом — демо удирдлага</p></div>
                <form class="admin-form" id="adminLoginForm" novalidate>
                    <div class="form-field"><label for="adminLoginEmail">Админ и-мэйл</label><input id="adminLoginEmail" type="email" autocomplete="username"></div>
                    <div class="form-field"><label for="adminLoginPassword">Нууц үг</label><input id="adminLoginPassword" type="password" autocomplete="current-password"></div>
                    <button class="button button-primary" type="submit">Нэвтрэх</button>
                </form>
                <p class="admin-demo-note">Демо админ: <b>${DEMO_ADMIN_EMAIL}</b> · нууц үг <b>${DEMO_ADMIN_PASSWORD}</b><br>Энэ нь зөвхөн локал демо — production-д серверийн authentication хэрэгтэй.</p>
                <a class="button button-ghost" href="index.html">Сайт руу буцах</a>
            </div>
        </div>`;
    }

    function adminViewHtml(view) {
        if (view === "products") return adminProductsHtml();
        if (view === "stats") return adminStatsHtml();
        if (view === "orders") return adminOrdersHtml();
        if (view === "users") return adminUsersHtml();
        if (view === "requests") return adminRequestsHtml();
        return adminDashboardHtml();
    }

    function handleAdminLogin() {
        const email = (textOf("adminLoginEmail") || "").trim().toLowerCase();
        const password = textOf("adminLoginPassword");
        if (!email || !password) { showToast("И-мэйл болон нууц үгээ оруулна уу.", true); return; }
        const admin = state.admins.find((item) => item && typeof item.email === "string" && item.email.toLowerCase() === email);
        if (!admin || admin.hash !== hashPassword(password)) { showToast("Админ эрх эсвэл нууц үг таарахгүй байна.", true); return; }
        state.adminSession = { email: admin.email, at: Date.now() };
        state.adminView = "dashboard";
        persistAdminSession();
        renderAdminPage();
        showToast(`Админ самбарт тавтай морил, ${admin.name || "админ"}!`);
    }

    function handleAdminLogout() {
        state.adminSession = null;
        persistAdminSession();
        renderAdminPage();
        showToast("Админ сессийг дуусгалаа.");
    }

    function renderAdminProductsTable() {
        const table = document.getElementById("adminProductsTable");
        const count = document.getElementById("adminProductsCount");
        if (table) table.innerHTML = adminProductTableHtml();
        if (count) count.textContent = `${adminProductRows().length} бараа`;
    }

    function renderAdminPage() {
        if (!elements.adminApp) return;
        if (!adminLoggedIn()) {
            elements.adminApp.innerHTML = adminLoginHtml();
            return;
        }
        elements.adminApp.innerHTML = adminShellHtml(state.adminView || "dashboard");
    }

    /* =====================================================
       Эхлүүлэг
       ===================================================== */
    function init() {
        if (isInitialized) return;
        isInitialized = true;
        cacheElements();
        if (pageName === "home") elements.galleryLightbox = buildGalleryLightbox();
        else elements.galleryLightbox = null;

        readUrlFilters();
        bindStaticEvents();
        updateCategoryCounts();
        syncFilterInputs();

        /* URL-ээс уншсан төлвийг форм дээр тусгах */
        if (elements.productSearch && state.query) elements.productSearch.value = state.query;
        if (elements.categoryFilter) elements.categoryFilter.value = state.category;
        if (elements.sortFilter) elements.sortFilter.value = state.sort;
        if (elements.filterMin) elements.filterMin.value = state.minPrice;
        if (elements.filterMax) elements.filterMax.value = state.maxPrice;
        if (elements.filterAge) elements.filterAge.value = state.age;
        if (elements.filterStock) elements.filterStock.checked = state.inStock;

        renderProducts();
        renderCart();
        renderWishlist();
        renderBundleShowcase();
        renderBundlesPage();
        renderBirthdayShowcase();
        renderHolidayGallery();
        renderProductPage();
        initPageReveal();
        renderFavoritesPage();
        renderAccountPage();
        updateAccountButton();
        if (pageName === "admin") {
            seedDemoAdmin();
            renderAdminPage();
        }
        setSlide(0);
        resetSlideTimer();
        startCountdown();
        watchStaticImages();
        onScroll();
        if (elements.currentYear) elements.currentYear.textContent = String(new Date().getFullYear());
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", init, { once: true });
    } else {
        init();
    }
})();