(() => {
    const teacherProfiles = {
        'Agunloye Ruth.jpg': { role: 'Assistant Class Teacher' },
        'Ayantola Kafayat Adenike.jpg': { role: 'Class Teacher' },
        'Mrs Oduwole oluwatoyin.png': {
            name: 'Mrs. Oduwole Oluwatoyin',
            role: 'Assistant Class Teacher'
        },
        'OKUNORE OLUWAYOMI ANUOLUWAPO.png': {
            name: 'Okunore Oluwayomi Anuoluwapo',
            role: 'Teacher'
        },
        'Okunowo Olatunde Solomon.jpg': {
            name: 'Olatunde Solomon Okunowo',
            role: 'Teacher/Coach'
        },
        'Omoseebi Olumide John.jpg': { role: 'Art & Craft/Teacher' },
        'Olakayode Olalekan Tomiwa.png': { role: 'Assistant Class Teacher' },
        'Osineye_Funmilola_Abiodun.jpg': {
            name: 'Osineye Funmilola Abiodun',
            role: 'Assistant Class Teacher'
        },
        'Oshinbanjo Olasunkanmi.jpg': { role: 'Coding & Robotics Teacher' },
        'Solaru Rashidat Adebowale.jpg': { role: 'Assistant Teacher' }
    };

    const teachers = [
        'Adebanjo Bushrah Adeayo.jpg',
        'Adekoya Taiwo Omolayo.jpg',
        'Adekunle Ganiyat Gbemisola.jpg',
        'Adesanya Oluwabusayomi Adeola.jpg',
        'Adeusi Kunle Cornelius.png',
        'Agunloye Ruth.jpg',
        'Aina Temitope.jpg',
        'Ajayi Oriyomi Omotoke.jpg',
        'Akindele Titilope Dorcas.jpg',
        'Alabi Oluwapelumi Alexandra.jpg',
        'Ayantola Kafayat Adenike.jpg',
        'BAKRE BASIT BABATUNDE.jpg',
        'Balogun Waliat Olasubomi.jpg',
        'Bello Motunrayo Oluwadamilare.jpg',
        'Bosede Mercy Kowe.jpg',
        'Bulugbe Busola Esther.jpg',
        'Fowosire Adebimpe Mariam.jpg',
        'Lawal Olanrewaju Isaiah.png',
        'Lobele Oluremi.jpg',
        'Miss Ojo Blessing.jpg',
        'Mrs Mgbeoji Ifeyiwa Matina.jpg',
        'Mrs Oduwole oluwatoyin.png',
        'Mrs Ogungbemi Abolanle O..jpg',
        'Mrs. O.R. Arigbabuwo Oduntan.jpg',
        'Mrs. Victoria Abata Oyeshola.jpg',
        'Ogunbiyi Oluwabukola Esther.jpg',
        'OKUNORE OLUWAYOMI ANUOLUWAPO.png',
        'Okunowo Olatunde Solomon.jpg',
        'Oladipupo Titilayo Oluwadamlare.jpg',
        'Olakayode Olalekan Tomiwa.png',
        'Oluwabusayo Abidemi.jpeg',
        'Omoseebi Olumide John.jpg',
        'Onabanwo Yetunde.jpg',
        'Osineye_Funmilola_Abiodun.jpg',
        'Oshinbanjo Olasunkanmi.jpg',
        'Oyesanya Tomiwa.jpg',
        'Solaru Rashidat Adebowale.jpg',
        'Talabi Olayinka.jpg',
        'Temitope Toluwase.png'
    ].map((filename) => {
        const profile = teacherProfiles[filename] || {};
        return {
            name: profile.name || filename.replace(/\.[^.]+$/, ''),
            role: profile.role || 'Teacher',
            image: `assets/images/staff/teachers/${filename}`
        };
    });
    const headsOfDepartment = [
        'Badejo Mary Oluwafunke.jpg',
        'Banjo Oluwadamilola Monsurat.jpg',
        'Helen Taiwo.png',
        'Mary Mgbolu.jpeg',
        'Mrs Akinloye Oluwabusola.jpg',
        'Nelson Rebecca.png',
        'Ogunleye Motunrayo Olaitan.jpg',
        'Oreagba Taobat Abosede.jpg'
    ].map((filename) => ({
        name: filename.replace(/\.[^.]+$/, ''),
        role: 'Head of Department',
        image: `assets/images/staff/heads-of-department/${filename}`
    }));

    const sharedFacts = window.TES_SITE_CONFIG;
    const founders = [{
            name: 'Mr. R.A. Ogunyemi',
            role: sharedFacts?.leadership.mrOgunyemi || 'Founder',
            image: 'assets/images/staff/founders/Mr. R.A. Ogunyemi (Founder).jpg'
        },
        {
            name: 'Mrs. E.E. Ogunyemi',
            role: sharedFacts?.leadership.mrsOgunyemi || 'Director and Proprietor',
            description: `${sharedFacts?.experienceYears.mrsOgunyemi ?? 30} years of educational experience.`,
            image: 'assets/images/staff/founders/Mrs. E.E. Ogunyemi (Founder_Director).jpg'
        }
    ];

    const management = [{
        name: 'Mr. Abimbola Ogunyemi',
        role: 'Manager & Director of Studies',
        image: 'assets/images/staff/founders/Mr. Abimbola Ogunyemi (Manager).jpg'
    }];

    const administrativeStaff = [{
            name: 'Atobatele Gloria Mojisola',
            role: 'Administrative Staff',
            image: 'assets/images/staff/admin/Atobatele Gloria Mojisola.jpg'
        },
        {
            name: 'Mrs. Okoh Esther',
            role: 'Administrative Staff',
            image: 'assets/images/staff/admin/Mrs. Okoh Esther.jpg'
        },
        {
            name: 'Titilayo Mary Fanoiki',
            role: 'Nurse',
            image: 'assets/images/staff/admin/Titilayo Mary Fanoiki.jpg'
        }
    ];

    const headsOfSchools = [{
            name: 'Mrs. O.R Olaosebikan',
            role: 'Head of Primary Schools',
            image: 'assets/images/staff/heads-of-schools/Mrs. O.R Olaosebikan (Head of Primary School).jpg'
        },
        {
            name: 'Awoma Olufunke O.',
            role: 'Head of Preschools/Sport Director',
            image: 'assets/images/staff/heads-of-schools/Awoma Olufunke O. (Head of Pre School).jpg'
        }
    ];

    const createElement = (tag, className, text) => {
        const element = document.createElement(tag);
        if (className) element.className = className;
        if (text) element.textContent = text;
        return element;
    };

    const createProfile = ({ name, role, image, description }) => {
        const card = createElement('article', 'overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg');
        const portrait = createElement('div', 'flex h-64 items-center justify-center bg-[#edf4ef]');

        if (image) {
            const photo = createElement('img', 'h-full w-full object-cover object-top');
            const directory = image.slice(0, image.lastIndexOf('/'));
            const filename = image.slice(image.lastIndexOf('/') + 1).replace(/\.[^.]+$/, '.jpg');
            photo.src = `${directory}/thumbnails/${filename}`;
            photo.alt = name;
            photo.loading = 'lazy';
            photo.decoding = 'async';
            portrait.append(photo);
        } else {
            const icon = createElement('i', 'fas fa-user-tie text-5xl text-[#0e5d46]');
            icon.setAttribute('aria-hidden', 'true');
            portrait.append(icon);
        }

        const details = createElement('div', 'p-5 text-center');
        details.append(
            createElement('h3', 'text-lg font-bold text-slate-900', name),
            createElement('p', 'mt-1 text-sm font-semibold text-[#0e5d46]', role)
        );
        if (description) {
            details.append(createElement('p', 'mt-2 text-sm text-slate-600', description));
        }
        card.append(portrait, details);
        return card;
    };
    const createGroup = (title, profiles, isSubgroup = false) => {
        const section = createElement('section', isSubgroup ? 'mt-8' : 'mt-14');
        const heading = createElement(
            isSubgroup ? 'h3' : 'h2',
            isSubgroup ? 'mb-4 text-xl font-black text-slate-900 md:text-2xl' : 'mb-6 text-2xl font-black text-slate-900 md:text-3xl',
            title
        );
        const grid = createElement('div', 'grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4');
        profiles.forEach((profile) => grid.append(createProfile(profile)));
        section.append(heading, grid);
        return section;
    };

    const createDisclosure = (title, content, count) => {
        const details = createElement('details', 'staff-directory-disclosure group mt-8 rounded-2xl border border-slate-200 bg-white px-5 py-4 shadow-sm first:mt-0');
        const summary = createElement('summary', 'flex cursor-pointer items-center justify-between text-slate-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#0e5d46]');
        content.id = `staff-disclosure-${title.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`;
        summary.setAttribute('aria-expanded', String(details.open));
        summary.setAttribute('aria-controls', content.id);
        const label = createElement('span', 'text-xl font-black md:text-2xl', title);
        label.setAttribute('role', 'heading');
        label.setAttribute('aria-level', '2');
        const countLabel = createElement('span', 'ml-3 text-sm font-medium text-slate-500', `${count} staff members`);
        const disclosureLabel = createElement('span', 'flex min-w-0 items-center');
        disclosureLabel.append(label, countLabel);
        const chevron = createElement('i', 'fas fa-chevron-down ml-4 shrink-0 text-sm text-[#0e5d46]');
        chevron.setAttribute('aria-hidden', 'true');
        summary.append(disclosureLabel, chevron);
        details.append(summary, content);
        details.addEventListener('toggle', () => {
            const isOpen = details.open;
            summary.setAttribute('aria-expanded', String(isOpen));
            chevron.classList.toggle('fa-chevron-down', !isOpen);
            chevron.classList.toggle('fa-chevron-up', isOpen);
        });
        return details;
    };

    const createManagementSection = () => {
        const content = createElement('div', 'mt-6 border-t border-slate-100');
        const groups = [
            ['Founders', founders],
            ['Manager', management],
            ['Administrative Staff', administrativeStaff],
            ['Heads of Schools', headsOfSchools]
        ];
        groups.forEach(([title, profiles]) => {
            content.append(createGroup(title, profiles, true));
        });
        const staffCount = groups.reduce((total, [, profiles]) => total + profiles.length, 0);
        return createDisclosure(
            'Management',
            content,
            staffCount
        );
    };

    const createCollapsibleGroup = (title, profiles) => {
        const content = createElement('div', 'mt-6 border-t border-slate-100 pt-6');
        const grid = createElement('div', 'grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4');
        profiles.forEach((profile) => grid.append(createProfile(profile)));
        content.append(grid);
        return createDisclosure(title, content, profiles.length);
    };

    const directory = document.getElementById('staff-directory');
    if (!directory) return;

    const content = createElement('div', 'container mx-auto max-w-7xl px-6');
    const intro = createElement('p', 'mx-auto max-w-3xl text-center text-lg leading-8 text-slate-600', 'Meet the people who lead, teach, and support learning at Treasureland Elementary School.');
    content.append(intro);

    if (directory.dataset.directoryPage === 'staff') {
        content.append(
            createManagementSection(),
            createCollapsibleGroup('Heads of Department', headsOfDepartment),
            createCollapsibleGroup('Teachers', teachers)
        );
    } else {
        content.append(
            createCollapsibleGroup('Heads of Department', headsOfDepartment),
            createCollapsibleGroup('Teaching Team', teachers)
        );
    }

    directory.replaceChildren(content);
})();