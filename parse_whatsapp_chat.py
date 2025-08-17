# parse_whatsapp_chat.py
import re, json, csv, argparse
from datetime import datetime

# أنماط سطور بداية الرسائل (أشهر صيغ واتساب: القديمة والجديدة، عربي/إنجليزي، 12/24 ساعة)
PATTERNS = [
    # 06/04/25, 2:06 am - محمد: نص
r'^(?P<date>\d{1,2}/\d{1,2}/\d{2}),\s*(?P<time>\d{1,2}:\d{2}(?:\s*[APap][Mm]))\s*-\s*(?P<sender>[^:]+):\s(?P<msg>.*)$',

    # [18/08/2025, 3:14 م] محمد: نص
    r'^\[(?P<date>\d{1,2}/\d{1,2}/\d{2,4}),\s*(?P<time>\d{1,2}:\d{2}(?:\s*[APap]\.?M\.?|[\u202F\s]*[صم]))\]\s(?P<sender>[^:]+):\s(?P<msg>.*)$',
    # 18/08/2025, 15:14 - محمد: نص
    r'^(?P<date>\d{1,2}/\d{1,2}/\d{2,4}),\s*(?P<time>\d{1,2}:\d{2}(?:\s*[APap]\.?M\.?|[\u202F\s]*[صم]))\s*-\s*(?P<sender>[^:]+):\s(?P<msg>.*)$',
    # حالات رسائل النظام بدون مرسل: [18/08/2025, 3:14 م] محمد انضم إلى المجموعة
    r'^\[(?P<date>\d{1,2}/\d{1,2}/\d{2,4}),\s*(?P<time>\d{1,2}:\d{2}(?:\s*[APap]\.?M\.?|[\u202F\s]*[صم]))\]\s(?P<msg_sys>.+)$',
    r'^(?P<date>\d{1,2}/\d{1,2}/\d{2,4}),\s*(?P<time>\d{1,2}:\d{2}(?:\s*[APap]\.?M\.?|[\u202F\s]*[صم]))\s*-\s*(?P<msg_sys>.+)$',
]
REGEXES = [re.compile(p) for p in PATTERNS]

# تحويل "ص/م" إلى AM/PM
def normalize_ampm(t):
    # شيل أي مسافات غريبة (زي U+202F أو U+200F)
    t = t.replace('\u202F', ' ').replace('\u200F', ' ').strip()
    t = re.sub(r'\s+', ' ', t)
    return t


def parse_datetime(date_str, time_str):
    time_str = normalize_ampm(time_str)
    fmts = [
       "%d/%m/%y, %I:%M %p",   # زي 06/04/25, 2:06 am
    "%d/%m/%Y, %I:%M %p",
    "%d/%m/%y, %H:%M",
    "%d/%m/%Y, %H:%M",
    ]
    for f in fmts:
        try:
            return datetime.strptime(f"{date_str} {time_str}", f)
        except ValueError:
            continue
    return None  # لو التنسيق مختلف تمامًا

def parse_chat(path):
    messages = []
    current = None

    with open(path, 'r', encoding='utf-8') as f:
        for raw_line in f:
            line = raw_line.rstrip('\n')

            # حاول تطابق سطر جديد
            matched = None
            for rx in REGEXES:
                m = rx.match(line)
                if m:
                    matched = m
                    break

            if matched:
                # خزّن الرسالة السابقة
                if current:
                    messages.append(current)
                gd = matched.groupdict()

                # رسالة نظام (مالهاش sender)
                if 'msg_sys' in gd and gd.get('msg_sys'):
                    dt = parse_datetime(gd['date'], gd['time'])
                    current = {
                        "datetime": dt.isoformat() if dt else None,
                        "date": gd['date'],
                        "time": gd['time'],
                        "sender": None,
                        "type": "system",
                        "text": gd['msg_sys'].strip(),
                    }
                else:
                    dt = parse_datetime(gd['date'], gd['time'])
                    current = {
                        "datetime": dt.isoformat() if dt else None,
                        "date": gd['date'],
                        "time": gd['time'],
                        "sender": gd['sender'].strip(),
                        "type": "message",
                        "text": gd['msg'].strip(),
                    }
            else:
                # سطر تابع للرسالة السابقة (ملتي-لاين)
                if current:
                    current["text"] += "\n" + line
                else:
                    # ملف فيه مقدمة قبل أول رسالة
                    continue

    if current:
        messages.append(current)
    return messages

def write_json(messages, out_path):
    with open(out_path, 'w', encoding='utf-8') as f:
        json.dump(messages, f, ensure_ascii=False, indent=2)

def write_csv(messages, out_path):
    keys = ["datetime", "date", "time", "sender", "type", "text"]
    with open(out_path, 'w', encoding='utf-8', newline='') as f:
        w = csv.DictWriter(f, fieldnames=keys)
        w.writeheader()
        for msg in messages:
            w.writerow(msg)

if __name__ == "__main__":
    ap = argparse.ArgumentParser(description="Parse WhatsApp exported chat .txt to JSON/CSV")
    ap.add_argument("txt", help="Path to exported chat .txt")
    ap.add_argument("--out-json", default="chat.json")
    ap.add_argument("--out-csv", default="chat.csv")
    args = ap.parse_args()

    msgs = parse_chat(args.txt)

    # فلترة سريعة للاسططر التلقائية (اختياري)
    # msgs = [m for m in msgs if not (m["type"]=="system" and "تم تأمين" in (m["text"] or ""))]

    write_json(msgs, args.out_json)
    write_csv(msgs, args.out_csv)
    print(f"Parsed {len(msgs)} messages -> {args.out_json}, {args.out_csv}")
