import os
import sys
from reportlab.lib.pagesizes import letter
from reportlab.lib import colors
from reportlab.lib.units import inch
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, PageBreak, KeepTogether, HRFlowable
)
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.pdfgen import canvas

class NumberedCanvas(canvas.Canvas):
    """Canvas that performs a two-pass calculation of total pages for 'Page X of Y' footer."""
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self._saved_page_states = []

    def showPage(self):
        self._saved_page_states.append(dict(self.__dict__))
        self._startPage()

    def save(self):
        num_pages = len(self._saved_page_states)
        for state in self._saved_page_states:
            self.__dict__.update(state)
            self.draw_page_decorations(num_pages)
            super().showPage()
        super().save()

    def draw_page_decorations(self, page_count):
        self.saveState()
        self.setFont("Helvetica", 8)
        self.setFillColor(colors.HexColor("#64748B"))

        # Header (pages 2+)
        if self._pageNumber > 1:
            self.drawString(54, 11 * inch - 36, "HireFlow AI — System Use Case Documentation")
            self.drawRightString(8.5 * inch - 54, 11 * inch - 36, "Confidential & Proprietary")
            self.setStrokeColor(colors.HexColor("#CBD5E1"))
            self.setLineWidth(0.5)
            self.line(54, 11 * inch - 42, 8.5 * inch - 54, 11 * inch - 42)

        # Footer (all pages)
        self.setStrokeColor(colors.HexColor("#E2E8F0"))
        self.setLineWidth(0.5)
        self.line(54, 45, 8.5 * inch - 54, 45)

        self.drawString(54, 30, "© 2026 HireFlow AI · Designed & Developed by Thejas")
        page_str = f"Page {self._pageNumber} of {page_count}"
        self.drawRightString(8.5 * inch - 54, 30, page_str)
        self.restoreState()


