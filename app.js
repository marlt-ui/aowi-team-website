// AOWI Team Website Application
class AOWIApp {
    constructor() {
        this.data = this.loadData();
        this.currentView = 'grid';
        this.currentVideoCategory = 'all';
        this.currentAdminTab = 'team';
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.renderAll();
        this.updateLastUpdated();
        
        // Add scroll effect to navbar
        window.addEventListener('scroll', () => {
            const navbar = document.getElementById('navbar');
            if (window.scrollY > 50) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
        });
    }

    loadData() {
        const defaultData = {
            about: {
                mission: "Driving efficiency and innovation in accounting operations through technology and process optimization.",
                whatWeDo: "We streamline financial workflows, implement automation solutions, and create tools that empower Netflix's accounting teams.",
                impact: "From reducing manual processes to building innovative solutions, we're transforming how Netflix handles accounting operations."
            },
            settings: {
                mondayUrl: ""
            },
            team: [
                {
                    id: 1,
                    name: "Your Name",
                    role: "Team Lead",
                    image: "",
                    whitePagesUrl: ""
                }
            ],
            newsletters: [
                {
                    id: 1,
                    title: "Q4'25 Newsletter",
                    quarter: "Q4'25",
                    url: "https://example.com/newsletter-q4-25"
                },
                {
                    id: 2,
                    title: "Q2'25 Newsletter",
                    quarter: "Q2'25",
                    url: "https://example.com/newsletter-q2-25"
                },
                {
                    id: 3,
                    title: "Q1'25 Newsletter",
                    quarter: "Q1'25",
                    url: "https://example.com/newsletter-q1-25"
                }
            ],
            projects: [
                {
                    id: 1,
                    title: "Workflow Automation System",
                    description: "Building automated workflows to reduce manual data entry and improve accuracy.",
                    status: "in-progress",
                    progress: 65,
                    owner: "Team Member",
                    startDate: "2026-01-15",
                    targetEndDate: "2026-06-30"
                }
            ],
            completed: [
                {
                    id: 1,
                    title: "Invoice Processing Tool",
                    description: "Automated invoice processing system that reduced processing time by 70%.",
                    impact: "Saved 20+ hours per week across the accounting team.",
                    completedDate: "2025-12-15"
                }
            ],
            videos: [
                {
                    id: 1,
                    title: "Introduction to AOWI Tools",
                    description: "Overview of our team's tools and how to use them effectively.",
                    category: "Tutorial",
                    url: "https://example.com/video1",
                    duration: "5:30"
                }
            ],
            resources: [
                {
                    id: 1,
                    title: "Team Handbook",
                    description: "Complete guide to AOWI processes and best practices.",
                    type: "Google Doc",
                    url: "https://docs.google.com"
                }
            ]
        };

        const saved = localStorage.getItem('aowiData');
        return saved ? JSON.parse(saved) : defaultData;
    }

    saveData() {
        localStorage.setItem('aowiData', JSON.stringify(this.data));
        this.updateLastUpdated();
    }

    updateLastUpdated() {
        const now = new Date();
        const formatted = now.toLocaleDateString('en-US', { 
            year: 'numeric', 
            month: 'short', 
            day: 'numeric' 
        });
        document.getElementById('lastUpdated').textContent = formatted;
    }

