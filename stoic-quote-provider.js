document.addEventListener('db-ready', function () {
    const quoteText = document.getElementById('quote-text');
    const quoteAuthor = document.getElementById('quote-author');
    const quoteVirtues = document.getElementById('quote-virtues');
    const quoteTags = document.getElementById('quote-tags');
    const quoteApplication = document.getElementById('quote-application');
    const randomQuoteBtn = document.getElementById('random-quote-btn');
    const virtueFilter = document.getElementById('virtue-filter');
    const philosopherFilter = document.getElementById('philosopher-filter');
    const shareQuoteBtn = document.getElementById('share-quote-btn');
    const shareMenu = document.getElementById('share-menu');
    const copyQuoteBtn = document.getElementById('copy-quote-btn');
    const forwardQuoteBtn = document.getElementById('forward-quote-btn');

    let currentQuotes = [];
    let currentQuote = null;

    function getUniqueValues(key) {
        let query;
        if (key === 'philosophers') {
            query = `SELECT DISTINCT author FROM quotes ORDER BY author`;
        } else {
            query = `SELECT DISTINCT name FROM ${key} ORDER BY name`;
        }
        const results = window.db.exec(query);
        if (results.length > 0) {
            return results[0].values.map(row => row[0]);
        }
        return [];
    }

    function populateFilters() {
        const virtues = getUniqueValues('virtues');
        const philosophers = getUniqueValues('philosophers');

        virtues.forEach(virtue => {
            const option = document.createElement('option');
            option.value = virtue;
            option.textContent = virtue;
            virtueFilter.appendChild(option);
        });

        philosophers.forEach(philosopher => {
            const option = document.createElement('option');
            option.value = philosopher;
            option.textContent = philosopher;
            philosopherFilter.appendChild(option);
        });
    }

    function displayQuote(quote) {
        currentQuote = quote; // Store the current quote
        quoteText.textContent = `“${quote.quote}”`;
        quoteAuthor.textContent = `— ${quote.author}`;
        quoteApplication.textContent = quote.application;

        quoteVirtues.innerHTML = '';
        quote.virtues.forEach(virtue => {
            const span = document.createElement('span');
            span.textContent = virtue;
            quoteVirtues.appendChild(span);
        });

        quoteTags.innerHTML = '';
        quote.tags.forEach(tag => {
            const span = document.createElement('span');
            span.textContent = tag;
            quoteTags.appendChild(span);
        });
    }

    function getQuotesFromDB(query, params) {
        const results = window.db.exec(query, params);
        if (results.length > 0) {
            return results[0].values.map(row => {
                return {
                    id: row[0],
                    quote: row[1],
                    author: row[2],
                    application: row[3],
                    virtues: row[4] ? row[4].split(',') : [],
                    tags: row[5] ? row[5].split(',') : []
                };
            });
        }
        return [];
    }

    function getRandomQuote() {
        const randomIndex = Math.floor(Math.random() * currentQuotes.length);
        return currentQuotes[randomIndex];
    }

    function filterQuotes() {
        const selectedVirtue = virtueFilter.value;
        const selectedPhilosopher = philosopherFilter.value;

        let query = `
            SELECT
                Q.id,
                Q.quote,
                Q.author,
                Q.application,
                GROUP_CONCAT(DISTINCT V.name) AS virtues,
                GROUP_CONCAT(DISTINCT T.name) AS tags
            FROM quotes Q
            LEFT JOIN quote_virtues QV ON Q.id = QV.quote_id
            LEFT JOIN virtues V ON QV.virtue_id = V.id
            LEFT JOIN quote_tags QT ON Q.id = QT.quote_id
            LEFT JOIN tags T ON QT.tag_id = T.id
        `;

        const conditions = [];
        const params = {};

        if (selectedVirtue !== 'all') {
            conditions.push('Q.id IN (SELECT quote_id FROM quote_virtues WHERE virtue_id = (SELECT id FROM virtues WHERE name = :virtue))');
            params[':virtue'] = selectedVirtue;
        }

        if (selectedPhilosopher !== 'all') {
            conditions.push('Q.author = :author');
            params[':author'] = selectedPhilosopher;
        }

        if (conditions.length > 0) {
            query += ' WHERE ' + conditions.join(' AND ');
        }

        query += ' GROUP BY Q.id';

        currentQuotes = getQuotesFromDB(query, params);

        const newQuote = getRandomQuote();
        if (newQuote) {
            displayQuote(newQuote);
        } else {
            // Handle case with no matching quotes
            quoteText.textContent = "No quotes match the selected filters.";
            quoteAuthor.textContent = "";
            quoteApplication.textContent = "";
            quoteVirtues.innerHTML = "";
            quoteTags.innerHTML = "";
        }
    }

    randomQuoteBtn.addEventListener('click', () => {
        const query = `
            SELECT
                Q.id,
                Q.quote,
                Q.author,
                Q.application,
                GROUP_CONCAT(DISTINCT V.name) AS virtues,
                GROUP_CONCAT(DISTINCT T.name) AS tags
            FROM quotes Q
            LEFT JOIN quote_virtues QV ON Q.id = QV.quote_id
            LEFT JOIN virtues V ON QV.virtue_id = V.id
            LEFT JOIN quote_tags QT ON Q.id = QT.quote_id
            LEFT JOIN tags T ON QT.tag_id = T.id
            GROUP BY Q.id
            ORDER BY RANDOM() LIMIT 1
        `;
        const quote = getQuotesFromDB(query)[0];
        if (quote) {
            displayQuote(quote);
        }
    });
    virtueFilter.addEventListener('change', filterQuotes);
    philosopherFilter.addEventListener('change', filterQuotes);

    shareQuoteBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        const isHidden = shareMenu.style.display === 'none';
        if (isHidden) {
            const btnRect = shareQuoteBtn.getBoundingClientRect();
            const controlsRect = shareQuoteBtn.parentElement.getBoundingClientRect();
            shareMenu.style.left = `${btnRect.left - controlsRect.left}px`;
            shareMenu.style.display = 'block';
            shareQuoteBtn.setAttribute('aria-expanded', 'true');
        } else {
            shareMenu.style.display = 'none';
            shareQuoteBtn.setAttribute('aria-expanded', 'false');
        }
    });

    copyQuoteBtn.addEventListener('click', () => {
        if (!currentQuote) return;
        const textToCopy = `“${currentQuote.quote}” — ${currentQuote.author}`;
        navigator.clipboard.writeText(textToCopy).then(() => {
            copyQuoteBtn.textContent = 'Copied!';
            setTimeout(() => {
                copyQuoteBtn.textContent = 'Copy Quote';
                shareMenu.style.display = 'none';
                shareQuoteBtn.setAttribute('aria-expanded', 'false');
            }, 1000);
        }).catch(err => {
            console.error('Failed to copy text: ', err);
            // Optional: Provide user feedback on error
        });
    });

    forwardQuoteBtn.addEventListener('click', () => {
        if (navigator.share && currentQuote) {
            navigator.share({
                title: 'A Stoic Quote',
                text: `“${currentQuote.quote}” — ${currentQuote.author}`,
                url: window.location.href
            }).then(() => {
                shareMenu.style.display = 'none';
                shareQuoteBtn.setAttribute('aria-expanded', 'false');
            }).catch((error) => console.log('Error sharing:', error));
        }
    });

    // Hide the forward button if the Web Share API is not supported
    if (!navigator.share) {
        forwardQuoteBtn.style.display = 'none';
    }

    // Close the share menu if the user clicks outside of it
    window.addEventListener('click', (e) => {
        if (shareMenu.style.display === 'block' && !shareMenu.contains(e.target) && e.target !== shareQuoteBtn) {
            shareMenu.style.display = 'none';
            shareQuoteBtn.setAttribute('aria-expanded', 'false');
        }
    });

    // Initial setup
    function initializeApp() {
        const initialQuery = `
            SELECT
                Q.id,
                Q.quote,
                Q.author,
                Q.application,
                GROUP_CONCAT(DISTINCT V.name) AS virtues,
                GROUP_CONCAT(DISTINCT T.name) AS tags
            FROM quotes Q
            LEFT JOIN quote_virtues QV ON Q.id = QV.quote_id
            LEFT JOIN virtues V ON QV.virtue_id = V.id
            LEFT JOIN quote_tags QT ON Q.id = QT.quote_id
            LEFT JOIN tags T ON QT.tag_id = T.id
            GROUP BY Q.id
        `;
        currentQuotes = getQuotesFromDB(initialQuery);
        populateFilters();
        displayQuote(getRandomQuote());
    }

    initializeApp();

    // About panel logic
    const aboutBtn = document.getElementById('about-btn');
    const aboutPanel = document.getElementById('about-panel');
    const closeAboutBtn = document.querySelector('.close-about-btn');

    aboutBtn.addEventListener('click', () => {
        aboutPanel.style.display = 'block';
    });

    closeAboutBtn.addEventListener('click', () => {
        aboutPanel.style.display = 'none';
    });

    window.addEventListener('click', (event) => {
        if (event.target == aboutPanel) {
            aboutPanel.style.display = 'none';
        }
    });
});
