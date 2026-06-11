import fs from 'fs';

const classWiseIds: Record<string, string[]> = {
    'Play': ['727', '728', '730', '731', '734', '735', '736', '737', '739', '740', '742', '744', '746', '748', '738', '741', '745', '751', '755', '756', '757', '758', '760', '761', '763', '768', '773', '775', '779', '787', '788', '789', '791', '794', '795', '797', '798', '799', '800', '823', '824', '825', '826', '827', '828', '829', '832', '830', '831', '856'],
    'Nursery': ['506', '509', '510', '518', '522', '526', '538', '541', '543', '544', '546', '552', '556', '558', '570', '576', '578', '624', '625', '626', '638', '720', '516', '592', '573', '594', '609', '628', '630', '636', '643', '652', '660', '676', '657', '686', '687', '708', '697', '704', '709', '721', '722', '752', '766', '776', '719', '729', '767', '784', '801', '802', '806', '817', '818', '833', '834', '835', '836', '837', '838', '855', '863'],
    'One': ['343', '347', '356', '362', '367', '369', '375', '383', '388', '398', '399', '463', '468', '525', '513', '517', '712', '536', '557', '565', '582', '587', '616', '593', '601', '617', '621', '622', '619', '647', '658', '669', '674', '683', '684', '688', '689', '713', '714', '772', '777', '778', '785', '790', '793', '807', '819', '821', '853', '854', '859', '864'],
    'Two': ['32', '35', '37', '38', '39', '40', '42', '45', '46', '47', '49', '88', '423', '409', '51', '421', '426', '441', '442', '495', '500', '595', '600', '613', '690', '717', '723', '750', '803', '770', '786', '816', '839', '840', '860', '865'],
    'Three': ['54', '55', '56', '57', '63', '64', '68', '69', '81', '422', '70', '82', '87', '72', '71', '74', '574', '410', '65', '503', '527', '607', '615', '655', '691', '692', '705', '732', '733', '747', '759', '841', '771', '792'],
    'Four': ['61', '66', '91', '92', '99', '94', '97', '104', '109', '110', '111', '114', '116', '117', '138', '128', '139', '502', '58', '661', '662', '663', '107', '338', '112', '118', '119', '121', '124', '131', '132', '145', '127', '142', '461', '482', '511', '530', '554', '567', '575', '103', '125', '141', '665', '678', '716', '780', '804', '815'],
    'Five': ['150', '152', '153', '154', '158', '162', '155', '157', '160', '161', '163', '164', '168', '169', '175', '178', '180', '411', '478', '484', '539', '555', '560', '568', '571', '579', '659', '724', '443', '653', '682', '781', '782', '813', '814', '843'],
    'Six': ['174', '191', '192', '193', '194', '195', '196', '203', '474', '197', '200', '204', '207', '187', '188', '561', '562', '580', '583', '599', '654', '675', '754', '762', '769', '774', '796', '805', '811', '812', '849', '850', '851', '852', '861'],
    'Seven': ['337', '371', '210', '211', '218', '221', '223', '412', '440', '524', '431', '186', '498', '528', '540', '549', '529', '551', '569', '585', '590', '603', '633', '645', '208', '672', '725', '749', '810', '845', '846', '847', '848'],
    'Eight': ['341', '359', '361', '389', '227', '229', '231', '241', '244', '249', '237', '240', '242', '243', '247', '248', '251', '253', '256', '406', '535', '610', '670', '764', '765', '862', '783', '809'],
    'Nine': ['342', '363', '257', '258', '259', '261', '263', '264', '265', '266', '269', '270', '271', '235', '413', '453', '272', '273', '274', '275', '278', '280', '282', '284', '285', '287', '288', '289', '290', '292', '598', '679', '693', '694', '700', '743', '753', '808', '866'],
    'Ten': ['293', '296', '297', '299', '300', '302', '301', '305', '309', '311', '313', '315', '473', '499', '298', '303', '295', '307', '418', '586', '611', '641', '651', '698', '844', '858', '671', '857']
};

