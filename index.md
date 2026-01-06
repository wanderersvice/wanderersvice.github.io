---
layout: default
title: Home
---

{% assign stories = site.stories | sort: 'date' | reverse %}
{% assign essays = site.essays | sort: 'date' | reverse %}
{% assign bookclub = site.bookclub | sort: 'date' | reverse %}

{% if essays.size > 0 %}
## Essays

{% for essay in essays %}
<article class="story">
    <div class="story-date">{{ essay.date | date: "%B, %Y" }}</div>
    <h2 class="story-title">{{ essay.title }}</h2>
    <p class="story-excerpt">{{ essay.excerpt }}</p>
    <p><a href="{{ essay.url | relative_url }}" class="read-more">Continue reading...</a></p>
</article>
{% endfor %}
{% endif %}

{% if stories.size > 0 %}
## Stories

{% for story in stories %}
<article class="story">
    <div class="story-date">{{ story.date | date: "%B, %Y" }}</div>
    <h2 class="story-title">{{ story.title }}</h2>
    <p class="story-excerpt">{{ story.excerpt }}</p>
    <p><a href="{{ story.url | relative_url }}" class="read-more">Continue reading...</a></p>
</article>
{% endfor %}
{% endif %}

{% if bookclub.size > 0 %}
## Book Club

{% for book in bookclub %}
<article class="story">
    <div class="story-date">{{ book.date | date: "%B, %Y" }}</div>
    <h2 class="story-title">{{ book.title }}</h2>
    <p class="story-excerpt">{{ book.excerpt }}</p>
    <p><a href="{{ book.url | relative_url }}" class="read-more">Continue reading...</a></p>
</article>
{% endfor %}
{% endif %}
