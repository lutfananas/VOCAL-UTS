// ============================================================
// SOAL UJIAN SPEAKING CBT - Bahasa Inggris Bisnis (UTW2002)
// UTS 2026/2027 Semester Ganjil - FISIP S1 Administrasi Publik
// Prof. Dr. Dwi Ima H, M.Hum
// ============================================================
// Total: 6 Sections, 100 Points, ~35 Menit
// Soal dikonversi dari soal tertulis menjadi speaking exam
// dengan format CBT yang komprehensif & detil.
// ============================================================

export type QuestionType =
  | "READ_ALOUD"        // Membaca teks dengan intonasi tepat
  | "PICTURE_DESC"      // Mendeskripsikan situasi/gambar
  | "ROLE_PLAY"         // Role-play dengan audio prompt
  | "SPOKEN_RESPONSE"   // Respon lisan atas pertanyaan/skenario
  | "FORMAL_REGISTER"   // Mengubah kalimat informal -> formal secara lisan
  | "OPINION_SPEAKING"; // Memberikan opini terstruktur

export interface SpeakingQuestion {
  id: string;
  sectionNumber: number;
  sectionTitle: string;
  type: QuestionType;
  title: string;
  scenario: string;          // Konteks situasi
  instruction: string;       // Instruksi kepada peserta
  preparationTimeSec: number; // Waktu membaca soal sebelum rekam
  recordingTimeSec: number;   // Maksimum durasi rekaman
  minDurationSec: number;     // Minimum durasi rekaman
  points: number;
  evaluationCriteria: string[]; // Kriteria penilaian
  tips: string[];              // Tips pengerjaan
  // Untuk READ_ALOUD: teks yang harus dibaca
  readingText?: string;
  // Untuk ROLE_PLAY: audio/skenario prompt
  promptText?: string;
  // Untuk FORMAL_REGISTER: kalimat informal yang harus diubah
  informalSentences?: string[];
  // Pertanyaan panduan untuk peserta
  guidingQuestions?: string[];
}

export const EXAM_META = {
  title: "UJIAN TENGAH SEMESTER (UTS) - SPEAKING CBT",
  academicYear: "2026/2027",
  semester: "Ganjil",
  courseCode: "UTW2002",
  courseName: "Bahasa Inggris Bisnis",
  programStudy: "S1 Administrasi Publik",
  faculty: "FISIP",
  examiner: "Prof. Dr. Dwi Ima Herminingsih, M.Hum",
  totalDurationMin: 35,
  totalPoints: 100,
  totalQuestions: 6,
  instructions: [
    "Ujian speaking ini terdiri dari 6 section dengan total 100 poin. Setiap section memiliki alokasi waktu tersendiri.",
    "Pastikan Anda menggunakan headset/mikrofon yang berfungsi baik dan berada di ruangan yang tenang.",
    "Setiap soal memiliki waktu preparation (membaca) sebelum Anda mulai merekam jawaban.",
    "Anda dapat melakukan RE-RECORD maksimal 2 kali per soal jika hasil rekaman belum optimal.",
    "Bicara dengan jelas, gunakan intonasi yang tepat, dan pastikan jawaban Anda memenuhi minimum durasi yang ditentukan.",
    "Dilarang membuka kamus, catatan, atau tab/aplikasi lain selama ujian berlangsung.",
    "Sistem akan otomatis menyimpan rekaman Anda. Jangan tutup browser sebelum semua soal selesai dan Anda menekan tombol Submit.",
    "Jika ada kendala teknis, segera hubungi pengawas/dosen sebelum menutup browser.",
  ],
} as const;

