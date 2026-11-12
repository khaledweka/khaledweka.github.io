---
title: 'Laravel Multi-DB Relationship Gotcha: Why Eager Loads Hit the Wrong Database'
pageTitle: 'Laravel Multi-DB Relationship Gotcha: Why Eager Loads Hit the Wrong Database'
excerpt: 'A subtle Eloquent behavior in multi-database apps: related models can inherit the parent connection during eager loading. Includes one-line fix and test impact checklist.'
titleAr: 'مشكلة العلاقات في Laravel متعدد قواعد البيانات: لماذا يقرأ الـ Eager Load من قاعدة خاطئة'
excerptAr: 'سلوك دقيق في Eloquent داخل التطبيقات متعددة قواعد البيانات: النماذج المرتبطة قد ترث اتصال النموذج الأب أثناء الـ eager loading. يتضمن الحل في سطر واحد وقائمة بتأثيره على الاختبارات.'
date: 2026-08-05
lang: en
description: 'Laravel Eloquent multi-database relationship gotcha: why related models can inherit the parent connection and how to fix and test it safely.'
raw: true
---
