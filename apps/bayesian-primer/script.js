document.addEventListener('DOMContentLoaded', () => {
    const appTitle = document.getElementById('app-title');
    const tableOfContents = document.getElementById('table-of-contents');
    const contentContainer = document.getElementById('content-container');

    let conceptsData = {};

    fetch('bayesian-concepts.json')
        .then(response => response.json())
        .then(data => {
            conceptsData = data;
            appTitle.textContent = conceptsData.title;
            buildTableOfContents();
            displayInitialContent();
            setupNavLinks();
        })
        .catch(error => {
            console.error('Error fetching Bayesian concepts:', error);
            contentContainer.textContent = 'Failed to load content. Please try again later.';
        });

    function buildTableOfContents() {
        const tocList = document.createElement('ul');
        conceptsData.sections.forEach(section => {
            const sectionItem = document.createElement('li');
            const sectionLink = document.createElement('a');
            sectionLink.textContent = section.title;
            sectionLink.href = `#${section.id}`;
            sectionItem.appendChild(sectionLink);

            if (section.subsections) {
                const subsectionList = document.createElement('ul');
                section.subsections.forEach(subsection => {
                    const subsectionItem = document.createElement('li');
                    const subsectionLink = document.createElement('a');
                    subsectionLink.textContent = subsection.title;
                    subsectionLink.href = `#${subsection.id}`;
                    subsectionItem.appendChild(subsectionLink);
                    subsectionList.appendChild(subsectionItem);
                });
                sectionItem.appendChild(subsectionList);
            }
            tocList.appendChild(sectionItem);
        });
        tableOfContents.appendChild(tocList);
    }

    function displayContent(id) {
        contentContainer.innerHTML = '';
        let contentFound = false;

        for (const section of conceptsData.sections) {
            if (section.id === id) {
                contentFound = true;
                const sectionTitle = document.createElement('h2');
                sectionTitle.textContent = section.title;
                contentContainer.appendChild(sectionTitle);

                if (section.subsections) {
                    section.subsections.forEach(subsection => {
                        const subTitle = document.createElement('h3');
                        subTitle.id = subsection.id;
                        subTitle.textContent = subsection.title;
                        const subContent = document.createElement('div');
                        subContent.innerHTML = subsection.content;
                        contentContainer.appendChild(subTitle);
                        contentContainer.appendChild(subContent);
                    });
                }
                break;
            } else if (section.subsections) {
                for (const subsection of section.subsections) {
                    if (subsection.id === id) {
                        contentFound = true;
                        const sectionTitle = document.createElement('h2');
                        sectionTitle.textContent = section.title;
                        contentContainer.appendChild(sectionTitle);
                        const subTitle = document.createElement('h3');
                        subTitle.id = subsection.id;
                        subTitle.textContent = subsection.title;
                        const subContent = document.createElement('div');
                        subContent.innerHTML = subsection.content;
                        contentContainer.appendChild(subTitle);
                        contentContainer.appendChild(subContent);
                        break;
                    }
                }
            }
            if(contentFound) break;
        }
    }

    function displayInitialContent() {
        if (conceptsData.sections && conceptsData.sections.length > 0) {
            displayContent(conceptsData.sections[0].id);
            updateActiveLink(conceptsData.sections[0].id);
        }
    }

    function setupNavLinks() {
        tableOfContents.addEventListener('click', e => {
            if (e.target.tagName === 'A') {
                e.preventDefault();
                const id = e.target.hash.substring(1);
                displayContent(id.split('-').slice(0, -1).join('-') || id);
                const targetElement = document.getElementById(id);
                if (targetElement) {
                    targetElement.scrollIntoView({ behavior: 'smooth' });
                }
                updateActiveLink(id);
            }
        });
    }

    function updateActiveLink(id) {
        const links = tableOfContents.querySelectorAll('a');
        links.forEach(link => {
            link.classList.remove('active');
            if (link.hash.substring(1) === id) {
                link.classList.add('active');
            }
        });
    }

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
