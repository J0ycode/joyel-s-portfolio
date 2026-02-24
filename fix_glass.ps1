$css = Get-Content 'style.css' -Raw

# All three card types use the same glass values - replace them
# Skill card glass
$css = $css.Replace(
    '.skill-card {
    padding: 1.5rem 1rem;
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    gap: 0.75rem;
    cursor: default;
    position: relative;
    overflow: hidden;
    /* ── Glassmorphism ── */
    background: rgba(255, 255, 255, 0.55);
    backdrop-filter: blur(14px);
    -webkit-backdrop-filter: blur(14px);
    border: 1px solid rgba(255, 255, 255, 0.75);
    border-radius: var(--radius-lg);
    box-shadow: 0 4px 24px rgba(0, 78, 100, 0.07),
                inset 0 1px 0 rgba(255, 255, 255, 0.9);
    transition: transform 0.4s var(--ease-bounce),
                box-shadow 0.4s, border-color 0.4s;
}',
    '.skill-card {
    padding: 1.5rem 1rem;
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    gap: 0.75rem;
    cursor: default;
    position: relative;
    overflow: hidden;
    /* ── Thick Glass ── */
    background: rgba(255, 255, 255, 0.10);
    backdrop-filter: blur(22px) saturate(160%);
    -webkit-backdrop-filter: blur(22px) saturate(160%);
    border: 1px solid rgba(255, 255, 255, 0.35);
    border-radius: var(--radius-lg);
    box-shadow: 0 8px 32px rgba(0, 78, 100, 0.10),
                inset 0 1px 0 rgba(255, 255, 255, 0.5);
    transition: transform 0.4s var(--ease-bounce),
                box-shadow 0.4s, border-color 0.4s;
}'
)

# Info card glass
$css = $css.Replace(
    '    /* ── Glassmorphism ── */
    background: rgba(255, 255, 255, 0.55);
    backdrop-filter: blur(14px);
    -webkit-backdrop-filter: blur(14px);
    border: 1px solid rgba(255, 255, 255, 0.75);
    border-radius: var(--radius-lg);
    box-shadow: 0 4px 20px rgba(0, 78, 100, 0.07),
                inset 0 1px 0 rgba(255, 255, 255, 0.9);
    transition: transform 0.4s var(--ease-bounce), box-shadow 0.4s, border-color 0.4s;',
    '    /* ── Thick Glass ── */
    background: rgba(255, 255, 255, 0.10);
    backdrop-filter: blur(22px) saturate(160%);
    -webkit-backdrop-filter: blur(22px) saturate(160%);
    border: 1px solid rgba(255, 255, 255, 0.35);
    border-radius: var(--radius-lg);
    box-shadow: 0 8px 32px rgba(0, 78, 100, 0.10),
                inset 0 1px 0 rgba(255, 255, 255, 0.5);
    transition: transform 0.4s var(--ease-bounce), box-shadow 0.4s, border-color 0.4s;'
)

# Project card glass
$css = $css.Replace(
    '    /* ── Glassmorphism ── */
    background: rgba(255, 255, 255, 0.55);
    backdrop-filter: blur(14px);
    -webkit-backdrop-filter: blur(14px);
    border: 1px solid rgba(255, 255, 255, 0.75);
    border-radius: var(--radius-lg);
    box-shadow: 0 4px 24px rgba(0, 78, 100, 0.07),
                inset 0 1px 0 rgba(255, 255, 255, 0.9);',
    '    /* ── Thick Glass ── */
    background: rgba(255, 255, 255, 0.10);
    backdrop-filter: blur(22px) saturate(160%);
    -webkit-backdrop-filter: blur(22px) saturate(160%);
    border: 1px solid rgba(255, 255, 255, 0.35);
    border-radius: var(--radius-lg);
    box-shadow: 0 8px 32px rgba(0, 78, 100, 0.10),
                inset 0 1px 0 rgba(255, 255, 255, 0.5);'
)

# Trait badge glass
$css = $css.Replace(
    '    background: rgba(255, 255, 255, 0.55);
    backdrop-filter: blur(10px);
    -webkit-backdrop-filter: blur(10px);
    border: 1px solid rgba(255, 255, 255, 0.75);
    border-radius: var(--radius-full);
    font-size: 0.85rem;
    color: var(--text-muted);
    box-shadow: 0 2px 10px rgba(0, 78, 100, 0.06),
                inset 0 1px 0 rgba(255, 255, 255, 0.9);',
    '    background: rgba(255, 255, 255, 0.10);
    backdrop-filter: blur(18px) saturate(160%);
    -webkit-backdrop-filter: blur(18px) saturate(160%);
    border: 1px solid rgba(255, 255, 255, 0.35);
    border-radius: var(--radius-full);
    font-size: 0.85rem;
    color: var(--text-muted);
    box-shadow: 0 2px 10px rgba(0, 78, 100, 0.06),
                inset 0 1px 0 rgba(255, 255, 255, 0.5);'
)

[System.IO.File]::WriteAllText("$PWD\style.css", $css)
Write-Host 'Thick glass applied!'
