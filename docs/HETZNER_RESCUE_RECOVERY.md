# Hetzner Server Rescue Mode Recovery Guide

## Problem: Server im Rescue-Modus, App ist offline

Wenn dein Hetzner Server im Rescue-Modus bootet, ist die produktive App offline, aber **ALLE DATEN SIND NOCH DA** auf der Hauptfestplatte.

---

## Schritt-für-Schritt Anleitung

### 1. SSH-Verbindung prüfen

**Problem:** Host-Key hat sich geändert (normal für Rescue-Modus)

```bash
# Alten Host-Key entfernen
ssh-keygen -f ~/.ssh/known_hosts -R '91.98.123.193'

# Neu verbinden (akzeptiert neuen Key)
ssh -o StrictHostKeyChecking=accept-new root@91.98.123.193
```

### 2. Überprüfen ob Server im Rescue-Modus ist

```bash
ssh root@91.98.123.193 "hostname && uname -a"
```

**Output bei Rescue-Modus:**
```
rescue
Linux rescue 6.12.19 #1 SMP ...
```

### 3. Produktive Festplatte überprüfen

```bash
# Filesystem checken
ssh root@91.98.123.193 "df -h | grep sda"

# Output sollte zeigen:
# /dev/sda1    75G  6.9G   65G  10%  /mnt/main
```

**Wichtig:** Die produktive Festplatte ist unter `/mnt/main` gemountet!

### 4. App-Daten überprüfen (sind noch da!)

```bash
# App-Verzeichnis checken
ssh root@91.98.123.193 "ls -la /mnt/main/var/www/noba-experts-Big-FiveTest/"

# Datenbank checken
ssh root@91.98.123.193 "ls -la /mnt/main/var/lib/mysql/meine_app_db"

# Backups checken
ssh root@91.98.123.193 "ls -la /mnt/main/root/backup*.sql"
```

### 5. SSH-Keys für produktives System vorbereiten

**Wichtig:** SSH-Keys im Rescue-System gehen beim Reboot verloren!
Deshalb ZUERST in produktives System kopieren:

```bash
# Aktuellen lokalen Public Key holen
cat ~/.ssh/id_rsa.pub  # oder id_ed25519.pub

# SSH-Keys ins produktive System schreiben
ssh root@91.98.123.193 "cat > /mnt/main/root/.ssh/authorized_keys << 'EOF'
ssh-ed25519 AAAAC3Nza... dev@gratify-pwa.com
ssh-rsa AAAAB3NzaC1... jbk@jbk-AB350M-HDV-R4-0
EOF
chmod 600 /mnt/main/root/.ssh/authorized_keys"
```

**Oder einzelnen Key hinzufügen:**
```bash
ssh root@91.98.123.193 "echo 'ssh-ed25519 AAAAC3Nza... admin@example.com' >> /mnt/main/root/.ssh/authorized_keys && chmod 600 /mnt/main/root/.ssh/authorized_keys"
```

### 6. Server aus Rescue-Modus neu starten

```bash
# Reboot ausführen
ssh root@91.98.123.193 "reboot"
```

**Was passiert:**
1. Server startet neu
2. Bootet vom produktiven System (nicht Rescue)
3. App startet automatisch (PM2, Systemd, etc.)
4. Nach 1-2 Minuten ist alles wieder online

### 7. Nach dem Reboot: Verbindung testen

```bash
# Warten bis Server hochgefahren ist (1-2 Minuten)
sleep 120

# SSH-Verbindung testen
ssh root@91.98.123.193 "hostname && uptime"

# App-Status checken
ssh root@91.98.123.193 "pm2 list"  # Falls PM2 verwendet wird
ssh root@91.98.123.193 "systemctl status nginx"
ssh root@91.98.123.193 "systemctl status mysql"
```

### 8. Website testen

```bash
curl -I https://test.noba-experts.de
# Sollte HTTP 200 oder 301/302 zurückgeben
```

---

## Wichtige Dateipfade

### Im Rescue-Modus:
- **Produktive Festplatte:** `/mnt/main/`
- **App:** `/mnt/main/var/www/noba-experts-Big-FiveTest/`
- **Datenbank:** `/mnt/main/var/lib/mysql/`
- **SSH-Keys (produktiv):** `/mnt/main/root/.ssh/authorized_keys`
- **Nginx Config:** `/mnt/main/etc/nginx/`
- **Backups:** `/mnt/main/root/backup*.sql`

