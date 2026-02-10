let noButtonDodgeCount = 0;
const maxDodges = 30; // Bisa dikurangi jadi 15-20 biar cepat rejected

let hasDodged = false; // Flag global: setelah dodge pertama, blokir klik permanen sementara

const noButtons = document.querySelectorAll('.btn.no');

function nextQuestion(accepted, questionNumber) {
    if (accepted) {
        document.querySelector(`#q${questionNumber}`).classList.remove('active');
        if (questionNumber < 3) {
            document.querySelector(`#q${questionNumber + 1}`).classList.add('active');
        } else {
            document.querySelector('#final').classList.add('active');
            celebrateAcceptance();
        }
    }
}

function handleNo() {
    // Hanya jalankan rejected kalau sudah capai limit dodge
    if (noButtonDodgeCount >= maxDodges) {
        document.querySelectorAll('.question').forEach(q => q.classList.remove('active'));
        document.querySelector('#rejected').classList.add('active');
        document.querySelector('.heart')?.style.display = 'none';
        document.querySelector('.broken-heart')?.style.display = 'block';
    }
    // Kalau berhasil klik No sebelum limit → abaikan atau kasih pesan
    // alert("Yah... tapi coba lagi yuk? 😏"); // Optional
}

function dodgeButton(event) {
    if (noButtonDodgeCount >= maxDodges) return;

    // Blokir default di touch agar tidak langsung click
    if (event.type.startsWith('touch')) {
        event.preventDefault();
    }

    let clientX, clientY;
    if (event.type.startsWith('touch')) {
        if (event.touches.length === 0) return;
        clientX = event.touches[0].clientX;
        clientY = event.touches[0].clientY;
    } else {
        clientX = event.clientX;
        clientY = event.clientY;
    }

    noButtons.forEach(btn => {
        const rect = btn.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        const distance = Math.hypot(clientX - centerX, clientY - centerY);

        if (distance < 100) {  // Sesuaikan radius dodge (100-140px)
            hasDodged = true; // Set flag: sekarang blokir klik

            const angle = Math.atan2(clientY - centerY, clientX - centerX);
            const dodgeDist = 180 + Math.random() * 100;

            let newX = centerX - Math.cos(angle) * dodgeDist;
            let newY = centerY - Math.sin(angle) * dodgeDist;

            newX = Math.max(20, Math.min(window.innerWidth - rect.width - 20, newX));
            newY = Math.max(20, Math.min(window.innerHeight - rect.height - 80, newY));

            btn.style.position = 'fixed';
            btn.style.left = `${newX}px`;
            btn.style.top = `${newY}px`;
            btn.style.transform = 'scale(1.12) rotate(5deg)'; // Efek lucu tambahan

            noButtonDodgeCount++;
            console.log(`Dodge #${noButtonDodgeCount}`);

            if (noButtonDodgeCount >= maxDodges) {
                handleNo();
            }
        }
    });
}

// Blokir klik/tap setelah dodge atau selama touch
function blockClick(event) {
    if (hasDodged || noButtonDodgeCount > 0) {
        event.preventDefault();
        event.stopPropagation();
        return false;
    }
}

document.addEventListener('DOMContentLoaded', () => {
    // Dodge events
    document.addEventListener('mousemove', dodgeButton);
    document.addEventListener('touchmove', dodgeButton, { passive: false });
    document.addEventListener('touchstart', dodgeButton, { passive: false });

    // Blokir klik pada tombol No
    noButtons.forEach(btn => {
        btn.addEventListener('click', blockClick);
        btn.addEventListener('touchend', blockClick, { passive: false });
        btn.addEventListener('mouseup', blockClick);
    });

    // Reset flag saat reset questions
    window.addEventListener('resetQuestionsCustom', () => {
        hasDodged = false;
    });
});

function resetQuestions() {
    document.querySelectorAll('.question').forEach(q => q.classList.remove('active'));
    document.querySelector('#q1').classList.add('active');
    document.querySelector('.heart').style.display = 'block';
    document.querySelector('.broken-heart').style.display = 'none';
    noButtonDodgeCount = 0;
    hasDodged = false;

    noButtons.forEach(btn => {
        btn.style.position = '';
        btn.style.left = '';
        btn.style.top = '';
        btn.style.transform = '';
    });

    // Trigger custom event kalau perlu
    window.dispatchEvent(new Event('resetQuestionsCustom'));
}

// celebrateAcceptance dan createHeart tetap sama seperti sebelumnya
// ... (copy paste dari kode asli kamu)
