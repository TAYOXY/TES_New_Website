(() => {
    const config = window.TES_SITE_CONFIG;
    if (!config) {
        console.error('The shared Treasureland site configuration is missing.');
        return;
    }

    const link = (href, label, className = '') =>
        `<a class="${className}" href="${href}">${label}</a>`;

    const dropdown = (label, items) => `
        <details class="tes-nav-group">
            <summary>${label}<span class="tes-nav-caret" aria-hidden="true"></span></summary>
            <div class="tes-nav-dropdown">${items.map((item) => link(item.href, item.label)).join('')}</div>
        </details>`;

    const header = () => {
        const about = [
            { label: "Director's Message", href: 'founders-message.html' },
            { label: 'Our History', href: 'our-history.html' },
            { label: 'Montessori Philosophy', href: 'montessori-philosophy.html' }
        ];
        const school = [
            { label: 'Our Programmes', href: 'our-programs.html' },
            { label: 'Our Staff', href: 'our-staff.html' },
            { label: 'Campus Life', href: 'campus-life.html' },
            { label: 'Extra-curricular Activities', href: 'extracurricular-activities.html' },
            { label: 'Inter-house Sports', href: 'inter-house-sports.html' }
        ];
        const academics = [
            { label: 'Admissions', href: 'admissions.html' },
            { label: 'TES Portal', href: 'tes-portal.html' },
            { label: 'Academic Calendar', href: 'news-and-events.html#academic-calendar' }
        ];

        return `
            <nav class="tes-site-header" aria-label="Main navigation">
                <div class="tes-header-inner">
                    <a class="tes-brand" href="index.html" aria-label="Treasureland Elementary School home">
                        <img src="assets/images/brand/TES-Logo-nobg.png" alt="">
                        <span><strong>TES</strong><small>Treasureland Elementary School</small></span>
                    </a>
                    <button class="tes-menu-toggle" type="button" aria-expanded="false" aria-controls="tes-primary-links">
                        <span class="tes-menu-icon" aria-hidden="true">☰</span>
                        <span class="tes-sr-only">Open navigation menu</span>
                    </button>
                    <div class="tes-primary-links" id="tes-primary-links">
                        ${dropdown('About', about)}
                        ${dropdown('School', school)}
                        ${dropdown('Programmes', config.programmes)}
                        ${dropdown('Activities', config.clubs)}
                        ${dropdown('Admissions', academics)}
                        ${link('news-and-events.html#updates', 'News')}
                        ${link('contact.html', 'Contact')}
                        ${link('admissions.html#waiting-list', 'Join the waiting list', 'tes-nav-cta')}
                    </div>
                </div>
            </nav>`;
    };

    const footer = () => `
        <footer class="tes-site-footer">
            <div class="tes-footer-inner">
                <section>
                    <a class="tes-footer-brand" href="index.html">Treasureland Elementary School</a>
                    <p>Nurturing confident, compassionate learners through Montessori-inspired education.</p>
                    <p><strong>School hours:</strong> ${config.schoolHours.schoolDay}<br>
                    <strong>After-school hours:</strong> ${config.schoolHours.afterSchool}</p>
                </section>
                <section>
                    <h2>Explore</h2>
                    ${link('admissions.html', 'Admissions')}
                    ${link('admissions.html#waiting-list', 'Register interest for 2027/2028')}
                    ${link('news-and-events.html#updates', 'News & Events')}
                    ${link('our-programs.html#creche', 'Early Years')}
                    ${link('our-programs.html#primary-school', 'Primary School')}
                    ${link('our-programs.html#after-school', 'After School')}
                    <p>${config.summerCamp}</p>
                </section>
                <section>
                    <h2>Contact</h2>
                    <address>${config.contact.address}</address>
                    ${link(`tel:${config.contact.phoneLink}`, config.contact.phone)}
                    ${link(`mailto:${config.contact.email}`, config.contact.email)}
                    ${link(config.contact.whatsapp, 'Message us on WhatsApp')}
                    ${link(config.contact.maps, 'Find us on Google Maps')}
                    <div class="tes-footer-social">
                        ${link('https://www.instagram.com/TreasureLandSchools/', 'Instagram')}
                        ${link('https://www.facebook.com/treasurelandschoolijebuode/', 'Facebook')}
                        ${link('https://www.tiktok.com/@treasurelandschools', 'TikTok')}
                    </div>
                </section>
                <section class="tes-map">
                    <h2>Visit us</h2>
                    <iframe src="${config.contact.mapEmbed}" title="Map showing Treasureland Elementary School in Ijebu Ode" loading="lazy" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
                </section>
            </div>
            <div class="tes-footer-bottom">© ${new Date().getFullYear()} Treasureland Elementary School. All rights reserved.</div>
        </footer>`;

    const applyFacts = () => {
        document.querySelectorAll('[data-site-fact="students"]').forEach((el) => {
            el.textContent = config.students;
        });
        document.querySelectorAll('[data-site-fact="founding-date"]').forEach((el) => {
            el.textContent = config.foundingDateDisplay;
        });
        document.querySelectorAll('[data-site-fact="years"]').forEach((el) => {
            el.textContent = config.yearsOfExcellence();
        });
        document.querySelectorAll('[data-site-fact="school-hours"]').forEach((el) => {
            el.textContent = config.schoolHours.schoolDay;
        });
        document.querySelectorAll('[data-site-fact="after-school-hours"]').forEach((el) => {
            el.textContent = config.schoolHours.afterSchool;
        });
        document.querySelectorAll('[data-site-fact="mrs-role"]').forEach((el) => {
            el.textContent = config.leadership.mrsOgunyemi;
        });
        document.querySelectorAll('[data-site-fact="mr-role"]').forEach((el) => {
            el.textContent = config.leadership.mrOgunyemi;
        });
        document.querySelectorAll('[data-age-range]').forEach((el) => {
            const key = el.dataset.ageRange;
            if (Object.prototype.hasOwnProperty.call(config.ageRanges, key)) {
                el.textContent = config.ageRanges[key];
            }
        });
        document.querySelectorAll('[data-site-fact="admissions-status"]').forEach((el) => {
            el.textContent = config.admissions.status;
        });
        document.querySelectorAll('[data-site-fact="admissions-current-session"]').forEach((el) => {
            el.textContent = config.admissions.currentSession;
        });
        document.querySelectorAll('[data-site-fact="admissions-next-session"]').forEach((el) => {
            el.textContent = config.admissions.nextSession;
        });
        document.querySelectorAll('[data-site-fact="admissions-reopening"]').forEach((el) => {
            el.textContent = config.admissions.reopening;
        });
        document.querySelectorAll('[data-site-fact="mrs-experience-years"]').forEach((el) => {
            el.textContent = config.experienceYears.mrsOgunyemi;
        });
    };

    const addSeasonalBanner = (season, nav) => {
        if (season === 'normal') return;

        const banner = document.createElement('div');
        banner.className = `tes-seasonal-banner tes-seasonal-banner--${season}`;
        banner.setAttribute('role', 'note');
        banner.innerHTML = '<span aria-hidden="true">❄</span><span>Season’s greetings from Treasureland — wishing every family joy, peace and a bright new year.</span><span aria-hidden="true">🎁</span><span aria-hidden="true">🎄</span>';
        nav.after(banner);
    };

    const addFestiveSnowfall = () => {
        const decor = document.createElement('div');
        decor.className = 'tes-festive-decor';
        decor.setAttribute('aria-hidden', 'true');
        decor.innerHTML = `
            <span class="tes-festive-snowflake tes-festive-snowflake--one">❄</span>
            <span class="tes-festive-snowflake tes-festive-snowflake--two">❄</span>
            <span class="tes-festive-snowflake tes-festive-snowflake--three">❄</span>
            <span class="tes-festive-snowflake tes-festive-snowflake--four">❄</span>
        `;
        document.body.appendChild(decor);
    };

    const addSeasonalAudio = (season) => {
        if (season === 'normal') return;

        const label = 'Christmas';
        const button = document.createElement('button');
        button.className = `tes-season-sound-toggle tes-season-sound-toggle--${season}`;
        button.type = 'button';
        button.setAttribute('aria-pressed', 'false');
        button.textContent = `Enable ${label} ambience`;
        document.body.appendChild(button);

        const AudioContext = window.AudioContext || window.webkitAudioContext;
        if (!AudioContext) {
            button.disabled = true;
            button.textContent = 'Seasonal sound unavailable';
            return;
        }

        let context;
        let ambienceEnabled = false;
        let ambientMaster;
        let ambientNodes = [];
        let ambientTimer;
        let scrollTimer;
        let isScrolling = false;
        let chimeIndex = 0;
        const soundVolumeMultiplier = 2.5;
        const christmasNotes = [659.25, 783.99, 987.77, 783.99, 659.25];

        const getContext = () => {
            if (!context) context = new AudioContext();
            return context;
        };

        const playTone = (frequency, duration, type, volume, endFrequency = frequency) => {
            if (!context || context.state !== 'running') return;

            const oscillator = context.createOscillator();
            const gain = context.createGain();
            const now = context.currentTime;
            oscillator.type = type;
            oscillator.frequency.setValueAtTime(frequency, now);
            if (endFrequency !== frequency) {
                oscillator.frequency.exponentialRampToValueAtTime(Math.max(1, endFrequency), now + duration);
            }
            gain.gain.setValueAtTime(Math.max(0.0001, volume * soundVolumeMultiplier), now);
            gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);
            oscillator.connect(gain);
            gain.connect(context.destination);
            oscillator.start(now);
            oscillator.stop(now + duration);
        };

        const playNavigationSound = () => {
            playTone(1046.5, 0.34, 'sine', 0.12);
            window.setTimeout(() => playTone(1318.51, 0.3, 'sine', 0.09), 55);
        };

        const stopAmbient = () => {
            window.clearInterval(ambientTimer);
            ambientTimer = undefined;
            if (!ambientMaster || !context || !ambientNodes.length) return;

            const now = context.currentTime;
            ambientMaster.gain.cancelScheduledValues(now);
            ambientMaster.gain.setTargetAtTime(0, now, 0.12);
            const nodesToStop = ambientNodes;
            ambientNodes = [];
            ambientMaster = null;
            window.setTimeout(() => {
                nodesToStop.forEach((node) => {
                    try {
                        node.stop();
                    } catch {
                        node.disconnect();
                    }
                });
            }, 600);
        };

        const startAmbient = async () => {
            if (!ambienceEnabled || isScrolling || ambientMaster) return;

            const audio = getContext();
            await audio.resume();
            if (!ambienceEnabled || isScrolling || audio.state !== 'running' || ambientMaster) return;

            ambientMaster = audio.createGain();
            ambientMaster.gain.setValueAtTime(0, audio.currentTime);
            ambientMaster.gain.linearRampToValueAtTime(0.055 * soundVolumeMultiplier, audio.currentTime + 1.2);
            ambientMaster.connect(audio.destination);
            ambientNodes = [];

            [196, 246.94, 293.66].forEach((frequency) => {
                const oscillator = audio.createOscillator();
                const gain = audio.createGain();
                oscillator.type = 'sine';
                oscillator.frequency.value = frequency;
                gain.gain.value = 0.1;
                oscillator.connect(gain);
                gain.connect(ambientMaster);
                oscillator.start();
                ambientNodes.push(oscillator);
            });

            ambientTimer = window.setInterval(() => {
                if (!ambientMaster) return;
                playTone(christmasNotes[chimeIndex % christmasNotes.length], 0.8, 'sine', 0.075);
                chimeIndex += 1;
            }, 1800);
        };

        const updateButton = () => {
            button.setAttribute('aria-pressed', String(ambienceEnabled));
            button.textContent = ambienceEnabled ? `Mute ${label} ambience` : `Enable ${label} ambience`;
        };

        button.addEventListener('click', async () => {
            ambienceEnabled = !ambienceEnabled;
            updateButton();
            if (ambienceEnabled) {
                try {
                    await startAmbient();
                } catch (error) {
                    console.warn('Seasonal ambience could not start:', error);
                }
            } else {
                stopAmbient();
            }
        });

        window.addEventListener('scroll', () => {
            if (!ambienceEnabled) return;
            isScrolling = true;
            stopAmbient();
            window.clearTimeout(scrollTimer);
            scrollTimer = window.setTimeout(() => {
                isScrolling = false;
                startAmbient().catch((error) => {
                    console.warn('Seasonal ambience could not start:', error);
                });
            }, 1100);
        }, { passive: true });

        document.addEventListener('click', (event) => {
            if (!(event.target instanceof Element)) return;
            const linkElement = event.target.closest('a[href]');
            if (!linkElement || event.defaultPrevented || event.button !== 0 ||
                event.metaKey || event.ctrlKey || event.shiftKey || event.altKey ||
                linkElement.target === '_blank' || linkElement.hasAttribute('download')) {
                return;
            }

            const target = new URL(linkElement.href, window.location.href);
            const current = new URL(window.location.href);
            if (target.origin !== current.origin ||
                (target.pathname === current.pathname && target.hash === current.hash)) {
                return;
            }

            event.preventDefault();
            try {
                getContext().resume().then(() => {
                    playNavigationSound();
                    window.setTimeout(() => {
                        window.location.assign(target.href);
                    }, 240);
                }).catch((error) => {
                    console.warn('Page-change sound could not start:', error);
                    window.location.assign(target.href);
                });
            } catch (error) {
                console.warn('Page-change sound could not start:', error);
                window.location.assign(target.href);
            }
        });

        window.addEventListener('pagehide', () => {
            window.clearTimeout(scrollTimer);
            stopAmbient();
        }, { once: true });
    };

    const mount = () => {
        document.body.classList.add('loaded');

        const oldHeader = document.querySelector('body > nav') || document.querySelector('nav');
        const newHeader = document.createElement('div');
        newHeader.innerHTML = header().trim();
        const nav = newHeader.firstElementChild;
        if (oldHeader) {
            oldHeader.replaceWith(nav);
        } else {
            document.body.prepend(nav);
        }

        const oldFooter = document.querySelector('footer.tes-footer') || document.querySelector('body > footer');
        const newFooter = document.createElement('div');
        newFooter.innerHTML = footer().trim();
        if (oldFooter) {
            oldFooter.replaceWith(newFooter.firstElementChild);
        } else {
            document.body.append(newFooter.firstElementChild);
        }

        const menuToggle = document.querySelector('.tes-menu-toggle');
        const links = document.querySelector('.tes-primary-links');
        const navGroups = [...links.querySelectorAll('.tes-nav-group')];
        navGroups.forEach((group) => {
            group.addEventListener('toggle', () => {
                if (group.open) {
                    navGroups.forEach((otherGroup) => {
                        if (otherGroup !== group) otherGroup.open = false;
                    });
                }
            });
        });

        const closeMenu = () => {
            links.classList.remove('is-open');
            menuToggle.setAttribute('aria-expanded', 'false');
            menuToggle.querySelector('.tes-menu-icon').textContent = '☰';
            menuToggle.querySelector('.tes-sr-only').textContent = 'Open navigation menu';
        };

        menuToggle.addEventListener('click', () => {
            const isOpen = menuToggle.getAttribute('aria-expanded') === 'true';
            menuToggle.setAttribute('aria-expanded', String(!isOpen));
            menuToggle.querySelector('.tes-menu-icon').textContent = isOpen ? '☰' : '×';
            menuToggle.querySelector('.tes-sr-only').textContent = isOpen ? 'Open navigation menu' : 'Close navigation menu';
            links.classList.toggle('is-open', !isOpen);
        });
        links.addEventListener('click', (event) => {
            if (event.target instanceof Element && event.target.closest('a')) closeMenu();
        });
        document.addEventListener('keydown', (event) => {
            if (event.key === 'Escape') closeMenu();
        });
        window.matchMedia('(min-width: 1024px)').addEventListener('change', (event) => {
            if (event.matches) closeMenu();
        });

        const season = config.seasonForDate();
        document.documentElement.dataset.tesSeason = season;
        addSeasonalBanner(season, nav);
        if (season === 'festive') addFestiveSnowfall();
        addSeasonalAudio(season);

        applyFacts();
    };

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', mount, { once: true });
    } else {
        mount();
    }
})();
