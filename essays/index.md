---
layout: default
title: Essays
---

{% assign essays = site.essays | sort: 'date' | reverse %}

{% if essays.size > 0 %}
{% for essay in essays %}
<article class="story">
    <div class="story-date">{{ essay.date | date: "%B, %Y" }}</div>
    <h2 class="story-title">{{ essay.title }}</h2>
    <p class="story-excerpt">{{ essay.excerpt }}</p>
    <p><a href="{{ essay.url | relative_url }}" class="read-more">Continue reading...</a></p>
</article>
{% endfor %}
{% else %}
<p>No essays found.</p>
{% endif %}
