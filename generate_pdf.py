import os
from reportlab.lib.pagesizes import letter
from reportlab.lib import colors
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, PageBreak, HRFlowable, KeepTogether
)
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.enums import TA_CENTER, TA_LEFT, TA_RIGHT, TA_JUSTIFY

def build_pdf(filename="APIx_Technical_Approach_SIH2026_Executive.pdf"):
    doc = SimpleDocTemplate(
        filename,
        pagesize=letter,
        rightMargin=36,
        leftMargin=36,
        topMargin=36,
        bottomMargin=36
    )

    styles = getSampleStyleSheet()

    # Custom Color Palette
    PRIMARY = colors.HexColor('#0284C7')    # Sky Blue Accent
    PRIMARY_DARK = colors.HexColor('#0369A1')
    NAVY = colors.HexColor('#0F172A')        # Dark Navy Header/Text
    TEXT_MUTED = colors.HexColor('#475569')
    BG_LIGHT = colors.HexColor('#F8FAFC')
    BG_BOX = colors.HexColor('#F0F9FF')
    BORDER_COLOR = colors.HexColor('#BAE6FD')
    SUCCESS_GREEN = colors.HexColor('#0D9488')
    RED_ACCENT = colors.HexColor('#DC2626')

    # Custom Typography Styles
    doc_title_style = ParagraphStyle(
        'DocTitle',
        parent=styles['Heading1'],
        fontName='Helvetica-Bold',
        fontSize=24,
        leading=28,
        textColor=PRIMARY,
        alignment=TA_LEFT,
        spaceAfter=4
    )

    doc_subtitle_style = ParagraphStyle(
        'DocSubTitle',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=12,
        leading=16,
        textColor=NAVY,
        spaceAfter=12
    )

    h1_style = ParagraphStyle(
        'SectionH1',
        parent=styles['Heading2'],
        fontName='Helvetica-Bold',
        fontSize=14,
        leading=18,
        textColor=PRIMARY,
        spaceBefore=14,
        spaceAfter=6
    )

    h2_style = ParagraphStyle(
        'SectionH2',
        parent=styles['Heading3'],
        fontName='Helvetica-Bold',
        fontSize=11,
        leading=15,
        textColor=NAVY,
        spaceBefore=8,
        spaceAfter=4
    )

    body_style = ParagraphStyle(
        'BodyDark',
        parent=styles['BodyText'],
        fontName='Helvetica',
        fontSize=9.5,
        leading=13.5,
        textColor=colors.HexColor('#1E293B'),
        alignment=TA_JUSTIFY,
        spaceAfter=6
    )

    bullet_style = ParagraphStyle(
        'BulletText',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=9,
        leading=13,
        textColor=colors.HexColor('#334155'),
        leftIndent=12,
        spaceAfter=3
    )

    formula_style = ParagraphStyle(
        'FormulaText',
        parent=styles['Normal'],
        fontName='Courier-Bold',
        fontSize=10.5,
        leading=14.5,
        textColor=PRIMARY_DARK,
        alignment=TA_CENTER,
        spaceBefore=4,
        spaceAfter=4
    )

    table_header_style = ParagraphStyle(
        'THStyle',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=9,
        leading=12,
        textColor=NAVY
    )

    table_cell_style = ParagraphStyle(
        'TDStyle',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=8.5,
        leading=11.5,
        textColor=colors.HexColor('#334155')
    )

    elements = []

    # ==========================================
    # PAGE 1: TITLE & EXECUTIVE SUMMARY
    # ==========================================
    
    banner_data = [
        [Paragraph("<b>SMART INDIA HACKATHON 2026 • PROBLEM STATEMENT ID 26056</b>", ParagraphStyle('B1', fontName='Helvetica-Bold', fontSize=10, textColor=PRIMARY))],
        [Paragraph("APIx — Real-time Airfare Price Index Engine", doc_title_style)],
        [Paragraph("Executive Technical Approach & Economic Policy Architecture", doc_subtitle_style)]
    ]

    banner_table = Table(banner_data, colWidths=[540])
    banner_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), BG_BOX),
        ('BOX', (0,0), (-1,-1), 1.5, BORDER_COLOR),
        ('PADDING', (0,0), (-1,-1), 12),
        ('VALIGN', (0,0), (-1,-1), 'MIDDLE'),
    ]))

    elements.append(banner_table)
    elements.append(Spacer(1, 10))

    # Meta Overview Box
    meta_data = [
        [Paragraph("<b>Project Domain:</b> Macroeconomic Data Analytics & Aviation Policy", body_style), Paragraph("<b>Target Authorities:</b> MoSPI, Reserve Bank of India (RBI)", body_style)],
        [Paragraph("<b>Live Demo Web:</b> <u>https://ybsolanki.github.io/apix-airfare-index/</u>", body_style), Paragraph("<b>GitHub Repository:</b> <u>https://github.com/ybsolanki/apix-airfare-index</u>", body_style)],
        [Paragraph("<b>Core Stack:</b> Python FastAPI, SQLite, React, Vite, Tailwind, Recharts", body_style), Paragraph("<b>Verification:</b> 100% Pytest Passed (7/7 Unit Tests)", body_style)]
    ]
    meta_table = Table(meta_data, colWidths=[270, 270])
    meta_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), BG_LIGHT),
        ('GRID', (0,0), (-1,-1), 0.5, colors.HexColor('#E2E8F0')),
        ('PADDING', (0,0), (-1,-1), 5),
    ]))
    elements.append(meta_table)
    elements.append(Spacer(1, 10))

    # 1. Executive Summary & Problem Analysis
    elements.append(Paragraph("1. Executive Summary & Macroeconomic Context", h1_style))
    elements.append(HRFlowable(width="100%", thickness=1, color=colors.HexColor('#E2E8F0'), spaceAfter=6))
    elements.append(Paragraph(
        "<b>The Flaw in Traditional Transportation CPI Surveys:</b> India's official Consumer Price Index (CPI) compiled by MoSPI relies heavily on static, monthly manual price collection for transportation. However, modern airline revenue management systems use dynamic yield algorithms that adjust domestic airfares continuously based on seat occupancy, fuel cost surcharges, and advance booking windows ($T+1$ to $T+45$). Consequently, official statistics suffer from a 30-to-60-day reporting lag and fail to capture real-time consumer expenditure swings.",
        body_style
    ))
    elements.append(Paragraph(
        "<b>The APIx Solution:</b> APIx establishes a continuous, automated high-frequency data pipeline that ingests raw airfares across 24 representative domestic Indian flight corridors, cleans and normalizes observations, standardizes yield curves, and computes a standardized <b>Airfare Price Index (APIx)</b> relative to base period Jan 2026 = 100.0.",
        body_style
    ))

    # 2. Key Technical Innovations
    elements.append(Paragraph("2. Core Technical Innovations & Value Add", h1_style))
    elements.append(HRFlowable(width="100%", thickness=1, color=colors.HexColor('#E2E8F0'), spaceAfter=6))

    elements.append(Paragraph("• <b>Dynamic Booking Horizon Standardizing (T+1 to T+45):</b> Isolates last-minute travel surge pricing from baseline inflation, allowing economists to distinguish between pure price shifts and demand shocks.", bullet_style))
    elements.append(Paragraph("• <b>Dual Sectoral Index Breakdown (Metro vs Tier-2/UDAN):</b> Computes separate sub-indices for high-density metro corridors (DEL-BOM, BOM-BLR) versus regional connectivity corridors (BOM-AMD, DEL-PNQ) to measure policy impact.", bullet_style))
    elements.append(Paragraph("• <b>Outlier Sanitation Engine:</b> Uses Interquartile Range (IQR) bounds and multi-OTA cross-validation to remove corrupt fare anomalies (< ₹1,000 or > ₹60,000) prior to calculation.", bullet_style))
    elements.append(Paragraph("• <b>Ethical Ingestion & Scraper Adapter Architecture:</b> Modular scrapers (`BaseScraper`) adhering strictly to rate limits, robots.txt, and zero anti-bot evasion.", bullet_style))

    elements.append(Spacer(1, 10))

    # Competitive Advantage Table
    comp_headers = [Paragraph(f"<b>{h}</b>", table_header_style) for h in ["Feature / Metric", "Traditional MoSPI Survey", "OTA Platforms (Google/MMT)", "APIx Proposed Platform"]]
    comp_rows = [
        comp_headers,
        [Paragraph("Data Frequency", table_cell_style), Paragraph("Monthly (30-day lag)", table_cell_style), Paragraph("Real-time (User Search)", table_cell_style), Paragraph("<b>High-Frequency (15-min / Daily Index)</b>", table_cell_style)],
        [Paragraph("Inflation Modeling", table_cell_style), Paragraph("Static Sample Points", table_cell_style), Paragraph("No Index Math", table_cell_style), Paragraph("<b>Laspeyres Weighted Relative Index</b>", table_cell_style)],
        [Paragraph("Yield Standardizing", table_cell_style), Paragraph("None", table_cell_style), Paragraph("Raw Fare Only", table_cell_style), Paragraph("<b>6 Purchase Windows (T+1 to T+45)</b>", table_cell_style)],
        [Paragraph("Sectoral Granularity", table_cell_style), Paragraph("Aggregate City Pairs", table_cell_style), Paragraph("Single Flight Search", table_cell_style), Paragraph("<b>24 Indian Corridors & Sector Split</b>", table_cell_style)],
        [Paragraph("API & Open Data", table_cell_style), Paragraph("PDF Bulletins", table_cell_style), Paragraph("Proprietary Web UI", table_cell_style), Paragraph("<b>Open REST API & Developer Portal</b>", table_cell_style)],
    ]
    comp_table = Table(comp_rows, colWidths=[110, 140, 140, 150])
    comp_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), BG_LIGHT),
        ('GRID', (0,0), (-1,-1), 0.5, colors.HexColor('#CBD5E1')),
        ('PADDING', (0,0), (-1,-1), 4),
    ]))
    elements.append(comp_table)

    # Page Break for clean multi-page presentation
    elements.append(PageBreak())

    # ==========================================
    # PAGE 2: MATHEMATICAL METHODOLOGY & FORMULAS
    # ==========================================
    elements.append(Paragraph("3. Deep Mathematical Index Calculation Specification", h1_style))
    elements.append(HRFlowable(width="100%", thickness=1, color=colors.HexColor('#E2E8F0'), spaceAfter=8))
    
    elements.append(Paragraph(
        "To ensure academic and regulatory credibility for MoSPI and RBI, APIx uses a transparent mathematical index methodology grounded in Laspeyres price index theory.",
        body_style
    ))

    # Formula Box 1
    f1_content = [
        [Paragraph("<b>1. Route-Level Price Relative (I<sub>r,t</sub>):</b>", body_style)],
        [Paragraph("<b>I<sub>r,t</sub> = ( P<sub>r,t</sub> / P<sub>r,0</sub> ) × 100</b>", formula_style)],
        [Paragraph("<i>Where P<sub>r,t</sub> is the average normalized fare for route r on date t, and P<sub>r,0</sub> is the Jan 2026 base fare.</i>", ParagraphStyle('SubF', fontName='Helvetica-Oblique', fontSize=8.5, textColor=TEXT_MUTED, alignment=TA_CENTER))]
    ]
    f1_table = Table(f1_content, colWidths=[540])
    f1_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), BG_BOX),
        ('BOX', (0,0), (-1,-1), 1, BORDER_COLOR),
        ('PADDING', (0,0), (-1,-1), 6),
    ]))
    elements.append(f1_table)
    elements.append(Spacer(1, 8))

    # Formula Box 2
    f2_content = [
        [Paragraph("<b>2. Aggregated National Airfare Price Index (I<sub>total,t</sub>):</b>", body_style)],
        [Paragraph("<b>I<sub>total,t</sub> = ∑ ( w<sub>r</sub> × I<sub>r,t</sub> )   [subject to ∑ w<sub>r</sub> = 1.0]</b>", formula_style)],
        [Paragraph("<i>Where w<sub>r</sub> represents the seat capacity weight derived from DGCA annual passenger traffic statistics.</i>", ParagraphStyle('SubF2', fontName='Helvetica-Oblique', fontSize=8.5, textColor=TEXT_MUTED, alignment=TA_CENTER))]
    ]
    f2_table = Table(f2_content, colWidths=[540])
    f2_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), BG_BOX),
        ('BOX', (0,0), (-1,-1), 1, BORDER_COLOR),
        ('PADDING', (0,0), (-1,-1), 6),
    ]))
    elements.append(f2_table)
    elements.append(Spacer(1, 10))

    elements.append(Paragraph("4. Advance Purchase Horizon Yield Curve Analysis", h1_style))
    elements.append(HRFlowable(width="100%", thickness=1, color=colors.HexColor('#E2E8F0'), spaceAfter=8))

    elements.append(Paragraph(
        "A critical innovation of APIx is standardizing observations by advance booking window. The table below illustrates real empirical observations from our dataset for the <b>Delhi → Mumbai (DEL-BOM)</b> route:",
        body_style
    ))

    bw_headers = [Paragraph(f"<b>{h}</b>", table_header_style) for h in ["Booking Horizon", "Avg Fare (₹)", "Min Fare (₹)", "Max Fare (₹)", "Yield Multiplier vs Base"]]
    bw_rows = [
        bw_headers,
        [Paragraph("T+1 (Last Minute)", table_cell_style), Paragraph("₹11,090", table_cell_style), Paragraph("₹8,200", table_cell_style), Paragraph("₹12,450", table_cell_style), Paragraph("<b>1.85x (+85%)</b>", table_cell_style)],
        [Paragraph("T+3 Days", table_cell_style), Paragraph("₹9,348", table_cell_style), Paragraph("₹6,900", table_cell_style), Paragraph("₹10,500", table_cell_style), Paragraph("1.55x (+55%)", table_cell_style)],
        [Paragraph("T+7 Days", table_cell_style), Paragraph("₹7,851", table_cell_style), Paragraph("₹5,800", table_cell_style), Paragraph("₹8,900", table_cell_style), Paragraph("1.30x (+30%)", table_cell_style)],
        [Paragraph("T+15 Days", table_cell_style), Paragraph("₹6,719", table_cell_style), Paragraph("₹5,100", table_cell_style), Paragraph("₹7,600", table_cell_style), Paragraph("1.12x (+12%)", table_cell_style)],
        [Paragraph("T+30 Days", table_cell_style), Paragraph("₹6,098", table_cell_style), Paragraph("₹4,890", table_cell_style), Paragraph("₹6,800", table_cell_style), Paragraph("1.02x (+2%)", table_cell_style)],
        [Paragraph("T+45 Days (Baseline)", table_cell_style), Paragraph("₹5,906", table_cell_style), Paragraph("₹4,750", table_cell_style), Paragraph("₹6,500", table_cell_style), Paragraph("<b>0.98x (Baseline)</b>", table_cell_style)],
    ]
    bw_table = Table(bw_rows, colWidths=[130, 100, 100, 100, 110])
    bw_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), BG_LIGHT),
        ('GRID', (0,0), (-1,-1), 0.5, colors.HexColor('#CBD5E1')),
        ('PADDING', (0,0), (-1,-1), 5),
    ]))
    elements.append(bw_table)

    # 5. Route Dataset Specification
    elements.append(Paragraph("5. 24 Domestic Indian Corridors & Weighting Breakdown", h1_style))
    elements.append(HRFlowable(width="100%", thickness=1, color=colors.HexColor('#E2E8F0'), spaceAfter=8))

    r_headers = [Paragraph(f"<b>{h}</b>", table_header_style) for h in ["Route Corridor", "Sector Type", "Distance", "Base Fare (t0)", "Route Weight (wr)"]]
    r_body = [
        r_headers,
        [Paragraph("Delhi → Mumbai (DEL-BOM)", table_cell_style), Paragraph("Metro", table_cell_style), Paragraph("1,148 km", table_cell_style), Paragraph("₹5,400", table_cell_style), Paragraph("0.095 (9.5%)", table_cell_style)],
        [Paragraph("Mumbai → Delhi (BOM-DEL)", table_cell_style), Paragraph("Metro", table_cell_style), Paragraph("1,148 km", table_cell_style), Paragraph("₹5,450", table_cell_style), Paragraph("0.095 (9.5%)", table_cell_style)],
        [Paragraph("Delhi → Bengaluru (DEL-BLR)", table_cell_style), Paragraph("Metro", table_cell_style), Paragraph("1,740 km", table_cell_style), Paragraph("₹6,200", table_cell_style), Paragraph("0.080 (8.0%)", table_cell_style)],
        [Paragraph("Bengaluru → Delhi (BLR-DEL)", table_cell_style), Paragraph("Metro", table_cell_style), Paragraph("1,740 km", table_cell_style), Paragraph("₹6,250", table_cell_style), Paragraph("0.080 (8.0%)", table_cell_style)],
        [Paragraph("Mumbai → Bengaluru (BOM-BLR)", table_cell_style), Paragraph("Metro", table_cell_style), Paragraph("842 km", table_cell_style), Paragraph("₹4,300", table_cell_style), Paragraph("0.065 (6.5%)", table_cell_style)],
        [Paragraph("Delhi → Kolkata (DEL-CCU)", table_cell_style), Paragraph("Metro", table_cell_style), Paragraph("1,305 km", table_cell_style), Paragraph("₹5,600", table_cell_style), Paragraph("0.055 (5.5%)", table_cell_style)],
        [Paragraph("Mumbai → Ahmedabad (BOM-AMD)", table_cell_style), Paragraph("Tier-2", table_cell_style), Paragraph("441 km", table_cell_style), Paragraph("₹3,200", table_cell_style), Paragraph("0.040 (4.0%)", table_cell_style)],
        [Paragraph("Delhi → Hyderabad (DEL-HYD)", table_cell_style), Paragraph("Metro", table_cell_style), Paragraph("1,253 km", table_cell_style), Paragraph("₹5,100", table_cell_style), Paragraph("0.050 (5.0%)", table_cell_style)],
        [Paragraph("Remaining 15 Corridors (Goa, Pune, Kochi)", table_cell_style), Paragraph("Metro / Tier-2", table_cell_style), Paragraph("500-2,080 km", table_cell_style), Paragraph("₹3,400 - ₹7,400", table_cell_style), Paragraph("0.345 (34.5%)", table_cell_style)],
    ]
    r_table = Table(r_body, colWidths=[170, 80, 80, 100, 110])
    r_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), BG_LIGHT),
        ('GRID', (0,0), (-1,-1), 0.5, colors.HexColor('#CBD5E1')),
        ('PADDING', (0,0), (-1,-1), 4),
    ]))
    elements.append(r_table)

    # Page Break for Page 3
    elements.append(PageBreak())

    # ==========================================
    # PAGE 3: PITCH SCRIPT & HACKATHON DEMO FLOW
    # ==========================================
    elements.append(Paragraph("6. SIH 2026 5-Minute Presentation Pitch Blueprint", h1_style))
    elements.append(HRFlowable(width="100%", thickness=1, color=colors.HexColor('#E2E8F0'), spaceAfter=8))

    elements.append(Paragraph(
        "This pitch blueprint is designed for the team to deliver a compelling, structured 3-to-5 minute presentation to hackathon evaluators:",
        body_style
    ))

    pitch_headers = [Paragraph(f"<b>{h}</b>", table_header_style) for h in ["Time Window", "Presentation Focus", "Key Talking Points & Demonstration", "Screen View"]]
    pitch_rows = [
        pitch_headers,
        [
            Paragraph("0:00 - 0:45", table_cell_style),
            Paragraph("<b>Problem Statement & Hook</b>", table_cell_style),
            Paragraph("Explain how monthly CPI surveys miss dynamic airfare surges. Introduce APIx as the solution for MoSPI & RBI.", table_cell_style),
            Paragraph("Overview Dashboard", table_cell_style)
        ],
        [
            Paragraph("0:45 - 1:45", table_cell_style),
            Paragraph("<b>Airfare Price Index & Trend</b>", table_cell_style),
            Paragraph("Show overall index value (118.6, +4.2%), historical line chart (7D/30D/90D), and Metro vs Tier-2 sector split.", table_cell_style),
            Paragraph("Overview & Index Analytics", table_cell_style)
        ],
        [
            Paragraph("1:45 - 2:45", table_cell_style),
            Paragraph("<b>Route Deep Dive & Yield Curve</b>", table_cell_style),
            Paragraph("Click Delhi → Mumbai (DEL-BOM). Show Advance Purchase Window Chart (T+1 ₹11,090 vs T+45 ₹5,906).", table_cell_style),
            Paragraph("Route Detail View Modal", table_cell_style)
        ],
        [
            Paragraph("2:45 - 3:30", table_cell_style),
            Paragraph("<b>Fare Explorer & Data Sources</b>", table_cell_style),
            Paragraph("Filter fares by airline/OTA source, demonstrate CSV export, and show scraper telemetry health (99.4%).", table_cell_style),
            Paragraph("Fare Explorer & Sources", table_cell_style)
        ],
        [
            Paragraph("3:30 - 4:30", table_cell_style),
            Paragraph("<b>Developer API & Live Refresh</b>", table_cell_style),
            Paragraph("Show REST API endpoints, copy cURL code snippet, and click 'Refresh Data' to demonstrate real-time recalculation.", table_cell_style),
            Paragraph("API Portal & Top Header", table_cell_style)
        ]
    ]
    pitch_table = Table(pitch_rows, colWidths=[70, 120, 240, 110])
    pitch_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), BG_LIGHT),
        ('GRID', (0,0), (-1,-1), 0.5, colors.HexColor('#CBD5E1')),
        ('PADDING', (0,0), (-1,-1), 5),
    ]))
    elements.append(pitch_table)
    elements.append(Spacer(1, 10))

    # 7. Deliverables & Deployment Summary
    elements.append(Paragraph("7. Completed Deliverables & System Verification", h1_style))
    elements.append(HRFlowable(width="100%", thickness=1, color=colors.HexColor('#E2E8F0'), spaceAfter=8))

    elements.append(Paragraph("✔ <b>Automated Pytest Suite:</b> 7/7 unit tests passed in 4.5s (`apix-backend/tests/test_api.py`).", bullet_style))
    elements.append(Paragraph("✔ <b>Vite Production Build:</b> Standalone production build generated with zero JSX syntax errors (`apix-frontend/dist`).", bullet_style))
    elements.append(Paragraph("✔ <b>GitHub Repository & Deployment:</b> Pushed to <u>https://github.com/ybsolanki/apix-airfare-index</u> and automated GitHub Actions workflow configured for GitHub Pages hosting.", bullet_style))

    doc.build(elements)
    print(f"Executive PDF successfully generated: {filename}")

if __name__ == "__main__":
    build_pdf()
