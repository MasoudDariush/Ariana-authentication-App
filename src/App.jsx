import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "./Pages/LoginPage";
import RegisterPage from "./Pages/RegisterPage";
import Dashboard from "./Pages/Dashboard";
import { useSelector } from "react-redux";

const ProtectedRoute = ({ children }) => {
  const token = useSelector((state) => state.auth.token);
  return token ? children : <Navigate to="/" />;
};

export default function App() {
  return (
    <>
      <BrowserRouter>
        <div className="w-full min-h-screen bg-white flex items-center justify-center">
          <Routes>
            <Route path="/" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
          </Routes>
        </div>
      </BrowserRouter>
    </>
  );
}

/*
children چیه و از کجا میاد؟

children = محتوایی که داخل کامپوننت قرار می‌دهی.

مثال:

<ProtectedRoute>
   <Dashboard />
</ProtectedRoute>


اینجا children = <Dashboard />

یعنی Dashboard داخل ProtectedRoute قرار گرفته.

این سازوکار خود React است.
هیچ چیز خاصی نیست:
هر کامپوننتی می‌تواند داشته باشد.


🟦 بخش 1 — توضیح خط‌به‌خط ProtectedRoute

کد:

const ProtectedRoute = ({ children }) => {
  const token = useSelector((state) => state.auth.token);
  return token ? children : <Navigate to="/" />;
};


بذار از صفر شروع کنیم.

🔹 const ProtectedRoute = (...) => { ... }

این یک کامپوننت است.

مثل یک تابع رفتار می‌کند.

حرف اول اسمش بزرگ است → چون قوانين React این را می‌خواهد.

خروجی آن JSX است (یعنی کد شبیه HTML).

🔹 ({ children })

این سخت‌ترین بخش برای مبتدیان است، ولی اینجا توضیح بسیار ساده:

children یعنی «محتوایی که بین تگ‌ها قرار می‌گیرد».

مثال:

<ProtectedRoute>
    <Dashboard />
</ProtectedRoute>


اینجا children = <Dashboard />

این ویژگی خود React است.
ما فقط داریم آن را از props خارج می‌کنیم (به این می‌گویند destructuring).

اگر بخواهیم ساده‌تر بنویسیم:

این دو کاملاً یک چیز هستند:
({ children })


و این:

props.children

🔹 useSelector(...)

کد:

const token = useSelector((state) => state.auth.token);


این خط یکی از مهم‌ترین خط‌ها در Redux است.

قدم‌به‌قدم:

1. useSelector چیه؟

تابعی از react-redux که به ما اجازه می‌دهد از داخل Store، اطلاعاتی را بخوانیم.

مثل اینکه می‌گویی:

«من می‌خوام از داخل Redux مقدار token رو بردارم.»

2. (state) => state.auth.token

این یک تابع است.
useSelector به آن state (وضعیت کامل برنامه) را می‌دهد.

ساختار state:

state = {
  auth: {
    token: "...",
    user: { ... }
  }
}


پس وقتی می‌نویسی:

state.auth.token


یعنی:

برو داخل state
برو داخل بخش auth
مقدار token را بگیر

3. نتیجه

اگر کاربر لاگین کرده باشد → token مقدار دارد
اگر نکرده باشد → token = null

🔹 return token ? children : <Navigate to="/" />

این یک شرط کوتاه است (ternary operator).

ساختار:

condition ? A : B


یعنی:

اگر condition درست بود → A
اگر غلط بود → B

اینجا:

اگر token وجود داشته باشد → children را نمایش بده

اگر token نباشد → برو به "/"

<Navigate to="/" /> یعنی تغییر مسیر به صفحه‌ی لاگین.

🎯 نتیجه ProtectedRoute

این کامپوننت نمی‌گذارد کاربر بدون توکن وارد Dashboard شود.

🟩 بخش 2 — توضیح خط‌به‌خط App.jsx

کد:

import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "./Pages/LoginPage";
import RegisterPage from "./Pages/RegisterPage";
import Dashboard from "./Pages/Dashboard";
import { useSelector } from "react-redux";


توضیح:

React وارد می‌شود.

BrowserRouter → اجازه می‌دهد URL تغییر کند.

Routes → مجموعه مسیرها.

Route → تعریف یک مسیر.

Navigate → تغییر مسیر.

صفحه‌ها را وارد می‌کنیم.

useSelector برای ProtectedRoute استفاده می‌شود.

ساخت ProtectedRoute (مثل بالا توضیح دادم)
بدنه اصلی App
export default function App() {
  return (
    <>
      <BrowserRouter>

BrowserRouter

یعنی:
«من می‌خوام در این برنامه مسیریابی داشته باشم.»

div با کلاس‌های Tailwind
<div className="w-full min-h-screen bg-white flex items-center justify-center">


کل صفحه سفید

همه‌چیز وسط صفحه

Routes
<Routes>


اینجا همه مسیرهای برنامه تعریف می‌شوند.

مسیر 1 — صفحه ورود
<Route path="/" element={<LoginPage />} />


یعنی:

اگر URL برابر "/" باشد → LoginPage را نشان بده.

مسیر 2 — صفحه ثبت‌نام
<Route path="/register" element={<RegisterPage />} />


یعنی:

اگر URL = "/register" → صفحه Register.

مسیر 3 — داشبورد (محافظت شده)
<Route
  path="/dashboard"
  element={
    <ProtectedRoute>
      <Dashboard />
    </ProtectedRoute>
  }
/>


یعنی:

وقتی کاربر می‌رود به /dashboard:

ProtectedRoute اجرا می‌شود

اگر توکن وجود داشت → <Dashboard /> را نمایش می‌دهد

اگر نه → به "/" می‌بَرد





#############################################
چرخهٔ کامل: Login → ذخیره توکن → ارسال اتوماتیک توکن → گرفتن کاربر → ورود به Dashboard

می‌خوایم صفر تا صد مسیر زیر رو کامل بفهمیم:

کاربر صفحه لاگین را باز می‌کند

اطلاعاتش را وارد می‌کند

دکمه Login را می‌زند

کد تو درخواست POST به سرور می‌فرستد

سرور یک token می‌دهد

Redux این توکن را ذخیره می‌کند

axiosConfig توکن را به تمام درخواست‌ها اضافه می‌کند

ProtectedRoute اجازه ورود می‌دهد

Dashboard کاربر را نمایش می‌دهد

بریم مرحله‌به‌مرحله…

🟦 مرحله 1 — کاربر وارد صفحه Login می‌شود

وقتی وارد صفحه "/" می‌شود:

<Route path="/" element={<LoginPage />} />


یعنی صفحه LoginPage نمایش داده می‌شود.

کاربر این‌ها را وارد می‌کند:

username

password

و روی دکمه «Login» کلیک می‌کند.

🟦 مرحله 2 — داخل LoginPage دکمه login اجرا می‌شود

معمولاً توی LoginPage چنین چیزی داریم:

const res = await loginUser(userData);


که loginUser همین تابعی است که قبلاً دیدیم:

export const loginUser = async (userData) => {
  const res = await axios.post(`${API}/staff/auth/`, userData);
  return res.data;
};


کار این تابع:

درخواست POST می‌فرستد به /staff/auth/

userData شامل:

{ username: "ali", password: "1234" }


اگر اطلاعات درست باشد، سرور جواب می‌دهد مثلاً:

{
  "token": "abc123xyz789"
}

🟦 مرحله 3 — Redux توکن را ذخیره می‌کند

بعد از دریافت token، در LoginPage معمولاً این کار انجام می‌شود:

dispatch(loginSuccess(res.token));


و loginSuccess در authSlice تعریف شده:

loginSuccess: (state, action) => {
  state.token = action.payload;
  localStorage.setItem("token", action.payload);
}


یعنی:

✔️ 1. توکن وارد Redux می‌شود
✔️ 2. توکن داخل localStorage ذخیره می‌شود

(تا با reload از بین نرود)

الان state شبیه این است:

auth: {
  token: "abc123xyz789",
  user: null
}

🟦 مرحله 4 — axiosConfig وارد عمل می‌شود (خیلی مهم!)

این فایل باعث می‌شود:

قبل از هر درخواست axios، توکن اتوماتیک به درخواست اضافه شود.

کد مهمش:

axios.interceptors.request.use((config) => {
  const token = store.getState().auth.token;
  if (token) {
    config.headers.Authorization = `Token ${token}`;
  }
  return config;
});


پس هرجا در برنامه axios استفاده شود:

headers → اینطوری می‌شود:
Authorization: Token abc123xyz789


تو هیچ‌جا لازم نیست توکن را دستی ارسال کنی.
همه چیز اتوماتیک است.

🟦 مرحله 5 — کاربر می‌خواهد وارد "/dashboard" شود

وقتی مثلا بعد از لاگین navigate می‌شود به:

navigate("/dashboard");


Route:

<Route
  path="/dashboard"
  element={
    <ProtectedRoute>
      <Dashboard />
    </ProtectedRoute>
  }
/>


ProtectedRoute اجرا می‌شود.

🟥 مرحله 6 — ProtectedRoute می‌گوید: «توکن داری؟»

کد:

const token = useSelector((state) => state.auth.token);
return token ? children : <Navigate to="/" />;


اگر:

token وجود داشته باشد → Dashboard را نمایش بده

token وجود نداشته باشد → برو به "/"

بنابراین:

👌 چون ما توکن داریم → اجازه ورود داریم
🟦 مرحله 7 — صفحه Dashboard باز می‌شود

معمولاً در Dashboard:

const user = await getCurrentUser();


تابع getCurrentUser:

axios.get(`${API}/staff/current_user/`);


اینجا خیلی مهم است:

این درخواست خودش هیچ توکنی ارسال نمی‌کند

اما axiosConfig توکن را قبل از ارسال اضافه می‌کند

پس سرور این را می‌بیند:

GET /current_user/
Authorization: Token abc123xyz789


سرور کاربر را شناسایی می‌کند (مثلاً از روی توکن) و جواب می‌دهد:

{
  "id": 1,
  "username": "ali",
  "email": "ali@gmail.com",
  ...
}

🟦 مرحله 8 — Redux اطلاعات کاربر را ذخیره می‌کند

معمولاً Dashboard یا LoginPage از این استفاده می‌کند:

dispatch(setUser(userData));


و داخل authSlice:

setUser: (state, action) => {
  state.user = action.payload;
  localStorage.setItem("user", JSON.stringify(action.payload));
}


پس:

✔️ user وارد Redux می‌شود
✔️ در localStorage هم ذخیره می‌شود

state الان این شکلی است:

auth: {
  token: "abc123xyz789",
  user: {
    id: 1,
    username: "ali",
    ...
  }
}

🟩 مرحله 9 — اطلاعات کاربر در Dashboard نمایش داده می‌شود

مثلاً:

<h1>Welcome, {user.username}</h1>


یا هر داده‌ی دیگری که از سرور گرفته شده.

🟩 مرحله 10 — اگر صفحه را Refresh کنیم چه می‌شود؟

چون در authSlice این را داشتی:

token: localStorage.getItem("token"),
user: JSON.parse(localStorage.getItem("user")),


پس هنگام Refresh:

Redux دوباره token را از localStorage می‌گیرد

Redux دوباره user را از localStorage می‌گیرد

ProtectedRoute می‌بیند توکن موجود است

اجازه ورود می‌دهد

پس بعد از Refresh هم Dashboard نمی‌پرد!

🎯 جمع‌بندی چرخه کامل (به زبان خیلی ساده)
Login Page -->
   ارسال username/password -->
      سرور token می‌دهد -->
         Redux توکن را ذخیره می‌کند -->
            axiosConfig توکن را به تمام درخواست‌ها اضافه می‌کند -->
               ProtectedRoute می‌بیند token هست -->
                  Dashboard باز می‌شود -->
                     Dashboard اطلاعات user را می‌گیرد -->
                        Redux user را ذخیره می‌کند -->
                           اطلاعات روی صفحه نمایش داده می‌شود

*/