def build_pdf(filename="HireFlow_AI_Use_Case_Documentation.pdf"):
    doc = SimpleDocTemplate(
        filename,
        pagesize=letter,
        leftMargin=54,
        rightMargin=54,
        topMargin=54,
        bottomMargin=54,
    )

    styles = getSampleStyleSheet()

    # Custom styles
    primary_color = colors.HexColor("#0A66C2")
    dark_slate = colors.HexColor("#0F172A")
    body_color = colors.HexColor("#334155")

    title_style = ParagraphStyle(
        'DocTitle',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=24,
        leading=28,
        textColor=primary_color,
        spaceAfter=6,
    )

    subtitle_style = ParagraphStyle(
        'DocSubTitle',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=12,
        leading=16,
        textColor=colors.HexColor("#475569"),
        spaceAfter=15,
    )

    h1_style = ParagraphStyle(
        'CustomH1',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=14,
        leading=18,
        textColor=dark_slate,
        spaceBefore=14,
        spaceAfter=6,
        keepWithNext=True,
    )

    h2_style = ParagraphStyle(
        'CustomH2',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=11,
        leading=15,
        textColor=primary_color,
        spaceBefore=10,
        spaceAfter=4,
        keepWithNext=True,
    )

    body_style = ParagraphStyle(
        'CustomBody',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=9,
        leading=13,
        textColor=body_color,
        spaceAfter=6,
    )

    meta_label_style = ParagraphStyle(
        'MetaLabel',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=8.5,
        leading=11,
        textColor=dark_slate,
    )

    meta_val_style = ParagraphStyle(
        'MetaVal',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=8.5,
        leading=11,
        textColor=body_color,
    )

    code_pill_style = ParagraphStyle(
        'CodePill',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=8,
        leading=10,
        textColor=colors.HexColor("#0A66C2"),
    )

    story = []

    # ── COVER / TITLE SECTION ────────────────────────────────────────────────
    story.append(Paragraph("HireFlow AI", title_style))
    story.append(Paragraph("Next-Generation AI-Powered Applicant Tracking & Talent Evaluation Platform", subtitle_style))
    story.append(Paragraph("<b>System Use Case Specification & Architecture Documentation</b>", ParagraphStyle('SubHeading', fontName='Helvetica-Bold', fontSize=10, textColor=dark_slate, spaceAfter=8)))
    story.append(HRFlowable(width="100%", thickness=1.5, color=primary_color, spaceAfter=12))

    # Meta Table
    meta_data = [
        [Paragraph("<b>Document Version:</b>", meta_label_style), Paragraph("1.0.0 (Production Release)", meta_val_style),
         Paragraph("<b>Target Platform:</b>", meta_label_style), Paragraph("AWS Amplify (Frontend) + Render (API)", meta_val_style)],
        [Paragraph("<b>Author / Lead:</b>", meta_label_style), Paragraph("Thejas", meta_val_style),
         Paragraph("<b>Database:</b>", meta_label_style), Paragraph("MongoDB Atlas Cloud Cluster", meta_val_style)],
        [Paragraph("<b>Date of Release:</b>", meta_label_style), Paragraph("August 2026", meta_val_style),
         Paragraph("<b>AI Engine:</b>", meta_label_style), Paragraph("OpenAI GPT-4o-mini + Word-Boundary NLP", meta_val_style)],
    ]
    meta_table = Table(meta_data, colWidths=[110, 150, 90, 154])
    meta_table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, -1), colors.HexColor("#F8FAFC")),
        ('BOX', (0, 0), (-1, -1), 0.5, colors.HexColor("#E2E8F0")),
        ('INNERGRID', (0, 0), (-1, -1), 0.5, colors.HexColor("#E2E8F0")),
        ('TOPPADDING', (0, 0), (-1, -1), 5),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 5),
        ('LEFTPADDING', (0, 0), (-1, -1), 8),
        ('RIGHTPADDING', (0, 0), (-1, -1), 8),
    ]))
    story.append(meta_table)
    story.append(Spacer(1, 14))

    # ── SECTION 1: EXECUTIVE SUMMARY & ARCHITECTURE ──────────────────────────
    story.append(Paragraph("1. Executive Summary & Solution Overview", h1_style))
    story.append(Paragraph(
        "<b>HireFlow AI</b> is a full-stack, enterprise-grade Talent Operating System and Applicant Tracking System (ATS) "
        "engineered to bridge candidate discovery with autonomous AI-driven candidate evaluation. It replaces fragmented "
        "hiring spreadsheets with automated resume decoding, authenticity/plagiarism detection, strict forward-only hiring "
        "stage governance, and cloud-native PDF persistence.",
        body_style
    ))

    arch_items = [
        [Paragraph("<b>Layer</b>", meta_label_style), Paragraph("<b>Technology</b>", meta_label_style), Paragraph("<b>Key Responsibilities</b>", meta_label_style)],
        [Paragraph("Frontend UI/UX", meta_label_style), Paragraph("React 18, Vite, Tailwind CSS, Lucide Icons", meta_val_style), Paragraph("Responsive public portal, dedicated mobile candidate cards, admin command center.", meta_val_style)],
        [Paragraph("Cloud Hosting", meta_label_style), Paragraph("AWS Amplify (Web) + Render (Node)", meta_val_style), Paragraph("Automated CI/CD git-triggered builds, SSL termination, and global CDN delivery.", meta_val_style)],
        [Paragraph("Backend Server", meta_label_style), Paragraph("Node.js, Express, Multer, JWT, CORS", meta_val_style), Paragraph("REST API endpoints, JWT security guard, resume binary streaming, stage transitions.", meta_val_style)],
        [Paragraph("Database Layer", meta_label_style), Paragraph("MongoDB Atlas (Mongoose ODM)", meta_val_style), Paragraph("Cloud Base64 PDF storage, candidate indexing, interview logs, duplicate protection.", meta_val_style)],
        [Paragraph("Intelligence Engine", meta_label_style), Paragraph("OpenAI GPT-4o-mini & NLP Heuristic", meta_val_style), Paragraph("Skill extraction, role match scoring (0-100%), plagiarism risk & originality audit.", meta_val_style)],
    ]
    arch_table = Table(arch_items, colWidths=[100, 160, 244])
    arch_table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor("#EAF4FF")),
        ('TEXTCOLOR', (0, 0), (-1, 0), primary_color),
        ('BOX', (0, 0), (-1, -1), 0.5, colors.HexColor("#CBD5E1")),
        ('INNERGRID', (0, 0), (-1, -1), 0.5, colors.HexColor("#E2E8F0")),
        ('TOPPADDING', (0, 0), (-1, -1), 4),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 4),
        ('LEFTPADDING', (0, 0), (-1, -1), 6),
    ]))
    story.append(arch_table)
    story.append(Spacer(1, 14))

    # ── SECTION 2: SYSTEM ACTORS ─────────────────────────────────────────────
    story.append(Paragraph("2. Primary System Actors", h1_style))
    actors_data = [
        [Paragraph("<b>Actor</b>", meta_label_style), Paragraph("<b>Description & Operational Scope</b>", meta_label_style)],
        [Paragraph("Job Applicant (Candidate)", meta_label_style), Paragraph("Public user browsing active positions, submitting PDF resumes with personal credentials, and receiving fast-track application confirmations.", meta_val_style)],
        [Paragraph("Recruiter / Hiring Team", meta_label_style), Paragraph("Authenticated admin managing requisitions, inspecting AI candidate scoring, viewing streamed PDF resumes, conducting multi-round interview ratings, and advancing candidates along strict stage gates.", meta_val_style)],
        [Paragraph("AI Intelligence Service", meta_label_style), Paragraph("Autonomous background engine that extracts keywords, assesses technical depth, calculates originality vs plagiarism risk, and compiles strengths and gaps.", meta_val_style)],
    ]
    actors_table = Table(actors_data, colWidths=[140, 364])
    actors_table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor("#F1F5F9")),
        ('BOX', (0, 0), (-1, -1), 0.5, colors.HexColor("#CBD5E1")),
        ('INNERGRID', (0, 0), (-1, -1), 0.5, colors.HexColor("#E2E8F0")),
        ('TOPPADDING', (0, 0), (-1, -1), 4),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 4),
        ('LEFTPADDING', (0, 0), (-1, -1), 6),
    ]))
    story.append(actors_table)
    story.append(Spacer(1, 14))

    # ── SECTION 3: DETAILED USE CASES ────────────────────────────────────────
    story.append(Paragraph("3. Detailed Use Case Specifications", h1_style))

    def make_use_case_table(uc_id, uc_title, actor, precond, trigger, main_flow, alt_flow, postcond):
        rows = [
            [Paragraph(f"<b>{uc_id}: {uc_title}</b>", ParagraphStyle('UCTitle', fontName='Helvetica-Bold', fontSize=9.5, textColor=colors.white)), ""],
            [Paragraph("<b>Primary Actor:</b>", meta_label_style), Paragraph(actor, meta_val_style)],
            [Paragraph("<b>Preconditions:</b>", meta_label_style), Paragraph(precond, meta_val_style)],
            [Paragraph("<b>Trigger:</b>", meta_label_style), Paragraph(trigger, meta_val_style)],
            [Paragraph("<b>Main Success Flow:</b>", meta_label_style), Paragraph(main_flow, meta_val_style)],
            [Paragraph("<b>Exceptions / Alternates:</b>", meta_label_style), Paragraph(alt_flow, meta_val_style)],
            [Paragraph("<b>Postconditions:</b>", meta_label_style), Paragraph(postcond, meta_val_style)],
        ]
        t = Table(rows, colWidths=[120, 384])
        t.setStyle(TableStyle([
            ('SPAN', (0, 0), (1, 0)),
            ('BACKGROUND', (0, 0), (1, 0), primary_color),
            ('BACKGROUND', (0, 1), (0, -1), colors.HexColor("#F8FAFC")),
            ('BOX', (0, 0), (-1, -1), 0.5, colors.HexColor("#CBD5E1")),
            ('INNERGRID', (0, 0), (-1, -1), 0.5, colors.HexColor("#E2E8F0")),
            ('TOPPADDING', (0, 0), (-1, -1), 4),
            ('BOTTOMPADDING', (0, 0), (-1, -1), 4),
            ('LEFTPADDING', (0, 0), (-1, -1), 6),
            ('RIGHTPADDING', (0, 0), (-1, -1), 6),
        ]))
        return t

    # UC-01
    story.append(make_use_case_table(
        "UC-01", "Job Requisition Discovery & Search",
        "Job Applicant / Public Visitor",
        "Public access to HireFlow AI landing page.",
        "Candidate visits home URL or clicks 'Open Positions'.",
        "1. System loads active job listings from database via GET /api/jobs.<br/>"
        "2. Candidate searches by role keywords, skills, or location.<br/>"
        "3. Candidate filters by employment type (Full-Time, Contract, Internship).<br/>"
        "4. Candidate clicks 'Apply Now' on target requisition.",
        "4a. If no jobs match search criteria, system presents helpful empty state with reset filters button.",
        "Candidate is navigated to Apply page with target jobId pre-selected."
    ))
    story.append(Spacer(1, 10))

    # UC-02
    story.append(make_use_case_table(
        "UC-02", "Application Submission & Atlas PDF Storage",
        "Job Applicant",
        "Target job is active and accepting applications.",
        "Candidate submits application form with PDF resume upload.",
        "1. Candidate inputs Full Name, Email, Phone, LinkedIn, and optional cover note.<br/>"
        "2. Candidate uploads PDF resume file (max 5MB).<br/>"
        "3. Backend parses multipart form data via Multer and converts PDF buffer to Base64 string.<br/>"
        "4. System saves Candidate document and Application record in MongoDB Atlas.<br/>"
        "5. System initializes hiring stage at <b>Applied</b> and triggers asynchronous AI parsing.<br/>"
        "6. UI redirects candidate to Application Success page with summary details.",
        "3a. Duplicate email applied to same job: System returns 409 Conflict with clear error message.<br/>"
        "3b. Invalid file format / size > 5MB: System rejects upload with 400 Bad Request.",
        "Application and PDF resume are permanently persisted in MongoDB Atlas cloud."
    ))
    story.append(Spacer(1, 10))

    # UC-03
    story.append(make_use_case_table(
        "UC-03", "AI Resume Extraction & Skill Alignment",
        "AI Intelligence Engine / Recruiter",
        "Application submitted with PDF resume data.",
        "Automated on application creation or triggered via 'Re-run Analysis'.",
        "1. AI Service decodes Base64 resume buffer and extracts text.<br/>"
        "2. OpenAI GPT-4o-mini prompt analyzes resume against target job description.<br/>"
        "3. System extracts candidate skills list and determines matched vs missing competencies.<br/>"
        "4. Computes Match Score (0-100%), verified strengths list, and potential interview gap probes.<br/>"
        "5. Results saved to application document under aiAnalysis schema.",
        "2a. OpenAI API key unavailable or rate limited: System seamlessly falls back to local NLP heuristic word-boundary parser without user disruption.",
        "Candidate profile displays accurate Match Score radial ring and extracted skills breakdown."
    ))
    story.append(Spacer(1, 10))

    # UC-04
    story.append(make_use_case_table(
        "UC-04", "Resume Plagiarism & Authenticity Audit",
        "AI Intelligence Engine / Recruiter",
        "Resume text extracted and ready for evaluation.",
        "Triggered as part of AI Candidate Insights pipeline.",
        "1. System scans resume text for boilerplate buzzword density, template clichés, and project specificity.<br/>"
        "2. Computes <b>Originality Score (%)</b> and <b>Plagiarism Risk (%)</b>.<br/>"
        "3. Assigns risk categorization: Low Risk (<=20%), Standard Phrasing (21-40%), High Template Plagiarism (>40%).<br/>"
        "4. Renders dual-color progress gauge and authenticity observation flag on recruiter card.",
        "1a. Short or non-technical resume: System flags lack of quantified metrics and raises alert.",
        "Recruiter is empowered with objective authenticity rating to screen out copied resumes."
    ))
    story.append(Spacer(1, 10))

    # UC-05
    story.append(make_use_case_table(
        "UC-05", "Strict Forward-Only Stage Governance",
        "Recruiter / Hiring Manager",
        "Authenticated admin viewing candidate details at /admin/applications/:id.",
        "Recruiter clicks 'Update Stage' button.",
        "1. System opens Stage Decision Modal displaying current stage (e.g. Applied).<br/>"
        "2. Modal presents two forward paths: 🟢 <b>Selected / Advance</b> (➔ R1) OR 🔴 <b>Rejected</b> (➔ Reject).<br/>"
        "3. Recruiter enters mandatory decision rationale note.<br/>"
        "4. Backend validates transition against strict forward state machine:<br/>"
        "   &nbsp;&nbsp;• Applied ➔ R1 | Reject<br/>"
        "   &nbsp;&nbsp;• R1 ➔ R2 | R1 Reject<br/>"
        "   &nbsp;&nbsp;• R2 ➔ R3 | R2 Reject<br/>"
        "   &nbsp;&nbsp;• R3 ➔ Approved | R3 Reject<br/>"
        "5. Stage history log updated with timestamp and decision note.",
        "4a. Recruiter attempts illegal backward move: System rejects transition with validation error.<br/>"
        "4b. Candidate already in terminal stage (Approved / Reject): Modal locks stage selector.",
        "Candidate stage updated and reflected across dashboard, timeline, and mobile cards."
    ))
    story.append(Spacer(1, 10))

    # UC-06
    story.append(make_use_case_table(
        "UC-06", "Inline Cloud PDF Resume Streaming",
        "Recruiter / Hiring Manager",
        "Candidate document contains Base64 resume buffer in Atlas.",
        "Recruiter clicks 'View Resume (PDF)' in Admin portal.",
        "1. Request dispatched to GET /api/applications/:id/resume.<br/>"
        "2. Backend retrieves candidate.resumeData from MongoDB Atlas.<br/>"
        "3. Decodes Base64 buffer to binary Buffer.from(data, 'base64').<br/>"
        "4. Sets response headers: Content-Type: application/pdf, Content-Disposition: inline.<br/>"
        "5. Browser opens resume PDF in a dedicated tab with native PDF controls (zoom, print, save).",
        "2a. Resume data missing / legacy upload: Backend attempts local file fallback or returns 404.",
        "Recruiter inspects original candidate PDF with zero dependency on ephemeral cloud storage."
    ))
    story.append(Spacer(1, 10))

    # UC-07
    story.append(make_use_case_table(
        "UC-07", "Structured Interview Feedback & Ratings",
        "Recruiter / Technical Interviewer",
        "Candidate is in active interview round (R1, R2, or R3).",
        "Interviewer logs feedback in 'Interview Notes & Evaluation' section.",
        "1. Recruiter selects Interview Round (R1 Technical, R2 Deep Tech, R3 System Design, HR).<br/>"
        "2. Assigns 1 to 5 Star Rating.<br/>"
        "3. Enters detailed technical observations, questions asked, and strengths.<br/>"
        "4. Clicks 'Save Interview Note'.<br/>"
        "5. System persists note in candidate interviewNotes array and refreshes timeline.",
        "3a. Empty notes field: System validates input and displays inline prompt.",
        "Feedback is permanently chronologically indexed for collaborative hiring decisions."
    ))
    story.append(Spacer(1, 14))

    # ── SECTION 4: SECURITY & GOVERNANCE MATRIX ──────────────────────────────
    story.append(Paragraph("4. System Governance, Security & Quality Matrix", h1_style))
    sec_data = [
        [Paragraph("<b>Governance Dimension</b>", meta_label_style), Paragraph("<b>Implementation Mechanism</b>", meta_label_style), Paragraph("<b>Impact & Guarantee</b>", meta_label_style)],
        [Paragraph("Authentication & RBAC", meta_val_style), Paragraph("JWT Bearer Tokens + bcrypt salted password hashing", meta_val_style), Paragraph("Guarantees admin endpoints are shielded from unauthorized access.", meta_val_style)],
        [Paragraph("Duplicate Guard", meta_val_style), Paragraph("MongoDB compound index on (jobId + candidate email)", meta_val_style), Paragraph("Prevents candidates from spamming duplicate applications for same role.", meta_val_style)],
        [Paragraph("Pipeline Integrity", meta_val_style), Paragraph("Deterministic finite state machine (FSM) validation", meta_val_style), Paragraph("Enforces strict forward-only progression; prevents illegal stage regressions.", meta_val_style)],
        [Paragraph("Ephemeral Cloud Resilience", meta_val_style), Paragraph("Atlas Base64 direct buffer storage & streaming", meta_val_style), Paragraph("Ensures 100% resume persistence across container restarts on Render/Amplify.", meta_val_style)],
        [Paragraph("Mobile Responsiveness", meta_val_style), Paragraph("Dedicated mobile cards view (sm:hidden / md:table)", meta_val_style), Paragraph("Flawless touch usability on 360px+ devices without layout clipping.", meta_val_style)],
    ]
    sec_table = Table(sec_data, colWidths=[120, 180, 204])
    sec_table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor("#F1F5F9")),
        ('BOX', (0, 0), (-1, -1), 0.5, colors.HexColor("#CBD5E1")),
        ('INNERGRID', (0, 0), (-1, -1), 0.5, colors.HexColor("#E2E8F0")),
        ('TOPPADDING', (0, 0), (-1, -1), 4),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 4),
        ('LEFTPADDING', (0, 0), (-1, -1), 6),
    ]))
    story.append(sec_table)
    story.append(Spacer(1, 14))

    # ── SECTION 5: CONCLUSION ────────────────────────────────────────────────
    story.append(Paragraph("5. Document Authorization & Sign-Off", h1_style))
    story.append(Paragraph(
        "This Use Case Document certifies that the HireFlow AI application meets all architectural, functional, "
        "and governance specifications for production deployment across AWS Amplify and Render cloud environments.",
        body_style
    ))
    story.append(Spacer(1, 8))

    sign_data = [
        [Paragraph("<b>Prepared By:</b>", meta_label_style), Paragraph("Thejas (Lead Engineer)", meta_val_style),
         Paragraph("<b>Project:</b>", meta_label_style), Paragraph("HireFlow AI Platform", meta_val_style)],
        [Paragraph("<b>Status:</b>", meta_label_style), Paragraph("Verified & Production Ready", meta_val_style),
         Paragraph("<b>Approved By:</b>", meta_label_style), Paragraph("System Architect", meta_val_style)],
    ]
    sign_table = Table(sign_data, colWidths=[100, 160, 90, 154])
    sign_table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, -1), colors.HexColor("#F8FAFC")),
        ('BOX', (0, 0), (-1, -1), 0.5, colors.HexColor("#E2E8F0")),
        ('INNERGRID', (0, 0), (-1, -1), 0.5, colors.HexColor("#E2E8F0")),
        ('TOPPADDING', (0, 0), (-1, -1), 4),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 4),
        ('LEFTPADDING', (0, 0), (-1, -1), 6),
    ]))
    story.append(sign_table)

    # Build document
    doc.build(story, canvasmaker=NumberedCanvas)
    print(f"PDF Successfully Generated: {filename}")


if __name__ == "__main__":
    out_path = sys.argv[1] if len(sys.argv) > 1 else "HireFlow_AI_Use_Case_Documentation.pdf"
    build_pdf(out_path)
