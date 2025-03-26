---
layout: default
title: Stories
---

{% assign stories = site.stories | sort: 'date' | reverse %}

{% if stories.size > 0 %}
{% for story in stories %}
<article class="story">
    <div class="story-date">{{ story.date | date: "%B, %Y" }}</div>
    <h2 class="story-title">{{ story.title }}</h2>
    <p class="story-excerpt">{{ story.excerpt }}</p>
    <p><a href="{{ story.url | relative_url }}" class="read-more">Continue reading...</a></p>
</article>
{% endfor %}
{% else %}
<p>No stories found.</p>
{% endif %}
