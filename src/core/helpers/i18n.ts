import { createI18n } from "vue-i18n";

import en from "@/assets/lang/en.json";
import id from "@/assets/lang/id.json";

const messages = {
    en: en,
    id: id,
};
const defaultLang = "id";

if (!localStorage.getItem("lang")) {
    localStorage.setItem("lang", defaultLang);
}

const i18n = createI18n({
    legacy: false,
    locale: localStorage.getItem("lang") || defaultLang,
    fallbackLocale: "id",
    globalInjection: true,
    messages,
});

export default i18n;