const allAllowedIds = new Set<string>();
for (const classGrp in classWiseIds) {
    classWiseIds[classGrp].forEach(id => allAllowedIds.add(id.trim()));
}

async function generate() {
    let sqlOutput = `/* Import Script for Students */\n`;
    sqlOutput += `/* By running this in your Supabase SQL Editor, you bypass all RLS policies */\n\n`;
    sqlOutput += `DELETE FROM public.students;\n\n`;
    
    // Create a map from studentId to CSV data for quick lookup
    const csvData = fs.readFileSync('full_database.csv', 'utf-8');
    const lines = csvData.split('\n');
    const studentDataMap = new Map<string, string[]>();
    
    for (let i = 1; i < lines.length; i++) {
        const line = lines[i].trim();
        if (!line) continue;
        
        let cols: string[] = [];
        let inQuotes = false;
        let currentField = '';
        for (let j = 0; j < line.length; j++) {
            const char = line[j];
            if (char === '"') {
                inQuotes = !inQuotes;
            } else if (char === ',' && !inQuotes) {
                cols.push(currentField);
                currentField = '';
            } else {
                currentField += char;
            }
        }
        cols.push(currentField);
        
        const rawId = cols[1]?.trim();
        if (rawId) {
            studentDataMap.set(rawId, cols);
        }
    }

    let importedCount = 0;

    // Loop through the classWiseIds array to maintain the exact serial order
    for (const cls in classWiseIds) {
        const ids = classWiseIds[cls];
        for (let k = 0; k < ids.length; k++) {
            const studentId = ids[k].trim();
            const cols = studentDataMap.get(studentId);
            
            if (!cols) {
                console.log(`Warning: Student ID ${studentId} not found in CSV.`);
                continue;
            }

            importedCount++;
            const studentName = cols[2]?.trim() || '';
            const name_bn = cols[3]?.trim() || '';
            const roll = (k + 1).toString();
            const group = '';
            const phone = '';
            const father_name = cols[8]?.trim() || '';
            const mother_name = cols[10]?.trim() || '';
            const dob = '';
            const section = cols[6]?.trim() || '';

            let studentClassRaw = cols[5]?.trim() || '';
            let studentClass = cls;
            
            if (studentClassRaw.toLowerCase().includes('morning') || studentClassRaw.toLowerCase().includes('প্রভাতি')) {
                studentClass += " (Morning)";
            } else if (studentClassRaw.toLowerCase().includes('day') || studentClassRaw.toLowerCase().includes('দিবা')) {
                studentClass += " (Day)";
            }
            
            const folderName = studentClass.replace(/[^a-zA-Z0-9]/g, '');
            const photo_url = `https://mawewinuluacryowgbdu.supabase.co/storage/v1/object/public/student-photos/${folderName}/${studentId}.jpg`;
            
            const escapeSql = (str: string) => str ? "'" + str.replace(/'/g, "''") + "'" : "NULL";

            // Insert command
            sqlOutput += `INSERT INTO public.students ("name", "studentId", "studentClass", "roll", "name_bn", "father_name", "mother_name", "dob", "study_group", "section", "photo_url")`;
            sqlOutput += ` VALUES (${escapeSql(studentName)}, ${escapeSql(studentId)}, ${escapeSql(studentClass)}, ${escapeSql(roll)}, ${escapeSql(name_bn)}, ${escapeSql(father_name)}, ${escapeSql(mother_name)}, ${escapeSql(dob)}, ${escapeSql(group)}, ${escapeSql(section)}, ${escapeSql(photo_url)});\n`;
        }
    }
    
    fs.writeFileSync('import_students.sql', sqlOutput);
    console.log(`Successfully generated import_students.sql with ${importedCount} statements.`);
}

generate().catch(console.error);
