import axios from "axios";

const API = "https://mock.arianalabs.io/api";

export const registerUser = async (formData) => {
  const res = await axios.post(`${API}/staff/register/`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data;
};

export const loginUser = async (userData) => {
  const res = await axios.post(`${API}/staff/auth/`, userData);
  return res.data;
};

export const getCurrentUser = async () => {
  const res = await axios.get(`${API}/staff/current_user/`);
  return res.data;
};


/*
 خط 1
import axios from "axios";



axios یک کتابخانه است برای ارتباط با سرور.


وظیفه‌اش ارسال درخواست‌ها:


GET


POST


PUT


DELETE




به زبان ساده:

axios یعنی «برو به سرور و اطلاعات بفرست یا بگیر».


🔹 خط 3
const API = "https://mock.arianalabs.io/api";



این یک رشته (string) است.


این آدرس اصلی سرور API است.


همیشه درخواست‌ها به این آدرس چسبیده می‌شوند.


مثال:
${API}/staff/register/
میشود:
https://mock.arianalabs.io/api/staff/register/

🔵 بخش اول — تابع registerUser
کد:
export const registerUser = async (formData) => {
  const res = await axios.post(`${API}/staff/register/`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data;
};

حالا خیلی ساده آن را می‌شکنیم:

🔹 export const registerUser = async (formData) => { … }


export const یعنی این تابع را می‌توان در فایل‌های دیگر استفاده کرد.


registerUser اسم تابع است.


async یعنی داخل این تابع از await استفاده می‌کنیم.


(formData) یعنی تابع یک ورودی دارد که اسم آن formData است.


formData معمولاً data فرم ثبت‌نام است
مثلاً: اسم، ایمیل، عکس پروفایل و...

🔹 axios.post(...)
ساختار axios.post:
axios.post( URL , داده‌ای که می‌فرستی , تنظیمات )

اینجا:
axios.post(`${API}/staff/register/`, formData, {...})

یعنی:

به آدرس /staff/register/ یک درخواست POST بفرست
داده‌های داخل formData را ارسال کن


🔹 headers: { "Content-Type": "multipart/form-data" }
این بخش می‌گوید:

من در حال فرستادن داده‌های فرم هستم،
که ممکنه شامل فایل (مثل عکس) باشد.

بدون این header، سرور نمی‌فهمد داده از چه نوعی است.

🔹 const res = await ...
await یعنی:

«صبر کن تا سرور جواب بده.»

نتیجه جواب سرور داخل res قرار می‌گیرد.
داخل res معمولاً این‌ها هست:


res.status → مثلا 200، 400


res.data → داده‌ای که سرور برمی‌گرداند


res.headers → اطلاعات پاسخ



🔹 return res.data
تو فقط خود data سرور را به بیرون می‌فرستی
و بخش‌های دیگر res را دور می‌ریزی.

🔵 بخش دوم — loginUser
کد:
export const loginUser = async (userData) => {
  const res = await axios.post(`${API}/staff/auth/`, userData);
  return res.data;
};

توضیح:


userData → شامل username و password


درخواست POST به مسیر /staff/auth/


هیچ header خاصی لازم نیست چون داده json است


res.data احتمالاً شامل token و user info است



🔵 بخش سوم — getCurrentUser
کد:
export const getCurrentUser = async () => {
  const res = await axios.get(`${API}/staff/current_user/`);
  return res.data;
};

توضیح:


این تابع هیچ ورودی ندارد


درخواست GET می‌فرستد به:


/staff/current_user/



سرور بر اساس token ذخیره‌شده،
کاربر فعلی را مشخص می‌کند


res.data شامل اطلاعات پروفایل کاربر است


*/
