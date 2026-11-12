---
title: 'إزاي تحسب الـ System Capacity في ثواني؟ (فن الـ Back-of-the-envelope Estimation) 🧮'
pageTitle: 'إزاي تحسب الـ System Capacity في ثواني؟ (Back-of-the-envelope)'
excerpt: 'ثوابت القوى، الـ Latency، الـ Availability، ومثال تويتر — تقدير سريع للسعة قبل ما ترسم الـ architecture في إنترفيو System Design.'
titleAr: 'إزاي تحسب الـ System Capacity في ثواني؟ (Back-of-the-envelope) 🧮'
cardTitle: 'إزاي تحسب الـ System Capacity في ثواني؟ (Back-of-the-envelope) 🧮'
image: '/assets/back-of-envelope-availability-nines.png'
imageAlt: ''
date: 2026-04-03
lang: ar
description: 'إزاي تحسب System Capacity في ثواني؟ فن الـ Back-of-the-envelope Estimation: ثوابت القوى، الـ Latency، الـ Availability، ومثال تويتر لإنترفيوهات System Design.'
---
<p>
  في إنترفيوهات الـ System Design بشركات زي Google أو Meta، غالباً هتتسأل سؤال زي: &quot;صمّم تويتر&quot;، وأول خطوة بتبين إنك مهندس شاطر هي إنك تعمل <strong>Back-of-the-envelope estimation</strong>.
</p>

<h2>يعني إيه؟</h2>
<p>
  هي حسابات سريعة (تقديرية) بتساعدك تقرر التصميم بتاعك هيمشي إزاي. محتاج Database واحدة؟ ولا محتاج Sharding؟ الـ Cache هيكفي؟
</p>

<h2>ثوابت لازم تكون في دماغك</h2>

<h3>١️⃣ قوة الرقم 2 (Powers of Two)</h3>
<p>
  لازم تبقى عارف التحويلات بسرعة. الـ 1GB مش مجرد رقم، هو 2<sup>30</sup> بايت. طلب مليون request فيه بايت واحد لكل request ≈ 1 MB. 1 PB (Petabyte) = 1000 TB.
</p>

<h3>٢️⃣ أرقام الـ Latency (اللي كل مبرمج لازم يعرفها)</h3>
<figure class="post-figure post-figure--lead">
  <img src="../assets/back-of-envelope-latency-numbers.png" alt="إنفوجرافيك: Latency Numbers Every Programmer Should Know — ذاكرة، قرص، شبكة" class="post-image post-image--infographic" width="1200" height="675" loading="eager" decoding="async">
  <figcaption class="post-figure-caption">
    <span dir="rtl" lang="ar">الذاكرة سريعة، القرص أبطأ بكثير، والشبكة (خصوصاً بين قارات) أبطأ — ركّز على تقليل الـ Disk I/O والـ seeks.</span>
  </figcaption>
</figure>
<ul>
  <li>الـ Memory مرجع سريع جداً (حوالي 100 ns).</li>
  <li>الـ Disk seek بطيء جداً مقارنة بيها (حوالي 10 ms).</li>
  <li>الخلاصة: حاول دايماً تقلّل الـ Disk I/O وتعتمد على الـ Caching والـ Sequential reads.</li>
</ul>

<h3>٣️⃣ قاعدة الـ Availability (الـ nines)</h3>
<figure class="post-figure">
  <img src="../assets/back-of-envelope-availability-nines.png" alt="إنفوجرافيك: High Availability و SLA — Measuring the Nines" class="post-image post-image--infographic" width="1200" height="675" loading="lazy" decoding="async">
  <figcaption class="post-figure-caption">
    <span dir="rtl" lang="ar">كل ما زادت الـ nines، قلّ الـ downtime المسموح — الـ SLA بيحدد الـ uptime المتوقع.</span>
  </figcaption>
</figure>
<p>
  لما حد يقولك الـ Availability &quot;أربع تسعات&quot; (99.99٪)، ده معناه إن السيستم مسموح له يقع حوالي <strong>52 دقيقة</strong> في السنة كلها (تقريباً).
</p>

<h2>💡 مثال عملي (تويتر)</h2>
<p>
  لو عندنا 300 مليون مستخدم، و 50٪ منهم نشطين يومياً (150M DAU)، وكل واحد كتب تويتين في اليوم:
</p>
<p>
  150M × 2 = <strong>300M</strong> تويتة يومياً.
</p>
<p>
  <strong>QPS (Queries Per Second):</strong> 300M ÷ 86,400 ثانية ≈ <strong>3,500</strong> تويتة في الثانية.
</p>
<p>
  <strong>Storage:</strong> لو 10٪ من التويتات فيها صور (حجم الصورة 1 MB): 30M صورة × 1 MB = <strong>30 TB</strong> يومياً! يعني في 5 سنين محتاج حوالي <strong>55 PB</strong>.
</p>

<h2>🚀 نصيحة للإنترفيو</h2>
<ul>
  <li><strong>قرب الأرقام (Round numbers):</strong> مش لازم تقول 86,400 ثانية في اليوم؛ ممكن تقول 100,000 لتسهيل الحساب. المهم المنطق.</li>
  <li><strong>وضّح افتراضاتك:</strong> قول &quot;أنا هفترض إن المستخدم بيفتح الأبلكيشن 3 مرات&quot;.</li>
  <li><strong>اكتب الوحدات:</strong> متقولش 5 وتسكت — قول 5 KB ولا 5 MB؟</li>
</ul>
<p>
  الهدف من الحسابات دي مش إنك تبقى آلة حاسبة؛ الهدف إنك تثبت إنك <strong>مهندس يعتمد على البيانات</strong> وعارف السيستم بتاعك هيشيل إيه.
</p>
<p class="post-tags" style="margin-top: 1.5rem; font-size: 0.9rem; color: var(--color-text-muted);">
  #SystemDesign #SoftwareEngineering #Backend #Scalability #TechInterviews #BigData
</p>
<p style="margin-top: 2rem;">
  <a href="index.html">&larr; العودة للمدونة</a>
</p>