    setupEventListeners() {
        // Mobile menu toggle
        const mobileToggle = document.getElementById('mobileToggle');
        const navMenu = document.getElementById('navMenu');
        mobileToggle?.addEventListener('click', () => {
            navMenu.classList.toggle('active');
        });

        // Close mobile menu on link click
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', () => {
                navMenu.classList.remove('active');
            });
        });

        // Search functionality
        document.getElementById('teamSearch')?.addEventListener('input', (e) => {
            this.filterTeam(e.target.value);
        });

        document.getElementById('projectSearch')?.addEventListener('input', (e) => {
            this.filterProjects(e.target.value);
        });

        document.getElementById('resourceSearch')?.addEventListener('input', (e) => {
            this.filterResources(e.target.value);
        });

        // Newsletter dropdown
        document.getElementById('newsletterSelect')?.addEventListener('change', (e) => {
            const openBtn = document.getElementById('openNewsletterBtn');
            openBtn.disabled = e.target.value === '';
        });

        // Project filter
        document.getElementById('projectFilter')?.addEventListener('change', (e) => {
            this.filterProjectsByStatus(e.target.value);
        });
    }

    renderAll() {
        this.renderAbout();
        this.renderTeam();
        this.renderProjects();
        this.renderCompleted();
        this.renderVideos();
        this.renderNewsletters();
        this.renderResources();
        this.renderStats();
        this.updateHeroStats();
        this.updateMondayLink();
    }

    updateMondayLink() {
        const mondayLink = document.getElementById('mondayLink');
        if (this.data.settings?.mondayUrl) {
            mondayLink.href = this.data.settings.mondayUrl;
            mondayLink.style.display = 'flex';
        } else {
            mondayLink.style.display = 'none';
        }
    }

    // About Section
    renderAbout() {
        document.getElementById('missionText').textContent = this.data.about.mission;
        document.getElementById('whatWeDoText').textContent = this.data.about.whatWeDo;
        document.getElementById('impactText').textContent = this.data.about.impact;
    }

    // Team Section
    renderTeam(filter = '') {
        const teamGrid = document.getElementById('teamGrid');
        let team = this.data.team;

        if (filter) {
            team = team.filter(member => 
                member.name.toLowerCase().includes(filter.toLowerCase()) ||
                member.role.toLowerCase().includes(filter.toLowerCase())
            );
        }

        if (team.length === 0) {
            teamGrid.innerHTML = `
                <div class="empty-state">
                    <div class="empty-icon">👥</div>
                    <p>No team members found.</p>
                </div>
            `;
            return;
        }

        teamGrid.innerHTML = team.map(member => {
            const initials = member.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
            const isClickable = member.whitePagesUrl && member.whitePagesUrl.trim() !== '';
            const cardClass = `team-card fade-in${isClickable ? ' team-card-clickable' : ''}`;
            const onClick = isClickable ? `onclick="window.open('${member.whitePagesUrl}', '_blank')"` : '';
            
            return `
                <div class="${cardClass}" ${onClick} ${isClickable ? 'style="cursor: pointer;"' : ''}>
                    <div class="team-avatar">
                        ${member.image 
                            ? `<img src="${member.image}" alt="${member.name}">` 
                            : `<div class="team-avatar-placeholder">${initials}</div>`
                        }
                    </div>
                    <div class="team-name">${member.name}</div>
                    <div class="team-role">${member.role}</div>
                    ${isClickable ? '<div class="team-link-indicator">View Profile →</div>' : ''}
                </div>
            `;
        }).join('');
    }

    filterTeam(query) {
        this.renderTeam(query);
    }

    // Projects Section
    renderProjects(statusFilter = 'all', searchQuery = '') {
        const projectsGrid = document.getElementById('projectsGrid');
        let projects = this.data.projects;

        if (statusFilter !== 'all') {
            projects = projects.filter(p => p.status === statusFilter);
        }

        if (searchQuery) {
            projects = projects.filter(p => 
                p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                p.description.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }

        if (projects.length === 0) {
            projectsGrid.innerHTML = `
                <div class="empty-state">
                    <div class="empty-icon">📋</div>
                    <p>No projects found.</p>
                </div>
            `;
            return;
        }

        projectsGrid.innerHTML = projects.map(project => {
            const statusClass = `status-${project.status}`;
            const statusText = project.status.split('-').map(word => 
                word.charAt(0).toUpperCase() + word.slice(1)
            ).join(' ');

            return `
                <div class="project-card fade-in">
                    <div class="project-header">
                        <div>
                            <div class="project-title">${project.title}</div>
                        </div>
                        <span class="project-status ${statusClass}">${statusText}</span>
                    </div>
                    <div class="project-description">${project.description}</div>
                    <div class="project-meta">
                        <span>👤 ${project.owner}</span>
                        <span>📅 Start: ${new Date(project.startDate).toLocaleDateString()}</span>
                        ${project.targetEndDate ? `<span>🎯 Target: ${new Date(project.targetEndDate).toLocaleDateString()}</span>` : ''}
                    </div>
                    ${project.progress !== undefined ? `
                        <div class="project-progress">
                            <div class="progress-label">
                                <span>Progress</span>
                                <span>${project.progress}%</span>
                            </div>
                            <div class="progress-bar">
                                <div class="progress-fill" style="width: ${project.progress}%"></div>
                            </div>
                        </div>
                    ` : ''}
                </div>
            `;
        }).join('');
    }

    filterProjects(query) {
        const statusFilter = document.getElementById('projectFilter').value;
        this.renderProjects(statusFilter, query);
    }

    filterProjectsByStatus(status) {
        const searchQuery = document.getElementById('projectSearch').value;
        this.renderProjects(status, searchQuery);
    }

    // Completed Projects Section
    renderCompleted() {
        const container = document.getElementById('completedProjects');
        container.className = `completed-container ${this.currentView}-view`;

        if (this.data.completed.length === 0) {
            container.innerHTML = `
                <div class="empty-state">
                    <div class="empty-icon">✅</div>
                    <p>No completed projects yet.</p>
                </div>
            `;
            return;
        }

        if (this.currentView === 'grid') {
            container.innerHTML = this.data.completed.map(project => `
                <div class="completed-card fade-in">
                    <span class="completed-date">${new Date(project.completedDate).toLocaleDateString()}</span>
                    <h3 class="completed-title">${project.title}</h3>
                    <p>${project.description}</p>
                    <div class="completed-impact">
                        <strong>Impact:</strong> ${project.impact}
                    </div>
                </div>
            `).join('');
        } else {
            container.innerHTML = this.data.completed
                .sort((a, b) => new Date(b.completedDate) - new Date(a.completedDate))
                .map(project => `
                    <div class="timeline-item fade-in">
                        <div class="timeline-dot"></div>
                        <div class="completed-card">
                            <span class="completed-date">${new Date(project.completedDate).toLocaleDateString()}</span>
                            <h3 class="completed-title">${project.title}</h3>
                            <p>${project.description}</p>
                            <div class="completed-impact">
                                <strong>Impact:</strong> ${project.impact}
                            </div>
                        </div>
                    </div>
                `).join('');
        }
    }

    switchView(view) {
        this.currentView = view;
        
        // Update button states
        document.querySelectorAll('.view-btn').forEach(btn => {
            btn.classList.remove('active');
            if (btn.dataset.view === view) {
                btn.classList.add('active');
            }
        });
        
        this.renderCompleted();
    }

    // Videos Section
    renderVideos(categoryFilter = 'all') {
        const videosGrid = document.getElementById('videosGrid');
        let videos = this.data.videos;

        if (categoryFilter !== 'all') {
            videos = videos.filter(v => v.category === categoryFilter);
        }

        if (videos.length === 0) {
            videosGrid.innerHTML = `
                <div class="empty-state">
                    <div class="empty-icon">🎬</div>
                    <p>No videos found.</p>
                </div>
            `;
            return;
        }

        videosGrid.innerHTML = videos.map(video => `
            <div class="video-card fade-in" onclick="window.open('${video.url}', '_blank')">
                <div class="video-thumbnail">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <polygon points="5 3 19 12 5 21 5 3"></polygon>
                    </svg>
                    <div class="play-icon">▶</div>
                </div>
                <div class="video-info">
                    <div class="video-title">${video.title}</div>
                    <div class="video-description">${video.description}</div>
                    <div class="video-meta">
                        <span>${video.category}</span>
                        <span>${video.duration}</span>
                    </div>
                </div>
            </div>
        `).join('');

        this.renderVideoCategories();
    }

    renderVideoCategories() {
        const categories = ['all', ...new Set(this.data.videos.map(v => v.category))];
        const container = document.getElementById('videoCategories');
        
        container.innerHTML = categories.map(cat => `
            <button class="category-btn ${cat === this.currentVideoCategory ? 'active' : ''}" 
                    onclick="app.filterVideosByCategory('${cat}')">
                ${cat === 'all' ? 'All Videos' : cat}
            </button>
        `).join('');
    }

    filterVideosByCategory(category) {
        this.currentVideoCategory = category;
        this.renderVideos(category);
    }

    // Newsletters Section
    renderNewsletters() {
        const newsletterSelect = document.getElementById('newsletterSelect');
        const newsletters = this.data.newsletters || [];

        if (newsletters.length === 0) {
            newsletterSelect.innerHTML = '<option value="">No newsletters available</option>';
            document.getElementById('openNewsletterBtn').disabled = true;
            return;
        }

        // Sort by quarter (newest first) - Q4 > Q3 > Q2 > Q1, then by year
        const sortedNewsletters = newsletters.sort((a, b) => {
            const extractQuarterYear = (quarter) => {
                const match = quarter.match(/Q(\d)['']?(\d{2})/);
                if (!match) return { q: 0, y: 0 };
                return { q: parseInt(match[1]), y: parseInt(match[2]) };
            };
            
            const aInfo = extractQuarterYear(a.quarter);
            const bInfo = extractQuarterYear(b.quarter);
            
            // Sort by year first (descending), then by quarter (descending)
            if (bInfo.y !== aInfo.y) return bInfo.y - aInfo.y;
            return bInfo.q - aInfo.q;
        });

        // Populate dropdown
        newsletterSelect.innerHTML = '<option value="">-- Choose a newsletter --</option>' + 
            sortedNewsletters.map(newsletter => 
                `<option value="${newsletter.id}" data-url="${newsletter.url}">${newsletter.title}</option>`
            ).join('');
    }

    openSelectedNewsletter() {
        const select = document.getElementById('newsletterSelect');
        const selectedOption = select.options[select.selectedIndex];
        const url = selectedOption.getAttribute('data-url');
        const openBtn = document.getElementById('openNewsletterBtn');
        
        if (url && url !== '') {
            window.open(url, '_blank');
        } else {
            openBtn.disabled = true;
        }
    }

    // Resources Section
    renderResources(filter = '') {
        const resourcesGrid = document.getElementById('resourcesGrid');
        let resources = this.data.resources;

        if (filter) {
            resources = resources.filter(r => 
                r.title.toLowerCase().includes(filter.toLowerCase()) ||
                r.description.toLowerCase().includes(filter.toLowerCase())
            );
        }

        if (resources.length === 0) {
            resourcesGrid.innerHTML = `
                <div class="empty-state">
                    <div class="empty-icon">📚</div>
                    <p>No resources found.</p>
                </div>
            `;
            return;
        }

        resourcesGrid.innerHTML = resources.map(resource => {
            const iconSvg = this.getResourceIcon(resource.type);
            return `
                <a href="${resource.url}" target="_blank" class="resource-card fade-in">
                    ${iconSvg}
                    <div class="resource-content">
                        <div class="resource-title">${resource.title}</div>
                        <div class="resource-description">${resource.description}</div>
                        <span class="resource-type">${resource.type}</span>
                    </div>
                </a>
            `;
        }).join('');
    }

    getResourceIcon(type) {
        const icons = {
            'Google Doc': '<svg class="resource-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>',
            'Google Sheet': '<svg class="resource-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="8" y1="13" x2="16" y2="13"></line><line x1="8" y1="17" x2="16" y2="17"></line><line x1="12" y1="10" x2="12" y2="20"></line></svg>',
            'Google Slides': '<svg class="resource-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect><line x1="8" y1="21" x2="16" y2="21"></line><line x1="12" y1="17" x2="12" y2="21"></line></svg>',
            'default': '<svg class="resource-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"></path><polyline points="13 2 13 9 20 9"></polyline></svg>'
        };
        return icons[type] || icons['default'];
    }

    filterResources(query) {
        this.renderResources(query);
    }

    // Stats
    renderStats() {
        document.getElementById('totalProjects').textContent = 
            this.data.projects.length + this.data.completed.length;
        document.getElementById('completedProjects').textContent = 
            this.data.completed.length;
        document.getElementById('totalVideos').textContent = 
            this.data.videos.length;
        document.getElementById('totalResources').textContent = 
            this.data.resources.length;
    }

    updateHeroStats() {
        document.getElementById('heroProjectCount').textContent = this.data.projects.length;
        document.getElementById('heroCompletedCount').textContent = this.data.completed.length;
        document.getElementById('heroTeamCount').textContent = this.data.team.length;
    }

    // Navigation
    scrollToSection(sectionId) {
        document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth' });
    }

    // Admin Panel
    toggleAdmin() {
        const panel = document.getElementById('adminPanel');
        panel.classList.toggle('active');
        if (panel.classList.contains('active')) {
            this.renderAdminTab(this.currentAdminTab);
        }
    }

    switchAdminTab(tab) {
        this.currentAdminTab = tab;
        document.querySelectorAll('.admin-tab').forEach(btn => {
            btn.classList.remove('active');
        });
        event.target.classList.add('active');
        this.renderAdminTab(tab);
    }

    renderAdminTab(tab) {
        const container = document.getElementById('adminFormContainer');
        
        switch(tab) {
            case 'team':
                this.renderTeamAdmin(container);
                break;
            case 'projects':
                this.renderProjectsAdmin(container);
                break;
            case 'completed':
                this.renderCompletedAdmin(container);
                break;
            case 'videos':
                this.renderVideosAdmin(container);
                break;
            case 'newsletters':
                this.renderNewslettersAdmin(container);
                break;
            case 'resources':
                this.renderResourcesAdmin(container);
                break;
            case 'about':
                this.renderAboutAdmin(container);
                break;
            case 'settings':
                this.renderSettingsAdmin(container);
                break;
        }
    }

    renderTeamAdmin(container) {
        const initials = (name) => name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
        
        container.innerHTML = `
            <h3>Manage Team Members</h3>
            <div class="item-list">
                ${this.data.team.map(member => `
                    <div class="list-item">
                        <div style="display: flex; align-items: center; gap: 1rem;">
                            <div style="width: 40px; height: 40px; border-radius: 50%; overflow: hidden; background: linear-gradient(135deg, var(--netflix-red), #B20710); display: flex; align-items: center; justify-content: center; color: white; font-weight: 700; font-size: 0.9rem;">
                                ${member.image ? `<img src="${member.image}" style="width: 100%; height: 100%; object-fit: cover;">` : initials(member.name)}
                            </div>
                            <div>
                                <div class="list-item-title">${member.name}</div>
                                <div style="font-size: 0.9rem; color: var(--text-secondary);">${member.role}</div>
                                ${member.whitePagesUrl ? '<div style="font-size: 0.85rem; color: var(--netflix-red);">✓ White Pages linked</div>' : ''}
                            </div>
                        </div>
                        <div class="list-item-actions">
                            <button class="btn-icon" onclick="app.editTeamMember(${member.id})" title="Edit">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                                    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                                </svg>
                            </button>
                            <button class="btn-icon" onclick="app.deleteTeamMember(${member.id})" title="Delete">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                    <polyline points="3 6 5 6 21 6"></polyline>
                                    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                                </svg>
                            </button>
                        </div>
                    </div>
                `).join('')}
            </div>
            
            <h3 id="teamFormTitle">Add New Team Member</h3>
            <form id="teamForm" onsubmit="app.saveTeamMember(event)">
                <input type="hidden" name="memberId" id="memberId">
                <div class="image-upload-container">
                    <div class="image-preview" id="imagePreview">
                        <div class="image-preview-placeholder">
                            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                                <circle cx="12" cy="7" r="4"></circle>
                            </svg>
                        </div>
                    </div>
                    <div class="file-input-wrapper">
                        <input type="file" id="teamImageInput" accept="image/*" onchange="app.handleImagePreview(event, 'imagePreview')">
                        <label for="teamImageInput" class="file-input-label">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="display: inline-block; vertical-align: middle; margin-right: 0.5rem;">
                                <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                                <circle cx="8.5" cy="8.5" r="1.5"></circle>
                                <polyline points="21 15 16 10 5 21"></polyline>
                            </svg>
                            Upload Photo (Optional)
                        </label>
                    </div>
                </div>
                <div class="form-group">
                    <label>Name</label>
                    <input type="text" name="name" id="teamName" class="form-input" required>
                </div>
                <div class="form-group">
                    <label>Role</label>
                    <input type="text" name="role" id="teamRole" class="form-input" required>
                </div>
                <div class="form-group">
                    <label>White Pages URL (Optional)</label>
                    <input type="url" name="whitePagesUrl" id="teamWhitePagesUrl" class="form-input" placeholder="https://whitepages.netflix.com/...">
                    <small style="color: var(--text-secondary); display: block; margin-top: 0.5rem;">
                        Add Netflix White Pages profile URL to make this team member's card clickable
                    </small>
                </div>
                <input type="hidden" name="image" id="teamImageData">
                <div class="form-actions">
                    <button type="submit" class="btn-primary" id="teamSubmitBtn">Add Team Member</button>
                    <button type="button" class="btn-secondary" id="teamCancelBtn" onclick="app.cancelEditTeamMember()" style="display: none;">Cancel</button>
                </div>
            </form>
        `;
    }

    handleImagePreview(event, previewId) {
        const file = event.target.files[0];
        const preview = document.getElementById(previewId);
        
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                preview.innerHTML = `<img src="${e.target.result}" alt="Preview">`;
                document.getElementById('teamImageData').value = e.target.result;
            };
            reader.readAsDataURL(file);
        }
    }

    saveTeamMember(event) {
        event.preventDefault();
        const form = event.target;
        const formData = new FormData(form);
        const memberId = formData.get('memberId');
        
        if (memberId) {
            // Edit existing member
            const memberIndex = this.data.team.findIndex(m => m.id == memberId);
            if (memberIndex !== -1) {
                this.data.team[memberIndex] = {
                    id: parseInt(memberId),
                    name: formData.get('name'),
                    role: formData.get('role'),
                    image: formData.get('image') || this.data.team[memberIndex].image,
                    whitePagesUrl: formData.get('whitePagesUrl') || ''
                };
                this.showNotification('Team member updated successfully!');
            }
        } else {
            // Add new member
            const newMember = {
                id: Date.now(),
                name: formData.get('name'),
                role: formData.get('role'),
                image: formData.get('image') || '',
                whitePagesUrl: formData.get('whitePagesUrl') || ''
            };
            this.data.team.push(newMember);
            this.showNotification('Team member added successfully!');
        }
        
        this.saveData();
        this.renderAll();
        this.renderAdminTab('team');
    }

    editTeamMember(id) {
        const member = this.data.team.find(m => m.id === id);
        if (!member) return;
        
        // Update form title
        document.getElementById('teamFormTitle').textContent = 'Edit Team Member';
        
        // Populate form
        document.getElementById('memberId').value = member.id;
        document.getElementById('teamName').value = member.name;
        document.getElementById('teamRole').value = member.role;
        document.getElementById('teamWhitePagesUrl').value = member.whitePagesUrl || '';
        document.getElementById('teamImageData').value = member.image || '';
        
        // Show existing image if available
        const imagePreview = document.getElementById('imagePreview');
        if (member.image) {
            imagePreview.innerHTML = `<img src="${member.image}" alt="Preview">`;
        }
        
        // Update button text and show cancel button
        document.getElementById('teamSubmitBtn').textContent = 'Update Team Member';
        document.getElementById('teamCancelBtn').style.display = 'inline-block';
        
        // Scroll to form
        document.getElementById('teamForm').scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }

    cancelEditTeamMember() {
        // Reset form
        document.getElementById('teamForm').reset();
        document.getElementById('memberId').value = '';
        document.getElementById('teamImageData').value = '';
        
        // Reset image preview
        const imagePreview = document.getElementById('imagePreview');
        imagePreview.innerHTML = `
            <div class="image-preview-placeholder">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                    <circle cx="12" cy="7" r="4"></circle>
                </svg>
            </div>
        `;
        
        // Reset form title and button
        document.getElementById('teamFormTitle').textContent = 'Add New Team Member';
        document.getElementById('teamSubmitBtn').textContent = 'Add Team Member';
        document.getElementById('teamCancelBtn').style.display = 'none';
    }

    deleteTeamMember(id) {
        if (!confirm('Are you sure you want to delete this team member?')) return;
        this.data.team = this.data.team.filter(m => m.id !== id);
        this.saveData();
        this.renderAll();
        this.renderAdminTab('team');
        this.showNotification('Team member deleted');
    }

    renderProjectsAdmin(container) {
        container.innerHTML = `
            <h3>Manage Projects</h3>
            <div class="item-list">
                ${this.data.projects.map(project => `
                    <div class="list-item">
                        <div>
                            <div class="list-item-title">${project.title}</div>
                            <div style="font-size: 0.9rem; color: var(--text-secondary);">${project.status}</div>
                        </div>
                        <div class="list-item-actions">
                            <button class="btn-icon" onclick="app.deleteProject(${project.id})">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                    <polyline points="3 6 5 6 21 6"></polyline>
                                    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                                </svg>
                            </button>
                        </div>
                    </div>
                `).join('')}
            </div>
            
            <h3>Add New Project</h3>
            <form id="projectForm" onsubmit="app.addProject(event)">
                <div class="form-group">
                    <label>Project Title</label>
                    <input type="text" name="title" class="form-input" required>
                </div>
                <div class="form-group">
                    <label>Description</label>
                    <textarea name="description" class="form-textarea" required></textarea>
                </div>
                <div class="form-group">
                    <label>Status</label>
                    <select name="status" class="form-select" required>
                        <option value="planning">Planning</option>
                        <option value="in-progress">In Progress</option>
                        <option value="on-hold">On Hold</option>
                        <option value="completed">Completed</option>
                    </select>
                </div>
                <div class="form-group">
                    <label>Progress (%)</label>
                    <input type="number" name="progress" class="form-input" min="0" max="100" value="0">
                </div>
                <div class="form-group">
                    <label>Owner</label>
                    <input type="text" name="owner" class="form-input" required>
                </div>
                <div class="form-group">
                    <label>Start Date</label>
                    <input type="date" name="startDate" class="form-input" required>
                </div>
                <div class="form-group">
                    <label>Target End Date</label>
                    <input type="date" name="targetEndDate" class="form-input" required>
                </div>
                <div class="form-group" id="impactField" style="display: none;">
                    <label>Impact (for completed projects)</label>
                    <textarea name="impact" class="form-textarea" placeholder="What impact did this project have?"></textarea>
                </div>
                <div class="form-actions">
                    <button type="submit" class="btn-primary">Add Project</button>
                </div>
            </form>
        `;
        
        // Add event listener to show/hide impact field based on status
        setTimeout(() => {
            const statusSelect = document.querySelector('#projectForm select[name="status"]');
            const impactField = document.getElementById('impactField');
            
            statusSelect?.addEventListener('change', (e) => {
                if (e.target.value === 'completed') {
                    impactField.style.display = 'block';
                    impactField.querySelector('textarea').required = true;
                } else {
                    impactField.style.display = 'none';
                    impactField.querySelector('textarea').required = false;
                }
            });
        }, 0);
    }

    addProject(event) {
        event.preventDefault();
        const form = event.target;
        const formData = new FormData(form);
        
        const status = formData.get('status');
        const newProject = {
            id: Date.now(),
            title: formData.get('title'),
            description: formData.get('description'),
            status: status,
            progress: parseInt(formData.get('progress')),
            owner: formData.get('owner'),
            startDate: formData.get('startDate'),
            targetEndDate: formData.get('targetEndDate')
        };
        
        // If status is completed, also add to completed projects
        if (status === 'completed') {
            const completedProject = {
                id: Date.now() + 1,
                title: newProject.title,
                description: newProject.description,
                impact: formData.get('impact') || 'Project successfully completed.',
                completedDate: new Date().toISOString().split('T')[0]
            };
            this.data.completed.push(completedProject);
        }
        
        this.data.projects.push(newProject);
        this.saveData();
        this.renderAll();
        this.renderAdminTab('projects');
        this.showNotification('Project added successfully!');
    }

    deleteProject(id) {
        if (!confirm('Are you sure you want to delete this project?')) return;
        this.data.projects = this.data.projects.filter(p => p.id !== id);
        this.saveData();
        this.renderAll();
        this.renderAdminTab('projects');
        this.showNotification('Project deleted');
    }

    renderCompletedAdmin(container) {
        container.innerHTML = `
            <h3>Manage Completed Projects</h3>
            <div class="item-list">
                ${this.data.completed.map(project => `
                    <div class="list-item">
                        <div>
                            <div class="list-item-title">${project.title}</div>
                            <div style="font-size: 0.9rem; color: var(--text-secondary);">${new Date(project.completedDate).toLocaleDateString()}</div>
                        </div>
                        <div class="list-item-actions">
                            <button class="btn-icon" onclick="app.deleteCompleted(${project.id})">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                    <polyline points="3 6 5 6 21 6"></polyline>
                                    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                                </svg>
                            </button>
                        </div>
                    </div>
                `).join('')}
            </div>
            
            <h3>Add Completed Project</h3>
            <form id="completedForm" onsubmit="app.addCompleted(event)">
                <div class="form-group">
                    <label>Project Title</label>
                    <input type="text" name="title" class="form-input" required>
                </div>
                <div class="form-group">
                    <label>Description</label>
                    <textarea name="description" class="form-textarea" required></textarea>
                </div>
                <div class="form-group">
                    <label>Impact</label>
                    <textarea name="impact" class="form-textarea" placeholder="What impact did this project have?" required></textarea>
                </div>
                <div class="form-group">
                    <label>Completed Date</label>
                    <input type="date" name="completedDate" class="form-input" required>
                </div>
                <div class="form-actions">
                    <button type="submit" class="btn-primary">Add Completed Project</button>
                </div>
            </form>
        `;
    }

    addCompleted(event) {
        event.preventDefault();
        const form = event.target;
        const formData = new FormData(form);
        
        const newCompleted = {
            id: Date.now(),
            title: formData.get('title'),
            description: formData.get('description'),
            impact: formData.get('impact'),
            completedDate: formData.get('completedDate')
        };
        
        this.data.completed.push(newCompleted);
        this.saveData();
        this.renderAll();
        this.renderAdminTab('completed');
        this.showNotification('Completed project added successfully!');
    }

    deleteCompleted(id) {
        if (!confirm('Are you sure you want to delete this completed project?')) return;
        this.data.completed = this.data.completed.filter(p => p.id !== id);
        this.saveData();
        this.renderAll();
        this.renderAdminTab('completed');
        this.showNotification('Completed project deleted');
    }

    renderVideosAdmin(container) {
        container.innerHTML = `
            <h3>Manage Videos</h3>
            <div class="item-list">
                ${this.data.videos.map(video => `
                    <div class="list-item">
                        <div>
                            <div class="list-item-title">${video.title}</div>
                            <div style="font-size: 0.9rem; color: var(--text-secondary);">${video.category} • ${video.duration}</div>
                        </div>
                        <div class="list-item-actions">
                            <button class="btn-icon" onclick="app.deleteVideo(${video.id})">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                    <polyline points="3 6 5 6 21 6"></polyline>
                                    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                                </svg>
                            </button>
                        </div>
                    </div>
                `).join('')}
            </div>
            
            <h3>Add New Video</h3>
            <form id="videoForm" onsubmit="app.addVideo(event)">
                <div class="form-group">
                    <label>Video Title</label>
                    <input type="text" name="title" class="form-input" required>
                </div>
                <div class="form-group">
                    <label>Description</label>
                    <textarea name="description" class="form-textarea" required></textarea>
                </div>
                <div class="form-group">
                    <label>Category</label>
                    <input type="text" name="category" class="form-input" placeholder="Tutorial, Overview, etc." required>
                </div>
                <div class="form-group">
                    <label>Video URL</label>
                    <input type="url" name="url" class="form-input" placeholder="https://..." required>
                </div>
                <div class="form-group">
                    <label>Duration</label>
                    <input type="text" name="duration" class="form-input" placeholder="5:30" required>
                </div>
                <div class="form-actions">
                    <button type="submit" class="btn-primary">Add Video</button>
                </div>
            </form>
        `;
    }

    addVideo(event) {
        event.preventDefault();
        const form = event.target;
        const formData = new FormData(form);
        
        const newVideo = {
            id: Date.now(),
            title: formData.get('title'),
            description: formData.get('description'),
            category: formData.get('category'),
            url: formData.get('url'),
            duration: formData.get('duration')
        };
        
        this.data.videos.push(newVideo);
        this.saveData();
        this.renderAll();
        this.renderAdminTab('videos');
        this.showNotification('Video added successfully!');
    }

    deleteVideo(id) {
        if (!confirm('Are you sure you want to delete this video?')) return;
        this.data.videos = this.data.videos.filter(v => v.id !== id);
        this.saveData();
        this.renderAll();
        this.renderAdminTab('videos');
        this.showNotification('Video deleted');
    }

    renderNewslettersAdmin(container) {
        if (!this.data.newsletters) {
            this.data.newsletters = [];
        }

        container.innerHTML = `
            <h3>Manage Newsletters</h3>
            <div class="item-list">
                ${this.data.newsletters.map(newsletter => `
                    <div class="list-item">
                        <div>
                            <div class="list-item-title">${newsletter.title}</div>
                            <div style="font-size: 0.9rem; color: var(--text-secondary);">${newsletter.quarter}</div>
                        </div>
                        <div class="list-item-actions">
                            <button class="btn-icon" onclick="app.deleteNewsletter(${newsletter.id})">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                    <polyline points="3 6 5 6 21 6"></polyline>
                                    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                                </svg>
                            </button>
                        </div>
                    </div>
                `).join('')}
            </div>
            
            <h3>Add New Newsletter</h3>
            <form id="newsletterForm" onsubmit="app.addNewsletter(event)">
                <div class="form-group">
                    <label>Newsletter Title</label>
                    <input type="text" name="title" class="form-input" placeholder="Q4'25 Newsletter" required>
                </div>
                <div class="form-group">
                    <label>Quarter</label>
                    <input type="text" name="quarter" class="form-input" placeholder="Q4'25" required>
                    <small style="color: var(--text-secondary); display: block; margin-top: 0.5rem;">
                        Format: Q1'26, Q2'26, Q3'26, Q4'26
                    </small>
                </div>
                <div class="form-group">
                    <label>Newsletter URL</label>
                    <input type="url" name="url" class="form-input" placeholder="https://..." required>
                </div>
                <div class="form-actions">
                    <button type="submit" class="btn-primary">Add Newsletter</button>
                </div>
            </form>
        `;
    }

    addNewsletter(event) {
        event.preventDefault();
        const form = event.target;
        const formData = new FormData(form);
        
        if (!this.data.newsletters) {
            this.data.newsletters = [];
        }

        const newNewsletter = {
            id: Date.now(),
            title: formData.get('title'),
            quarter: formData.get('quarter'),
            url: formData.get('url')
        };
        
        this.data.newsletters.push(newNewsletter);
        this.saveData();
        this.renderAll();
        this.renderAdminTab('newsletters');
        this.showNotification('Newsletter added successfully!');
    }

    deleteNewsletter(id) {
        if (!confirm('Are you sure you want to delete this newsletter?')) return;
        this.data.newsletters = this.data.newsletters.filter(n => n.id !== id);
        this.saveData();
        this.renderAll();
        this.renderAdminTab('newsletters');
        this.showNotification('Newsletter deleted');
    }

    renderResourcesAdmin(container) {
        container.innerHTML = `
            <h3>Manage Resources</h3>
            <div class="item-list">
                ${this.data.resources.map(resource => `
                    <div class="list-item">
                        <div>
                            <div class="list-item-title">${resource.title}</div>
                            <div style="font-size: 0.9rem; color: var(--text-secondary);">${resource.type}</div>
                        </div>
                        <div class="list-item-actions">
                            <button class="btn-icon" onclick="app.deleteResource(${resource.id})">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                    <polyline points="3 6 5 6 21 6"></polyline>
                                    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                                </svg>
                            </button>
                        </div>
                    </div>
                `).join('')}
            </div>
            
            <h3>Add New Resource</h3>
            <form id="resourceForm" onsubmit="app.addResource(event)">
                <div class="form-group">
                    <label>Resource Title</label>
                    <input type="text" name="title" class="form-input" required>
                </div>
                <div class="form-group">
                    <label>Description</label>
                    <textarea name="description" class="form-textarea" required></textarea>
                </div>
                <div class="form-group">
                    <label>Type</label>
                    <select name="type" class="form-select" required>
                        <option value="Google Doc">Google Doc</option>
                        <option value="Google Sheet">Google Sheet</option>
                        <option value="Google Slides">Google Slides</option>
                        <option value="User Guide">User Guide</option>
                        <option value="Documentation">Documentation</option>
                        <option value="Template">Template</option>
                        <option value="Other">Other</option>
                    </select>
                </div>
                <div class="form-group">
                    <label>URL</label>
                    <input type="url" name="url" class="form-input" placeholder="https://docs.google.com/..." required>
                </div>
                <div class="form-actions">
                    <button type="submit" class="btn-primary">Add Resource</button>
                </div>
            </form>
        `;
    }

    addResource(event) {
        event.preventDefault();
        const form = event.target;
        const formData = new FormData(form);
        
        const newResource = {
            id: Date.now(),
            title: formData.get('title'),
            description: formData.get('description'),
            type: formData.get('type'),
            url: formData.get('url')
        };
        
        this.data.resources.push(newResource);
        this.saveData();
        this.renderAll();
        this.renderAdminTab('resources');
        this.showNotification('Resource added successfully!');
    }

    renderSettingsAdmin(container) {
        container.innerHTML = `
            <h3>Website Settings</h3>
            
            <h4 style="margin-top: 2rem; margin-bottom: 1rem;">Monday.com Integration</h4>
            <p style="color: var(--text-secondary); margin-bottom: 1.5rem;">
                Add your Monday.com board URL to show a "View in Monday.com" button on the Projects section.
            </p>
            
            <form id="settingsForm" onsubmit="app.updateSettings(event)">
                <div class="form-group">
                    <label>Monday.com Board URL (Optional)</label>
                    <input type="url" name="mondayUrl" class="form-input" 
                           placeholder="https://yourcompany.monday.com/boards/..." 
                           value="${this.data.settings?.mondayUrl || ''}">
                    <small style="color: var(--text-secondary); display: block; margin-top: 0.5rem;">
                        Leave empty to hide the Monday.com button
                    </small>
                </div>
                <div class="form-actions">
                    <button type="submit" class="btn-primary">Save Settings</button>
                </div>
            </form>
        `;
    }

    updateSettings(event) {
        event.preventDefault();
        const form = event.target;
        const formData = new FormData(form);
        
        if (!this.data.settings) {
            this.data.settings = {};
        }
        
        this.data.settings.mondayUrl = formData.get('mondayUrl');
        
        this.saveData();
        this.updateMondayLink();
        this.showNotification('Settings updated successfully!');
    }

    deleteResource(id) {
        if (!confirm('Are you sure you want to delete this resource?')) return;
        this.data.resources = this.data.resources.filter(r => r.id !== id);
        this.saveData();
        this.renderAll();
        this.renderAdminTab('resources');
        this.showNotification('Resource deleted');
    }

    renderAboutAdmin(container) {
        container.innerHTML = `
            <h3>Edit About Section</h3>
            <form id="aboutForm" onsubmit="app.updateAbout(event)">
                <div class="form-group">
                    <label>Mission</label>
                    <textarea name="mission" class="form-textarea" required>${this.data.about.mission}</textarea>
                </div>
                <div class="form-group">
                    <label>What We Do</label>
                    <textarea name="whatWeDo" class="form-textarea" required>${this.data.about.whatWeDo}</textarea>
                </div>
                <div class="form-group">
                    <label>Our Impact</label>
                    <textarea name="impact" class="form-textarea" required>${this.data.about.impact}</textarea>
                </div>
                <div class="form-actions">
                    <button type="submit" class="btn-primary">Update About Section</button>
                </div>
            </form>
        `;
    }

    updateAbout(event) {
        event.preventDefault();
        const form = event.target;
        const formData = new FormData(form);
        
        this.data.about = {
            mission: formData.get('mission'),
            whatWeDo: formData.get('whatWeDo'),
            impact: formData.get('impact')
        };
        
        this.saveData();
        this.renderAll();
        this.showNotification('About section updated successfully!');
    }

    showNotification(message) {
        const notification = document.createElement('div');
        notification.textContent = message;
        notification.style.cssText = `
            position: fixed;
            top: 80px;
            right: 20px;
            background: var(--netflix-red);
            color: white;
            padding: 1rem 2rem;
            border-radius: 8px;
            box-shadow: var(--shadow-lg);
            z-index: 3000;
            animation: slideIn 0.3s ease-out;
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.style.animation = 'slideOut 0.3s ease-out';
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }
}

// Animation styles
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// Initialize the app
const app = new AOWIApp();
