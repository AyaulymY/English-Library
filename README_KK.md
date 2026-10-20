# English Library — онлайн басқару панелі

Бұл жинақ қазіргі GitHub Pages сайтыңызды жоймай, оған мұғалімге арналған қорғалған мазмұн басқару панелін қосуға арналған.

Сайт: https://ayaulymy.github.io/English-Library/

## Қалай жұмыс істейді?

- GitHub Pages сайтты бұрынғыдай көрсетеді.
- Supabase онлайн дерекқорында жаңа ережелер, тапсырмалар және ойындар сақталады.
- Мұғалім `admin.html` бетіне email және пароль арқылы кіреді.
- Қосу / өңдеу / жою батырмалары Supabase дерекқорына өзгеріс жазады.
- Оқушылар сайттағы «Online materials» бөлімінен жарияланған материалдарды көреді.
- Әр материал қосқан сайын GitHub-та файлды қайта жүктеу қажет емес.
- Бірақ бастапқыда интеграция файлдарын сайтқа бір рет қосып, GitHub-қа жариялау керек.

> Маңызды: бұл дайын интеграция қаңқасы. Supabase жобасын жасап, өзіңіздің Project URL және anon/publishable key мәндерін енгізіп, төмендегі қадамдарды орындау қажет. Құпия `service_role` кілтін браузерге ешқашан салмаңыз.

## 1. Supabase жобасын ашу

1. https://supabase.com/ сайтына кіріп, аккаунт ашыңыз.
2. **New project** басып, `English Library` деп атаңыз.
3. Құпиясөз орнатып, жоба ашылғанша күтіңіз.
4. **SQL Editor → New query** бөліміне өтіңіз.
5. Осы жинақтағы `supabase-schema.sql` файлын толық көшіріп, SQL Editor-ге қойып, **Run** басыңыз.
6. SQL ішіндегі `YOUR_ADMIN_EMAIL@example.com` мәтінін өзіңіздің Supabase-қа кіруге қолданатын email-іңізге ауыстырыңыз.

## 2. Мұғалім аккаунтын жасау

1. Supabase → **Authentication → Users** бөліміне кіріңіз.
2. **Add user** таңдаңыз.
3. Өз email-іңіз бен күшті пароль орнатыңыз.
4. Ашық signup тіркеуін қоспаңыз. Мұғалім аккаунтын осы жерден ғана жасаңыз.

## 3. Supabase кілттерін енгізу

1. Supabase → **Project Settings → API** (немесе **Connect**) бөліміне кіріңіз.
2. Project URL және `anon` / `publishable` public key көшіріңіз.
3. `supabase-config.js` файлын ашыңыз.
4. `YOUR_SUPABASE_URL` және `YOUR_SUPABASE_ANON_KEY` мәндерін өз мәндеріңізбен ауыстырыңыз.

`anon` / publishable key браузерде қолдануға арналған. `service_role` немесе secret key қолданбаңыз.

## 4. Файлдарды GitHub репозиторийіне қосу

Қазіргі `index.html` файлын өшірмеңіз және орнына басқа сайт қоймаңыз.

GitHub-та `AyaulymY/English-Library` репозиторийін ашып, **Add file → Upload files** арқылы мына файлдарды жүктеңіз:

- `admin.html`
- `supabase-config.js`
- `supabase-public-loader.js`

Оларды `index.html` тұрған негізгі папкаға жүктеп, **Commit changes** басыңыз.

## 5. Қазіргі index.html бетіне бір реттік интеграция

`index.html` ішіндегі мына жолды табыңыз:

```html
<div id="app-content"></div>
```

Оның дәл астына мына элементті қосыңыз:

```html
<section id="online-materials" style="margin-top:24px">
  <h2>Online materials / Қосымша материалдар</h2>
  <p>Мұғалім қосқан ережелер, тапсырмалар және ойындар.</p>
  <div id="online-materials-list">Loading materials…</div>
</section>
```

Содан кейін `index.html` файлының соңында, `</body>` жабылу тегінің алдында мына скрипттерді қосыңыз:

```html
<script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>
<script src="./supabase-config.js"></script>
<script src="./supabase-public-loader.js"></script>
```

Файлды сақтап, GitHub-та commit жасаңыз. Бұл — бастапқы интеграция үшін бір реттік өзгеріс. Кейін мазмұнды `admin.html` арқылы қосуға болады.

## 6. Басқару панелін ашу

Сайт жарияланғаннан кейін мына мекенжайға өтіңіз:

https://ayaulymy.github.io/English-Library/admin.html

Email және пароль арқылы кіріңіз. Ереже, тапсырма немесе ойын қосып, **Save material** басыңыз.

## Қауіпсіздік

- `supabase-schema.sql` RLS (Row Level Security) қорғанысын қосады.
- Барлық келушілер тек жария материалдарды оқи алады.
- Жазу, өңдеу және жою тек SQL ішіндегі `YOUR_ADMIN_EMAIL@example.com` мәнімен сәйкес келетін аккаунтқа рұқсат етіледі.
- Supabase-тың `service_role` / secret key-ін `supabase-config.js` немесе кез келген HTML/JS файлына салмаңыз.
- SQL-дегі email-ді өзіңіздікіне ауыстырғаныңызды тексеріңіз.

## Қазіргі сайттағы ескі Content Editor туралы

Қазіргі `index.html` ішіндегі Content Editor материалдарды браузердің `localStorage` сақтау орнында сақтайды. Ол тек сол браузерде көрінуі мүмкін. Онлайн дерекқорға қосылған жаңа материалдарды барлық құрылғыдан көру үшін осы жинақтағы Supabase басқару панелін қолданыңыз. Ескі материалдар автоматты түрде дерекқорға көшірілмейді; оларды қажет болса қолмен қайта енгізу керек.

## Қате шықса

- `Invalid API key`: URL немесе public anon/publishable key қате.
- `permission denied` / RLS error: SQL-дегі admin email зөв эсэхийг, мөн аккаунт Authentication → Users ішінде бар екенін тексеріңіз.
- Сайтта материал шықпайды: `index.html` ішіне `online-materials` блоктары мен үш script тегі қосылғанын, файлдардың root папкада екенін тексеріңіз.
