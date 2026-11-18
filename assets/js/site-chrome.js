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
            { label: 'Extracurricular Activities', href: 'extracurricular-activities.html' },
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
                    <a class="tes-brand" href="index.html">
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
                        ${link('admissions.html#waiting-list', 'Join the interest list', 'tes-nav-cta')}
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
                    ${link('admissions.html#waiting-list', 'Join the interest list')}
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
            <div class="tes-footer-bottom">© ${new Date().getFullYear()} Treasureland Elementary School. All rights reserved. · <a href="privacy.html">Privacy Policy</a></div>
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
        const ageRanges = config.ageRanges || {};
        document.querySelectorAll('[data-age-range]').forEach((el) => {
            const key = el.dataset.ageRange;
            if (Object.prototype.hasOwnProperty.call(ageRanges, key)) {
                el.textContent = ageRanges[key];
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

        // Three public-domain carols, arranged for the season. Melodies and
        // bass lines were reduced from public-domain Mutopia Project
        // engravings (first_noel, stille-nacht, cranham), so no recorded audio
        // is downloaded or streamed.
        const pieceScores = [
            {
                title: 'The First Noel',
                bpm: 96,
                voice: 'viola',
                melody: `
                    F#4:0.5 E4:0.5 D4:1.5 E4:0.5 F#4:0.5 G4:0.5 A4:2 B4:0.5
                    C#5:0.5 D5:1 C#5:1 B4:1 A4:2 B4:0.5 C#5:0.5 D5:1
                    C#5:1 B4:1 A4:1 B4:1 C#5:1 D5:1 A4:1 G4:1
                    F#4:2.5 E4:0.5 D4:1.5 E4:0.5 F#4:0.5 G4:0.5 A4:2 B4:0.5
                    C#5:0.5 D5:1 C#5:1 B4:1 A4:2 B4:0.5 C#5:0.5 D5:1
                    C#5:1 B4:1 A4:1 B4:1 C#5:1 D5:1 A4:1 G4:1
                    F#4:2.5 E4:0.5 D4:1.5 E4:0.5 F#4:0.5 G4:0.5 A4:2 D5:0.5
                    C#5:0.5 B4:3 A4:3 D5:1 C#5:1 B4:1 A4:1 B4:1
                    C#5:1 D5:1 A4:1 G4:1 F#4:2
                `,
                bass: `
                    D3:2 B2:2 A2:2 F#3:4 D3:2 F#3:2 D3:2 F#3:2 E3:2 A3:2
                    D3:2 A2:2 B2:2 A2:2 F#3:4 D3:2 F#3:2 D3:2 F#3:2 E3:2
                    A2:2 D3:2 A2:2 B2:2 F#3:2 D3:2 A3:2 D4:2 B3:2 G3:2
                    D3:2 E3:2 A2:2 D3:2
                `
            },
            {
                title: 'Silent Night',
                bpm: 60,
                voice: 'violin',
                melody: `
                    D5:1.5 E5:0.5 D5:1 B4:3 D5:1.5 E5:0.5 D5:1 B4:3
                    A5:3 F#5:3 G5:3 D5:3 E5:3 G5:1.5 F#5:0.5 E5:1
                    D5:1.5 E5:0.5 D5:1 B4:3 E5:3 G5:1.5 F#5:0.5 E5:1
                    D5:1.5 E5:0.5 D5:1 B4:3 A5:3 C6:1.5 A5:0.5 F#5:1
                    G5:3 B5:3 G5:1 D5:1 B4:1 D5:1.5 C5:0.5 A4:1
                    G4:3
                `,
                bass: `
                    G3:12 D4:6 G3:6 C4:6 G3:6 C4:6 G3:6 D4:6 G3:8 D4:4
                    G3:4
                `
            },
            {
                title: 'In the Bleak Midwinter',
                bpm: 60,
                voice: 'violin',
                melody: `
                    A4:2.5 A#4:0.5 C5:1 A4:1 G4:2 F4:2 G4:1.5 A4:0.5
                    G4:1 D4:1 G4:4 A4:1.5 A#4:0.5 C5:1 A4:1 G4:2
                    F4:2 G4:1 A4:1 G4:1.5 F4:4.5 A#4:1.5 A4:0.5 A#4:1
                    C5:1 D5:2 A4:2 C5:1 A4:1 G4:1 F4:1 E4:3
                    A4:2.5 A#4:0.5 C5:1 A4:1 G4:2 F4:2 G4:1 A4:1
                    G4:1.5 F4:2.5
                `,
                bass: `
                    F3:2 G3:2 D3:4 A#2:4 G2:2 C3:2 F3:2 G3:2 D3:4 A#2:4
                    F3:4 D3:4 A#2:4 A2:4 A#2:2 C3:2 F3:2 G3:2 D3:4 A#2:2
                    C3:2 F3:4
                `
            }
        ];

        const gapSeconds = 1.8;
        const noteOffsets = { C: 0, 'C#': 1, D: 2, 'D#': 3, E: 4, F: 5, 'F#': 6, G: 7, 'G#': 8, A: 9, 'A#': 10, B: 11 };
        const frequencyOf = (name) => {
            const match = /^([A-G]#?)(\d)$/.exec(name);
            if (!match) return 0;
            const midi = (Number(match[2]) + 1) * 12 + noteOffsets[match[1]];
            return 440 * Math.pow(2, (midi - 69) / 12);
        };
        const parseScore = (source, bpm) => source.trim().split(/\s+/).map((token) => {
            const [name, beats] = token.split(':');
            return {
                frequency: name === 'r' ? 0 : frequencyOf(name),
                duration: Number(beats) * (60 / bpm)
            };
        });
        const voices = {
            violin: { type: 'sawtooth', volume: 0.05, attack: 0.1, release: 0.32, filter: 3.6, detune: 6, vibrato: true },
            viola: { type: 'sawtooth', volume: 0.055, attack: 0.11, release: 0.34, filter: 3.2, detune: 5, vibrato: true },
            cello: { type: 'sawtooth', volume: 0.045, attack: 0.14, release: 0.42, filter: 2.8, detune: 4, vibrato: true }
        };
        const programme = pieceScores.map((piece) => {
            const melody = parseScore(piece.melody, piece.bpm);
            const bass = parseScore(piece.bass, piece.bpm);
            const length = (notes) => notes.reduce((total, note) => total + note.duration, 0);
            return {
                title: piece.title,
                voice: voices[piece.voice] || voices.violin,
                melody,
                bass,
                duration: Math.max(length(melody), length(bass))
            };
        });

        let context;
        let ambienceEnabled = false;
        let ambientMaster;
        let ambientNodes = [];
        let ambientEffects = [];
        let loopTimer;
        let nextPieceAt = 0;
        let pieceIndex = 0;
        const soundVolumeMultiplier = 2.5;

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

        const playVoice = (frequency, when, duration, voice = voices.violin) => {
            if (!context || !ambientMaster) return;

            const attack = Math.min(voice.attack, duration * 0.3);
            const release = Math.min(voice.release, duration * 0.45);
            const sustainEnd = Math.max(when + attack, when + duration - release);

            const gain = context.createGain();
            gain.gain.setValueAtTime(0.0001, when);
            gain.gain.exponentialRampToValueAtTime(voice.volume, when + attack);
            gain.gain.setValueAtTime(voice.volume, sustainEnd);
            gain.gain.exponentialRampToValueAtTime(0.0001, when + duration);
            gain.connect(ambientMaster);

            // A gentle low-pass keeps the sawtooth from sounding buzzy and
            // gives the notes a bowed, woody body rather than a piano attack.
            const filter = context.createBiquadFilter();
            filter.type = 'lowpass';
            filter.frequency.setValueAtTime(Math.min(5200, Math.max(600, frequency * voice.filter)), when);
            filter.Q.setValueAtTime(0.6, when);
            filter.connect(gain);

            const oscillators = [];
            let live = voice.detune ? 2 : 1;
            const tidy = () => {
                live -= 1;
                if (live > 0) return;
                try {
                    filter.disconnect();
                    gain.disconnect();
                } catch {
                    // Already detached.
                }
            };

            // Two slightly detuned voices per note mimic a small string
            // section; a single voice is used for the cello line.
            const detunes = voice.detune ? [-voice.detune, voice.detune] : [0];
            detunes.forEach((cents) => {
                const oscillator = context.createOscillator();
                oscillator.type = voice.type;
                oscillator.frequency.setValueAtTime(frequency, when);
                if (cents) oscillator.detune.setValueAtTime(cents, when);
                oscillator.connect(filter);
                oscillator.start(when);
                oscillator.stop(when + duration + 0.05);
                oscillator.onended = () => {
                    try {
                        oscillator.disconnect();
                    } catch {
                        // The node was already torn down when the ambience stopped.
                    }
                    const index = ambientNodes.indexOf(oscillator);
                    if (index !== -1) ambientNodes.splice(index, 1);
                    tidy();
                };
                ambientNodes.push(oscillator);
                oscillators.push(oscillator);
            });

            if (voice.vibrato && duration > 0.4) {
                // A slow, shallow vibrato reads as a bowed string rather than
                // a pure synth tone.
                const lfo = context.createOscillator();
                const depth = context.createGain();
                lfo.frequency.setValueAtTime(5.1, when);
                depth.gain.setValueAtTime(frequency * 0.0032, when);
                lfo.connect(depth);
                oscillators.forEach((oscillator) => depth.connect(oscillator.frequency));
                lfo.start(when);
                lfo.stop(when + duration);
                lfo.onended = () => {
                    try {
                        lfo.disconnect();
                        depth.disconnect();
                    } catch {
                        // Already detached.
                    }
                    const index = ambientNodes.indexOf(lfo);
                    if (index !== -1) ambientNodes.splice(index, 1);
                };
                ambientNodes.push(lfo);
            }
        };

        const schedulePiece = (piece, startTime) => {
            let cursor = startTime;
            piece.melody.forEach((note) => {
                if (note.frequency) playVoice(note.frequency, cursor, note.duration, piece.voice);
                cursor += note.duration;
            });

            let bassCursor = startTime;
            piece.bass.forEach((note) => {
                if (note.frequency) playVoice(note.frequency, bassCursor, note.duration, voices.cello);
                bassCursor += note.duration;
            });
        };

        const updateNowPlaying = (title) => {
            button.title = `Now playing: ${title}. Christmas favourites on strings: ${programme.map((piece) => piece.title).join(', ')}.`;
        };

        const scheduleNextPiece = () => {
            if (!ambienceEnabled || !ambientMaster || !context) return;

            const piece = programme[pieceIndex % programme.length];
            pieceIndex += 1;
            const start = Math.max(context.currentTime + 0.15, nextPieceAt);
            schedulePiece(piece, start);
            nextPieceAt = start + piece.duration + gapSeconds;
            const wait = Math.max(1000, (nextPieceAt - context.currentTime - 0.5) * 1000);
            loopTimer = window.setTimeout(scheduleNextPiece, wait);
            updateNowPlaying(piece.title);
        };

        const stopAmbient = () => {
            window.clearTimeout(loopTimer);
            loopTimer = undefined;
            nextPieceAt = 0;
            if (!context) return;

            const master = ambientMaster;
            const nodes = ambientNodes;
            const effects = ambientEffects;
            ambientMaster = null;
            ambientNodes = [];
            ambientEffects = [];

            if (master) {
                const now = context.currentTime;
                master.gain.cancelScheduledValues(now);
                master.gain.setTargetAtTime(0.0001, now, 0.08);
            }

            window.setTimeout(() => {
                nodes.forEach((node) => {
                    try {
                        node.stop();
                    } catch {
                        node.disconnect();
                    }
                });
                effects.forEach((node) => {
                    try {
                        node.disconnect();
                    } catch {
                        // Already disconnected.
                    }
                });
                if (master) {
                    try {
                        master.disconnect();
                    } catch {
                        // Already disconnected.
                    }
                }
            }, 450);
        };

        const startAmbient = async () => {
            if (!ambienceEnabled || ambientMaster) return;

            const audio = getContext();
            await audio.resume();
            if (!ambienceEnabled || audio.state !== 'running' || ambientMaster) return;

            ambientMaster = audio.createGain();
            ambientMaster.gain.setValueAtTime(0.0001, audio.currentTime);
            ambientMaster.gain.exponentialRampToValueAtTime(1, audio.currentTime + 1.4);
            ambientMaster.connect(audio.destination);

            const delay = audio.createDelay(0.5);
            delay.delayTime.value = 0.32;
            const feedback = audio.createGain();
            feedback.gain.value = 0.2;
            const wet = audio.createGain();
            wet.gain.value = 0.16;
            ambientMaster.connect(delay);
            delay.connect(feedback);
            feedback.connect(delay);
            delay.connect(wet);
            wet.connect(audio.destination);

            ambientNodes = [];
            ambientEffects = [delay, feedback, wet];
            nextPieceAt = 0;
            pieceIndex = 0;
            scheduleNextPiece();
        };

        const updateButton = () => {
            button.setAttribute('aria-pressed', String(ambienceEnabled));
            button.textContent = ambienceEnabled ? `Mute ${label} ambience` : `Enable ${label} ambience`;
            if (!ambienceEnabled) button.removeAttribute('title');
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
                (target.pathname === current.pathname && target.search === current.search)) {
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
