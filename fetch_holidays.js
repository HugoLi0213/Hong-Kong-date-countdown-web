const https = require('https');
const fs = require('fs');

const fetchUrl = (url) => {
    return new Promise((resolve, reject) => {
        https.get(url, (res) => {
            let data = '';
            res.on('data', (chunk) => {
                data += chunk;
            });
            res.on('end', () => {
                try {
                    resolve(JSON.parse(data));
                } catch (e) {
                    reject(e);
                }
            });
        }).on('error', (err) => {
            reject(err);
        });
    });
};

const formatDateEn = (dateStr) => {
    // dateStr is YYYYMMDD
    const year = dateStr.substring(0, 4);
    const month = parseInt(dateStr.substring(4, 6)) - 1; // 0-indexed
    const day = parseInt(dateStr.substring(6, 8));
    const date = new Date(year, month, day);
    return date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
};

const formatDateZh = (dateStr) => {
    const year = dateStr.substring(0, 4);
    const month = parseInt(dateStr.substring(4, 6));
    const day = parseInt(dateStr.substring(6, 8));
    return `${year}年${month}月${day}日`;
};

async function main() {
    try {
        console.log('Fetching data...');
        const enData = await fetchUrl('https://www.1823.gov.hk/common/ical/en.json');
        const zhData = await fetchUrl('https://www.1823.gov.hk/common/ical/tc.json');

        const enEvents = enData.vcalendar[0].vevent;
        const zhEvents = zhData.vcalendar[0].vevent;

        // Filter for 2026
        const year = '2026';
        const enEvents2026 = enEvents.filter(e => e.dtstart[0].startsWith(year));
        
        // Match zh events by date (dtstart)
        // Note: The structure might have slight differences or different order, so matching by date is safest if UIDs differ.
        // Let's assume date is unique enough for holidays.
        
        const datesArray = [];
        const translationsEnEvents = {};
        const translationsZhEvents = {};
        const translationsEnDates = {};
        const translationsZhDates = {};

        enEvents2026.forEach(enEvent => {
            const dateStr = enEvent.dtstart[0];
            const zhEvent = zhEvents.find(z => z.dtstart[0] === dateStr);
            
            if (!zhEvent) {
                console.warn(`No matching Chinese event for ${enEvent.summary} on ${dateStr}`);
                return;
            }

            const enName = enEvent.summary;
            const zhName = zhEvent.summary;
            const formattedDateEn = formatDateEn(dateStr);
            const formattedDateZh = formatDateZh(dateStr);

            datesArray.push({ event: enName, date: formattedDateEn });

            translationsEnEvents[enName] = enName;
            translationsZhEvents[enName] = zhName;
            
            translationsEnDates[formattedDateEn] = formattedDateEn;
            translationsZhDates[formattedDateEn] = formattedDateZh;
        });

        // Sort by date
        datesArray.sort((a, b) => new Date(a.date) - new Date(b.date));

        const output = {
            dates: datesArray,
            translations: {
                en: {
                    events: translationsEnEvents,
                    dates: translationsEnDates
                },
                zh: {
                    events: translationsZhEvents,
                    dates: translationsZhDates
                }
            }
        };

        fs.writeFileSync('calendar_2026_data.json', JSON.stringify(output, null, 2));
        console.log('Data saved to calendar_2026_data.json');

    } catch (error) {
        console.error('Error:', error);
    }
}

main();