export const SPEAKING_QUESTIONS: SpeakingQuestion[] = [
  // ============================================================
  // SECTION 1: PERSONAL INTRODUCTION & READ ALOUD (15 Poin)
  // ============================================================
  {
    id: "Q1",
    sectionNumber: 1,
    sectionTitle: "Personal Introduction & Read Aloud",
    type: "READ_ALOUD",
    title: "Self-Introduction and Reading a Public Service Announcement",
    scenario:
      "Sebagai mahasiswa Administrasi Publik, Anda diminta memperkenalkan diri dan membaca pengumuman resmi dari kantor pelayanan publik untuk dokumentasi audio internal.",
    instruction:
      "Pertama, perkenalkan diri Anda dalam bahasa Inggris (Nama, NIM, Program Studi, dan Fakultas). Kemudian, bacalah teks pengumuman berikut dengan intonasi yang jelas, jeda yang tepat, dan pelafalan yang benar.",
    preparationTimeSec: 30,
    recordingTimeSec: 90,
    minDurationSec: 45,
    points: 15,
    evaluationCriteria: [
      "Pelafalan kata (Pronunciation) - 4 poin",
      "Intonasi & penekanan kata (Intonation & Stress) - 4 poin",
      "Kelancaran membaca (Fluency) - 3 poin",
      "Kelengkapan self-introduction - 2 poin",
      "Jeda yang tepat antar kalimat - 2 poin",
    ],
    tips: [
      "Tarik napas dalam sebelum mulai merekam.",
      "Bacalah dengan kecepatan sedang, jangan terlalu cepat.",
      "Berikan jeda singkat di tanda koma dan jeda lebih panjang di tanda titik.",
      "Perhatikan kata-kata teknis seperti 'Disdukcapil' dan 'administrative'.",
    ],
    readingText:
      "Welcome to the Civil Registry Office. Our office provides essential public services including birth certificates, marriage licenses, and national identity cards. We are committed to delivering efficient, transparent, and citizen-friendly services to all members of our community. Our operating hours are Monday through Friday, from eight in the morning to four in the afternoon. Please take a number and wait for your turn at the designated counter. Thank you for your patience and cooperation.",
  },

  // ============================================================
  // SECTION 2: SITUATION DESCRIPTION (20 Poin)
  // Dikonversi dari Soal 1 - Tata Bahasa dalam Deskripsi Pelayanan Publik
  // ============================================================
  {
    id: "Q2",
    sectionNumber: 2,
    sectionTitle: "Situation Description - Public Service System",
    type: "PICTURE_DESC",
    title: "Describing a Public Service Office in Simple Present Tense",
    scenario:
      "Anda adalah staf administrasi yang diminta membuat video deskripsi singkat untuk brosur internasional yang menjelaskan sistem pelayanan di kantor Anda.",
    instruction:
      "Deskripsikan secara lisan (dalam bahasa Inggris) sistem pelayanan publik di kantor Anda dalam 1 paragraf lisan minimal 5 kalimat. Gunakan Simple Present Tense secara konsisten. Sertakan minimal 2 kata sifat (adjectives) dan 2 kata keterangan (adverbs) yang relevan dengan pelayanan publik. Sebutkan secara jelas kata sifat dan kata keterangan yang Anda gunakan di akhir rekaman.",
    preparationTimeSec: 60,
    recordingTimeSec: 120,
    minDurationSec: 60,
    points: 20,
    evaluationCriteria: [
      "Penggunaan Simple Present Tense yang konsisten - 5 poin",
      "Penggunaan minimal 2 adjectives yang relevan - 4 poin",
      "Penggunaan minimal 2 adverbs yang relevan - 4 poin",
      "Koherensi dan kelengkapan paragraf lisan - 4 poin",
      "Pelafalan dan intonasi - 3 poin",
    ],
    tips: [
      "Gunakan struktur: Subject + Verb-1 (+ s/es untuk subjek tunggal) + Object/Complement.",
      "Contoh adjectives: efficient, friendly, modern, accessible, reliable.",
      "Contoh adverbs: quickly, politely, professionally, regularly, smoothly.",
      "Sebutkan dengan jelas: 'The adjectives I used are...' dan 'The adverbs I used are...' di akhir.",
    ],
    guidingQuestions: [
      "Apa nama kantor dan layanan utamanya?",
      "Bagaimana prosedur pelayanannya? (langkah-langkah)",
      "Siapa saja staf yang melayani?",
      "Kapan kantor dibuka/ditutup?",
      "Apa komitmen mutu pelayanan kantor Anda?",
    ],
  },

  // ============================================================
  // SECTION 3: ROLE PLAY - GIVING DIRECTIONS (20 Poin)
  // Dikonversi dari Soal 2 - Navigasi dan Pelayanan di Area Publik
  // ============================================================
  {
    id: "Q3",
    sectionNumber: 3,
    sectionTitle: "Role Play - Giving Directions at City Hall",
    type: "ROLE_PLAY",
    title: "Directing a Foreign Citizen to the Civil Registry Office",
    scenario:
      "Anda adalah petugas loket informasi di Balai Kota (City Hall). Seorang warga negara asing datang dan bertanya arah menuju kantor Disdukcapil (Civil Registry Office) yang terletak di seberang jalan. Anda harus merespon secara lisan seolah-olah sedang berbicara langsung dengan warga tersebut.",
    instruction:
      "Rekam jawaban Anda dalam bahasa Inggris sebagai petugas informasi. Jawaban Anda harus mencakup: (1) Salam pembuka dan penutup formal, (2) Minimal 3 frasa pengarahan (direction phrases) yang berbeda, (3) Penggunaan tepat dari 2 prepositions of place/movement, (4) Penyebutan 1 landmark sebagai penanda jalan, dan (5) Satu kalimat konfirmasi untuk memastikan warga memahami arahan Anda. Bayangkan Anda sedang berbicara langsung dengan warga asing tersebut.",
    preparationTimeSec: 60,
    recordingTimeSec: 120,
    minDurationSec: 60,
    points: 20,
    evaluationCriteria: [
      "Salam pembuka & penutup formal - 3 poin",
      "Minimal 3 direction phrases yang berbeda - 6 poin",
      "Penggunaan 2 prepositions of place/movement - 4 poin",
      "Penyebutan 1 landmark - 2 poin",
      "Kalimat konfirmasi pemahaman - 3 poin",
      "Kelancaran dan intonasi profesional - 2 poin",
    ],
    tips: [
      "Direction phrases: 'go straight', 'turn left/right', 'walk past', 'cross the street', 'continue along'.",
      "Prepositions of place/movement: 'opposite', 'across', 'past', 'next to', 'between', 'in front of'.",
      "Contoh landmark: 'the big mosque', 'the blue sign', 'the post office', 'the traffic light'.",
      "Contoh kalimat konfirmasi: 'Is that clear?', 'Do you understand the directions?', 'Shall I repeat anything?'",
      "Bicara dengan nada ramah namun profesional.",
    ],
    promptText:
      "Foreign Citizen: \"Excuse me, officer. I need to go to the Civil Registry Office to register my child's birth. Could you please tell me how to get there from here?\"",
    guidingQuestions: [
      "Bagaimana Anda menyapa warga secara formal?",
      "Apa 3 frasa pengarahan yang akan Anda gunakan?",
      "Apa 2 preposisi tempah/gerakan yang Anda pilih?",
      "Landmark apa yang akan Anda sebutkan?",
      "Bagaimana Anda mengonfirmasi pemahaman warga?",
    ],
  },

  // ============================================================
  // SECTION 4: SPOKEN RESPONSE - COMPLAINT HANDLING (20 Poin)
  // Dikonversi dari Soal 3 - Manajemen Keluhan Warga
  // ============================================================
  {
    id: "Q4",
    sectionNumber: 4,
    sectionTitle: "Spoken Response - Handling an Angry Citizen",
    type: "SPOKEN_RESPONSE",
    title: "Responding to a Citizen Complaint with Empathy, Apology, and Solution",
    scenario:
      "Seorang warga datang ke kantor Dinas Sosial dengan perasaan marah karena namanya tidak masuk dalam daftar penerima bantuan, padahal ia sudah mengurusnya sebulan lalu. Warga tersebut berdiri di depan loket Anda dan berbicara dengan nada tinggi. Anda harus merespon secara lisan dengan tenang dan profesional.",
    instruction:
      "Rekam respons lisan Anda dalam bahasa Inggris. Jawaban Anda harus terdiri dari 3 bagian yang jelas: (1) Empathy - tunjukkan bahwa Anda memahami perasaan warga, (2) Apology - mohon maaf atas ketidaknyamanan yang terjadi, dan (3) Offering a Solution - tawarkan langkah konkret untuk menyelesaikan masalah. Sebutkan secara eksplisit kata 'Empathy', 'Apology', dan 'Solution' di awal setiap bagian agar penguji dapat mengidentifikasi dengan jelas.",
    preparationTimeSec: 90,
    recordingTimeSec: 150,
    minDurationSec: 75,
    points: 20,
    evaluationCriteria: [
      "Empathy - kalimat menunjukkan pemahaman perasaan warga - 6 poin",
      "Apology - permohonan maaf yang tulus dan profesional - 5 poin",
      "Solution - penawaran solusi konkret yang dapat dilakukan - 6 poin",
      "Nada suara yang tenang dan menenangkan - 2 poin",
      "Pelafasan dan tata bahasa - 1 poin",
    ],
    tips: [
      "Empathy: 'I understand how frustrating this must be for you...'",
      "Apology: 'I sincerely apologize for the inconvenience this has caused...'",
      "Solution: 'Let me check your file right now and escalate this to the supervisor...'",
      "Jangan defensif. Akui kesalahan sistem/prosedur jika ada.",
      "Gunakan nada suara yang lebih rendah dan lambat untuk menenangkan warga.",
      "Awali dengan 'Empathy:...', lalu 'Apology:...', lalu 'Solution:...'.",
    ],
    promptText:
      "Angry Citizen: \"This is unacceptable! I submitted my documents a month ago, and you're telling me my name is not on the list? Do you know how important this assistance is for my family?! I demand an explanation right now!\"",
    guidingQuestions: [
      "Bagaimana Anda menunjukkan empathy tanpa mengakui kesalahan pribadi?",
      "Kata maaf apa yang paling tepat dan profesional?",
      "Solusi konkret apa yang bisa Anda tawarkan dalam 24 jam?",
      "Bagaimana Anda mengajak warga untuk duduk dan menenangkan diri?",
      "Apakah Anda perlu melibatkan supervisor? Kapan?",
    ],
  },

  // ============================================================
  // SECTION 5: FORMAL REGISTER SPEAKING (10 Poin)
  // Dikonversi dari Soal 4 - Kesadaran Berbahasa di Birokrasi
  // ============================================================
  {
    id: "Q5",
    sectionNumber: 5,
    sectionTitle: "Formal Register Speaking - From Informal to Formal",
    type: "FORMAL_REGISTER",
    title: "Converting Informal Sentences to Formal Spoken Register",
    scenario:
      "Sebagai ASN/birokrat di ruang pelayanan publik, Anda harus berlatih mengucapkan kalimat formal. Berikut 4 kalimat informal yang sering diucapkan, dan Anda harus mengucapkan versi formalnya secara lisan dengan intonasi yang sesuai.",
    instruction:
      "Untuk setiap kalimat informal berikut, ucapkan versi formal yang layak diucapkan oleh ASN di ruang pelayanan publik. Setelah mengucapkan 4 kalimat formal, berikan 1 alasan singkat (dalam bahasa Inggris) mengapa kalimat formal lebih efektif digunakan dalam pelayanan publik. Ucapkan dengan jelas: 'Number one, formal version: ...' dan seterusnya.",
    preparationTimeSec: 60,
    recordingTimeSec: 120,
    minDurationSec: 60,
    points: 10,
    evaluationCriteria: [
      "Konversi kalimat 1 yang tepat & formal - 2 poin",
      "Konversi kalimat 2 yang tepat & formal - 2 poin",
      "Konversi kalimat 3 yang tepat & formal - 2 poin",
      "Konversi kalimat 4 yang tepat & formal - 2 poin",
      "Alasan singkat penggunaan formal register - 1 poin",
      "Intonasi profesional - 1 poin",
    ],
    tips: [
      "Hindari kontraksi (don't -> do not, can't -> cannot).",
      "Gunakan 'Excuse me', 'May I', 'Could you please', 'I would like to'.",
      "Hindari slang atau bahasa terlalu kasual.",
      "Contoh: 'Where's the info desk?' -> 'Excuse me, could you please direct me to the information counter?'",
      "Alasan formal: lebih sopan, lebih jelas, mencerminkan profesionalisme instansi.",
    ],
    informalSentences: [
      "Where's the info desk?",
      "Can you help me out with this form?",
      "What time does this open?",
      "I don't agree with that policy.",
    ],
    guidingQuestions: [
      "Apa kata pengganti 'Where's' yang lebih formal?",
      "Apa kata pengganti 'help me out' yang lebih profesional?",
      "Bagaimana menyatakan 'What time' dengan lebih sopan?",
      "Bagaimana menyatakan ketidaksetujuan secara diplomatis?",
      "Mengapa register formal penting dalam birokrasi?",
    ],
  },

  // ============================================================
  // SECTION 6: PUBLIC FORUM CHAIRPERSON RESPONSE (15 Poin)
  // Dikonversi dari Soal 5 - Studi Kasus Komunikasi Rapat Publik
  // ============================================================
  {
    id: "Q6",
    sectionNumber: 6,
    sectionTitle: "Public Forum Chairperson Response",
    type: "OPINION_SPEAKING",
    title: "Managing a Disrupted Public Forum (Musrenbang) as Chairperson",
    scenario:
      "Anda adalah Ketua Rapat (Chairperson) dalam sebuah Public Forum (Musyawarah Perencanaan Pembangunan / Musrenbang) yang dihadiri warga dan pejabat. Di tengah presentasi anggaran, seorang warga tiba-tiba memotong pembicaraan dengan suara keras dan mengeluh soal transparansi dana. Anda harus mengambil alih kendali dan merespon secara lisan.",
    instruction:
      "Rekam respons lisan Anda dalam bahasa Inggris minimal 4 kalimat. Respons Anda harus mencakup: (1) Mengambil alih kendali rapat secara tegas namun sopan (managing the floor), (2) Menunjukkan Active Listening dengan memvalidasi keluhan warga, (3) Mengarahkan diskusi ke mekanisme yang konstruktif (redirect to constructive mechanism), dan (4) Menutup intervensi dengan ajakan untuk melanjutkan rapat secara tertib. Gunakan nada suara yang otoritatif namun tetap menghormati warga.",
    preparationTimeSec: 90,
    recordingTimeSec: 120,
    minDurationSec: 60,
    points: 15,
    evaluationCriteria: [
      "Managing the floor - tegas namun sopan - 4 poin",
      "Active listening - memvalidasi keluhan warga - 4 poin",
      "Redirect ke mekanisme konstruktif - 4 poin",
      "Penutup yang mengajak kembali ke agenda - 2 poin",
      "Intonasi otoritatif & profesional - 1 poin",
    ],
    tips: [
      "Managing the floor: 'Order, please. Let me address this concern.'",
      "Active listening: 'I hear your frustration, and your concern about transparency is valid.'",
      "Redirect: 'I propose we discuss this in the Q&A session and follow up with a written response.'",
      "Penutup: 'Thank you for raising this. Let us continue with the presentation.'",
      "Jangan memotong warga dengan kasar. Akui haknya untuk didengar.",
      "Pertahankan kontak mata (dalam konteks audio: bicara dengan jelas dan mantap).",
    ],
    promptText:
      "Disruptive Citizen (standing up loudly during the budget presentation): \"This is outrageous! You're sitting there talking about budget allocations, but where is the transparency? We never see where the money goes! You officials always hide behind complicated numbers! I demand an answer right now!\"",
    guidingQuestions: [
      "Kalimat apa yang Anda gunakan untuk mengambil alih kendali?",
      "Bagaimana Anda memvalidasi keluhan warga tanpa setuju dengan tuduhan?",
      "Mekanisme konstruktif apa yang Anda tawarkan (mis. Q&A session, written follow-up)?",
      "Bagaimana Anda mengajak peserta lain untuk melanjutkan rapat?",
      "Apakah Anda perlu menunjuk staf untuk mendampingi warga tersebut? Kapan?",
    ],
  },
];

export const getQuestionById = (id: string): SpeakingQuestion | undefined =>
  SPEAKING_QUESTIONS.find((q) => q.id === id);

export const getTotalPoints = (): number =>
  SPEAKING_QUESTIONS.reduce((sum, q) => sum + q.points, 0);

export const getTotalPreparationAndRecording = (): {
  prep: number;
  record: number;
} => ({
  prep: SPEAKING_QUESTIONS.reduce((sum, q) => sum + q.preparationTimeSec, 0),
  record: SPEAKING_QUESTIONS.reduce((sum, q) => sum + q.recordingTimeSec, 0),
});
