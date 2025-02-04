let currentPage = 1;
const recordsPerPage = 10; // จำนวนรายการต่อหน้า

// ฟังก์ชันโหลดประเภทสัตว์เลี้ยงจาก LocalStorage
function loadPetTypes() {
    let petTypes = JSON.parse(localStorage.getItem('petTypes'));

    // console.log(petTypes);


    if (!petTypes || (Array.isArray(petTypes) && petTypes.length === 0)) {
        petTypes = ['สุนัข', 'แมว', 'นก', 'อื่นๆ'];
        localStorage.setItem('petTypes', JSON.stringify(petTypes));
    }

    return petTypes;
}


// ฟังก์ชันเพิ่มประเภทสัตว์เลี้ยง
function addPetType() {
    const newPetType = document.getElementById('newPetType').value.trim();
    if (newPetType) {
        const petTypes = loadPetTypes();
        if (!petTypes.includes(newPetType)) {
            petTypes.push(newPetType);
            localStorage.setItem('petTypes', JSON.stringify(petTypes));
            updatePetTypeSelectors();
            displayPetTypeList();
            document.getElementById('newPetType').value = ''; // ล้าง input
        } else {
            alert('ประเภทนี้มีอยู่แล้ว!');
        }
    } else {
        alert('กรุณากรอกประเภทสัตว์เลี้ยง');
    }
}

// อัปเดต `<select>` ทั้งหมดด้วยประเภทสัตว์เลี้ยง
function updatePetTypeSelectors() {
    const petTypes = loadPetTypes();
    const petTypeSelect = document.getElementById('petType');
    const filterPetTypeSelect = document.getElementById('filterPetType');

    // ล้าง options เดิม
    petTypeSelect.innerHTML = '';
    filterPetTypeSelect.innerHTML = '<option value="ทั้งหมด">ทั้งหมด</option>';

    // เพิ่ม options ใหม่
    petTypes.forEach(type => {
        const option = document.createElement('option');
        option.value = type;
        option.textContent = type;
        petTypeSelect.appendChild(option);

        const filterOption = document.createElement('option');
        filterOption.value = type;
        filterOption.textContent = type;
        filterPetTypeSelect.appendChild(filterOption);
    });
}

// ฟังก์ชันแสดงรายการประเภทสัตว์เลี้ยง
function displayPetTypeList() {
    const petTypes = loadPetTypes();
    const petTypeList = document.getElementById('petTypeList');
    petTypeList.innerHTML = ''; // เคลียร์ข้อมูลก่อนอัปเดตใหม่

    petTypes.forEach((type, index) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${index + 1}</td>
            <td>${type}</td>
            <td>
                <button onclick="deletePetType(${index})" class="delete-btn">ลบ</button>
            </td>
        `;
        petTypeList.appendChild(row);
    });
}

// ฟังก์ชันลบประเภทสัตว์เลี้ยง
function deletePetType(index) {
    const petTypes = loadPetTypes();
    petTypes.splice(index, 1);
    localStorage.setItem('petTypes', JSON.stringify(petTypes));
    updatePetTypeSelectors();
    displayPetTypeList(); // อัปเดตรายการประเภทสัตว์เลี้ยง
}

// บันทึกการดูแลสัตว์เลี้ยง
document.getElementById('petForm').addEventListener('submit', function (event) {
    event.preventDefault();

    const petName = document.getElementById('petName').value;
    const petType = document.getElementById('petType').value;
    const careDate = document.getElementById('careDate').value;
    const careDescription = document.getElementById('careDescription').value;

    const petRecord = {
        petName,
        petType,
        careDate,
        careDescription
    };

    savePetRecord(petRecord);
    displayPetRecords(currentPage); // แสดงข้อมูลหน้าแรกหลังจากบันทึก
    document.getElementById('petForm').reset();
});

function savePetRecord(record) {
    let records = JSON.parse(localStorage.getItem('petRecords')) || [];
    records.push(record);
    localStorage.setItem('petRecords', JSON.stringify(records));
}

function displayPetRecords(page) {
    const records = JSON.parse(localStorage.getItem('petRecords')) || [];
    const filterPetType = document.getElementById('filterPetType').value;

    // กรองข้อมูลตามประเภทสัตว์เลี้ยง
    const filteredRecords = filterPetType === 'ทั้งหมด'
        ? records
        : records.filter(record => record.petType === filterPetType);

    const recordsList = document.getElementById('petRecords');
    recordsList.innerHTML = '';

    const startIndex = (page - 1) * recordsPerPage;
    const endIndex = startIndex + recordsPerPage;
    const paginatedRecords = filteredRecords.slice(startIndex, endIndex);

    paginatedRecords.forEach((record, index) => {
        const li = document.createElement('li');
        li.innerHTML = `
            <strong>ชื่อสัตว์เลี้ยง:</strong> ${record.petName}<br>
            <strong>ประเภทสัตว์เลี้ยง:</strong> ${record.petType}<br>
            <strong>วันที่:</strong> ${record.careDate}<br>
            <strong>รายละเอียดการดูแล:</strong> ${record.careDescription}<br>
            <button onclick="deleteRecord(${startIndex + index})">ลบ</button>
        `;
        recordsList.appendChild(li);
    });

    updatePagination(filteredRecords.length, page);
}

function updatePagination(totalRecords, currentPage) {
    const totalPages = Math.ceil(totalRecords / recordsPerPage);
    const pageInfo = document.getElementById('pageInfo');
    pageInfo.textContent = `หน้า ${currentPage} จาก ${totalPages}`;

    const prevButton = document.getElementById('prevPage');
    const nextButton = document.getElementById('nextPage');

    prevButton.disabled = currentPage === 1;
    nextButton.disabled = currentPage === totalPages;
}

function deleteRecord(index) {
    let records = JSON.parse(localStorage.getItem('petRecords')) || [];
    records.splice(index, 1);
    localStorage.setItem('petRecords', JSON.stringify(records));
    displayPetRecords(currentPage);
}

// การจัดการปุ่มแบ่งหน้า
document.getElementById('prevPage').addEventListener('click', () => {
    if (currentPage > 1) {
        currentPage--;
        displayPetRecords(currentPage);
    }
});

document.getElementById('nextPage').addEventListener('click', () => {
    const totalRecords = JSON.parse(localStorage.getItem('petRecords'))?.length || 0;
    const totalPages = Math.ceil(totalRecords / recordsPerPage);
    if (currentPage < totalPages) {
        currentPage++;
        displayPetRecords(currentPage);
    }
});

// การกรองข้อมูลตามประเภทสัตว์เลี้ยง
document.getElementById('filterPetType').addEventListener('change', () => {
    currentPage = 1; // รีเซ็ตไปที่หน้าแรกเมื่อเปลี่ยนประเภท
    displayPetRecords(currentPage);
});

// แสดงบันทึกแรกเมื่อโหลดหน้า
updatePetTypeSelectors();
displayPetTypeList();
displayPetRecords(currentPage);