### Im produktiven System:
- **App:** `/var/www/noba-experts-Big-FiveTest/`
- **Datenbank:** `/var/lib/mysql/`
- **SSH-Keys:** `/root/.ssh/authorized_keys`

---

## Troubleshooting

### Problem: Server bootet wieder in Rescue-Modus

**Lösung:** Rescue-Modus im Hetzner Robot Panel deaktivieren:
1. Gehe zu https://robot.hetzner.com
2. Wähle Server aus
3. Klicke "Rescue" → "Deactivate"
4. Klicke "Reset" → "Execute automatic hardware reset"

### Problem: SSH-Verbindung schlägt nach Reboot fehl

**Mögliche Ursachen:**
1. SSH-Keys wurden nicht ins produktive System kopiert
2. Falscher Pfad oder Permissions

**Lösung:**
1. Zurück in Rescue-Modus booten (Hetzner Panel)
2. SSH-Keys erneut kopieren (siehe Schritt 5)
3. Permissions checken: `chmod 700 /mnt/main/root/.ssh && chmod 600 /mnt/main/root/.ssh/authorized_keys`

### Problem: App startet nicht nach Reboot

**Diagnose:**
```bash
# PM2 Logs checken
ssh root@91.98.123.193 "pm2 logs"

# Nginx Status
ssh root@91.98.123.193 "systemctl status nginx"

# MySQL Status
ssh root@91.98.123.193 "systemctl status mysql"

# Disk Space
ssh root@91.98.123.193 "df -h"
```

---

## Quick Reference Commands

```bash
# 1. Host-Key entfernen
ssh-keygen -f ~/.ssh/known_hosts -R '91.98.123.193'

# 2. Verbinden
ssh root@91.98.123.193

# 3. Rescue-Modus checken
hostname  # sollte "rescue" zeigen

# 4. Produktive Daten checken
ls -la /mnt/main/var/www/

# 5. SSH-Keys kopieren
echo "ssh-rsa YOUR_KEY" >> /mnt/main/root/.ssh/authorized_keys
chmod 600 /mnt/main/root/.ssh/authorized_keys

# 6. Reboot
reboot

# 7. Status checken (nach 2 min)
curl -I https://test.noba-experts.de
```

---

## Hetzner Robot Panel Alternative

Falls SSH nicht funktioniert, kannst du den Rescue-Modus auch manuell verlassen:

1. Gehe zu https://robot.hetzner.com
2. Login mit deinen Hetzner-Zugangsdaten
3. Wähle deinen Server aus der Liste
4. **Rescue Tab:**
   - Klicke "Deactivate" um Rescue-Modus zu beenden
5. **Reset Tab:**
   - Klicke "Execute an automatic hardware reset"
6. Warte 1-2 Minuten bis Server neu gestartet ist

---

## Prävention

### Warum ist der Server im Rescue-Modus?

Mögliche Gründe:
- Manuell im Hetzner Robot aktiviert (für Wartung)
- Boot-Probleme mit dem produktiven System
- Filesystem-Fehler auf der Hauptfestplatte
- GRUB/Bootloader-Probleme

### Rescue-Modus Status checken

Im Hetzner Robot Panel:
- **Rescue Tab** → Zeigt ob Rescue aktiv ist
- Wenn aktiv: "Deactivate" Button ist sichtbar

---

## Backup vor Reboot (Optional aber empfohlen)

```bash
# Datenbank Backup erstellen (im Rescue-Modus)
ssh root@91.98.123.193 "mysqldump --all-databases > /mnt/main/root/backup_before_reboot_$(date +%Y%m%d_%H%M%S).sql"

# App-Verzeichnis Backup
ssh root@91.98.123.193 "tar -czf /mnt/main/root/app_backup_$(date +%Y%m%d_%H%M%S).tar.gz -C /mnt/main/var/www noba-experts-Big-FiveTest"
```

---

**Stand:** Oktober 2025
**Server:** Hetzner Dedicated (91.98.123.193)
**App:** NOBA EXPERTS Big Five Test
**Domain:** test.noba-experts.de
