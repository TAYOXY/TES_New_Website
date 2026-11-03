(() => {
    const admissions = {
        currentSession: '2026/2027',
        nextSession: '2027/2028',
        reopening: 'June 2027'
    };
    admissions.status = `Admissions for the ${admissions.currentSession} session are closed. Register your interest for the ${admissions.nextSession} session; formal applications are expected to reopen in ${admissions.reopening}.`;

    const config = {
        schoolName: 'Treasureland Elementary School',
        foundingDate: '2011-09-19',
        foundingDateDisplay: '19 September 2011',
        students: '550+',
        accreditation: 'Government-approved school following the Nigerian educational system.',
        leadership: {
            mrsOgunyemi: 'Director and Proprietor',
            mrOgunyemi: 'Founder'
        },
        experienceYears: {
            mrsOgunyemi: 30
        },
        schoolHours: {
            schoolDay: '7:30 am–3:00 pm',
            afterSchool: '3:00 pm–5:00 pm'
        },
        ageRanges: {
            montessoriAcademic: '[CONFIRM: Montessori Academic age range]',
            creche: '[CONFIRM: Crèche age range]',
            preparatoryPlaygroup: '[CONFIRM: Preparatory & Playgroup age range]',
            nursery1: '[CONFIRM: Nursery 1 age range]',
            nursery2: '[CONFIRM: Nursery 2 age range]',
            primary: '[CONFIRM: Primary School age range]'
        },
        admissions,
        contact: {
            address: 'Block 37, JDPC Road, Off Stadium Road, GRA, Ijebu Ode',
            phone: '+234 807 455 2156',
            phoneLink: '+2348074552156',
            email: 'hello@treasurelandschools.com',
            whatsapp: 'https://wa.me/2348074552156',
            maps: 'https://www.google.com/maps/search/?api=1&query=Treasureland+Elementary+School+Ijebu+Ode',
            mapEmbed: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3961.589317780016!2d3.930132374137194!3d6.81969939317806!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x103968cd5772fbb7%3A0xe69cd986a08e66dc!2sTreasureland%20Elementary%20school!5e0!3m2!1sen!2sng!4v1793517141108!5m2!1sen!2sng'
        },
        programmes: [
            { label: 'Montessori Academic', href: 'our-programs.html#montessori-academic' },
            { label: 'Crèche', href: 'our-programs.html#creche' },
            { label: 'Preparatory & Playgroup', href: 'our-programs.html#preparatory-playgroup' },
            { label: 'Nursery 1', href: 'our-programs.html#nursery-1' },
            { label: 'Nursery 2', href: 'our-programs.html#nursery-2' },
            { label: 'Primary School', href: 'our-programs.html#primary-school' }
        ],
        clubs: [
            { label: 'Music Club', href: 'extracurricular-activities.html#music' },
            { label: 'Art & Craft Club', href: 'extracurricular-activities.html#art-creativity' },
            { label: 'Tie & Dye Club', href: 'extracurricular-activities.html#tie-dye' },
            { label: 'Makeup Artistry Club', href: 'extracurricular-activities.html#makeup-artistry' },
            { label: 'Culinary Arts Club', href: 'extracurricular-activities.html#culinary' },
            { label: 'Dance Club', href: 'extracurricular-activities.html#dance' },
            { label: 'Sports & Games Club', href: 'extracurricular-activities.html#sports-games' },
            { label: 'Seamstress & Sewing Club', href: 'extracurricular-activities.html#sewing' },
            { label: 'Jet Club', href: 'extracurricular-activities.html#jet' },
            { label: 'Hair Making Club', href: 'extracurricular-activities.html#hair-making' }
        ],
        summerCamp: 'Summer Camp takes place during the third-term long break, after the second week of the holiday, and runs for three weeks.'
    };

    const elapsedYears = () => {
        const [year, month, day] = config.foundingDate.split('-').map(Number);
        const now = new Date();
        return now.getFullYear() - year - (
            now.getMonth() + 1 < month ||
            (now.getMonth() + 1 === month && now.getDate() < day) ? 1 : 0
        );
    };

    config.seasonForDate = (date = new Date()) => {
        const month = date.getMonth();
        const day = date.getDate();

        if ((month === 10 && day >= 25) || month === 11 || (month === 0 && day <= 10)) return 'festive';
        return 'normal';
    };

    config.yearsOfExcellence = () => `${elapsedYears()}+`;
    window.TES_SITE_CONFIG = config;
})();
