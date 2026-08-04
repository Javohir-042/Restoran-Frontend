import React, { createContext, useContext, useState, useEffect } from "react";
import { useAuth } from "../hooks/use-auth";

type Language = "uz" | "ru";

interface Translations {
    [key: string]: {
        uz: string;
        ru: string;
    };
}

const translations: Translations = {
    // Login
    "Buyurtmalar, xodimlar va stollarni bitta joydan boshqaring.": { uz: "Buyurtmalar, xodimlar va stollarni bitta joydan boshqaring.", ru: "Управляйте заказами, персоналом и столами в одном месте." },
    "Welcome Back": { uz: "Xush kelibsiz", ru: "Добро пожаловать" },
    "Please select your login method": { uz: "Iltimos tizimga kirish turini tanlang", ru: "Пожалуйста, выберите метод входа" },
    "Telefon raqami": { uz: "Telefon raqami", ru: "Номер телефона" },
    "Parol": { uz: "Parol", ru: "Пароль" },
    "LOGIN TO DASHBOARD": { uz: "TIZIMGA KIRISH", ru: "ВОЙТИ В СИСТЕМУ" },
    "Kirilmoqda...": { uz: "Kirilmoqda...", ru: "Вход..." },
    "Ikki bosqichli tasdiqlash": { uz: "Ikki bosqichli tasdiqlash", ru: "Двухфакторная аутентификация" },
    "Telefoningizga yuborilgan kodni kiriting": { uz: "Telefoningizga yuborilgan kodni kiriting", ru: "Введите код, отправленный на ваш телефон" },
    "TASDIQLASH": { uz: "TASDIQLASH", ru: "ПОДТВЕРДИТЬ" },
    "Tekshirilmoqda...": { uz: "Tekshirilmoqda...", ru: "Проверка..." },
    "← Orqaga qaytish": { uz: "← Orqaga qaytish", ru: "← Назад" },
    "Enter your 4-digit employee PIN to clock in.": { uz: "Smenani boshlash uchun 4 xonali PIN kodni kiriting.", ru: "Введите 4-значный PIN-код сотрудника, чтобы начать смену." },
    "Texnik yordam va savollar uchun:": { uz: "Texnik yordam va savollar uchun:", ru: "Для технической поддержки и вопросов:" },

    // Kitchen
    "Buyurtmalar Navbati": { uz: "Buyurtmalar Navbati", ru: "Очередь заказов" },
    "Oshpaz:": { uz: "Oshpaz:", ru: "Повар:" },
    "ULANGAN": { uz: "ULANGAN", ru: "ПОДКЛЮЧЕН" },
    "UZILGAN": { uz: "UZILGAN", ru: "ОТКЛЮЧЕН" },
    "Ulanishda xatolik yuz berdi. Iltimos sahifani yangilang.": { uz: "Ulanishda xatolik yuz berdi. Iltimos sahifani yangilang.", ru: "Ошибка подключения. Пожалуйста, обновите страницу." },
    "Hozircha yangi buyurtma yo'q": { uz: "Hozircha yangi buyurtma yo'q", ru: "Пока нет новых заказов" },
    "Barcha taomlar tayyorlangan yoki hali buyurtma tushmagan.": { uz: "Barcha taomlar tayyorlangan yoki hali buyurtma tushmagan.", ru: "Все блюда приготовлены или заказов пока нет." },
    "Kutyapti:": { uz: "Kutyapti:", ru: "Ожидает:" },
    "daqiqa": { uz: "daqiqa", ru: "минут" },
    "Qabul qilish": { uz: "Qabul qilish", ru: "Принять" },

    // Waiter & Tables
    "STOLLAR": { uz: "STOLLAR", ru: "СТОЛЫ" },
    "LIVE": { uz: "LIVE", ru: "В СЕТИ" },
    "OFFLINE": { uz: "OFFLINE", ru: "ОФФЛАЙН" },
    "CHAP TOMONDAN STOL TANLANG": { uz: "CHAP TOMONDAN STOL TANLANG", ru: "ВЫБЕРИТЕ СТОЛ СЛЕВА" },
    "BO'SH": { uz: "BO'SH", ru: "СВОБОДНО" },
    "BAND": { uz: "BAND", ru: "ЗАНЯТО" },
    "REZERV": { uz: "REZERV", ru: "РЕЗЕРВ" },
    "Stol bo'sh": { uz: "Stol bo'sh", ru: "Стол свободен" },
    "Mijozlar kelishganda yangi hisob ochishingiz mumkin.": { uz: "Mijozlar kelishganda yangi hisob ochishingiz mumkin.", ru: "Откройте новый счет, когда придут клиенты." },
    "Ochilyapti...": { uz: "Ochilyapti...", ru: "Открывается..." },
    "Buyurtma Boshlash": { uz: "Buyurtma Boshlash", ru: "Начать заказ" },
    "Hali taom qo'shilmagan": { uz: "Hali taom qo'shilmagan", ru: "Блюда еще не добавлены" },
    "Ushbu taomni bekormoqchimisiz?": { uz: "Ushbu taomni bekormoqchimisiz?", ru: "Вы хотите отменить это блюдо?" },
    "OLIB BORISH": { uz: "OLIB BORISH", ru: "ОТНЕСТИ" },
    "Yana taom qo'shish": { uz: "Yana taom qo'shish", ru: "Добавить еще блюда" },
    "Yuklanmoqda...": { uz: "Yuklanmoqda...", ru: "Загрузка..." },

    // Menu Modal
    "Menyu": { uz: "Menyu", ru: "Меню" },
    "Stolga taom qo'shish": { uz: "Stolga taom qo'shish", ru: "Добавить блюдо к столу" },
    "Turkumlar yuklanmoqda...": { uz: "Turkumlar yuklanmoqda...", ru: "Категории загружаются..." },
    "Savat": { uz: "Savat", ru: "Корзина" },
    "Hozircha hech narsa qo'shilmadi": { uz: "Hozircha hech narsa qo'shilmadi", ru: "Пока ничего не добавлено" },
    "Taomlar soni:": { uz: "Taomlar soni:", ru: "Количество блюд:" },
    "Oshpazga Yuborish": { uz: "Oshpazga Yuborish", ru: "Отправить повару" },
    "ta": { uz: "ta", ru: "шт" },

    // Nav
    "Dashboard": { uz: "Dashboard", ru: "Дашборд" },
    "Buyurtmalar": { uz: "Buyurtmalar", ru: "Заказы" },
    "Stollar": { uz: "Stollar", ru: "Столы" },
    "Turkumlar": { uz: "Turkumlar", ru: "Категории" },
    "Chiqish": { uz: "Chiqish", ru: "Выйти" },

    // Top headers
    "Dashboard Overview": { uz: "Asosiy ko'rsatkichlar", ru: "Обзор панели" },
    "Real-time performance and operational metrics for tonight's service.": {
        uz: "Joriy xizmat va operatsion ko'rsatkichlar",
        ru: "Работа в реальном времени и операционные показатели.",
    },

    // Stat cards
    "Today's Revenue": { uz: "Bugungi tushum", ru: "Выручка за сегодня" },
    "Open Bills": { uz: "Ochiq hisoblar", ru: "Открытые счета" },
    "Active Staff Directory": { uz: "Ishlayotgan xodimlar", ru: "Сотрудники на смене" },
    "On Duty": { uz: "Smenada", ru: "На смене" },

    // Settings
    "Sozlamalar": { uz: "Sozlamalar", ru: "Настройки" },
    "Tizim parametrlarini boshqarish va moslashtirish": { uz: "Tizim parametrlarini boshqarish va moslashtirish", ru: "Управление и настройка параметров системы" },
    "Umumiy": { uz: "Umumiy", ru: "Общие" },
    "Xizmat haqi": { uz: "Xizmat haqi", ru: "Обслуживание" },
    "Xavfsizlik": { uz: "Xavfsizlik", ru: "Безопасность" },
    "Bildirishnomalar": { uz: "Bildirishnomalar", ru: "Уведомления" },
    "Restoran nomi": { uz: "Restoran nomi", ru: "Название ресторана" },
    "Kontakt telefon": { uz: "Kontakt telefon", ru: "Контактный телефон" },
    "Manzil": { uz: "Manzil", ru: "Адрес" },
    "Valyuta": { uz: "Valyuta", ru: "Валюта" },
    "Saqlash": { uz: "Saqlash", ru: "Сохранить" },
    "Saqlanmoqda...": { uz: "Saqlanmoqda...", ru: "Сохранение..." },
    "Xizmat haqi foizi": { uz: "Xizmat haqi foizi", ru: "Процент обслуживания" },
    "Har bir buyurtmaga qo'shiladigan foiz miqdori": { uz: "Har bir buyurtmaga qo'shiladigan foiz miqdori", ru: "Процент, добавляемый к каждому заказу" },
    "Avtomatik hisobga qo'shish": { uz: "Avtomatik hisobga qo'shish", ru: "Автоматически добавлять в счет" },
    "Check chiqarilganda xizmat haqi avtomatik hisoblanadi": { uz: "Check chiqarilganda xizmat haqi avtomatik hisoblanadi", ru: "Плата за обслуживание рассчитывается автоматически при выставлении чека" },
    "Parolni o'zgartirish": { uz: "Parolni o'zgartirish", ru: "Изменить пароль" },
    "Hozirgi parol": { uz: "Hozirgi parol", ru: "Текущий пароль" },
    "Yangi parol": { uz: "Yangi parol", ru: "Новый пароль" },
    "Yangi parolni tasdiqlash": { uz: "Yangi parolni tasdiqlash", ru: "Подтвердите новый пароль" },
    "Ikki bosqichli autentifikatsiya (2FA)": { uz: "Ikki bosqichli autentifikatsiya (2FA)", ru: "Двухфакторная аутентификация (2FA)" },
    "Tizimga kirishda joriy paroldan tashqari qo'shimcha maxsus xavfsizlik kodini kiritish zarur bo'ladi. Bu akkauntingiz xavfsizligini sezilarli darajada oshiradi.": { uz: "Tizimga kirishda joriy paroldan tashqari qo'shimcha maxsus xavfsizlik kodini kiritish zarur bo'ladi. Bu akkauntingiz xavfsizligini sezilarli darajada oshiradi.", ru: "При входе в систему необходимо ввести специальный код помимо текущего пароля. Это повысит безопасность." },
    "Bildirishnoma sozlamalari": { uz: "Bildirishnoma sozlamalari", ru: "Настройки уведомлений" },
    "Yangi buyurtma bildirishnomasi": { uz: "Yangi buyurtma bildirishnomasi", ru: "Уведомление о новом заказе" },
    "Oshxona tayyorlik signali": { uz: "Oshxona tayyorlik signali", ru: "Сигнал готовности на кухне" },
    "Inventarizatsiya ogohlantirishlari": { uz: "Inventarizatsiya ogohlantirishlari", ru: "Уведомления об инвентаризации" },
    "Mijoz buyurtma berganda dasturda va qurilmada tovushli signal berib ogohlantirish": { uz: "Mijoz buyurtma berganda dasturda va qurilmada tovushli signal berib ogohlantirish", ru: "Оповещение звуковым сигналом в приложении и на устройстве при заказе клиента" },
    "Oshxonada taom tayyor bo'lganda, tasdiqlovchi xabarni ofitsiantga yuborish": { uz: "Oshxonada taom tayyor bo'lganda, tasdiqlovchi xabarni ofitsiantga yuborish", ru: "Отправка официанту подтверждающего сообщения о готовности блюда на кухне" },
    "Ombordagi zaxiralar belgilan miqdordan kam qolganda avtomatik xabar berish": { uz: "Ombordagi zaxiralar belgilan miqdordan kam qolganda avtomatik xabar berish", ru: "Автоматическое уведомление, когда запасы на складе падают ниже установленного предела" },

    // Statuses
    "Full Shift": { uz: "To'liq navbat", ru: "Полная смена" },
    "Stable": { uz: "Barqaror", ru: "Стабильно" },

    // Revenue Analysis Chart
    "Revenue Analysis": { uz: "Daromad tahlili", ru: "Анализ доходов" },
    "Performance comparison over time": {
        uz: "Vaqt o'tishi bilan ko'rsatkichlarni taqqoslash",
        ru: "Сравнение производительности за время",
    },
    Week: { uz: "Hafta", ru: "Неделя" },
    Month: { uz: "Oy", ru: "Месяц" },
    Year: { uz: "Yil", ru: "Год" },

    // Staff Directory

    // Role replacements
    "Oshpaz": { uz: "Oshpaz", ru: "Повар" },
    "Kassir": { uz: "Kassir", ru: "Кассир" },
    "Ofitsiant": { uz: "Ofitsiant", ru: "Официант" },
    "Bosh ofitsiant": { uz: "Bosh ofitsiant", ru: "Старший официант" },
    "Menejer": { uz: "Menejer", ru: "Менеджер" },

    "Search orders or menu...": { uz: "Buyurtma yoki menyuni izlash", ru: "Поиск заказов или меню..." },

    // Staff
    "Xodimlar boshqaruvi": { uz: "Xodimlar boshqaruvi", ru: "Управление персоналом" },
    "Xodimlar": { uz: "Xodimlar", ru: "Персонал" },
    "Jami xodimlar": { uz: "Jami xodimlar", ru: "Всего сотрудников" },
    "Yangi xodim qo'shish": { uz: "Yangi xodim qo'shish", ru: "Добавить сотрудника" },
    "Xodimni tahrirlash": { uz: "Xodimni tahrirlash", ru: "Редактировать сотрудника" },
    "Ism": { uz: "Ism", ru: "Имя" },
    "Familiya": { uz: "Familiya", ru: "Фамилия" },
    "Telefon raqami (ixtiyoriy)": { uz: "Telefon raqami (ixtiyoriy)", ru: "Номер телефона (необязательно)" },
    "Tanlang...": { uz: "Tanlang...", ru: "Выберите..." },
    "Ma'lumotlar": { uz: "Ma'lumotlar", ru: "Данные" },
    "PIN kod": { uz: "PIN kod", ru: "PIN-код" },
    "Yangi PIN kod kiritilganda xodimning eski PIN kodi o'chiriladi.": { uz: "Yangi PIN kod kiritilganda xodimning eski PIN kodi o'chiriladi.", ru: "При вводе нового PIN-кода старый PIN-код сотрудника будет удален." },
    "Yangi PIN kod": { uz: "Yangi PIN kod", ru: "Новый PIN-код" },
    "PIN kodni yangilash": { uz: "PIN kodni yangilash", ru: "Обновить PIN-код" },
    "Yangilanmoqda...": { uz: "Yangilanmoqda...", ru: "Обновление..." },
    "PIN kod (4 xonali)": { uz: "PIN kod (4 xonali)", ru: "PIN-код (4 цифры)" },
    "Xodim qo'shildi": { uz: "Xodim qo'shildi", ru: "Сотрудник добавлен" },
    "Jami": { uz: "Jami", ru: "Всего" },
    "ta faol xodim": { uz: "ta faol xodim", ru: "активных сотрудников" },
    "Faol xodimlar": { uz: "Faol xodimlar", ru: "Активные сотрудники" },
    "Rol bo'yicha": { uz: "Rol bo'yicha", ru: "По роли" },
    "Admin": { uz: "Admin", ru: "Админ" },
    "Super Admin": { uz: "Super Admin", ru: "Супер Админ" },
    "ni butunlay o'chirasizmi? Bu qaytarib bo'lmaydi.": { uz: "ni butunlay o'chirasizmi? Bu qaytarib bo'lmaydi.", ru: "вы хотите удалить насовсем? Это действие нельзя отменить." },
    "bo'yicha xodim topilmadi": { uz: "bo'yicha xodim topilmadi", ru: "сотрудник не найден по запросу" },
    "Xodimlar topilmadi": { uz: "Xodimlar topilmadi", ru: "Сотрудники не найдены" },
    "Rol": { uz: "Rol", ru: "Роль" },
    "Telefon": { uz: "Telefon", ru: "Телефон" },
    "Holati": { uz: "Holati", ru: "Статус" },

    // Tables
    "Stollar boshqaruvi": { uz: "Stollar boshqaruvi", ru: "Управление столами" },
    "Yangi stol": { uz: "Yangi stol", ru: "Новый стол" },
    "Buyurtmani tahrirlash": { uz: "Buyurtmani tahrirlash", ru: "Редактировать заказ" },
    "Buyurtma": { uz: "Buyurtma", ru: "Заказ" },
    "Noma'lum": { uz: "Noma'lum", ru: "Неизвестно" },
    "Yangi taom qo'shish uchun \"Yangi buyurtma qo'shish\" oynasidan shu stolni qayta tanlang — mavjud ochiq hisobga qo'shiladi.": {
        uz: "Yangi taom qo'shish uchun \"Yangi buyurtma qo'shish\" oynasidan shu stolni qayta tanlang — mavjud ochiq hisobga qo'shiladi.",
        ru: "Для добавления новых блюд снова выберите этот стол в окне «Новый заказ» — будет добавлено к открытому счету."
    },
    "Stol qo'shish": { uz: "Stol qo'shish", ru: "Добавить стол" },
    "Yangi stol qo'shish": { uz: "Yangi stol qo'shish", ru: "Добавить новый стол" },
    "Bitta stol": { uz: "Bitta stol", ru: "Один стол" },
    "Bir nechta stol": { uz: "Bir nechta stol", ru: "Несколько столов" },
    "Stol raqami": { uz: "Stol raqami", ru: "Номер стола" },
    "Masalan: 5": { uz: "Masalan: 5", ru: "Например: 5" },
    "Dan": { uz: "Dan", ru: "От" },
    "Gacha": { uz: "Gacha", ru: "До" },
    "Qo'shilmoqda...": { uz: "Qo'shilmoqda...", ru: "Добавление..." },
    "Qo'shish": { uz: "Qo'shish", ru: "Добавить" },
    "Stolni tanlang": { uz: "Stolni tanlang", ru: "Выберите стол" },
    "Taomlarni tanlang": { uz: "Taomlarni tanlang", ru: "Выберите блюда" },
    "band — qo'shiladi": { uz: "band — qo'shiladi", ru: "занят — будет добавлено" },
    "Stollar topilmadi": { uz: "Stollar topilmadi", ru: "Столы не найдены" },
    "Menyu bo'sh": { uz: "Menyu bo'sh", ru: "Меню пусто" },

    // QR and Reserve Table Modals
    "QR kodni yuklab olish": { uz: "QR kodni yuklab olish", ru: "Скачать QR-код" },
    "Mijoz skanerlab, menyuga kiradi": { uz: "Mijoz skanerlab, menyuga kiradi", ru: "Клиент сканирует, чтобы войти в меню" },
    "ni rezerv qilish": { uz: "ni rezerv qilish", ru: "забронировать" },
    "Sana": { uz: "Sana", ru: "Дата" },
    "Mehmon ismi": { uz: "Mehmon ismi", ru: "Имя гостя" },
    "Eslatma: Siz hozir localhost dasiz.": { uz: "Eslatma: Siz hozir localhost dasiz.", ru: "Примечание: Вы сейчас на localhost." },
    "Telefonda skaner qilish uchun loyihani aynan IP manzil (masalan, ": { uz: "Telefonda skaner qilish uchun loyihani aynan IP manzil (masalan, ", ru: "Для сканирования на телефоне откройте проект по IP-адресу (например, " },
    ") orqali ochib, so'ngra u yerdagi QR ni skaner qiling yoki Vercel linkdan kiring!": { uz: ") orqali ochib, so'ngra u yerdagi QR ni skaner qiling yoki Vercel linkdan kiring!", ru: "), а затем отсканируйте QR-код оттуда или перейдите по ссылке Vercel!" },

    // Menu Item Modals
    "Nomi (o'zbek)": { uz: "Nomi (o'zbek)", ru: "Название (узбекский)" },
    "Nomi (rus)": { uz: "Nomi (rus)", ru: "Название (русский)" },
    "Tavsif (ixtiyoriy)": { uz: "Tavsif (ixtiyoriy)", ru: "Описание (необязательно)" },
    "Tavsif": { uz: "Tavsif", ru: "Описание" },
    "Narxi (so'm)": { uz: "Narxi (so'm)", ru: "Цена (сум)" },
    "Turkum": { uz: "Turkum", ru: "Категория" },
    "Taomni tahrirlash": { uz: "Taomni tahrirlash", ru: "Редактировать блюдо" },
    "Rasmni almashtirish uchun bosing": { uz: "Rasmni almashtirish uchun bosing", ru: "Нажмите, чтобы изменить фото" },
    "Admin Terminal": { uz: "Admin Terminal", ru: "Админ-Терминал" },
    "Jami:": { uz: "Jami:", ru: "Итого:" },
    "Buyurtmani saqlash": { uz: "Buyurtmani saqlash", ru: "Сохранить заказ" },
    "Menyu uchun yangi turkum nomlarini kiriting": { uz: "Menyu uchun yangi turkum nomlarini kiriting", ru: "Введи названия новых категорий меню" },
    "Turkum nomi (Uzb)": { uz: "Turkum nomi (Uzb)", ru: "Название категории (Uzb)" },
    "Turkum nomi (Rus)": { uz: "Turkum nomi (Rus)", ru: "Название категории (Rus)" },
    "Masalan: Issiq ovqatlar": { uz: "Masalan: Issiq ovqatlar", ru: "Например: Горячие блюда" },
    "Masalan: Горячие блюда": { uz: "Masalan: Горячие блюда", ru: "Например: Горячие блюда" },
    "Yangi turkum qo'shish": { uz: "Yangi turkum qo'shish", ru: "Добавить новую категорию" },
    "Turkumni tahrirlash": { uz: "Turkumni tahrirlash", ru: "Редактировать категорию" },
    "Turkum nomlarini yangilash": { uz: "Turkum nomlarini yangilash", ru: "Обновить названия категорий" },
    "Jami stollar": { uz: "Jami stollar", ru: "Всего столов" },
    "Band stollar": { uz: "Band stollar", ru: "Занятые столы" },
    "Bo'sh stollar": { uz: "Bo'sh stollar", ru: "Свободные столы" },
    "Rezerv qilingan": { uz: "Rezerv qilingan", ru: "Забронированные" },
    "Stollar ro'yxati": { uz: "Stollar ro'yxati", ru: "Список столов" },
    "kishilik": { uz: "kishilik", ru: "мест" },
    "daqiqadan beri": { uz: "daqiqadan beri", ru: "минут назад" },
    "Hozircha bo'sh...": { uz: "Hozircha bo'sh...", ru: "Пока свободно..." },
    "Hisob": { uz: "Hisob", ru: "Счет" },
    "Keldi": { uz: "Keldi", ru: "Пришел" },
    "Bekor": { uz: "Bekor", ru: "Отмена" },
    "Rezerv qilish": { uz: "Rezerv qilish", ru: "Забронировать" },
    "O'chirish": { uz: "O'chirish", ru: "Удалить" },

    // Orders
    "Buyurtmalar boshqaruvi": { uz: "Buyurtmalar boshqaruvi", ru: "Управление заказами" },
    "Yangi buyurtma qo'shish": { uz: "Yangi buyurtma qo'shish", ru: "Добавить новый заказ" },
    "Jami buyurtmalar": { uz: "Jami buyurtmalar", ru: "Всего заказов" },
    "Kutilmoqda": { uz: "Kutilmoqda", ru: "В ожидании" },
    "Tayyorlanmoqda": { uz: "Tayyorlanmoqda", ru: "Готовится" },
    "Yakunlangan": { uz: "Yakunlangan", ru: "Завершено" },
    "Sana bo'yicha": { uz: "Sana bo'yicha", ru: "По дате" },
    "Stol": { uz: "Stol", ru: "Стол" },
    "Barchasi": { uz: "Barchasi", ru: "Все" },
    "Barcha statuslar": { uz: "Barcha statuslar", ru: "Все статусы" },
    "Yangi": { uz: "Yangi", ru: "Новый" },
    "Tayyor": { uz: "Tayyor", ru: "Готово" },
    "Filtrlar bo'yicha buyurtma topilmadi": { uz: "Filtrlar bo'yicha buyurtma topilmadi", ru: "Заказы по фильтрам не найдены" },
    "Buyurtmalar topilmadi": { uz: "Buyurtmalar topilmadi", ru: "Заказы не найдены" },
    "ID": { uz: "ID", ru: "ID" },
    "Xodim": { uz: "Xodim", ru: "Сотрудник" },
    "Taomlar": { uz: "Taomlar", ru: "Блюда" },
    "Umumiy summa": { uz: "Umumiy summa", ru: "Общая сумма" },
    "Vaqt": { uz: "Vaqt", ru: "Время" },
    "Ko'rish": { uz: "Ko'rish", ru: "Посмотреть" },
    "Tahrirlash": { uz: "Tahrirlash", ru: "Редактировать" },
    "Taomlar bor, bekor qilib bo'lmaydi": { uz: "Taomlar bor, bekor qilib bo'lmaydi", ru: "Есть блюда, отменить нельзя" },
    "Ko'rsatilmoqda:": { uz: "Ko'rsatilmoqda:", ru: "Показано:" },
    "dan": { uz: "dan", ru: "из" },
    "Kunlik daromad": { uz: "Kunlik daromad", ru: "Дневной доход" },
    "Eng ko'p buyurtma qilingan": { uz: "Eng ko'p buyurtma qilingan", ru: "Самые популярные" },
    "Hozircha ma'lumot yo'q": { uz: "Hozircha ma'lumot yo'q", ru: "Пока нет данных" },
    "To'liq hisobotni ko'rish": { uz: "To'liq hisobotni ko'rish", ru: "Смотреть полный отчет" },

    // Categories
    "Turkumlar boshqaruvi": { uz: "Turkumlar boshqaruvi", ru: "Управление категориями" },
    "Restoran menyusidagi barcha turkumlarni boshqaring": { uz: "Restoran menyusidagi barcha turkumlarni boshqaring", ru: "Управление всеми категориями в меню ресторана" },
    "Yangi turkum": { uz: "Yangi turkum", ru: "Новая категория" },
    "Turkum qidirish...": { uz: "Turkum qidirish...", ru: "Поиск категории..." },
    "Nomi (Uzb)": { uz: "Nomi (Uzb)", ru: "Название (Узб)" },
    "Nomi (Rus)": { uz: "Nomi (Rus)", ru: "Название (Рус)" },
    "Status": { uz: "Status", ru: "Статус" },
    "Amallar": { uz: "Amallar", ru: "Действия" },
    "Turkumlar topilmadi": { uz: "Turkumlar topilmadi", ru: "Категории не найдены" },
    "Haqiqatan ham ushbu turkumni o'chirmoqchimisiz?": { uz: "Haqiqatan ham ushbu turkumni o'chirmoqchimisiz?", ru: "Вы действительно хотите удалить эту категорию?" },
    "O'chirishda xatolik yuz berdi": { uz: "O'chirishda xatolik yuz berdi", ru: "Произошла ошибка при удалении" },
    "Turkumlarni yuklashda xatolik yuz berdi. Iltimos, qayta urinib ko'ring.": { uz: "Turkumlarni yuklashda xatolik yuz berdi. Iltimos, qayta urinib ko'ring.", ru: "Ошибка при загрузке категорий. Пожалуйста, попробуйте еще раз." },
    "Mavjud emas": { uz: "Mavjud emas", ru: "Нет данных" },
    "Faol": { uz: "Faol", ru: "Активный" },
    "Nofaol": { uz: "Nofaol", ru: "Неактивный" },
    "Jami turkumlar": { uz: "Jami turkumlar", ru: "Всего категорий" },
    "Faol turkumlar": { uz: "Faol turkumlar", ru: "Активные категории" },

    // Menu
    "Menyu boshqaruvi": { uz: "Menyu boshqaruvi", ru: "Управление меню" },
    "Restoran menyusidagi barcha taomlar va ichimliklarni boshqaring": { uz: "Restoran menyusidagi barcha taomlar va ichimliklarni boshqaring", ru: "Управление всеми блюдами и напитками в меню ресторана" },
    "Yangi taom qo'shish": { uz: "Yangi taom qo'shish", ru: "Добавить новое блюдо" },
    "Jami taomlar": { uz: "Jami taomlar", ru: "Всего блюд" },
    "Aktiv": { uz: "Aktiv", ru: "Активно" },
    "To'xtatilgan": { uz: "To'xtatilgan", ru: "Приостановлено" },
    "Taom qidirish...": { uz: "Taom qidirish...", ru: "Поиск блюда..." },
    "Taom rasmi": { uz: "Taom rasmi", ru: "Фото блюда" },
    "Nomi": { uz: "Nomi", ru: "Название" },
    "Kategoriya": { uz: "Kategoriya", ru: "Категория" },
    "Narxi": { uz: "Narxi", ru: "Цена" },
    "Taom topilmadi": { uz: "Taom topilmadi", ru: "Блюдо не найдено" },
    "tadan": { uz: "tadan", ru: "из" },
    "ko'rsatilmoqda": { uz: "ko'rsatilmoqda", ru: "показано" },
    "taomini o'chirasizmi?": { uz: "taomini o'chirasizmi?", ru: "Вы действительно хотите удалить это блюдо?" },

    // Cashier
    "Kutayotgan Hisoblar": { uz: "Kutayotgan Hisoblar", ru: "Ожидающие счета" },
    "Faqat taomlari yetkazilgan stollar": { uz: "Faqat taomlari yetkazilgan stollar", ru: "Только столы с доставленными заказами" },
    "faqat taomlari yetkazilgan stollar": { uz: "faqat taomlari yetkazilgan stollar", ru: "только столы с доставленными заказами" },
    "CHAP TOMONDAN HISOB TANLANG": { uz: "CHAP TOMONDAN HISOB TANLANG", ru: "ВЫБЕРИТЕ СЧЕТ СЛЕВА" },
    "Chap tomondan hisob tanlang": { uz: "Chap tomondan hisob tanlang", ru: "Выберите счет слева" },
    "To'lovni qabul qilish uchun tayyor hisobni tanlang.": { uz: "To'lovni qabul qilish uchun tayyor hisobni tanlang.", ru: "Выберите готовый счет для оплаты." },
    "Bugungi Tushum:": { uz: "Bugungi Tushum:", ru: "Выручка за сегодня:" },
    "Ochiq hisoblar yo'q": { uz: "Ochiq hisoblar yo'q", ru: "Нет открытых счетов" },
    "Barcha taomlar yetkazildi": { uz: "Barcha taomlar yetkazildi", ru: "Все блюда доставлены" },
    "Hali tayyor emas": { uz: "Hali tayyor emas", ru: "Еще не готово" },
    "Taomlar yig'indisi:": { uz: "Taomlar yig'indisi:", ru: "Сумма блюд:" },
    "To'langan summa:": { uz: "To'langan summa:", ru: "Оплаченная сумма:" },
    "To'lov shakli": { uz: "To'lov shakli", ru: "Способ оплаты" },
    "Qabul Qilinadigan Summa": { uz: "Qabul Qilinadigan Summa", ru: "Сумма к оплате" },
    "Qabul qilinadigan summa": { uz: "Qabul qilinadigan summa", ru: "Сумма к оплате" },
    "QABUL QILISH": { uz: "QABUL QILISH", ru: "ПРИНЯТЬ" },
    "To'liq to'langan": { uz: "To'liq to'langan", ru: "Полностью оплачено" },
    "Hisob yopilgan yoki yopilmoqda": { uz: "Hisob yopilgan yoki yopilmoqda", ru: "Счет закрыт или закрывается" },
    "QISMAN TO'LANGAN": { uz: "QISMAN TO'LANGAN", ru: "ОПЛАЧЕНО ЧАСТИЧНО" },
    "YANGI": { uz: "YANGI", ru: "НОВЫЙ" },
    "To'lovlar tarixi": { uz: "To'lovlar tarixi", ru: "История платежей" },
    "To'lovlar Tarixi": { uz: "To'lovlar Tarixi", ru: "История платежей" },
    "Tarix bo'sh yoki topilmadi": { uz: "Tarix bo'sh yoki topilmadi", ru: "История пуста или не найдена" },
    "Tarix bo'sh yoki topilmadi.": { uz: "Tarix bo'sh yoki topilmadi.", ru: "История пуста или не найдена." },
    "Bekor qilish": { uz: "Bekor qilish", ru: "Отменить" },
    "BEKOR QILINGAN": { uz: "BEKOR QILINGAN", ru: "ОТМЕНЕНО" },
    "JAMI:": { uz: "JAMI:", ru: "ИТОГО:" },
    "NAQD": { uz: "NAQD", ru: "НАЛИЧНЫЕ" },
    "UZCARD": { uz: "UZCARD", ru: "UZCARD" },
    "HUMO": { uz: "HUMO", ru: "HUMO" }
};

