$css = Get-Content 'style.css' -Raw

# Remove backdrop-filter lines
$css = $css -replace '\s*backdrop-filter:[^;]+;', ''
$css = $css -replace '\s*-webkit-backdrop-filter:[^;]+;', ''

# Replace glass white backgrounds -> transparent surface
$css = $css -replace 'background: rgba\(255, 255, 255, 0\.10\);', 'background: var(--surface);'
$css = $css -replace 'background: rgba\(255, 255, 255, 0\.55\);', 'background: var(--surface);'

# Replace glass white borders -> standard border
$css = $css -replace 'border: 1px solid rgba\(255, 255, 255, 0\.35\);', 'border: 1px solid var(--border);'
$css = $css -replace 'border: 1px solid rgba\(255, 255, 255, 0\.75\);', 'border: 1px solid var(--border);'

# Remove inset white highlight from box-shadows (the ,\n inset 0 1px 0 ... part)
$css = $css -replace ',\s*\r?\n?\s*inset 0 1px 0 rgba\(255, 255, 255, [0-9.]+\)', ''

# Remove glass comment markers
$css = $css -replace '\s*/\* (?:--|-{2}) (?:Thick Glass|Glassmorphism) (?:--|-{2}) \*/', ''

[System.IO.File]::WriteAllText("$PWD\style.css", $css)
Write-Host "All glass effects removed!"
