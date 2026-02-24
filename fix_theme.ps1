$css = Get-Content 'style.css' -Raw

$goldTheme = @"

/* -- GOLD DARK THEME (classic) -- */
[data-theme="gold"] {
    --bg: #060608;
    --bg-2: #0a0a0f;
    --surface: rgba(255, 255, 255, 0.04);
    --surface-2: rgba(255, 255, 255, 0.07);
    --border: rgba(255, 255, 255, 0.08);
    --border-gold: rgba(212, 175, 55, 0.25);
    --gold: #d4af37;
    --gold-light: #f0cc60;
    --gold-dim: rgba(212, 175, 55, 0.15);
    --silver: #c0c0c0;
    --white: #ffffff;
    --text: #e8e8ec;
    --text-muted: #888899;
    --text-dim: rgba(232, 232, 236, 0.5);
    --shadow-gold: 0 0 40px rgba(212, 175, 55, 0.15);
    --shadow-card: 0 8px 40px rgba(0, 0, 0, 0.5);
    --glow-gold: 0 0 20px rgba(212, 175, 55, 0.4);
}

/* Gold theme: restore dark-specific hardcoded values */
[data-theme="gold"] body                    { background: #060608 !important; color: #e8e8ec; }
[data-theme="gold"] #preloader              { background: #000 !important; }
[data-theme="gold"] #nav.scrolled           { background: rgba(6,6,8,0.88) !important; }
[data-theme="gold"] .mobile-drawer         { background: rgba(6,6,8,0.97) !important; }
[data-theme="gold"] .skill-card,
[data-theme="gold"] .info-card,
[data-theme="gold"] .project-card {
    background: rgba(255,255,255,0.04) !important;
    border-color: rgba(255,255,255,0.08) !important;
    box-shadow: 0 4px 24px rgba(0,0,0,0.3) !important;
    backdrop-filter: none !important;
    -webkit-backdrop-filter: none !important;
}
[data-theme="gold"] .trait {
    background: rgba(255,255,255,0.04) !important;
    border-color: rgba(255,255,255,0.08) !important;
    box-shadow: none !important;
    backdrop-filter: none !important;
}
[data-theme="gold"] strong                  { color: #ffffff; }
[data-theme="gold"] .section-headline       { color: #ffffff; }
[data-theme="gold"] .hero-headline          { color: #ffffff; }
[data-theme="gold"] .stat-num               { color: #ffffff; }
[data-theme="gold"] .nav-logo               { color: #ffffff; }
[data-theme="gold"] .nav-link:hover,
[data-theme="gold"] .nav-link.active        { color: #ffffff; }
[data-theme="gold"] .nav-burger span        { background: #ffffff; }
[data-theme="gold"] .drawer-link            { color: #e8e8ec; }
[data-theme="gold"] .skill-icon {
    background: linear-gradient(135deg, #d4af37 0%, #f0cc60 50%, #ffe49a 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    filter: drop-shadow(0 2px 6px rgba(212,175,55,0.3));
}
[data-theme="gold"] .ring-projects .planet-icon { color: #818cf8 !important; }
[data-theme="gold"] .ring-skills .orbit-planet  {
    background: rgba(12,12,18,0.85) !important;
    border-color: rgba(212,175,55,0.45) !important;
}
[data-theme="gold"] .orbit-ring.ring-skills     { border-color: rgba(212,175,55,0.25) !important; }
[data-theme="gold"] .orbit-ring.ring-projects   { border-color: rgba(99,102,241,0.2) !important; }

/* -- THEME TOGGLE BUTTON -- */
.theme-toggle {
    width: 32px;
    height: 32px;
    border-radius: 50%;
    border: 1.5px solid var(--border-gold);
    background: none;
    cursor: none;
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
    overflow: hidden;
    transition: border-color 0.3s, transform 0.3s, box-shadow 0.3s;
    flex-shrink: 0;
    margin-left: 0.5rem;
}

.theme-toggle:hover {
    transform: scale(1.12);
    border-color: var(--gold);
    box-shadow: 0 0 10px rgba(0,78,100,0.18);
}

/* Split-circle: left half = teal, right half = gold */
.theme-toggle-icon {
    width: 18px;
    height: 18px;
    border-radius: 50%;
    position: relative;
    overflow: hidden;
    background: #004E64;
}

.theme-toggle-icon::before {
    content: '';
    position: absolute;
    top: 0;
    right: 0;
    width: 50%;
    height: 100%;
    background: #C9A227;
}

"@

# Insert after the closing :root brace (end of root block at roughly chars before RESET comment)
$marker = '/* -- RESET -- */'
if (-not $css.Contains($marker)) {
    # find raw RESET comment (with non-ASCII box chars)
    $idx = $css.IndexOf('*,')
    if ($idx -gt 0) {
        # Walk back to find the blank line before it
        $insertAt = $idx
        $css = $css.Substring(0, $insertAt) + "`r`n" + $goldTheme + "`r`n" + $css.Substring($insertAt)
    }
}
else {
    $css = $css.Replace($marker, $goldTheme + "`r`n" + $marker)
}

[System.IO.File]::WriteAllText("$PWD\style.css", $css)
Write-Host "Gold theme & toggle button CSS added!"
