async function initializeMarked() {
    return new Promise((resolve, reject) => {
        const script = document.createElement('script');
        script.src = 'https://cdn.jsdelivr.net/npm/marked/marked.min.js';
        script.onload = () => {
            // Initialize marked with options
            marked.use({
                mangle: false,
                headerIds: false
            });
            resolve(marked);
        };
        script.onerror = reject;
        document.head.appendChild(script);
    });
}

const GITHUB_RAW_URL = 'https://raw.githubusercontent.com/wanderersvice/wanderersvice.github.io/github-pages';

async function loadManifest() {
    try {
        const response = await fetch(`${GITHUB_RAW_URL}/content/manifest.json`);
        if (!response.ok) {
            throw new Error('Failed to load content manifest');
        }
        return await response.json();
    } catch (error) {
        console.error('Error loading manifest:', error);
        return { stories: [], essays: [] };
    }
}

async function fetchContent(markedInstance) {
    try {
        const manifest = await loadManifest();
        console.log('Content manifest:', manifest);
        
        const stories = await fetchMarkdownFiles(manifest.stories, 'stories', markedInstance);
        const essays = await fetchMarkdownFiles(manifest.essays, 'essays', markedInstance);
        
        return { stories, essays };
    } catch (error) {
        console.error('Error fetching content:', error);
        return { stories: [], essays: [] };
    }
}

async function fetchMarkdownFiles(files, type, markedInstance) {
    try {
        // Fetch each markdown file
        const contents = await Promise.all(
            files.map(async file => {
                try {
                    const response = await fetch(`${GITHUB_RAW_URL}/content/${type}/${file}`);
                    if (!response.ok) {
                        console.error(`Error fetching ${file}:`, response.statusText);
                        return null;
                    }
                    const text = await response.text();
                    const content = parseMarkdown(text, markedInstance);
                    if (content) {
                        content.type = type;
                        content.path = file;
                    }
                    return content;
                } catch (error) {
                    console.error(`Error processing ${file}:`, error);
                    return null;
                }
            })
        );
        
        // Filter out any null results from errors and sort by date
        return contents
            .filter(content => content !== null)
            .sort((a, b) => new Date(b.date) - new Date(a.date));
    } catch (error) {
        console.error('Error fetching markdown files:', error);
        return [];
    }
}

function parseMarkdown(text, markedInstance) {
    try {
        // Split front matter and content
        const parts = text.trim().split('---');
        if (parts.length < 3) {
            console.error('Invalid markdown format - missing front matter');
            return null;
        }
        
        const frontMatter = parts[1];
        const content = parts.slice(2).join('---'); // Join remaining parts in case content contains ---
        
        // Parse front matter
        const metadata = {};
        frontMatter.split('\n').forEach(line => {
            const [key, ...values] = line.split(':');
            if (key && values.length) {
                let value = values.join(':').trim();
                // Handle quoted strings and arrays
                if (value.startsWith('"') && value.endsWith('"')) {
                    value = value.slice(1, -1);
                } else if (value.startsWith('[') && value.endsWith(']')) {
                    value = value.slice(1, -1).split(',').map(v => v.trim());
                }
                metadata[key.trim()] = value;
            }
        });
        
        // Parse markdown content
        const htmlContent = markedInstance.parse(content.trim());
        
        return {
            ...metadata,
            content: htmlContent
        };
    } catch (error) {
        console.error('Error parsing markdown:', error);
        return null;
    }
}

function createContentElement(item) {
    const article = document.createElement('article');
    article.className = 'story';
    
    const date = new Date(item.date);
    
    article.innerHTML = `
        <div class="story-date">${['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'][date.getMonth()]}, ${date.getFullYear()}</div>
        <h2 class="story-title">${item.title}</h2>
        <p class="story-excerpt">${item.excerpt}</p>
        <p><a href="#${item.type}/${item.path}" class="read-more" data-content='${JSON.stringify({title: item.title, content: item.content})}'>Continue reading...</a></p>
    `;
    
    // Add click handler
    const readMoreLink = article.querySelector('.read-more');
    readMoreLink.addEventListener('click', function(e) {
        e.preventDefault();
        const data = JSON.parse(this.dataset.content);
        showFullContent(data.title, data.content);
        // Update URL without reloading
        history.pushState({}, '', this.getAttribute('href'));
    });
    
    return article;
}

function showFullContent(title, content) {
    const main = document.querySelector('main');
    main.innerHTML = `
        <article class="story full">
            <div class="story-meta">
                <a href="#" onclick="window.location.hash = ''; return false;">← Back</a>
            </div>
            <h2 class="story-title">${title}</h2>
            <div class="story-content">
                ${content}
            </div>
        </article>
    `;
    window.scrollTo(0, 0);
}

// Initialize the page
document.addEventListener('DOMContentLoaded', async () => {
    try {
        const main = document.querySelector('main');
        main.innerHTML = '<div class="loading">Loading content...</div>';
        
        // Initialize marked first
        const markedInstance = await initializeMarked();
        
        // Then fetch and render content
        const { stories, essays } = await fetchContent(markedInstance);
        
        if (stories.length > 0 || essays.length > 0) {
            main.innerHTML = '';
            
            if (stories.length > 0) {
                const storiesSection = document.createElement('section');
                storiesSection.id = 'stories';
                storiesSection.innerHTML = '<h2 style="font-weight: normal; font-style: italic;">Stories</h2>';
                stories.forEach(story => {
                    storiesSection.appendChild(createContentElement(story));
                });
                main.appendChild(storiesSection);
            }
            
            if (essays.length > 0) {
                const essaysSection = document.createElement('section');
                essaysSection.id = 'essays';
                essaysSection.innerHTML = '<h2 style="font-weight: normal; font-style: italic;">Essays</h2>';
                essays.forEach(essay => {
                    essaysSection.appendChild(createContentElement(essay));
                });
                main.appendChild(essaysSection);
            }
        } else {
            main.innerHTML = '<div class="error">No content found.</div>';
        }
    } catch (error) {
        console.error('Error initializing page:', error);
        main.innerHTML = '<div class="error">Error loading content. Please try again later.</div>';
    }
});
