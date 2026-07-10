import { Router, type Response } from 'express';
import puppeteer from 'puppeteer';
import prisma from '../config/db';
import { authenticateToken, type AuthenticatedRequest, requireRole } from '../middlewares/auth';

const router = Router();

// Endpoint to generate Report Card PDF
router.get('/report-card/:studentId', authenticateToken, requireRole(['school_admin', 'teacher', 'superadmin', 'student']), async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { studentId } = req.params;
    const institutionId = req.user?.institutionId;

    if (!institutionId) {
      return res.status(403).json({ error: 'Forbidden', message: 'Institution ID required' });
    }

    // Ensure student belongs to institution
    const student = await prisma.user.findFirst({
      where: { id: studentId, institutionId, role: 'student' },
      include: { institution: true }
    });

    if (!student) {
      return res.status(404).json({ error: 'NotFound', message: 'Student not found' });
    }

    // Fetch grades
    const grades = await prisma.gradebookEntry.findMany({
      where: { studentId, institutionId }
    });

    const htmlContent = `
      <html>
        <head>
          <style>
            body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; padding: 40px; color: #333; }
            .header { text-align: center; border-bottom: 2px solid #0d9488; padding-bottom: 20px; margin-bottom: 30px; }
            .header h1 { margin: 0; color: #0d9488; font-size: 28px; }
            .header p { margin: 5px 0 0 0; font-size: 14px; color: #666; }
            .student-info { margin-bottom: 40px; padding: 20px; background: #f8fafc; border-radius: 8px; }
            .student-info p { margin: 5px 0; }
            table { width: 100%; border-collapse: collapse; margin-top: 20px; }
            th, td { border: 1px solid #e2e8f0; padding: 12px; text-align: left; }
            th { background-color: #f1f5f9; font-weight: bold; color: #475569; }
            .footer { margin-top: 60px; text-align: center; font-size: 12px; color: #94a3b8; border-top: 1px solid #e2e8f0; padding-top: 20px; }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>${student.institution?.name || 'Institution'}</h1>
            <p>Official Report Card</p>
          </div>
          <div class="student-info">
            <p><strong>Name:</strong> ${student.name}</p>
            <p><strong>Class:</strong> ${student.class || 'N/A'} - ${student.section || 'N/A'}</p>
            <p><strong>Roll No:</strong> ${student.rollNo || 'N/A'}</p>
          </div>
          
          <h2>Academic Performance</h2>
          <table>
            <thead>
              <tr>
                <th>Subject</th>
                <th>Exam</th>
                <th>Marks Obtained</th>
                <th>Remarks</th>
              </tr>
            </thead>
            <tbody>
              ${grades.length > 0 ? grades.map(g => `
                <tr>
                  <td>${g.subject}</td>
                  <td>${g.examName}</td>
                  <td>${g.marks}</td>
                  <td>${g.remarks || '-'}</td>
                </tr>
              `).join('') : '<tr><td colspan="4" style="text-align: center;">No grades recorded yet.</td></tr>'}
            </tbody>
          </table>
          <div class="footer">Generated on ${new Date().toLocaleDateString()}</div>
        </body>
      </html>
    `;

    const browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox', '--disable-setuid-sandbox'] });
    const page = await browser.newPage();
    await page.setContent(htmlContent, { waitUntil: 'domcontentloaded' });
    const pdfBuffer = await page.pdf({ format: 'A4', printBackground: true });
    await browser.close();

    res.set({
      'Content-Type': 'application/pdf',
      'Content-Length': pdfBuffer.length,
      'Content-Disposition': `inline; filename="report-card-${student.name.replace(/\\s+/g, '-')}.pdf"`
    });
    return res.send(pdfBuffer);
  } catch (error) {
    console.error('PDF generation error', error);
    return res.status(500).json({ error: 'InternalError', message: 'Failed to generate PDF' });
  }
});

// Endpoint to generate Admit Card PDF
router.get('/admit-card/:studentId', authenticateToken, requireRole(['school_admin', 'teacher', 'superadmin', 'student']), async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { studentId } = req.params;
    const institutionId = req.user?.institutionId;

    if (!institutionId) return res.status(403).json({ error: 'Forbidden', message: 'Institution ID required' });

    const student = await prisma.user.findFirst({
      where: { id: studentId, institutionId, role: 'student' },
      include: { institution: true }
    });

    if (!student) return res.status(404).json({ error: 'NotFound', message: 'Student not found' });

    const htmlContent = `
      <html>
        <head>
          <style>
            body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; padding: 40px; color: #333; }
            .card { border: 2px solid #3b82f6; border-radius: 12px; padding: 30px; position: relative; }
            .header { text-align: center; border-bottom: 2px dashed #e2e8f0; padding-bottom: 20px; margin-bottom: 20px; }
            .header h1 { margin: 0; color: #1d4ed8; font-size: 24px; text-transform: uppercase; }
            .header h2 { margin: 5px 0 0 0; font-size: 18px; color: #3b82f6; }
            .photo-box { position: absolute; top: 30px; right: 30px; width: 100px; height: 120px; border: 1px solid #cbd5e1; display: flex; align-items: center; justify-content: center; color: #94a3b8; font-size: 12px; background: #f8fafc; }
            .info p { margin: 10px 0; font-size: 16px; }
            .info strong { display: inline-block; width: 120px; color: #475569; }
            .instructions { margin-top: 40px; padding: 20px; background: #eff6ff; border-radius: 8px; font-size: 14px; }
            .instructions ul { padding-left: 20px; margin: 5px 0; }
            .signature { margin-top: 60px; display: flex; justify-content: space-between; }
            .signature-box { border-top: 1px solid #94a3b8; width: 200px; text-align: center; padding-top: 10px; font-size: 14px; color: #64748b; }
          </style>
        </head>
        <body>
          <div class="card">
            <div class="header">
              <h1>${student.institution?.name || 'Institution'}</h1>
              <h2>ADMIT CARD / HALL TICKET</h2>
            </div>
            <div class="photo-box">Affix Photo</div>
            <div class="info">
              <p><strong>Name:</strong> ${student.name}</p>
              <p><strong>Class:</strong> ${student.class || 'N/A'} - ${student.section || 'N/A'}</p>
              <p><strong>Roll No:</strong> ${student.rollNo || 'N/A'}</p>
              <p><strong>DOB:</strong> ${student.dob ? new Date(student.dob).toLocaleDateString() : 'N/A'}</p>
            </div>
            
            <div class="instructions">
              <strong>Instructions to Candidate:</strong>
              <ul>
                <li>Please bring this admit card to the examination hall.</li>
                <li>Electronic devices are strictly prohibited.</li>
                <li>Arrive at least 30 minutes before the scheduled time.</li>
              </ul>
            </div>

            <div class="signature">
              <div class="signature-box">Student Signature</div>
              <div class="signature-box">Principal Signature</div>
            </div>
          </div>
        </body>
      </html>
    `;

    const browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox', '--disable-setuid-sandbox'] });
    const page = await browser.newPage();
    await page.setContent(htmlContent, { waitUntil: 'domcontentloaded' });
    const pdfBuffer = await page.pdf({ format: 'A4', printBackground: true });
    await browser.close();

    res.set({
      'Content-Type': 'application/pdf',
      'Content-Length': pdfBuffer.length,
      'Content-Disposition': `inline; filename="admit-card-${student.name.replace(/\\s+/g, '-')}.pdf"`
    });
    return res.send(pdfBuffer);
  } catch (error) {
    console.error('PDF generation error', error);
    return res.status(500).json({ error: 'InternalError', message: 'Failed to generate PDF' });
  }
});

export default router;
