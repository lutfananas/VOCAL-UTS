-- Seed 30 mahasiswa ke Cloudflare D1
-- 15 S1 Adpub UNITA + 15 S1 PGSD UBHI

INSERT INTO Student (id, nim, name, programStudy, faculty, courseCode, courseName, examStatus, createdAt, updatedAt) VALUES
-- === S1 Administrasi Publik - UNITA ===
('unita-001', '220100101', 'Ahmad Fauzi Rahman', 'S1 Administrasi Publik - UNITA', 'FISIP', 'UTW2002', 'Bahasa Inggris Bisnis', 'NOT_STARTED', datetime('now'), datetime('now')),
('unita-002', '220100102', 'Siti Nurhaliza Putri', 'S1 Administrasi Publik - UNITA', 'FISIP', 'UTW2002', 'Bahasa Inggris Bisnis', 'NOT_STARTED', datetime('now'), datetime('now')),
('unita-003', '220100103', 'Budi Santoso Wibowo', 'S1 Administrasi Publik - UNITA', 'FISIP', 'UTW2002', 'Bahasa Inggris Bisnis', 'NOT_STARTED', datetime('now'), datetime('now')),
('unita-004', '220100104', 'Dewi Lestari Anggraini', 'S1 Administrasi Publik - UNITA', 'FISIP', 'UTW2002', 'Bahasa Inggris Bisnis', 'NOT_STARTED', datetime('now'), datetime('now')),
('unita-005', '220100105', 'Rizki Pratama Adi', 'S1 Administrasi Publik - UNITA', 'FISIP', 'UTW2002', 'Bahasa Inggris Bisnis', 'NOT_STARTED', datetime('now'), datetime('now')),
('unita-006', '220100106', 'Nabila Az-Zahra Hakim', 'S1 Administrasi Publik - UNITA', 'FISIP', 'UTW2002', 'Bahasa Inggris Bisnis', 'NOT_STARTED', datetime('now'), datetime('now')),
('unita-007', '220100107', 'Fajar Nugroho Saputro', 'S1 Administrasi Publik - UNITA', 'FISIP', 'UTW2002', 'Bahasa Inggris Bisnis', 'NOT_STARTED', datetime('now'), datetime('now')),
('unita-008', '220100108', 'Indah Permatasari Dewi', 'S1 Administrasi Publik - UNITA', 'FISIP', 'UTW2002', 'Bahasa Inggris Bisnis', 'NOT_STARTED', datetime('now'), datetime('now')),
('unita-009', '220100109', 'Muhammad Iqbal Firdaus', 'S1 Administrasi Publik - UNITA', 'FISIP', 'UTW2002', 'Bahasa Inggris Bisnis', 'NOT_STARTED', datetime('now'), datetime('now')),
('unita-010', '220100110', 'Putri Ayu Lestari', 'S1 Administrasi Publik - UNITA', 'FISIP', 'UTW2002', 'Bahasa Inggris Bisnis', 'NOT_STARTED', datetime('now'), datetime('now')),
('unita-011', '220100111', 'Andi Mappangara Akbar', 'S1 Administrasi Publik - UNITA', 'FISIP', 'UTW2002', 'Bahasa Inggris Bisnis', 'NOT_STARTED', datetime('now'), datetime('now')),
('unita-012', '220100112', 'Ratna Sari Melati', 'S1 Administrasi Publik - UNITA', 'FISIP', 'UTW2002', 'Bahasa Inggris Bisnis', 'NOT_STARTED', datetime('now'), datetime('now')),
('unita-013', '220100113', 'Yusuf Hamzah Mahendra', 'S1 Administrasi Publik - UNITA', 'FISIP', 'UTW2002', 'Bahasa Inggris Bisnis', 'NOT_STARTED', datetime('now'), datetime('now')),
('unita-014', '220100114', 'Fitri Handayani Sari', 'S1 Administrasi Publik - UNITA', 'FISIP', 'UTW2002', 'Bahasa Inggris Bisnis', 'NOT_STARTED', datetime('now'), datetime('now')),
('unita-015', '220100115', 'Bagus Setiawan Pratama', 'S1 Administrasi Publik - UNITA', 'FISIP', 'UTW2002', 'Bahasa Inggris Bisnis', 'NOT_STARTED', datetime('now'), datetime('now')),
-- === S1 PGSD - UBHI ===
('ubhi-001', '220200101', 'Citra Ayu Pratiwi', 'S1 PGSD - UBHI', 'FKIP', 'UTW2002', 'Bahasa Inggris Bisnis', 'NOT_STARTED', datetime('now'), datetime('now')),
('ubhi-002', '220200102', 'Dimas Aryo Wibisono', 'S1 PGSD - UBHI', 'FKIP', 'UTW2002', 'Bahasa Inggris Bisnis', 'NOT_STARTED', datetime('now'), datetime('now')),
('ubhi-003', '220200103', 'Eka Putri Rahmawati', 'S1 PGSD - UBHI', 'FKIP', 'UTW2002', 'Bahasa Inggris Bisnis', 'NOT_STARTED', datetime('now'), datetime('now')),
('ubhi-004', '220200104', 'Fajar Bayu Setiawan', 'S1 PGSD - UBHI', 'FKIP', 'UTW2002', 'Bahasa Inggris Bisnis', 'NOT_STARTED', datetime('now'), datetime('now')),
('ubhi-005', '220200105', 'Gita Maharani Putri', 'S1 PGSD - UBHI', 'FKIP', 'UTW2002', 'Bahasa Inggris Bisnis', 'NOT_STARTED', datetime('now'), datetime('now')),
('ubhi-006', '220200106', 'Hadi Pranata Wijaya', 'S1 PGSD - UBHI', 'FKIP', 'UTW2002', 'Bahasa Inggris Bisnis', 'NOT_STARTED', datetime('now'), datetime('now')),
('ubhi-007', '220200107', 'Indra Kusuma Atmaja', 'S1 PGSD - UBHI', 'FKIP', 'UTW2002', 'Bahasa Inggris Bisnis', 'NOT_STARTED', datetime('now'), datetime('now')),
('ubhi-008', '220200108', 'Joko Susilo Utomo', 'S1 PGSD - UBHI', 'FKIP', 'UTW2002', 'Bahasa Inggris Bisnis', 'NOT_STARTED', datetime('now'), datetime('now')),
('ubhi-009', '220200109', 'Kartika Sari Dewi', 'S1 PGSD - UBHI', 'FKIP', 'UTW2002', 'Bahasa Inggris Bisnis', 'NOT_STARTED', datetime('now'), datetime('now')),
('ubhi-010', '220200110', 'Lukman Hakim Pradana', 'S1 PGSD - UBHI', 'FKIP', 'UTW2002', 'Bahasa Inggris Bisnis', 'NOT_STARTED', datetime('now'), datetime('now')),
('ubhi-011', '220200111', 'Mega Wulandari Ayu', 'S1 PGSD - UBHI', 'FKIP', 'UTW2002', 'Bahasa Inggris Bisnis', 'NOT_STARTED', datetime('now'), datetime('now')),
('ubhi-012', '220200112', 'Nanda Pratama Putra', 'S1 PGSD - UBHI', 'FKIP', 'UTW2002', 'Bahasa Inggris Bisnis', 'NOT_STARTED', datetime('now'), datetime('now')),
('ubhi-013', '220200113', 'Okta Viani Lestari', 'S1 PGSD - UBHI', 'FKIP', 'UTW2002', 'Bahasa Inggris Bisnis', 'NOT_STARTED', datetime('now'), datetime('now')),
('ubhi-014', '220200114', 'Pandu Raga Saputra', 'S1 PGSD - UBHI', 'FKIP', 'UTW2002', 'Bahasa Inggris Bisnis', 'NOT_STARTED', datetime('now'), datetime('now')),
('ubhi-015', '220200115', 'Qori Amalia Zahra', 'S1 PGSD - UBHI', 'FKIP', 'UTW2002', 'Bahasa Inggris Bisnis', 'NOT_STARTED', datetime('now'), datetime('now'));
