# Tunisia Mall — Premium Edition

## رفع النسخة
ارفع محتويات هذا المجلد إلى جذر مستودع GitHub Pages، ثم افتح الموقع بعد اكتمال النشر.

## مهم
- `index.html` هو المتجر.
- `admin.html` يحوّل تلقائيًا إلى `admin-final.html`.
- المنتجات في المتجر تُقرأ من جدول Supabase `products` أولًا.
- `products.js` موجود كنسخة احتياطية عند تعذر Supabase.
- الطلبات تُحفظ في `orders` قبل فتح WhatsApp.
- استبدل `WHATSAPP_NUMBER` في `script.js` برقم WhatsApp الحقيقي.
- لا تضع `service_role` key في ملفات الواجهة. استخدم publishable/anon key مع RLS مضبوط.

## ما يلزم في Supabase
يجب أن يسمح جدول `products` بالقراءة العامة للمنتجات المنشورة، ويجب أن تسمح سياسة `orders` بإدخال الطلبات من المتجر. لوحة الإدارة يجب أن تستخدم صلاحيات أكثر تقييدًا.
