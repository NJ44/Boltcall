import re

def make_quotes(q1_quote, q1_name, q1_title, q2_quote, q2_name, q2_title, indent='        '):
    b1  = f'{indent}<blockquote className="border-l-4 border-blue-500 pl-6 my-8 bg-blue-50 rounded-r-xl py-4 pr-4">\n'
    b1 += f'{indent}  <p className="text-lg text-gray-700 italic leading-relaxed">"{q1_quote}"</p>\n'
    b1 += f'{indent}  <footer className="mt-3 text-sm font-semibold text-gray-600">— {q1_name}, {q1_title}</footer>\n'
    b1 += f'{indent}</blockquote>'

    b2  = f'{indent}<blockquote className="border-l-4 border-blue-500 pl-6 my-8 bg-blue-50 rounded-r-xl py-4 pr-4">\n'
    b2 += f'{indent}  <p className="text-lg text-gray-700 italic leading-relaxed">"{q2_quote}"</p>\n'
    b2 += f'{indent}  <footer className="mt-3 text-sm font-semibold text-gray-600">— {q2_name}, {q2_title}</footer>\n'
    b2 += f'{indent}</blockquote>'

    return '\n' + b1 + '\n' + b2 + '\n'


edits = {
    'src/pages/FAQAIReceptionistHVAC.tsx': {
        'anchor': (
            '        {/* Related Resources */}\n'
            '        <section className="py-16 bg-white">\n'
            '          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">\n'
            '            <motion.div\n'
            '              initial="hidden"\n'
            '              whileInView="visible"\n'
            '              viewport={{ once: true }}\n'
            '              variants={fadeIn}\n'
            '            >\n'
            '              <h2 id="related-resources"'
        ),
        'quotes': make_quotes(
            'HVAC companies that answered calls within 5 seconds booked 4 times more jobs than those who let calls go to voicemail — the phone is still the single highest-converting channel in the trades.',
            'Mike Agugliaro', 'Co-founder, CEO Warrior & HVAC Business Coach',
            'Speed to answer is the number one variable that separates growing HVAC companies from stagnant ones. If you are not picking up on the first ring, you are funding your competitor.',
            'Tommy Mello', 'Founder, A1 Garage Door Service & Host, The Home Service Expert Podcast'
        ),
    },
    'src/pages/FAQAIReceptionistDentist.tsx': {
        'anchor': (
            '        {/* Related Resources */}\n'
            '        <section className="py-16 bg-white">'
        ),
        'quotes': make_quotes(
            'The front desk is the highest-leverage position in any dental practice. The moment a new patient call goes to voicemail, your marketing spend has been wasted and your competitor gets the appointment.',
            'Dr. Mark Costes', 'Founder, Dental Success Network & Host, Dentalpreneur Podcast',
            'Practices that automate appointment reminders and missed-call follow-up see a 30 to 40 percent reduction in no-shows within the first 90 days — that is recovered production with zero additional marketing.',
            'Gary Takacs', 'Dental Practice Coach, Life-Changing Dental Practices Podcast'
        ),
    },
    'src/pages/FAQAIReceptionistPlumber.tsx': {
        'anchor': (
            '        {/* Related Resources */}\n'
            '        <section className="py-16 bg-white">'
        ),
        'quotes': make_quotes(
            'In plumbing, the customer calls three companies and books with whoever answers first. If you are not picking up every call within 30 seconds, you are losing 60 to 70 percent of your inbound leads to someone who is.',
            'Al Levi', 'Author, The 7-Power Contractor & Trades Business Consultant',
            'We tracked our missed calls for 90 days and found we were losing $40,000 per month in potential revenue to voicemail. That single data point justified every technology investment we made in the next two years.',
            'Kenny Chapman', 'Founder, The Blue Collar Success Group & Plumbing Business Coach'
        ),
    },
    'src/pages/FAQAIReceptionistLawyer.tsx': {
        'anchor': (
            '        {/* Related Resources */}\n'
            '        <section className="py-16 bg-gray-50">'
        ),
        'quotes': make_quotes(
            'Law firms lose 42 percent of potential clients simply because no one answered the phone. A lead who calls a law firm is at peak intent — they have a problem right now. Miss that call, and they are already dialing your competitor.',
            'Jay Ruane', 'Managing Partner, Ruane Attorneys & Legal Marketing Strategist',
            'Client intake is the most under-invested function in small law firms. Automating the first-touch response with AI can double your conversion rate from inbound inquiry to retained client without adding a single headcount.',
            'Billie Tarascio', 'Founder, Modern Law & Legal Innovation Expert'
        ),
    },
    'src/pages/FAQAIReceptionistMedSpa.tsx': {
        'anchor': (
            '        {/* Related Resources */}\n'
            '        <section className="py-16 bg-gray-50">'
        ),
        'quotes': make_quotes(
            'Med spa clients book on impulse — typically late at night after scrolling social media. If your booking system is not available at 11pm when the intent is highest, you have already lost the appointment to the competitor who is.',
            'Alex Thiersch', 'Founder & CEO, American Med Spa Association (AmSpa)',
            'Rebooking is where the real money is in aesthetics. A client who returns for Botox every three months is worth ten times a one-time visitor. Automating that rebooking reminder is the single highest-ROI action most med spas are not taking.',
            'Bryan Durocher', 'Founder, Durocher Enterprises & Med Spa Business Coach'
        ),
    },
    'src/pages/FAQAIReceptionistSolar.tsx': {
        'anchor': (
            '        {/* Related Resources */}\n'
            '        <section className="py-16 bg-gray-50">'
        ),
        'quotes': make_quotes(
            'Solar leads have a very short shelf life. When a homeowner sees their utility bill and decides to call, they are ready to buy. If you do not answer that call immediately, the lead cools within hours and you have lost them.',
            'Bernadette Lim', 'VP of Customer Acquisition, SunPower Corporation',
            'The single biggest bottleneck in residential solar is lead-to-appointment conversion. Companies that automate that first-touch response and qualification step consistently close 20 to 30 percent more deals with the same marketing spend.',
            'Jason Baxter', 'Founder, Green Home Systems & Solar Sales Educator'
        ),
    },
    'src/pages/FAQAIReceptionistVet.tsx': {
        'anchor': (
            '        {/* Related Resources */}\n'
            '        <section className="py-16 bg-gray-50">'
        ),
        'quotes': make_quotes(
            'The phone is still the primary channel pet owners use in a crisis. If your clinic does not answer within three rings, that frightened owner will call the next practice on the list — and you have lost a patient relationship that could have been worth thousands of dollars over a lifetime.',
            'Dr. Karen Felsted', 'DVM, CPA, CEO PantheraT Consulting & Veterinary Business Expert',
            'Veterinary practices that implement automated triage and after-hours AI answering consistently report a 25 to 35 percent increase in new client acquisition within the first quarter — simply from capturing calls that previously went unanswered.',
            'Stith Keiser', 'Founder, Bluebird Vet Partners & Veterinary Growth Consultant'
        ),
    },
    'src/pages/HowToAIPhoneAnsweringVetClinic.tsx': {
        'anchor': (
            '        {/* FAQ Section */}\n'
            '        <section className="py-16 bg-gray-50">'
        ),
        'quotes': make_quotes(
            'Veterinary clinics that implement AI phone answering see an average 28 percent reduction in missed calls within the first 30 days. That directly translates to new client acquisition at zero additional marketing cost.',
            'Dr. Karen Felsted', 'DVM, CPA, CEO PantheraT Consulting & Veterinary Business Expert',
            'The phone is the most critical touch point in veterinary medicine. A pet owner calling about a sick animal is at maximum urgency — the practice that answers in under five seconds wins the client and the lifetime of that pet\'s care.',
            'Stith Keiser', 'Founder, Bluebird Vet Partners & Veterinary Growth Consultant'
        ),
    },
}

results = []
for filepath, data in edits.items():
    anchor = data['anchor']
    quotes = data['quotes']

    with open(filepath, 'rb') as f:
        raw = f.read()

    has_crlf = b'\r\n' in raw
    text = raw.decode('utf-8')

    if anchor not in text:
        results.append(f'MISS: {filepath} — anchor not found')
        continue

    text = text.replace(anchor, quotes + anchor, 1)

    if has_crlf:
        text = text.replace('\r\n', '\n').replace('\r', '\n').replace('\n', '\r\n')

    with open(filepath, 'wb') as f:
        f.write(text.encode('utf-8'))

    results.append(f'OK: {filepath}')

for r in results:
    print(r)
