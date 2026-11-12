---
title: 'RESTful API Design Principles'
excerpt: 'Best practices for building consistent, maintainable APIs. Nouns over verbs, status codes, versioning, and pagination.'
date: 2025-03-15
lang: en
description: 'RESTful API Design Principles - Khaled Alwakeel. Best practices for building consistent, maintainable APIs.'
---
<p>
  After years of building and consuming APIs, I've distilled a few principles that consistently lead to better, more maintainable systems. Here's what I keep in mind when designing RESTful endpoints.
</p>

<h2>Use Nouns, Not Verbs</h2>
<p>
  The URL should represent a resource, not an action. Use HTTP methods to express the action. Prefer <code>GET /users</code> over <code>GET /getUsers</code>, and <code>POST /orders</code> over <code>POST /createOrder</code>.
</p>

<h2>Consistent HTTP Status Codes</h2>
<p>
  Return meaningful status codes: 200 for success, 201 for creation, 204 for successful deletion with no body, 400 for client errors, 401/403 for auth issues, 404 for not found, 422 for validation errors, and 500 for server errors. Consistency helps clients handle responses correctly.
</p>

<h2>Version Your API</h2>
<p>
  Whether in the URL (<code>/v1/users</code>) or headers, versioning gives you room to evolve without breaking existing consumers. Plan for it from day one.
</p>

<h2>Pagination and Filtering</h2>
<p>
  For list endpoints, support pagination (e.g., <code>?page=1&per_page=20</code>) and filtering. Avoid returning unbounded lists—it's a performance and security risk.
</p>

<p>
  <a href="index.html">&larr; Back to Blog</a>
</p>
