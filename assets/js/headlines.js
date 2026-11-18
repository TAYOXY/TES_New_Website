(() => {
    const schoolEvents = [
        { date: "2026-09-14", label: "Resumption", color: "#d7b15d", href: "news-and-events.html#academic-calendar" },
        { date: "2026-10-01", label: "Independence Day", color: "#d7b15d", href: "news-and-events.html#academic-calendar" },
        { date: "2026-10-05", label: "World Teachers Day", color: "#d7b15d", href: "news-and-events.html#academic-calendar" },
        { date: "2026-10-08", label: "First Assessment Test", color: "#fbbf24", href: "news-and-events.html#academic-calendar" },
        { date: "2026-10-22", label: "Mid-Term Test", color: "#fbbf24", href: "news-and-events.html#academic-calendar" },
        { date: "2026-10-28", label: "Open House", color: "#d7b15d", href: "news-and-events.html#academic-calendar" },
        { date: "2026-10-29", label: "Mid-Term Break", color: "#fcd34d", href: "news-and-events.html#academic-calendar" },
        { date: "2026-11-10", label: "World Science Day", color: "#d7b15d", href: "news-and-events.html#academic-calendar" },
        { date: "2026-11-23", label: "Revision", color: "#fbbf24", href: "news-and-events.html#academic-calendar" },
        { date: "2026-11-26", label: "Examination", color: "#fbbf24", href: "news-and-events.html#academic-calendar" },
        { date: "2026-12-03", label: "World Disability Day", color: "#d7b15d", href: "news-and-events.html#academic-calendar" },
        { date: "2026-12-09", label: "End-of-Year Party & Vacation", color: "#d7b15d", href: "news-and-events.html#academic-calendar" },
    ];

    const fallbackHighlights = [
        { date: "2026-11-03", label: "Prefects Revealed", color: "#d7b15d", href: "news-and-events.html#prefects" },
        { date: "2026-11-05", label: "Inter-house Sports Gallery", color: "#d7b15d", href: "news-and-events.html#inter-house-sports" },
        { date: "2026-11-08", label: "Admissions Update", color: "#e2c98a", href: "admissions.html" }
    ];

    const getUpcomingEvents = (count = 2, maxDays = 45) => {
        const now = new Date();
        const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        const candidates = [...schoolEvents, ...fallbackHighlights];
        const upcoming = candidates
            .map((event) => {
                const eventDate = new Date(event.date);
                const diffDays = Math.ceil((eventDate - today) / (1000 * 60 * 60 * 24));
                return { ...event, eventDate, diffDays };
            })
            .filter((event) => event.diffDays >= 0 && event.diffDays <= maxDays)
            .sort((a, b) => a.diffDays - b.diffDays)
            .slice(0, count);

        if (upcoming.length) {
            return upcoming;
        }

        return candidates
            .map((event) => {
                const eventDate = new Date(event.date);
                const diffDays = Math.ceil((eventDate - today) / (1000 * 60 * 60 * 24));
                return { ...event, eventDate, diffDays };
            })
            .sort((a, b) => a.diffDays - b.diffDays)
            .slice(0, count);
    };

    const formatDate = (dateStr) => {
        const date = new Date(dateStr);
        return date.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" });
    };

    const addHeadlines = () => {
        const upcomingEvents = getUpcomingEvents(2, 45);
        let headlines = document.querySelector(".headlines-bar");
        if (!headlines) {
            headlines = document.createElement("aside");
            headlines.className = "headlines-bar";
            headlines.setAttribute("aria-label", "Latest school headlines");
        }

        const valuesLink = `<a href="our-programs.html" class="headline-link value-link" style="color:#e2c98a">
            <span class="headline-badge">Our Vision</span>
            <span class="headline-text">CREATIVITY, DIVERSITY & INNOVATION</span>
            <i class="fas fa-arrow-right ml-2 text-xs"></i>
        </a>`;

        const eventsLabel = `<span class="headline-events-label">Upcoming events</span>`;

        const eventLinks = upcomingEvents.map((event, index) => `
            <a href="${event.href}" ${index > 0 ? 'tabindex="-1"' : ''} class="headline-link event-link" style="color:${event.color}">
                <span class="headline-badge">${formatDate(event.date)}</span>
                <span class="headline-text">${event.label}</span>
                <i class="fas fa-arrow-right ml-2 text-xs"></i>
            </a>
        `).join("");

        const allLinks = valuesLink + eventsLabel + eventLinks;

        // Duplicate content for seamless infinite scrolling
        const duplicatedLinks = allLinks + allLinks;

headlines.innerHTML = `
        <div class="headlines-inner min-w-0">
            <div class="headlines-window min-w-0 overflow-hidden py-3">
                <div class="headlines-track">
                    <div class="headlines-group">
                        ${duplicatedLinks}
                    </div>
                </div>
            </div>
        </div>`;

        const navigation = document.querySelector("body > nav");
        if (navigation) {
            if (headlines.nextElementSibling !== navigation) {
                navigation.before(headlines);
            }
            navigation.classList.add("headlines-nav-offset");
            const updateNavigationOffset = () => {
                const height = `${headlines.getBoundingClientRect().height}px`;
                navigation.style.setProperty("--headlines-height", height);
                document.documentElement.style.setProperty("--headlines-height", height);
            };
            updateNavigationOffset();
            if ("ResizeObserver" in window) {
                new ResizeObserver(updateNavigationOffset).observe(headlines);
            } else {
                window.addEventListener("resize", updateNavigationOffset);
            }
        } else {
            if (!headlines.isConnected) {
                document.body.prepend(headlines);
            }
        }
    };

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", addHeadlines, { once: true });
    } else {
        addHeadlines();
    }
})();
