import React, { useState } from "react";
import { loginUser, getCurrentUser } from "../api/authApi";
import { useDispatch } from "react-redux";
import { loginSuccess, setUser } from "../store/authSlice";
import { useNavigate } from "react-router-dom";

export default function LoginPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    username: "",
    password: "",
  });

  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState("");

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const validate = () => {
    let newErrors = {};

    if (!form.username.trim()) {
      newErrors.username = "Please enter your username.";
    } else if (form.username.length < 4) {
      newErrors.username = "Username must be at least 4 characters long.";
    }

    if (!form.password.trim()) {
      newErrors.password = "Please enter your password.";
    } else if (form.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters long.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setApiError("");

    if (!validate()) return;

    try {
      const response = await loginUser({
        username: form.username,
        password: form.password,
      });

      if (response.token) {
        dispatch(loginSuccess(response.token));

        const userResponse = await getCurrentUser();
        dispatch(setUser(userResponse[0] || userResponse));

        navigate("/dashboard");
      } else {
        throw new Error(response.detail || "Invalid server response.");
      }
    } catch (error) {
      console.error(
        "Login error details:",
        error.response?.data || error.message
      );

      let errorMsg = "Incorrect username or password.";
      if (error.response?.data?.detail) {
        errorMsg = error.response.data.detail;
      }

      setApiError(errorMsg);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center w-[384px] border-2 border-slate-100 rounded-lg px-6 py-8">
      <div className="w-[260px] flex items-center justify-center mb-10">
        <img src="src/assets/Ariana Logo.jpg" alt="" />
      </div>

      <div className="flex flex-col space-y-6">
        <div className="flex flex-col space-y-3">
          <h1 className="text-2xl font-semibold">Login</h1>
          <p className="text-slate-500 text-md">
            Enter your username and password to login to your account.
          </p>
        </div>

        <form
          className="flex flex-col space-y-6 items-center w-full"
          onSubmit={handleSubmit}
        >
          {/* Username */}
          <div className="flex flex-col space-y-2 w-full">
            <div className="text-md font-semibold">Username</div>
            <input
              name="username"
              type="text"
              onChange={handleChange}
              placeholder="Enter your username"
              className="border-1 rounded-lg border-slate-200 p-2 w-full placeholder:text-sm placeholder:font-medium placeholder:text-gray-500"
            />
            {errors.username && (
              <p className="text-red-500 text-sm">{errors.username}</p>
            )}
          </div>

          {/* Password */}
          <div className="flex flex-col space-y-2 w-full">
            <div className="text-md font-semibold">Password</div>
            <input
              name="password"
              type="password"
              onChange={handleChange}
              placeholder="Enter your password"
              className="border-1 rounded-lg border-slate-200 p-2 w-full placeholder:text-sm placeholder:font-medium placeholder:text-gray-500"
            />
            {errors.password && (
              <p className="text-red-500 text-sm">{errors.password}</p>
            )}
          </div>
          {apiError && <p className="text-red-500 text-sm">{apiError}</p>}
          <button
            type="submit"
            className="flex justify-center w-full bg-black text-white rounded-lg px-4 py-2 text-sm"
          >
            Login
          </button>

          <div className="font-medium text-sm">
            <p>
              Don't have an account?{" "}
              <span
                className="border-b border-b-black cursor-pointer"
                onClick={() => navigate("/register")}
              >
                Sign Up
              </span>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}
/*

بخش A — خط اول: import React, { useState } from "react";

import — کلمه کلیدی جاوااسکریپت/ESModule: می‌گوید «می‌خواهم چیزی را از یک فایل یا بسته بیاورم».

React — نامِ چیزی که داریم وارد می‌کنیم؛ خود کتابخانه React. لازم است برای بعضی JSXها یا توابع.

, — جداکننده بین آیتم‌های لیست واردات.

{ — آکولاد باز: شروع لیست وارداتی که نام‌گذاری‌شده‌اند (named imports).

useState — اسم یک Hook از React؛ تابعی برای داشتن و مدیریت «حالت» (state) در یک کامپوننت فانکشنی.

} — آکولاد بسته: پایان لیست وارداتی.

from — کلمه کلیدی: می‌گوید «این موارد را از کجا بیار».

"react" — رشته‌ای که نشان‌دهنده بسته‌ای است که از آن import می‌کنیم (در node_modules).

; — پایان خط در جاوااسکریپت (اختیاری ولی متداول).

بخش B — import { loginUser, getCurrentUser } from "../api/authApi";

import — همان توضیح بالا.

{ } — ما اینجا چند تابع نام‌دار (named exports) را از فایل می‌گیریم.

loginUser — اسم تابعی (تعریف شده در authApi) که درخواست لاگین را به سرور می‌فرستد.

, — جداکننده.

getCurrentUser — اسم تابعی که اطلاعات کاربر فعلی را از سرور می‌گیرد.

from — از کجا.

"../api/authApi" — مسیر فایل نسبت به محل این فایل؛ .. یعنی یک پوشه بالاتر، سپس وارد api شو، سپس فایل authApi.

; — پایان.

بخش C — import { useDispatch } from "react-redux";

useDispatch — یک hook از کتابخانه react-redux است.
وظیفه‌اش: دادن تابع dispatch که با آن می‌توانیم action به Redux ارسال کنیم (یعنی بگوییم state را تغییر بده).

"react-redux" — پکیج مربوط به اتصال React و Redux.

بخش D — import { loginSuccess, setUser } from "../store/authSlice";

loginSuccess — action creator صادرشده از authSlice. وقتی آن را صدا می‌زنیم و dispatch می‌کنیم، reducer مربوطه در Redux اجرا می‌شود و state را تغییر می‌دهد (مثلاً توکن را ذخیره می‌کند).

setUser — action برای ذخیره اطلاعات کاربر در state.

"../store/authSlice" — فایل حاوی slice مربوط به احراز هویت.

بخش E — import { useNavigate } from "react-router-dom";

useNavigate — hook از react-router-dom که به ما تابع navigate می‌دهد؛ با آن می‌توانیم برنامه‌وار (در جاوااسکریپت) کاربر را به مسیر دیگری هدایت کنیم (redirect).

بخش F — export default function LoginPage() {

export — می‌گوید این چیز را قابل استفاده در فایل‌های دیگر می‌کنیم.

default — خروجی پیش‌فرض این فایل است. یعنی وقتی دیگری بنویسد import LoginPage from "./LoginPage" همین تابع را می‌گیرد.

function — تعریف تابع در جاوااسکریپت؛ در React این تابع یک کامپوننت است.

LoginPage — نام تابع/کامپوننت. اسم کامپوننت طبق قاعده React با حرف بزرگ شروع می‌شود.

() — پرانتزهای تابع؛ در اینجا کامپوننت هیچ props مستقیم ورودی ندارد (لیست پارامترهای خالی).

{ — آکولاد باز: شروع بدنه تابع.

بخش G — const dispatch = useDispatch();

const — تعریف یک متغیر که نمی‌توان اسمش را دوباره به چیز دیگری اشاره داد (ثابت مرجع).

dispatch — اسم متغیر؛ ما از آن برای ارسال action به redux استفاده می‌کنیم.

= — عملگر تخصیص؛ مقدار سمت راست را در متغیر سمت چپ می‌گذارد.

useDispatch() — فراخوانی hook. این تابع وقتی صدا زده می‌شود، dispatch را برمی‌گرداند.

(); — پرانتز تابع و پایان دستور.

بخش H — const navigate = useNavigate();

navigate — تابعی که با آن می‌تو‌انیم مسیر صفحه را عوض کنیم. مثال: navigate("/dashboard").

useNavigate() — فراخوانی hook برای گرفتن تابع navigate.

بخش I — const [form, setForm] = useState({ username: "", password: "", });

Breakdown:

const — تعریف متغیر ثابت مرجع.

[ form, setForm ] — تخصیص آرایه‌ای (array destructuring): useState یک آرایه دو عضوی برمی‌گرداند؛ اولین عنصر مقدار state و دومین عنصر تابعی برای تغییر آن. این سینتکس هر دو را جدا می‌کند.

form — اسم متغیر state که داده‌های فرم را خواهیم داشت.

setForm — تابعی که برای به‌روزرسانی form استفاده می‌شود.

= — تخصیص.

useState(...) — فراخوانی hook React برای ایجاد state محلی کامپوننت.

{ username: "", password: "", } — شیء اولیه که به عنوان مقدار اولیه state داده می‌شود: دو فیلد username و password که هر کدام یک رشته خالی‌اند.

{ } — آکولادهای شیء جاوااسکریپت.

username: — کلید (اسم پراپرتی) داخل شیء.

"" — مقدار خالی (string).

, — جداکننده بین پراپرتی‌ها.

password: — کلید دیگر.

; — پایان خط.

معنی بالا: form یک شیء است که وضعیت فیلدها را نگه می‌دارد؛ setForm برای تغییر آن استفاده می‌شود.

بخش J — const [errors, setErrors] = useState({});

مشابه بخش I.

errors — شیئی که در آن نگه می‌داریم چه خطاهایی وجود دارد (مثلاً errors.username = "...").

setErrors — تابع برای به‌روزرسانی errors.

useState({}) — مقدار اولیه یک شیء خالی (یعنی فعلاً هیچ خطایی نیست).

بخش K — const [apiError, setApiError] = useState("");

apiError — رشته‌ای که پیام خطای برگشتی از سرور در آن نگه داشته می‌شود.

setApiError — برای تغییر پیام خطای سرور.

مقدار اولیه "" یعنی هیچ پیام خطایی فعلاً نمایش داده نشود.

بخش L — تعریف تابع handleChange
const handleChange = (e) => {
  setForm({
    ...form,
    [e.target.name]: e.target.value,
  });
};


کلمه‌به‌کلمه:

const — تعریف یک ثابت مرجع.

handleChange — اسم تابع؛ این تابع زمانی اجرا می‌شود که کاربر مقداری داخل یک input تایپ کند.

= — تخصیص.

(e) — پارامتر تابع؛ e کوتاه‌شده event است؛ آبجکتی که اطلاعات رویداد (رویدادی که در DOM اتفاق افتاده) را می‌دهد.

=> — عملگر arrow function؛ نشان‌دهنده‌ی تعریف تابع سریع. معادل function(e) { ... }.

{ } داخلی — بلوک کد تابع.

داخل تابع:

setForm({...}) — فراخوانی تابع به‌روزرسانی state؛ مقدار جدید فرم را می‌دهد.

{ ...form, [e.target.name]: e.target.value } — این یک شی جدید است که با استفاده از spread و computed property ساخته می‌شود.

...form — spread operator : تمام کلیدها و مقادیر قبلی form را کپی می‌کند داخل شی جدید. این کار تضمین می‌کند فیلدهایی که تغییر نکردند نگه داشته شوند.

, — بعد از spread، یک کلید جدید یا به‌روزرسانی می‌نویسیم.

[e.target.name] — computed property name: نام پراپرتی را از مقدار e.target.name می‌سازد. اگر input name="username" بود، اینجا همان username خواهد شد.

: — تفکیک کلید و مقدار.

e.target.value — مقدار متنی که کاربر در input نوشته.

در نتیجه setForm یک شی جدید می‌سازد که همان مقادیر قبلی را دارد ولی فیلدی که کاربر تغییر داده با مقدار جدید جایگزین شده.

بخش M — تابع validate
const validate = () => {
  let newErrors = {};
  if (!form.username.trim()) { ... }
  else if (form.username.length < 4) { ... }
  if (!form.password.trim()) { ... }
  else if (form.password.length < 6) { ... }
  setErrors(newErrors);
  return Object.keys(newErrors).length === 0;
};


کلمه‌به‌کلمه:

const validate = () => { — تعریف یک تابع محلی به اسم validate. این تابع بدون پارامتر است و در انتها true یا false برمی‌گرداند.

let newErrors = {}; — let به معنی یک متغیر قابل تغییر؛ newErrors شی جدیدی است که خطاها را در آن می‌ریزیم. مقدار اولیه یک شیء خالی.

if — شرط.

!form.username.trim() — معنی: form.username.trim() مقدار username را بدون فاصله در ابتدا/اخر (trim) برمی‌گرداند؛ ! یعنی اگر رشته خالی یا فقط فاصله بود (false-like) شرط اجرا می‌شود.

form.username — دسترسی به مقدار username داخل state form.

.trim() — تابعی روی رشته که فاصله‌های ابتدا و انتهای رشته را حذف می‌کند.

newErrors.username = "Please enter your username."; — اگر نام کاربری خالی باشد، یک پیام خطا به کلید username در newErrors اختصاص می‌دهد.

else if (form.username.length < 4) — اگر username کمتر از 4 کاراکتر است.

newErrors.username = "Username must be at least 4 characters long."; — پیام مناسب.

سپس مشابه برای form.password با شرط length < 6.

setErrors(newErrors); — خطاها را در state ذخیره می‌کنیم تا در UI نمایش داده شود.

return Object.keys(newErrors).length === 0; — Object.keys(...) لیستی از اسم کلیدهای شی را برمی‌گرداند؛ اگر طول این لیست صفر باشد یعنی خطا نیست؛ === 0 بررسی برابری سخت (نوع و مقدار). پس تابع true برمی‌گرداند اگر هیچ خطایی نباشد.

بخش N — تابع handleSubmit

تعریف کامل و سپس گویاتر:

const handleSubmit = async (e) => {
  e.preventDefault();
  setApiError("");
  if (!validate()) return;
  try {
    const response = await loginUser({ username: form.username, password: form.password });
    if (response.token) {
      dispatch(loginSuccess(response.token));
      const userResponse = await getCurrentUser();
      dispatch(setUser(userResponse[0] || userResponse));
      navigate("/dashboard");
    } else {
      throw new Error(response.detail || "Invalid server response.");
    }
  } catch (error) {
    console.error("Login error details:", error.response?.data || error.message);
    let errorMsg = "Incorrect username or password.";
    if (error.response?.data?.detail) { errorMsg = error.response.data.detail; }
    setApiError(errorMsg);
  }
};


حالا کلمه‌به‌کلمه:

const handleSubmit = — تعریف یک تابع.

async — کلمه کلیدی که می‌گوید این تابع «آسنکرون» است؛ یعنی می‌توانیم داخلش از await برای منتظر ماندن جواب promiseها استفاده کنیم.

(e) — پارامتر تابع؛ e رویداد ارسال فرم است (event).

=> — arrow function.

{ — شروع بدنه تابع.

داخل:

e.preventDefault();

e.preventDefault — تابعی از event که رفتار پیش‌فرض مرورگر را لغو می‌کند. در فرم‌ها پیش‌فرض ارسال فرم و reload صفحه است؛ این خط آن را متوقف می‌کند تا کنترل ارسال با جاوااسکریپت باشد.

(); — فراخوانی تابع.

setApiError(""); — مقدار خطای API را به رشته خالی تبدیل می‌کنیم تا پیام قبلی پاک شود.

if (!validate()) return;

اگر validate() false برگرداند (یعنی خطا وجود دارد)، با return از تابع خارج می‌شویم و دیگر ادامه نمی‌دهیم (هیچ درخواستی به سرور نمی‌رود).

try { ... } catch (error) { ... }

بلوک try/catch برای گرفتن هر خطای زمان اجرا یا خطای Promiseها. هر خطایی در try رخ دهد، کنترل می‌رود به catch با شی error.

درون try:

const response = await loginUser({ username: form.username, password: form.password, });

const response = — نتیجه را در متغیر response ذخیره می‌کنیم.

await — منتظر می‌ماند تا loginUser(...) یک Promise را حل کند (resolve) و مقدار بازگشتی را بدهد.

loginUser(...) — تابعی که درخواست POST لاگین را به سرور می‌فرستد؛ آرگومان یک شی است: { username: form.username, password: form.password }.

username: form.username — مقدار username از state فرم را می‌فرستیم.

password: form.password — مقدار password از state فرم.

if (response.token) { — اگر سرور در جواب یک فیلد token فرستاده (یعنی لاگین موفق) وارد این شاخه می‌شویم.

داخل این شاخه:

dispatch(loginSuccess(response.token));

loginSuccess(response.token) — اکشن‌کرییتور را فراخوانی می‌کند با token (این تابع یک آبجکت action تولید می‌کند).

dispatch(...) — آن action را به Redux می‌فرستد که باعث اجرای reducer و ذخیره توکن در state و localStorage می‌شود.

const userResponse = await getCurrentUser();

بعد از ذخیره توکن، getCurrentUser() فراخوانی می‌شود تا اطلاعات کاربر را بگیرد (مثلاً نام، ایمیل). await باعث می‌شود تا تا زمان دریافت جواب صبر کند.

dispatch(setUser(userResponse[0] || userResponse));

بعضی APIها جواب را داخل یک آرایه برمی‌گردانند، مثلا [userObject]، بعضی‌ها فقط userObject.

userResponse[0] || userResponse — اگر userResponse[0] وجود داشته باشد آن را بگیر، در غیر این صورت userResponse.

سپس با dispatch(setUser(...)) اطلاعات user را در Redux ذخیره می‌کنیم.

navigate("/dashboard");

هدایت کاربر به مسیر /dashboard. یعنی صفحه داشبورد را نشان بده.

} else { throw new Error(response.detail || "Invalid server response."); }

اگر response.token وجود نداشت یعنی پاسخ سرور مطابق انتظار نبود؛ throw یک خطا می‌سازد و آن را پرتاب می‌کند.

new Error(...) — سازنده‌ی شی خطا؛ داخلش متن خطا گذاشته می‌شود.

response.detail || "Invalid server response." — اگر سرور یک detail در جواب داده آن را استفاده کن، در غیر این صورت متن کلی.

درون catch (error) { ... }:

catch (error) — خطا درون متغیر error قرار می‌گیرد.

console.error("Login error details:", error.response?.data || error.message);

console.error(...) — چاپ پیام خطا در کنسول مرورگر (با سطح خطا).

"Login error details:" — متن ثابت برای کمک به دیباگ.

error.response?.data — اگر خطا ناشی از axios باشد، axios خطا را به شکل error.response با داده‌های سرور قرار می‌دهد؛ ?. اپراتور optional chaining است که اگر error.response موجود نباشد از کرش جلوگیری کند و undefined بدهد.

|| error.message — اگر error.response?.data موجود نبود، error.message (متن خطای جاوااسکریپت) را چاپ کن.

let errorMsg = "Incorrect username or password.";

متغیر محلی errorMsg با پیام پیش‌فرض.

if (error.response?.data?.detail) { errorMsg = error.response.data.detail; }

اگر سرور پیام خطای خاصی فرستاده (detail)، آن را جایگزین errorMsg کن.

setApiError(errorMsg);

پیام نهایی را در state apiError قرار می‌دهیم تا UI آن را نشان دهد.

}; — پایان تعریف handleSubmit.

بخش O — return ( ...JSX... ); — خروجی کامپوننت (UI)

کامپوننت React باید چیزی "برگرداند" که در React به آن JSX می‌گوییم (شبه-HTML). return این JSX را برمی‌گرداند.

return ( — شروع بلوک JSX.

JSX شامل تگ‌های HTML-like مثل <div>, <form>, <input>, <button> است. داخل JSX می‌شود جاوااسکریپت را بین {} قرار داد.

من اجزای مهم JSX را هم کلمه به کلمه توضیح می‌دهم:

خط JSX: <div className="flex flex-col items-center justify-center w-[384px] border-2 border-slate-100 rounded-lg px-6 py-8">

<div> — عنصر بلاک HTML.

className — در React به جای attribute HTML class از className استفاده می‌کنیم؛ اینجا لیستی از کلاس‌های TailwindCSS است که ظاهر را تعیین می‌کنند.

="..." — رشته‌ای از اسامی کلاس.

flex → نمایش المان به صورت فلکس باکس.

flex-col → جهت ستون.

items-center justify-center → وسط چین کردن عناصر.

w-[384px] border-2 border-slate-100 rounded-lg px-6 py-8 → اندازه، حاشیه‌ها، شعاع‌، padding و غیره.

> — پایان باز شدن تگ، محتوای داخلی می‌آید.

<img src="src/assets/Ariana Logo.jpg" alt="" />

<img /> — تگ تصویر. در JSX باید تگ self-closing باشد (/>).

src — مسیر فایل تصویری.

alt — متن جایگزین تصویر (برای دسترسی و زمانی که تصویر لود نشود). اینجا رشته خالی است.

<h1 className="text-2xl font-semibold">Login</h1>

<h1> — تگ عنوان سطح 1.

محتوای بین تگ‌ها Login — متن نمایشی.

className — کلاس‌های CSS برای اندازه و فونت.

<form className="..." onSubmit={handleSubmit}>

<form> — تگ HTML فرم.

onSubmit={handleSubmit} — وقتی فرم ارسال می‌شود (دکمه submit زده شود یا Enter)، این prop جاوااسکریپتی handleSubmit را صدا می‌زند. در JSX JavaScript داخل {} نوشته می‌شود.

بخش input username:
<input
  name="username"
  type="text"
  onChange={handleChange}
  placeholder="Enter your username"
  className="..."
/>


کلمه‌به‌کلمه:

<input /> — المان ورودی تک‌خطی.

name="username" — اسم input؛ این نام است که در handleChange از e.target.name خوانده می‌شود.

type="text" — نوع ورودی؛ اینجا متن است.

onChange={handleChange} — هر بار کاربر تایپ کند یا مقدار عوض شود، این تابع اجرا می‌شود.

placeholder="..." — متن خاکستری که وقتی فیلد خالی است نمایش داده می‌شود.

className="..." — کلاس‌های CSS.

نمایش خطای مربوط به username:
{errors.username && (
  <p className="text-red-500 text-sm">{errors.username}</p>
)}


{ ... } — داخل JSX، هر چیزی داخل آکولاد جاوااسکریپت است و قبل از رندر ارزیابی می‌شود.

errors.username && (...) — این یک شیوه مرسوم در React است: اگر errors.username وجود داشته باشد (truthy) عبارت بعد از && نمایش داده می‌شود؛ اگر errors.username falsy (مثل undefined یا "") باشد، چیزی نمایش داده نمی‌شود.

<p>{errors.username}</p> — متن خطا را درون عنصر پاراگراف نمایش می‌دهد.

input password — دقیقا مانند username فقط type="password" که باعث می‌شود متن واردشده به صورت نقطه/ستاره نشان داده شود.
نمایش خطای API:
{apiError && <p className="text-red-500 text-sm">{apiError}</p>}


اگر apiError (رشته) غیرخالی باشد، متن آن زیر فرم نشان داده می‌شود.

دکمه submit:
<button type="submit" className="...">Login</button>


<button> — دکمه.

type="submit" — وقتی این دکمه زده شود، فرم ارسال می‌شود و onSubmit فرم اجرا می‌شود.

متن بین تگ‌ها Login — نوشته‌ی دکمه.

لینک Sign Up:
<span onClick={() => navigate("/register")}>Sign Up</span>


<span> — تگ خطی.

onClick={...} — وقتی span کلیک شود، جاوااسکریپت داخل {} اجرا می‌شود.

() => navigate("/register") — یک arrow function بدون پارامتر که هنگام کلیک navigate("/register") را صدا می‌زند؛ یعنی کاربر را به صفحه ثبت‌نام می‌برد.

برخی نمادهای جاوااسکریپتی که بارها استفاده شدند — یک‌به‌یک و ساده

=> — arrow function؛ جایگزین function(...) { ... } است.

... (spread operator) — داخل اشیاء ...form یعنی «همه مقادیر form را اینجا بیاور».

[expr] داخل شیء — computed property name؛ اگر داخل براکت یک عبارت (مثل e.target.name) قرار گیرد آن مقدار به عنوان اسم پراپرتی استفاده می‌شود.

await — منتظر حل شدن یک Promise می‌ماند و سپس مقدار حل‌شده را برمی‌گرداند. فقط داخل توابع async مجاز است.

async — علامت می‌دهد تابع آسنکرون است و می‌تواند از await استفاده کند.

try { } catch (error) { } — ساختار مدیریت خطا؛ هر خطایی در try رخ دهد به catch می‌رود.

throw — ایجاد خطا دستی و پرتاب آن برای رفتن به بلوک catch.

new Error("...") — ساختن شی خطا با متن مشخص.

?. — optional chaining؛ اگر بخش قبل از ?. وجود نداشته باشد، به‌جای کرش کردن undefined برمی‌گرداند. مثال: error.response?.data امن است حتی اگر error.response وجود نداشته باشد.

|| — عملگر منطقی OR: اگر سمت چپ truthy نباشد، سمت راست را برمی‌گرداند.

Object.keys(obj) — آرایه‌ای از کلیدهای یک شی را برمی‌گرداند.

=== — مقایسه از نوع سخت؛ بررسی می‌کند مقدار و نوع برابر باشند.

جمع‌بندیِ کوتاهِ بسیار ساده (چند جمله‌ای)

import‌ها: می‌گویند چه چیزهایی از کجا آمده‌اند (React، توابع API، Redux، Router).

useState‌ها: جاهایی که مقادیر متغیر را نگه می‌داریم (فرم، خطاها).

handleChange: هر بار کاربر تایپ می‌کند، مقدار فرم را با spread بروزرسانی می‌کند.

validate: از فرم می‌پرسد «آیا ورودی‌ها درست‌اند؟» و خطاها را می‌سازد.

handleSubmit: جلوی reload را می‌گیرد، فرم را اعتبارسنجی می‌کند، درخواست لاگین می‌زند، جواب را دریافت می‌کند، توکن را در Redux ذخیره می‌کند، اطلاعات کاربر را می‌گیرد، کاربر را به داشبورد می‌فرستد، و در صورت خطا پیام مناسبی نمایش می‌دهد.

JSX: قالب صفحه است؛ inputها، دکمه، پیام خطا — همه آنجا تعریف شده‌اند.

*/
