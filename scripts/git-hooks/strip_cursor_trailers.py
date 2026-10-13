#!/usr/bin/env python3
"""Remove Cursor marketing / co-author lines from the commit message file."""
import sys


def should_drop(line: str) -> bool:
    s = line.strip().lower()
    if not s:
        return False
    if "co-authored-by" in s and "cursor" in s:
        return True
    if "made-with" in s and "cursor" in s:
        return True
    if "made with cursor" in s:
        return True
    return False


def main() -> int:
    if len(sys.argv) < 2:
        return 0
    path = sys.argv[1]
    try:
        with open(path, encoding="utf-8", errors="replace") as f:
            lines = f.readlines()
    except OSError:
        return 0
    kept = [L for L in lines if not should_drop(L)]
    while kept and kept[-1].strip() == "" and len(kept) > 1 and kept[-2].strip() == "":
        kept.pop()
    try:
        with open(path, "w", encoding="utf-8") as f:
            f.writelines(kept)
    except OSError:
        return 0
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