interface LanguageContextProps {
    language: Language;
    setLanguage: (lang: Language) => void;
    t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextProps | undefined>(
    undefined
);

export const LanguageProvider = ({
    children,
}: {
    children: React.ReactNode;
}) => {
    const { userName } = useAuth();
    const storageKey = userName ? `app_lang_${userName}` : "app_lang";

    const [language, setLanguageState] = useState<Language>(() => {
        const storedName = localStorage.getItem("userName");
        const key = storedName ? `app_lang_${storedName}` : "app_lang";
        const stored = localStorage.getItem(key);
        return stored === "ru" ? "ru" : "uz";
    });

    useEffect(() => {
        const saved = localStorage.getItem(storageKey) as Language;
        if (saved) {
            setLanguageState(saved);
        } else if (!userName) {
            const generic = localStorage.getItem("app_lang") as Language;
            if (generic) setLanguageState(generic);
        }
    }, [storageKey, userName]);

    useEffect(() => {
        localStorage.setItem(storageKey, language);
    }, [language, storageKey]);

    const setLanguage = (lang: Language) => setLanguageState(lang);

    const t = (key: string): string => {
        if (!translations[key]) return key;
        return translations[key][language] || key;
    };

    return (
        <LanguageContext.Provider value={{ language, setLanguage, t }}>
            {children}
        </LanguageContext.Provider>
    );
};

export const useLanguage = () => {
    const context = useContext(LanguageContext);
    if (!context) {
        throw new Error("useLanguage must be used within a LanguageProvider");
    }
    return context;
};
