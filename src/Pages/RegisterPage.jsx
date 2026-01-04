import React, { useState, useRef } from "react";
import { User } from "lucide-react";
import { registerUser } from "../api/authApi";
import { useNavigate } from "react-router-dom";

export default function RegisterPage() {
  const [form, setForm] = useState({
    first_name: "",
    last_name: "",
    username: "",
    password: "",
    confirmPassword: "",
    avatar: null,
  });

  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState("");
  const [preview, setPreview] = useState(null);
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "avatar" && files[0]) {
      setForm({ ...form, avatar: files[0] });
      setPreview(URL.createObjectURL(files[0]));
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const validate = () => {
    let newErrors = {};

    if (!form.first_name.trim()) {
      newErrors.first_name = "Please enter your first name";
    }

    if (!form.last_name.trim()) {
      newErrors.last_name = "Please enter your last name";
    }

    if (!form.username.trim()) {
      newErrors.username = "Please enter a username";
    } else if (form.username.length < 4) {
      newErrors.username = "Username must be at least 4 characters";
    }

    if (!form.password.trim()) {
      newErrors.password = "Please enter a password";
    } else if (form.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    if (form.confirmPassword !== form.password) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    if (!form.avatar) {
      newErrors.avatar = "Please upload a profile picture";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setApiError("");

    if (!validate()) return;

    try {
      const formData = new FormData();
      formData.append("first_name", form.first_name);
      formData.append("last_name", form.last_name);
      formData.append("username", form.username);
      formData.append("password", form.password);
      formData.append("confirm_password", form.confirmPassword);
      if (form.avatar) formData.append("avatar", form.avatar);

      await registerUser(formData);
      alert("Registration successful! Please log in.");
      navigate("/");
    } catch (error) {
      let errorMsg = "Registration error: ";

      if (error.response?.data?.non_field_errors) {
        errorMsg += error.response.data.non_field_errors[0];
      } else if (error.response?.data?.detail) {
        errorMsg += error.response.data.detail;
      } else {
        errorMsg += error.message;
      }

      setApiError(errorMsg);
    }
  };

  const handleUploadClick = () => fileInputRef.current.click();

  return (
    <div className="flex flex-col items-center justify-center w-[384px] border-2 border-slate-100 rounded-lg m-8 px-6 py-8">
      <div className="w-[260px] flex items-center justify-center mb-10">
        <img src="src/assets/Ariana Logo.jpg" alt="" />
      </div>

      <div className="flex flex-col space-y-6 w-full justify-center">
        <div className="flex flex-col space-y-3">
          <h1 className="text-2xl font-semibold">Sign Up</h1>
          <p className="text-slate-500 text-sm">
            Enter your information to create an account.
          </p>
        </div>

        <div className="flex justify-between items-center border-1 border-slate-100 rounded-lg px-4 py-2">
          <div className="bg-blue-100/50 rounded-full">
            {preview ? (
              <img
                src={preview}
                alt="Preview"
                className="w-11 h-11 rounded-full object-cover"
              />
            ) : (
              <User className="text-black/25 w-12 h-12 p-2" />
            )}
          </div>
          <div
            className="border-2 border-slate-100 rounded-lg px-2 py-2 font-semibold cursor-pointer"
            onClick={handleUploadClick}
          >
            Upload +
          </div>
          <input
            type="file"
            name="avatar"
            accept="image/*"
            onChange={handleChange}
            ref={fileInputRef}
            className="hidden"
          />
        </div>
        {errors.avatar && (
          <p className="text-red-500 text-sm">{errors.avatar}</p>
        )}

        <form
          className="flex flex-col space-y-6 items-center w-full"
          onSubmit={handleSubmit}
        >
          <div className="flex flex-col space-y-2 w-full">
            <div className="text-md font-semibold">First name</div>
            <input
              name="first_name"
              type="text"
              onChange={handleChange}
              placeholder="Please enter your first name"
              className="border-1 rounded-lg border-slate-200 p-2 w-full"
            />
            {errors.first_name && (
              <p className="text-red-500 text-sm">{errors.first_name}</p>
            )}
          </div>

          <div className="flex flex-col space-y-2 w-full">
            <div className="text-md font-semibold">Last name</div>
            <input
              name="last_name"
              type="text"
              onChange={handleChange}
              placeholder="Please enter your last name"
              className="border-1 rounded-lg border-slate-200 p-2 w-full"
            />
            {errors.last_name && (
              <p className="text-red-500 text-sm">{errors.last_name}</p>
            )}
          </div>

          <div className="flex flex-col space-y-2 w-full">
            <div className="text-md font-semibold">Username</div>
            <input
              name="username"
              type="text"
              onChange={handleChange}
              placeholder="Please enter a username"
              className="border-1 rounded-lg border-slate-200 p-2 w-full"
            />
            {errors.username && (
              <p className="text-red-500 text-sm">{errors.username}</p>
            )}
          </div>
          {apiError && <p className="text-red-500 text-sm">{apiError}</p>}
          <div className="flex flex-col space-y-2 w-full">
            <div className="text-md font-semibold">Password</div>
            <input
              name="password"
              type="password"
              onChange={handleChange}
              placeholder="Please enter a password"
              className="border-1 rounded-lg border-slate-200 p-2 w-full"
            />
            {errors.password && (
              <p className="text-red-500 text-sm">{errors.password}</p>
            )}
          </div>

          <div className="flex flex-col space-y-2 w-full">
            <div className="text-md font-semibold">Confirm Password</div>
            <input
              name="confirmPassword"
              type="password"
              onChange={handleChange}
              placeholder="Re-enter your password"
              className="border-1 rounded-lg border-slate-200 p-2 w-full"
            />
            {errors.confirmPassword && (
              <p className="text-red-500 text-sm">{errors.confirmPassword}</p>
            )}
          </div>

          <button
            type="submit"
            className="flex justify-center w-full bg-slate-100 text-black rounded-lg px-4 py-2 text-sm font-semibold hover:bg-black hover:text-white transition-all duration-200"
          >
            Register
          </button>

          <div className="font-medium text-sm">
            <p>
              Already have an account?{" "}
              <span
                className="border-b border-b-black cursor-pointer"
                onClick={() => navigate("/")}
              >
                Sign in
              </span>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}
/*
🔵 خط ۱
import React, { useState, useRef } from "react";

✳️ import

کلمه‌ی جاوااسکریپتی؛ یعنی:

برو از یک فایل یا کتابخانه‌ی دیگر یک چیزهایی را برای استفاده در این فایل بیار.

✳️ React

این اسم کتابخانه اصلی ری‌اکت است.
وقتی فایل JSX داریم (مثل همین RegisterPage)، باید React را وارد کنیم تا JSX کار کند.

✳️ { useState, useRef }

این یعنی از داخل کتابخانه react فقط این دو تابع را بگیر:

useState → ساختن state (حافظه داخلی کامپوننت)

useRef → ساختن یک متغیر قابل نگهداری بدون رندر مجدد (برای فایل input نیاز داریم)

✳️ from "react"

یعنی:

این چیزها را از کتابخانه‌ی react دریافت کن.

🔵 خط ۲
import { User } from "lucide-react";

✳️ lucide-react

این یک کتابخانه از آیکون‌های SVG است.

✳️ { User }

این یک کامپوننت آیکون است که شکل آدمک یا پروفایل را نشان می‌دهد.

🔵 خط ۳
import { registerUser } from "../api/authApi";

✳️ ../api/authApi

این یعنی برو یک فولدر بالاتر (..) و وارد پوشه api شو و فایل authApi.js را باز کن.

✳️ { registerUser }

از داخل آن فایل فقط تابع registerUser را بگیر.

این تابع برای ثبت‌نام کاربر در سرور استفاده می‌شود.

🔵 خط ۴
import { useNavigate } from "react-router-dom";

✳️ useNavigate

این تابع مخصوص کتابخانه‌ی react-router-dom است و برای انتقال کاربر از یک صفحه به صفحه‌ای دیگر استفاده می‌شود.

مثلاً:

navigate("/dashboard")


کاربر را ببر به صفحه /dashboard.




بخش ۲ — شروع کامپوننت و state ها

کد:

export default function RegisterPage() {

✔️ export default

این یعنی:

این فایل یک چیز اصلی دارد که می‌خواهد به بیرون بدهد.

هر فایلی یک export default می‌تواند داشته باشد.

✔️ function RegisterPage()

اینجا داریم یک کامپوننت ری‌اکت تعریف می‌کنیم.
اسمش RegisterPage است.

ری‌اکت کامپوننت‌هایی هستند که UI را می‌سازند.

🌟 بخش ۳ — state اصلی فرم

کد:

const [form, setForm] = useState({
  first_name: "",
  last_name: "",
  username: "",
  password: "",
  confirmPassword: "",
  avatar: null,
});

✔️ const

یعنی یک مقدار ثابت تعریف می‌کنیم.

✔️ [form, setForm]

این یک تکنیک جاوااسکریپت به نام array destructuring است.

تابع useState یک آرایه برمی‌گرداند که دو چیز داخلش است:

form → مقدار فعلی state

setForm → تابعی برای تغییر state

✔️ useState({...})

تابع useState از ری‌اکت است و برای ذخیره‌سازی داده‌های فرم استفاده می‌شود.

✔️ مقدار اولیه state:

این یک آبجکت است با فیلدهای مربوط به فرم ثبت‌نام:

first_name → خالی

last_name → خالی

username → خالی

password → خالی

confirmPassword → خالی

avatar → null (چون عکس فایل است)

🌟 بخش ۴ — state های خطا و apiError

کد:

const [errors, setErrors] = useState({});

✔️ errors

آبجکتی است که خطاهای فرم را نگه می‌دارد
مثلاً:

errors.username = "Username required"


کد:

const [apiError, setApiError] = useState("");

✔️ apiError

وقتی سرور خطا برگرداند، اینجا ذخیره می‌شود.

کد:

const [preview, setPreview] = useState(null);

✔️ preview

این عکس پروفایل را قبل از آپلود نمایش می‌دهد.

🌟 بخش ۵ — useNavigate
const navigate = useNavigate();

✔️ useNavigate

تابع مخصوص react-router
برای تغییر صفحه استفاده می‌شود.

مثلاً:

navigate("/")

🌟 بخش ۶ — useRef برای فایل input
const fileInputRef = useRef(null);

✔️ useRef

این یک متغیر "ثابت" می‌سازد که با رندر مجدد تغییر نمی‌کند.

ما از آن برای کلیک کردن روی input فایل به صورت مخفی استفاده می‌کنیم.

🌟 بخش ۷ — تابع handleChange

کد:

const handleChange = (e) => {


تابع هر تغییری در inputهای فرم را مدیریت می‌کند.

داخلش:
const { name, value, files } = e.target;


e → همان event ورودی است

e.target → همان input است

name → نام input (مثل username)

value → مقدار input

files → لیست فایل های آپلودی (برای عکس)

اگر ورودی عکس بود:
if (name === "avatar" && files[0]) {
  setForm({ ...form, avatar: files[0] });
  setPreview(URL.createObjectURL(files[0]));
}


اگر name برابر avatar باشد

فایل را در state ذخیره می‌کنیم

preview را با URL.createObjectURL() می‌سازیم

اگر ورودی معمولی بود:
setForm({ ...form, [name]: value });


...form یعنی کپی بقیه فیلدها

[name] یعنی مقدار همان input را تغییر بده
(مثل username، first_name، password...)

🌟 بخش ۸ — تابع validate (ولیدیشن فرم)

این تابع خطاهای کاربر را بررسی می‌کند.

مثلاً:

if (!form.first_name.trim()) {
  newErrors.first_name = "Please enter your first name";
}


تمام فیلدها یکی‌یکی بررسی می‌شوند.

آخرش:

setErrors(newErrors);
return Object.keys(newErrors).length === 0;


یعنی:

خطاها را ذخیره کن

اگر طول خطا صفر بود → فرم معتبر است

🌟 بخش ۹ — تابع handleSubmit

این مهمترین قسمت است.

کد:

const handleSubmit = async (e) => {

✔️ async

چون داخلش از await استفاده می‌کنیم.

جلوگیری از ریفرش شدن صفحه:
e.preventDefault();

پاک کردن خطای قبلی:
setApiError("");

اگر validate شکست خورد:
if (!validate()) return;

🔥 ساخت FormData برای ارسال به سرور

کد:

const formData = new FormData();
formData.append("first_name", form.first_name);
formData.append("last_name", form.last_name);
formData.append("username", form.username);
formData.append("password", form.password);
formData.append("confirm_password", form.confirmPassword);
if (form.avatar) formData.append("avatar", form.avatar);


FormData برای ارسال فایل + متن استفاده می‌شود.

🔥 ارسال به سرور
await registerUser(formData);


اگر موفق باشد:

alert("Registration successful! Please log in.");
navigate("/");


می‌برد به صفحه‌ی لاگین.

🔥 اگر سرور خطا داد

کد:

catch (error) {
  let errorMsg = "Registration error: ";


اگر سرور چنین خطاهایی داشت:

error.response.data.non_field_errors
error.response.data.detail


آن‌ها را نمایش می‌دهیم.

آخر:

setApiError(errorMsg);

🌟 بخش ۱۰ — تابع handleUploadClick
const handleUploadClick = () => fileInputRef.current.click();


این کاری می‌کند که وقتی روی دکمه "Upload +" کلیک می‌کنی، input فایل که مخفی است، باز شود.

🌟 بخش ۱۱ — JSX (قسمت نمایشی UI)

کل UI صفحه ثبت‌نام:

عکس لوگو

فیلد آپلود

فیلدهای فرم

دکمه ثبت‌نام

لینک بازگشت به صفحه لاگین

هر قسمت className دارد که مربوط به TailwindCSS است.


ما از این خط شروع می‌کنیم:

return (


در ری‌اکت هر کامپوننت باید یک مقدار برگرداند، که معمولاً یک JSX (ساختار HTML مانند) است.

🔵 بخش ۱
کد:
<div className="flex flex-col items-center justify-center w-[384px] border-2 border-slate-100 rounded-lg m-8 px-6 py-8">


این اولین div است.
این یعنی کل کارت ثبت‌نام.

داخل className چه خبر است؟
کلاس	معنی
flex	فعال کردن flexbox
flex-col	چیدمان ستونی
items-center	قرار دادن محتوا وسط از نظر افقی
justify-center	وسط‌چین عمودی
w-[384px]	عرض ثابت ۳۸۴ پیکسل
border-2	خطوط دور با ضخامت ۲
border-slate-100	رنگ خط کم‌رنگ
rounded-lg	گوشه‌های گرد
m-8	فاصله بیرونی ۲rem
px-6	پدینگ افقی
py-8	پدینگ عمودی
🔵 بخش ۲ — لوگو
<div className="w-[260px] flex items-center justify-center mb-10">
  <img src="src/assets/Ariana Logo.jpg" alt="" />
</div>

توضیح:

w-[260px] → عرض ۲۶۰ پیکسل

flex → برای وسط چین کردن عکس

mb-10 → فاصله از پایین

<img> → نمایش عکس لوگو

src → مسیر عکس

alt → متن جایگزین (خالی است)

🔵 بخش ۳ — تیتر صفحه
<div className="flex flex-col space-y-3">
  <h1 className="text-2xl font-semibold">Sign Up</h1>
  <p className="text-slate-500 text-sm">
    Enter your information to create an account.
  </p>
</div>

توضیح:

flex flex-col → دو عنصر h1 و p زیر هم

space-y-3 → بینشان 12px فاصله

h1 با text-2xl → اندازه بزرگ

font-semibold → نیمه ضخیم

پ متن معرفی با رنگ خاکستری (text-slate-500)

🔵 بخش ۴ — بخش آپلود عکس پروفایل
<div className="flex justify-between items-center border-1 border-slate-100 rounded-lg px-4 py-2">


این div شامل:

عکس پروفایل یا آیکون پیش‌فرض

دکمه Upload

input فایل مخفی

۱. نمایش عکس یا آیکون
<div className="bg-blue-100/50 rounded-full">
  {preview ? (
    <img
      src={preview}
      alt="Preview"
      className="w-11 h-11 rounded-full object-cover"
    />
  ) : (
    <User className="text-black/25 w-12 h-12 p-2" />
  )}
</div>

توضیح:

{preview ? (...) : (...)} → شرط JSX
اگر preview وجود داشته باشد، عکس را نشان می‌دهد
اگر نه، آیکون <User> را نمایش می‌دهد

برای عکس:

w-11 h-11 → اندازه ۴۴px

rounded-full → کاملاً گرد

object-cover → عکس بدون کشیدگی در قاب می‌نشیند

آیکون پیش‌فرض:

User → آیکون آدمک از lucide-react

text-black/25 → رنگ خاکستری کم‌رنگ

w-12 h-12 → اندازه

p-2 → فاصله داخلی

2. دکمه انتخاب عکس
<div
  className="border-2 border-slate-100 rounded-lg px-2 py-2 font-semibold cursor-pointer"
  onClick={handleUploadClick}
>
  Upload +
</div>

نکات:

این div مثل یک دکمه عمل می‌کند

cursor-pointer → وقتی موس می‌رود روی آن، شکلش دست می‌شود

onClick={handleUploadClick} → کلیک باعث باز شدن input فایل می‌شود (input مخفی است)

3. input فایل مخفی
<input
  type="file"
  name="avatar"
  accept="image/*"
  onChange={handleChange}
  ref={fileInputRef}
  className="hidden"
/>

کلمه‌به‌کلمه:

type="file" → برای انتخاب فایل

accept="image/*" → فقط عکس قابل انتخاب است

onChange={handleChange} → وقتی فایل انتخاب شد، مقدارش تغییر می‌کند

ref={fileInputRef} → رفرنس برای کلیک کردن با جاوااسکریپت

className="hidden" → input مخفی است

🔵 بخش ۵ — اگر عکس انتخاب نشد، پیام خطا
{errors.avatar && (
  <p className="text-red-500 text-sm">{errors.avatar}</p>
)}

معنی:

اگر errors.avatar وجود داشته باشد:
→ متن خطا نمایش داده می‌شود
اگر وجود نداشته باشد:
→ هیچ چیزی نمایش نمی‌دهد

🔵 بخش ۶ — فرم اصلی

کد:

<form
  className="flex flex-col space-y-6 items-center w-full"
  onSubmit={handleSubmit}
>

کلمه‌به‌کلمه:

form → یک فرم HTML

onSubmit={handleSubmit} → وقتی روی دکمه Register کلیک شد، تابع handleSubmit اجرا می‌شود

🔵 هر فیلد ورودی فرم توضیح کامل
فیلد first name:
<div className="flex flex-col space-y-2 w-full">
  <div className="text-md font-semibold">First name</div>
  <input
    name="first_name"
    type="text"
    onChange={handleChange}
    placeholder="Please enter your first name"
    className="border-1 rounded-lg border-slate-200 p-2 w-full"
  />

توضیح:

name="first_name" → کلید مربوط به state فرم

هر تغییری در input باعث اجرای handleChange می‌شود

placeholder متن راهنماست

border-slate-200 → رنگ خاکستری کم‌رنگ

rounded-lg → گوشه گرد

بخش خطای first_name
{errors.first_name && (
  <p className="text-red-500 text-sm">{errors.first_name}</p>
)}


اگر خطایی باشد، نمایش داده می‌شود.

همین ساختار برای:

last_name

username

password

confirmPassword

تکرار شده.

فقط name و placeholder تغییر کرده‌اند.

🔵 بخش خطای apiError

کد:

{apiError && <p className="text-red-500 text-sm">{apiError}</p>}


اگر پاسخ سرور خطا داد، اینجا نمایش داده می‌شود.

🔵 بخش دکمه ثبت‌نام
<button
  type="submit"
  className="flex justify-center w-full bg-slate-100 text-black rounded-lg px-4 py-2 text-sm font-semibold hover:bg-black hover:text-white transition-all duration-200"
>
  Register
</button>

نکات:

type="submit" → فرم را ارسال می‌کند

hover → وقتی موس روی دکمه برود، رنگ‌ها تغییر می‌کنند

transition → انیمیشن نرم ۲۰۰ms

🔵 بخش لینک "Sign in"
<div className="font-medium text-sm">
  <p>
    Already have an account?{" "}
    <span
      className="border-b border-b-black cursor-pointer"
      onClick={() => navigate("/")}
    >
      Sign in
    </span>
  </p>
</div>

نکته‌ها:

{" "} → فاصله در JSX

کلیک روی Sign in → کاربر به صفحه لاگین منتقل می‌شود

*/
