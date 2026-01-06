---
layout: default
title: Book Club
---

{% assign bookclub = site.bookclub | sort: 'date' | reverse %}

{% if bookclub.size > 0 %}
{% for book in bookclub %}
<article class="story">
    <div class="story-date">{{ book.date | date: "%B, %Y" }}</div>
    <h2 class="story-title">{{ book.title }}</h2>
    <p class="story-excerpt">{{ book.excerpt }}</p>
    <p><a href="{{ book.url | relative_url }}" class="read-more">Continue reading...</a></p>
</article>
{% endfor %}
{% else %}
<p>No books found.</p>
{% endif %}
